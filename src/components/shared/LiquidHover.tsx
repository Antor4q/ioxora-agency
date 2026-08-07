"use client";

import {
  ReactNode,
  useEffect,
  useRef,
} from "react";

import * as THREE from "three";

type LiquidHoverProps = {
  children: ReactNode;
  className?: string;

  /**
   * Liquid strength
   *
   * 1   = subtle
   * 2   = medium
   * 3   = strong
   * 4+  = very strong
   */
  intensity?: number;

  /**
   * Radius of the liquid area
   *
   * Smaller = more local
   * Bigger  = wider liquid
   */
  radius?: number;
};

/* =========================================================
   CANVAS BUFFER
========================================================= */

// Small horizontal safety buffer.
// Prevents the last glyph from being clipped by canvas edge.
const TEXT_BUFFER_X = 12;

/* =========================================================
   VERTEX SHADER
========================================================= */

const vertexShader = `
varying vec2 vUv;

void main() {

  vUv = uv;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(
      position,
      1.0
    );
}
`;

/* =========================================================
   FRAGMENT SHADER
========================================================= */

const fragmentShader = `
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;
uniform float uRadius;
uniform float uIntensity;
uniform vec2 uResolution;
uniform vec2 uMouseVelocity;
uniform float uTime;

varying vec2 vUv;

void main() {

  vec2 uv = vUv;

  vec2 delta = uv - uMouse;

  float aspect =
    uResolution.x /
    max(uResolution.y, 1.0);

  delta.x *= aspect;

  float distanceToMouse = length(delta);

  float influence =
    exp(
      -pow(
        distanceToMouse / uRadius,
        2.0
      )
    );

  influence *= uHover;

  vec2 direction =
    normalize(
      delta + vec2(0.00001)
    );

  float wave1 =
    sin(
      uv.x * 24.0 +
      uv.y * 9.0
    );

  float wave2 =
    cos(
      uv.y * 30.0 -
      uv.x * 8.0
    );

  float wave3 =
    sin(
      (uv.x + uv.y) * 36.0
    );

  float liquidShape =
    wave1 * 0.40 +
    wave2 * 0.35 +
    wave3 * 0.25;

  float mouseSpeed =
    length(uMouseVelocity);

  mouseSpeed =
    clamp(
      mouseSpeed * 8.0,
      0.0,
      1.0
    );

  float bulge =
    influence *
    0.025 *
    uIntensity;

  float sidePush =
    influence *
    liquidShape *
    0.040 *
    uIntensity;

  float rippleWave =
    sin(
      distanceToMouse * 80.0
    );

  float ripple =
    rippleWave *
    influence *
    0.012 *
    uIntensity;

  vec2 velocity =
    uMouseVelocity;

  velocity.x *= aspect;

  float velocityInfluence =
    mouseSpeed *
    influence *
    0.025 *
    uIntensity;

  vec2 velocityStretch =
    velocity *
    velocityInfluence;

  vec2 perpendicular =
    vec2(
      -direction.y,
      direction.x
    );

  float softWave =
    sin(
      distanceToMouse * 50.0
    );

  vec2 perpendicularPush =
    perpendicular *
    softWave *
    influence *
    0.012 *
    uIntensity;

  vec2 distortion =
    direction *
    (
      sidePush +
      ripple +
      bulge
    );

  distortion += velocityStretch;
  distortion += perpendicularPush;

  uv += distortion;

  vec4 color =
    texture2D(
      uTexture,
      uv
    );

  float edge =
    smoothstep(
      uRadius,
      uRadius * 0.35,
      distanceToMouse
    );

  float edgeWave =
    sin(
      distanceToMouse * 70.0
    );

  float highlight =
    edgeWave *
    edge *
    influence *
    0.025;

  color.rgb +=
    color.rgb *
    highlight;

  gl_FragColor = color;
}
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function LiquidHover({
  children,
  className = "",
  intensity = 3.0,
  radius = 0.18,
}: LiquidHoverProps) {

  const wrapperRef =
    useRef<HTMLDivElement | null>(null);

  const sourceRef =
    useRef<HTMLDivElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    const wrapper =
      wrapperRef.current;

    const source =
      sourceRef.current;

    const canvas =
      canvasRef.current;

    if (
      !wrapper ||
      !source ||
      !canvas
    ) {
      return;
    }

    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
      new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        powerPreference:
          "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setClearColor(
      0x000000,
      0
    );

    /* =====================================================
       SCENE / CAMERA
    ===================================================== */

    const scene =
      new THREE.Scene();

    const camera =
      new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        0,
        1
      );

    /* =====================================================
       VARIABLES
    ===================================================== */

    let contentCanvas:
      HTMLCanvasElement | null = null;

    let texture:
      THREE.CanvasTexture | null = null;

    let material:
      THREE.ShaderMaterial | null = null;

    let geometry:
      THREE.PlaneGeometry | null = null;

    let mesh:
      THREE.Mesh | null = null;

    let animationFrame = 0;

    let initialized = false;

    let imageLoadHandlerAttached =
      false;

    let targetHover = 0;
    let currentHover = 0;

    const targetMouse =
      new THREE.Vector2(
        0.5,
        0.5
      );

    const currentMouse =
      new THREE.Vector2(
        0.5,
        0.5
      );

    const previousMouse =
      new THREE.Vector2(
        0.5,
        0.5
      );

    const mouseVelocity =
      new THREE.Vector2(
        0,
        0
      );

    /* =====================================================
       IMAGE DETECTION
    ===================================================== */

    const imageEl =
      source.querySelector(
        "img"
      ) as HTMLImageElement | null;

    /* =====================================================
       LETTER SPACING
    ===================================================== */

    const parseLetterSpacing = (
      value: string,
      fontSize: number
    ) => {

      if (
        value === "normal" ||
        !value
      ) {
        return 0;
      }

      if (
        value.endsWith("px")
      ) {
        return (
          parseFloat(value) || 0
        );
      }

      if (
        value.endsWith("em")
      ) {
        return (
          (parseFloat(value) || 0) *
          fontSize
        );
      }

      return 0;
    };

    /* =====================================================
       DRAW: IMAGE CONTENT
    ===================================================== */

    const drawImageContent = (
      img: HTMLImageElement
    ) => {

      const wrapperRect =
        wrapper.getBoundingClientRect();

      const imgRect =
        img.getBoundingClientRect();

      const width =
        Math.max(
          wrapperRect.width,
          imgRect.width,
          1
        );

      const height =
        Math.max(
          wrapperRect.height,
          imgRect.height,
          1
        );

      const dpr =
        Math.min(
          window.devicePixelRatio,
          2
        );

      if (!contentCanvas) {
        contentCanvas =
          document.createElement(
            "canvas"
          );
      }

      contentCanvas.width =
        Math.ceil(
          width * dpr
        );

      contentCanvas.height =
        Math.ceil(
          height * dpr
        );

      const ctx =
        contentCanvas.getContext(
          "2d"
        );

      if (!ctx) {
        return;
      }

      ctx.clearRect(
        0,
        0,
        contentCanvas.width,
        contentCanvas.height
      );

      /*
       * Draw image only after it has
       * actual pixel data.
       */

      if (
        img.complete &&
        img.naturalWidth > 0
      ) {

        const offsetX =
          (
            imgRect.left -
            wrapperRect.left
          ) * dpr;

        const offsetY =
          (
            imgRect.top -
            wrapperRect.top
          ) * dpr;

        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          imgRect.width * dpr,
          imgRect.height * dpr
        );
      }

      if (!texture) {

        texture =
          new THREE.CanvasTexture(
            contentCanvas
          );

        texture.colorSpace =
          THREE.NoColorSpace;

        texture.minFilter =
          THREE.LinearFilter;

        texture.magFilter =
          THREE.LinearFilter;

        texture.wrapS =
          THREE.ClampToEdgeWrapping;

        texture.wrapT =
          THREE.ClampToEdgeWrapping;

      } else {

        texture.image =
          contentCanvas;

        texture.needsUpdate =
          true;
      }

      /*
       * Redraw when image finishes loading.
       */

      if (
        !img.complete &&
        !imageLoadHandlerAttached
      ) {

        imageLoadHandlerAttached =
          true;

        const handleLoad = () => {

          drawImageContent(
            img
          );

          if (texture) {
            texture.needsUpdate =
              true;
          }
        };

        img.addEventListener(
          "load",
          handleLoad,
          {
            once: true,
          }
        );
      }
    };

    /* =====================================================
       DRAW: TEXT CONTENT
    ===================================================== */

    const drawTextContent = () => {

      const wrapperRect =
        wrapper.getBoundingClientRect();

      const sourceRect =
        source.getBoundingClientRect();

      const heading =
        source.querySelector(
          "h1, h2, h3, h4, h5, h6, p, span"
        ) as HTMLElement | null;

      const element =
        heading || source;

      const computed =
        window.getComputedStyle(
          element
        );

      /*
       * Use scroll dimensions but
       * add a small safety buffer.
       *
       * This prevents the final glyph
       * from being clipped.
       */

      const actualWidth =
        Math.max(
          source.scrollWidth,
          sourceRect.width,
          element.scrollWidth,
          1
        );

      const actualHeight =
        Math.max(
          sourceRect.height,
          element.scrollHeight,
          1
        );

      /*
       * IMPORTANT:
       *
       * The buffer is intentionally small.
       * It gives the last character some
       * breathing room without noticeably
       * changing the text scale.
       */

      const paddingX =
        TEXT_BUFFER_X;

      const paddingY = 0;

      const width =
        actualWidth +
        paddingX * 2;

      const height =
        actualHeight +
        paddingY * 2;

      const dpr =
        Math.min(
          window.devicePixelRatio,
          2
        );

      if (!contentCanvas) {

        contentCanvas =
          document.createElement(
            "canvas"
          );
      }

      contentCanvas.width =
        Math.ceil(
          width * dpr
        );

      contentCanvas.height =
        Math.ceil(
          height * dpr
        );

      const ctx =
        contentCanvas.getContext(
          "2d"
        );

      if (!ctx) {
        return;
      }

      ctx.clearRect(
        0,
        0,
        contentCanvas.width,
        contentCanvas.height
      );

      ctx.save();

      ctx.scale(
        dpr,
        dpr
      );

      /* ===================================================
         FONT
      =================================================== */

      const fontStyle =
        computed.fontStyle ||
        "normal";

      const fontVariant =
        computed.fontVariant ||
        "normal";

      const fontWeight =
        computed.fontWeight ||
        "400";

      const fontSize =
        computed.fontSize ||
        "16px";

      const fontFamily =
        computed.fontFamily ||
        "sans-serif";

      ctx.font =
        `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;

      ctx.fillStyle =
        computed.color ||
        "#222628";

      ctx.textBaseline =
        "top";

      const fontSizeNumber =
        parseFloat(fontSize) ||
        16;

      const letterSpacing =
        parseLetterSpacing(
          computed.letterSpacing,
          fontSizeNumber
        );

      /* ===================================================
         LINE HEIGHT
      =================================================== */

      let lineHeight =
        fontSizeNumber * 1.2;

      if (
        computed.lineHeight !==
        "normal"
      ) {

        if (
          computed.lineHeight.endsWith(
            "px"
          )
        ) {

          lineHeight =
            parseFloat(
              computed.lineHeight
            ) ||
            lineHeight;

        } else {

          const numeric =
            parseFloat(
              computed.lineHeight
            );

          if (
            !isNaN(numeric)
          ) {

            lineHeight =
              numeric *
              fontSizeNumber;
          }
        }
      }

      /* ===================================================
         TEXT
      =================================================== */

      const text =
        element.innerText ||
        element.textContent ||
        "";

      const lines =
        text.split(/\n/);

      /*
       * Add the horizontal buffer
       * before drawing the text.
       */

      const offsetX =
        sourceRect.left -
        wrapperRect.left +
        paddingX;

      const offsetY =
        sourceRect.top -
        wrapperRect.top +
        paddingY;

      const textAlign =
        computed.textAlign;

      /* ===================================================
         DRAW EACH LINE
      =================================================== */

      lines.forEach(
        (
          line,
          index
        ) => {

          const y =
            offsetY +
            index *
              lineHeight;

          let x =
            offsetX;

          if (
            textAlign ===
            "center"
          ) {

            x +=
              sourceRect.width /
              2;

            ctx.textAlign =
              "center";

          } else if (
            textAlign ===
            "right"
          ) {

            x +=
              sourceRect.width;

            ctx.textAlign =
              "right";

          } else {

            ctx.textAlign =
              "left";
          }

          /* =================================================
             NO LETTER SPACING
          ================================================= */

          if (
            Math.abs(
              letterSpacing
            ) < 0.01
          ) {

            ctx.fillText(
              line,
              x,
              y
            );

            return;
          }

          /* =================================================
             CUSTOM LETTER SPACING
          ================================================= */

          const chars =
            Array.from(line);

          let totalWidth = 0;

          chars.forEach(
            (char) => {

              totalWidth +=
                ctx.measureText(
                  char
                ).width;

              totalWidth +=
                letterSpacing;
            }
          );

          totalWidth -=
            letterSpacing;

          let drawX = x;

          if (
            textAlign ===
            "center"
          ) {

            drawX =
              x -
              totalWidth /
                2;

          } else if (
            textAlign ===
            "right"
          ) {

            drawX =
              x -
              totalWidth;
          }

          ctx.textAlign =
            "left";

          chars.forEach(
            (char) => {

              ctx.fillText(
                char,
                drawX,
                y
              );

              drawX +=
                ctx.measureText(
                  char
                ).width +
                letterSpacing;
            }
          );
        }
      );

      ctx.restore();

      /* ===================================================
         TEXTURE
      =================================================== */

      if (!texture) {

        texture =
          new THREE.CanvasTexture(
            contentCanvas
          );

        texture.colorSpace =
          THREE.NoColorSpace;

        texture.minFilter =
          THREE.LinearFilter;

        texture.magFilter =
          THREE.LinearFilter;

        texture.wrapS =
          THREE.ClampToEdgeWrapping;

        texture.wrapT =
          THREE.ClampToEdgeWrapping;

      } else {

        texture.image =
          contentCanvas;

        texture.needsUpdate =
          true;
      }
    };

    /* =====================================================
       DRAW CONTENT
    ===================================================== */

    const drawContent = () => {

      if (imageEl) {

        drawImageContent(
          imageEl
        );

      } else {

        drawTextContent();
      }
    };

    /* =====================================================
       RESIZE
    ===================================================== */

    const resize = () => {

      const rect =
        wrapper.getBoundingClientRect();

      /*
       * Keep the renderer slightly wider
       * than the original text wrapper.
       *
       * This matches the canvas buffer used
       * by drawTextContent().
       */

      const extraWidth =
        imageEl
          ? 0
          : TEXT_BUFFER_X * 2;

      const width =
        Math.max(
          rect.width,
          source.scrollWidth +
            extraWidth,
          1
        );

      const height =
        Math.max(
          rect.height,
          source.scrollHeight,
          1
        );

      renderer.setSize(
        width,
        height,
        false
      );

      /*
       * Explicit CSS size prevents
       * devicePixelRatio from making
       * the canvas visually larger.
       */

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      if (material) {

        material.uniforms.uResolution.value.set(
          width,
          height
        );
      }

      drawContent();
    };

    /* =====================================================
       INITIALIZE
    ===================================================== */

    const initialize = () => {

      /*
       * Hide original DOM content
       * before WebGL starts.
       */

      source.style.opacity =
        "0";

      /*
       * First draw.
       */

      drawContent();

      /*
       * If texture failed,
       * restore original content.
       */

      if (!texture) {

        source.style.opacity =
          "1";

        return;
      }

      /* ===================================================
         SHADER MATERIAL
      =================================================== */

      material =
        new THREE.ShaderMaterial({

          vertexShader,
          fragmentShader,

          uniforms: {

            uTexture: {
              value: texture,
            },

            uMouse: {
              value: currentMouse,
            },

            uHover: {
              value: 0,
            },

            uRadius: {
              value: radius,
            },

            uIntensity: {
              value: intensity,
            },

            uResolution: {
              value:
                new THREE.Vector2(
                  1,
                  1
                ),
            },

            uMouseVelocity: {
              value:
                mouseVelocity,
            },

            uTime: {
              value: 0,
            },
          },

          transparent: true,

          depthWrite: false,

          depthTest: false,

          blending:
            THREE.NormalBlending,
        });

      /* ===================================================
         MESH
      =================================================== */

      geometry =
        new THREE.PlaneGeometry(
          2,
          2
        );

      mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      scene.add(
        mesh
      );

      canvas.style.opacity =
        "1";

      resize();

      initialized =
        true;

      /* ===================================================
         WEB FONT READY
      =================================================== */

      document.fonts.ready.then(
        () => {

          if (
            !initialized ||
            imageEl
          ) {
            return;
          }

          drawContent();

          if (texture) {
            texture.needsUpdate =
              true;
          }

          /*
           * Resize again because
           * the final font metrics can
           * change the text width.
           */

          resize();
        }
      );
    };

    /* =====================================================
       POINTER EVENTS
    ===================================================== */

    const onPointerEnter = () => {

      targetHover = 1;
    };

    const onPointerLeave = () => {

      targetHover = 0;
    };

    const onPointerMove = (
      event: PointerEvent
    ) => {

      const rect =
        wrapper.getBoundingClientRect();

      if (
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return;
      }

      const x =
        (
          event.clientX -
          rect.left
        ) /
        rect.width;

      const y =
        (
          event.clientY -
          rect.top
        ) /
        rect.height;

      targetMouse.set(
        THREE.MathUtils.clamp(
          x,
          0,
          1
        ),
        THREE.MathUtils.clamp(
          1 - y,
          0,
          1
        )
      );
    };

    wrapper.addEventListener(
      "pointerenter",
      onPointerEnter
    );

    wrapper.addEventListener(
      "pointermove",
      onPointerMove
    );

    wrapper.addEventListener(
      "pointerleave",
      onPointerLeave
    );

    /* =====================================================
       RESIZE OBSERVER
    ===================================================== */

    const resizeObserver =
      new ResizeObserver(
        resize
      );

    resizeObserver.observe(
      wrapper
    );

    /* =====================================================
       START
    ===================================================== */

    initialize();

    /* =====================================================
       ANIMATION
    ===================================================== */

    let lastTime =
      performance.now();

    const animate = (
      currentTime: number
    ) => {

      animationFrame =
        requestAnimationFrame(
          animate
        );

      const delta =
        Math.min(
          (
            currentTime -
            lastTime
          ) / 1000,
          0.05
        );

      lastTime =
        currentTime;

      if (
        !initialized ||
        !material
      ) {
        return;
      }

      material.uniforms.uTime.value =
        currentTime * 0.001;

      /* =================================================
         HOVER
      ================================================= */

      currentHover +=
        (
          targetHover -
          currentHover
        ) *
        Math.min(
          delta * 7,
          1
        );

      material.uniforms.uHover.value =
        currentHover;

      /* =================================================
         MOUSE
      ================================================= */

      currentMouse.x +=
        (
          targetMouse.x -
          currentMouse.x
        ) *
        Math.min(
          delta * 10,
          1
        );

      currentMouse.y +=
        (
          targetMouse.y -
          currentMouse.y
        ) *
        Math.min(
          delta * 10,
          1
        );

      /* =================================================
         VELOCITY
      ================================================= */

      const velocityX =
        currentMouse.x -
        previousMouse.x;

      const velocityY =
        currentMouse.y -
        previousMouse.y;

      previousMouse.copy(
        currentMouse
      );

      mouseVelocity.x +=
        (
          velocityX -
          mouseVelocity.x
        ) *
        Math.min(
          delta * 8,
          1
        );

      mouseVelocity.y +=
        (
          velocityY -
          mouseVelocity.y
        ) *
        Math.min(
          delta * 8,
          1
        );

      mouseVelocity.multiplyScalar(
        Math.max(
          0,
          1 -
            delta * 2.5
        )
      );

      /* =================================================
         UNIFORMS
      ================================================= */

      material.uniforms.uMouse.value.copy(
        currentMouse
      );

      material.uniforms.uMouseVelocity.value.copy(
        mouseVelocity
      );

      /* =================================================
         RENDER
      ================================================= */

      renderer.render(
        scene,
        camera
      );
    };

    animationFrame =
      requestAnimationFrame(
        animate
      );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      cancelAnimationFrame(
        animationFrame
      );

      resizeObserver.disconnect();

      wrapper.removeEventListener(
        "pointerenter",
        onPointerEnter
      );

      wrapper.removeEventListener(
        "pointermove",
        onPointerMove
      );

      wrapper.removeEventListener(
        "pointerleave",
        onPointerLeave
      );

      geometry?.dispose();

      material?.dispose();

      texture?.dispose();

      renderer.dispose();

      renderer.forceContextLoss();
    };

  }, [
    intensity,
    radius,
  ]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-visible ${className}`}
      style={{
        isolation: "isolate",
      }}
    >

      <div
        ref={sourceRef}
        className="relative z-0 overflow-visible"
      >
        {children}
      </div>

      <canvas
        ref={canvasRef}
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-10
          block
        "
        style={{
          opacity: 0,
        }}
      />

    </div>
  );
}