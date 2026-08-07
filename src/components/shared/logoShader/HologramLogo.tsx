"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* =========================================================
   IOXORA LOGO SHAPE
   ========================================================= */

const WING_A: [number, number][] = [
  [-0.8448, -0.9313],
  [-0.8726, -0.918],
  [-0.9032, -0.8977],
  [-0.9319, -0.8733],
  [-0.9547, -0.8489],
  [-0.9738, -0.822],
  [-0.9868, -0.7914],
  [-0.995, -0.7591],
  [-0.9995, -0.7214],
  [-0.9993, -0.6829],
  [-0.9948, -0.6486],
  [-0.9786, -0.5953],
  [-0.9481, -0.5372],
  [-0.907, -0.4853],
  [-0.8444, -0.4266],
  [-0.7603, -0.3622],
  [-0.6939, -0.3163],
  [-0.651, -0.2858],
  [-0.6132, -0.257],
  [-0.5812, -0.2303],
  [-0.5467, -0.1991],
  [-0.5239, -0.177],
  [-0.5182, -0.1702],
  [-0.5107, -0.1597],
  [-0.5022, -0.1469],
  [-0.4942, -0.134],
  [-0.4844, -0.1175],
  [-0.4738, -0.0976],
  [-0.4676, -0.0802],
  [-0.4637, -0.0586],
  [-0.462, -0.0308],
  [-0.4617, 0.0036],
  [-0.4622, 0.0403],
  [-0.4646, 0.0669],
  [-0.4695, 0.0867],
  [-0.4791, 0.1081],
  [-0.4943, 0.1342],
  [-0.5169, 0.1675],
  [-0.5478, 0.2027],
  [-0.589, 0.2399],
  [-0.6393, 0.2791],
  [-0.7114, 0.3305],
  [-0.817, 0.407],
  [-0.8936, 0.4741],
  [-0.9513, 0.5438],
  [-0.9851, 0.614],
  [-0.9978, 0.6827],
  [-0.9903, 0.7741],
  [-0.951, 0.8552],
  [-0.8907, 0.9098],
  [-0.8036, 0.9441],
  [-0.6997, 0.9485],
  [-0.6099, 0.9263],
  [-0.5144, 0.8705],
  [-0.4121, 0.784],
  [-0.3185, 0.6839],
  [-0.2231, 0.5584],
  [-0.1407, 0.4192],
  [-0.0842, 0.2825],
  [-0.0478, 0.1305],
  [-0.0379, -0.0227],
  [-0.0525, -0.1624],
  [-0.0931, -0.3086],
  [-0.1586, -0.4488],
  [-0.2391, -0.5782],
  [-0.3412, -0.71],
  [-0.4501, -0.821],
  [-0.5448, -0.8924],
  [-0.6053, -0.9228],
  [-0.6681, -0.942],
  [-0.7259, -0.9495],
  [-0.7873, -0.9464],
];

const WING_B: [number, number][] = [
  [0.629, -0.9341],
  [0.5005, -0.8624],
  [0.3571, -0.7296],
  [0.234, -0.5721],
  [0.125, -0.3818],
  [0.0655, -0.2252],
  [0.0535, -0.181],
  [0.0469, -0.1447],
  [0.0434, -0.0999],
  [0.0425, -0.0444],
  [0.0427, 0.036],
  [0.0437, 0.0957],
  [0.047, 0.1432],
  [0.0528, 0.1794],
  [0.0633, 0.2198],
  [0.1039, 0.3353],
  [0.1959, 0.5148],
  [0.3038, 0.6684],
  [0.4357, 0.8087],
  [0.5622, 0.9024],
  [0.6152, 0.9295],
  [0.638, 0.938],
  [0.6637, 0.9433],
  [0.693, 0.9455],
  [0.7362, 0.9461],
  [0.775, 0.9456],
  [0.8061, 0.9434],
  [0.8282, 0.9395],
  [0.8488, 0.9324],
  [0.8735, 0.9199],
  [0.923, 0.8838],
  [0.9584, 0.8432],
  [0.9848, 0.7921],
  [0.9978, 0.7391],
  [0.998, 0.6704],
  [0.9789, 0.5988],
  [0.934, 0.5223],
  [0.8691, 0.4512],
  [0.772, 0.3718],
  [0.6872, 0.3127],
  [0.6202, 0.2617],
  [0.5674, 0.216],
  [0.5217, 0.1695],
  [0.4918, 0.1309],
  [0.4767, 0.1049],
  [0.4688, 0.086],
  [0.4639, 0.0639],
  [0.4618, 0.0381],
  [0.4612, 0],
  [0.4618, -0.0356],
  [0.4642, -0.0639],
  [0.4687, -0.0843],
  [0.4771, -0.1044],
  [0.49, -0.1272],
  [0.521, -0.1686],
  [0.5609, -0.2101],
  [0.6157, -0.2579],
  [0.6765, -0.3045],
  [0.7739, -0.3729],
  [0.8751, -0.4567],
  [0.95, -0.5442],
  [0.9887, -0.6242],
  [0.9994, -0.7126],
  [0.9915, -0.767],
  [0.9838, -0.7956],
  [0.9741, -0.817],
  [0.9584, -0.8399],
  [0.9368, -0.8651],
  [0.892, -0.9049],
  [0.8366, -0.9327],
  [0.7682, -0.9485],
  [0.7014, -0.9492],
];

/* =========================================================
   SHAPE
   ========================================================= */

function createShape(points: [number, number][]) {
  const shape = new THREE.Shape();

  shape.moveTo(
    points[0][0],
    points[0][1]
  );

  for (let i = 1; i < points.length; i++) {
    shape.lineTo(
      points[i][0],
      points[i][1]
    );
  }

  shape.closePath();

  return shape;
}

/* =========================================================
   VERTEX SHADER
   ========================================================= */

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec3 vPosition;
  varying float vLiquid;

  uniform float uHover;
  uniform vec2 uMouse;

  void main() {

    vec3 pos = position;

    /*
      Mouse distance
    */

    vec2 delta =
      pos.xy - uMouse;

    float distanceToMouse =
      length(delta);

    /*
      Stronger and wider liquid influence
    */

    float influence =
      exp(
        -pow(
          distanceToMouse / 0.60,
          2.0
        )
      );

    influence *= uHover;

    /*
      Direction from mouse
    */

    vec2 direction =
      normalize(
        delta +
        vec2(0.0001)
      );

    /*
      =====================================================
      LIQUID / WATER DEFORMATION
      =====================================================
    */

    float wave1 =
      sin(
        pos.x * 10.0 +
        pos.y * 5.0
      );

    float wave2 =
      cos(
        pos.y * 12.0 -
        pos.x * 4.0
      );

    float wave3 =
      sin(
        (pos.x + pos.y) * 16.0
      );

    float liquidShape =
      wave1 * 0.40 +
      wave2 * 0.35 +
      wave3 * 0.25;

    /*
      Main liquid bulge

      Higher = more water-drop effect
    */

    float bulge =
      influence *
      0.30;

    /*
      Strong sideways stretch

      Higher = more liquid movement
    */

    float sidePush =
      influence *
      liquidShape *
      0.20;

    /*
      Additional radial displacement

      Makes the surface feel like
      something pushed into water.
    */

    float ripple =
      sin(
        distanceToMouse * 25.0
      ) *
      influence *
      0.035;

    /*
      Push away from cursor
    */

    pos.xy +=
      direction *
      (
        sidePush +
        ripple
      );

    /*
      Push toward camera
    */

    pos.z +=
      bulge;

    /*
      Extra edge displacement
    */

    pos.xy +=
      vec2(
        sin(pos.y * 18.0),
        cos(pos.x * 18.0)
      ) *
      influence *
      0.018;

    /*
      Save liquid amount
    */

    vLiquid =
      influence;

    /*
      World position
    */

    vec4 worldPosition =
      modelMatrix *
      vec4(
        pos,
        1.0
      );

    vWorldPosition =
      worldPosition.xyz;

    vPosition =
      pos;

    vNormal =
      normalize(
        mat3(modelMatrix) *
        normal
      );

    vViewDirection =
      normalize(
        cameraPosition -
        worldPosition.xyz
      );

    gl_Position =
      projectionMatrix *
      viewMatrix *
      worldPosition;
  }
`;

/* =========================================================
   FRAGMENT SHADER
   ========================================================= */

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec3 vPosition;
  varying float vLiquid;

  uniform float uHover;

  /*
    Static holographic palette
  */

  vec3 rainbow(float t) {

    vec3 c1 =
      vec3(
        0.02,
        0.95,
        1.00
      );

    vec3 c2 =
      vec3(
        0.18,
        0.22,
        1.00
      );

    vec3 c3 =
      vec3(
        0.78,
        0.08,
        1.00
      );

    vec3 c4 =
      vec3(
        1.00,
        0.08,
        0.55
      );

    vec3 c5 =
      vec3(
        1.00,
        0.82,
        0.12
      );

    vec3 c6 =
      vec3(
        0.08,
        1.00,
        0.82
      );

    t = fract(t);

    if (t < 0.2) {

      return mix(
        c1,
        c2,
        t / 0.2
      );
    }

    if (t < 0.4) {

      return mix(
        c2,
        c3,
        (t - 0.2) / 0.2
      );
    }

    if (t < 0.6) {

      return mix(
        c3,
        c4,
        (t - 0.4) / 0.2
      );
    }

    if (t < 0.8) {

      return mix(
        c4,
        c5,
        (t - 0.6) / 0.2
      );
    }

    return mix(
      c5,
      c6,
      (t - 0.8) / 0.2
    );
  }

  void main() {

    vec3 N =
      normalize(vNormal);

    vec3 V =
      normalize(vViewDirection);

    /*
      Fresnel
    */

    float facing =
      max(
        dot(N, V),
        0.0
      );

    float fresnel =
      pow(
        1.0 - facing,
        2.25
      );

    /*
      =====================================================
      STATIC HOLOGRAPHIC COLOR
      =====================================================

      IMPORTANT:
      NO uTime here.

      Therefore there is no continuous
      left-to-right color animation.
    */

    float phase =
      dot(
        N,
        normalize(
          vec3(
            0.75,
            0.45,
            1.0
          )
        )
      );

    phase +=
      fresnel * 0.65;

    /*
      Hover affects the liquid area,
      but does not create a continuous sweep.
    */

    phase +=
      vLiquid * 0.42;

    vec3 rainbowColor =
      rainbow(
        phase * 0.72 +
        0.5
      );

    /*
      Glass base
    */

    vec3 glassBase =
      vec3(
        0.70,
        0.84,
        1.0
      );

    vec3 body =
      mix(
        glassBase,
        rainbowColor,
        0.40
      );

    /*
      Main light
    */

    vec3 lightDirection =
      normalize(
        vec3(
          0.30,
          0.65,
          1.0
        )
      );

    float diffuse =
      max(
        dot(
          N,
          lightDirection
        ),
        0.0
      );

    /*
      Specular
    */

    vec3 reflected =
      reflect(
        -lightDirection,
        N
      );

    float specular =
      pow(
        max(
          dot(
            reflected,
            V
          ),
          0.0
        ),
        50.0
      );

    /*
      Broad glass highlight
    */

    float broadHighlight =
      pow(
        max(
          dot(
            N,
            normalize(
              vec3(
                -0.30,
                0.72,
                1.0
              )
            )
          ),
          0.0
        ),
        7.0
      );

    /*
      Cursor liquid highlight
    */

    float liquidHighlight =
      vLiquid *
      (
        0.45 +
        fresnel * 0.9
      );

    /*
      Final body
    */

    vec3 color =
      body *
      (
        0.42 +
        diffuse * 0.38
      );

    /*
      Holographic edge
    */

    color +=
      rainbowColor *
      fresnel *
      1.45;

    /*
      White reflection
    */

    color +=
      vec3(1.0) *
      specular *
      1.35;

    /*
      Broad reflection
    */

    color +=
      vec3(
        0.85,
        0.95,
        1.0
      ) *
      broadHighlight *
      0.75;

    /*
      Liquid highlight
    */

    color +=
      mix(
        vec3(
          0.25,
          0.75,
          1.0
        ),
        rainbowColor,
        0.65
      ) *
      liquidHighlight *
      1.15;

    /*
      Extra bright rim while hovering
    */

    color +=
      rainbowColor *
      vLiquid *
      0.45;

    /*
      Transparency
    */

    float alpha =
      0.40 +
      fresnel * 0.55 +
      specular * 0.20;

    alpha +=
      liquidHighlight *
      0.10;

    alpha =
      clamp(
        alpha,
        0.40,
        0.98
      );

    gl_FragColor =
      vec4(
        color,
        alpha
      );
  }
`;

/* =========================================================
   COMPONENT
   ========================================================= */

export default function HologramLogo() {

  const bannerRef =
    useRef<HTMLDivElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const banner =
      bannerRef.current;

    const canvas =
      canvasRef.current;

    if (
      !banner ||
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
        antialias: true,
        alpha: true,
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
       SCENE
       ===================================================== */

    const scene =
      new THREE.Scene();

    const camera =
      new THREE.PerspectiveCamera(
        30,
        1,
        0.1,
        100
      );

    camera.position.set(
      0,
      0,
      7.8
    );

    /* =====================================================
       GEOMETRY
       ===================================================== */

    const extrudeSettings:
      THREE.ExtrudeGeometryOptions = {

      depth: 0.44,

      bevelEnabled: true,

      bevelThickness: 0.085,

      bevelSize: 0.065,

      bevelSegments: 8,

      curveSegments: 2,
    };

    const geometryA =
      new THREE.ExtrudeGeometry(
        createShape(WING_A),
        extrudeSettings
      );

    const geometryB =
      new THREE.ExtrudeGeometry(
        createShape(WING_B),
        extrudeSettings
      );

    geometryA.translate(
      0,
      0,
      -extrudeSettings.depth! / 2
    );

    geometryB.translate(
      0,
      0,
      -extrudeSettings.depth! / 2
    );

    geometryA.computeVertexNormals();

    geometryB.computeVertexNormals();

    /* =====================================================
       UNIFORMS
       ===================================================== */

    const uniforms = {

      uHover: {
        value: 0,
      },

      uMouse: {
        value:
          new THREE.Vector2(
            0,
            0
          ),
      },

      uMouseVelocity: {
        value:
          new THREE.Vector2(
            0,
            0
          ),
      },
    };

    /* =====================================================
       MATERIAL
       ===================================================== */

    const material =
      new THREE.ShaderMaterial({

        vertexShader,

        fragmentShader,

        uniforms,

        transparent: true,

        depthWrite: true,

        depthTest: true,

        side: THREE.DoubleSide,

        blending:
          THREE.NormalBlending,
      });

    /* =====================================================
       LOGO GROUP
       ===================================================== */

    const meshA =
      new THREE.Mesh(
        geometryA,
        material
      );

    const meshB =
      new THREE.Mesh(
        geometryB,
        material
      );

    const group =
      new THREE.Group();

    group.add(
      meshA,
      meshB
    );

    /*
      =====================================================
      LOGO SIZE
      =====================================================

      1.25 = current size

      Smaller:
      1.0

      Bigger:
      1.4
    */

    group.scale.setScalar(
      1.25
    );

    scene.add(
      group
    );

    /* =====================================================
       STATE
       ===================================================== */

    let hoverTarget = 0;

    let hoverValue = 0;

    let mouseX = 0;

    let mouseY = 0;

    let smoothMouseX = 0;

    let smoothMouseY = 0;

    let targetRotX = 0;

    let targetRotY = 0;

    let currentRotX = 0;

    let currentRotY = 0;

    let targetLogoX = 0;

    let targetLogoY = 0;

    let currentLogoX = 0;

    let currentLogoY = 0;

    let previousMouseX = 0;

    let previousMouseY = 0;

    let idleRotation = 0;

    /* =====================================================
       POINTER ENTER
       ===================================================== */

    const onPointerEnter =
      () => {

        hoverTarget = 1;
      };

    /* =====================================================
       POINTER LEAVE
       ===================================================== */

    const onPointerLeave =
      () => {

        hoverTarget = 0;

        targetRotX = 0;

        targetRotY = 0;

        targetLogoX = 0;

        targetLogoY = 0;
      };

    /* =====================================================
       POINTER MOVE
       ===================================================== */

    const onPointerMove =
      (
        event: PointerEvent
      ) => {

        const rect =
          banner.getBoundingClientRect();

        const nx =
          (
            (
              event.clientX -
              rect.left
            ) /
            rect.width
          ) *
            2 -
          1;

        const ny =
          (
            (
              event.clientY -
              rect.top
            ) /
            rect.height
          ) *
            2 -
          1;

        /*
          Shader mouse
        */

        mouseX = nx;

        mouseY = -ny;

        /*
          Logo follows cursor
        */

        targetLogoX =
          nx * 0.42;

        targetLogoY =
          -ny * 0.25;

        /*
          3D tilt
        */

        targetRotY =
          nx * 0.38;

        targetRotX =
          -ny * 0.26;
      };

    banner.addEventListener(
      "pointerenter",
      onPointerEnter
    );

    banner.addEventListener(
      "pointerleave",
      onPointerLeave
    );

    banner.addEventListener(
      "pointermove",
      onPointerMove
    );

    /* =====================================================
       RESIZE
       ===================================================== */

    const resize =
      () => {

        const width =
          banner.clientWidth;

        const height =
          banner.clientHeight;

        if (
          width <= 0 ||
          height <= 0
        ) {
          return;
        }

        renderer.setSize(
          width,
          height,
          false
        );

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();
      };

    const resizeObserver =
      new ResizeObserver(
        resize
      );

    resizeObserver.observe(
      banner
    );

    resize();

    /* =====================================================
       ANIMATION
       ===================================================== */

    const clock =
      new THREE.Clock();

    let animationFrame = 0;

    const animate =
      () => {

        animationFrame =
          requestAnimationFrame(
            animate
          );

        const delta =
          clock.getDelta();

        /*
          Smooth hover
        */

        hoverValue +=
          (
            hoverTarget -
            hoverValue
          ) *
          Math.min(
            delta * 7,
            1
          );

        uniforms.uHover.value =
          hoverValue;

        /*
          Smooth mouse
        */

        smoothMouseX +=
          (
            mouseX -
            smoothMouseX
          ) *
          Math.min(
            delta * 8,
            1
          );

        smoothMouseY +=
          (
            mouseY -
            smoothMouseY
          ) *
          Math.min(
            delta * 8,
            1
          );

        /*
          Mouse velocity
        */

        const velocityX =
          smoothMouseX -
          previousMouseX;

        const velocityY =
          smoothMouseY -
          previousMouseY;

        previousMouseX =
          smoothMouseX;

        previousMouseY =
          smoothMouseY;

        uniforms.uMouseVelocity.value.x +=
          (
            velocityX -
            uniforms.uMouseVelocity.value.x
          ) *
          0.18;

        uniforms.uMouseVelocity.value.y +=
          (
            velocityY -
            uniforms.uMouseVelocity.value.y
          ) *
          0.18;

        /*
          Shader mouse
        */

        uniforms.uMouse.value.x =
          smoothMouseX;

        uniforms.uMouse.value.y =
          smoothMouseY;

        /*
          Logo follows mouse
        */

        currentLogoX +=
          (
            targetLogoX -
            currentLogoX
          ) *
          Math.min(
            delta * 4,
            1
          );

        currentLogoY +=
          (
            targetLogoY -
            currentLogoY
          ) *
          Math.min(
            delta * 4,
            1
          );

        group.position.x =
          currentLogoX;

        group.position.y =
          currentLogoY;

        /*
          Smooth rotation
        */

        currentRotX +=
          (
            targetRotX -
            currentRotX
          ) *
          Math.min(
            delta * 5,
            1
          );

        currentRotY +=
          (
            targetRotY -
            currentRotY
          ) *
          Math.min(
            delta * 5,
            1
          );

        /*
          Slow idle rotation
        */

        idleRotation +=
          delta * 0.08;

        group.rotation.x =
          currentRotX;

        group.rotation.y =
          idleRotation +
          currentRotY;

        /*
          Tiny floating motion
        */

        group.position.z =
          Math.sin(
            performance.now() *
              0.00065
          ) *
          0.018;

        /*
          Hover scale
        */

        const scale =
          1.25 +
          hoverValue * 0.035;

        group.scale.setScalar(
          scale
        );

        renderer.render(
          scene,
          camera
        );
      };

    animate();

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {

      cancelAnimationFrame(
        animationFrame
      );

      resizeObserver.disconnect();

      banner.removeEventListener(
        "pointerenter",
        onPointerEnter
      );

      banner.removeEventListener(
        "pointerleave",
        onPointerLeave
      );

      banner.removeEventListener(
        "pointermove",
        onPointerMove
      );

      geometryA.dispose();

      geometryB.dispose();

      material.dispose();

      renderer.dispose();

      renderer.forceContextLoss();
    };

  }, []);

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div
      ref={bannerRef}
      className="
        relative
        h-full
        min-h-[500px]
        w-full
        z-10
        overflow-visible
        touch-none
       
      "
    >

      {/* =================================================
          BOTTOM SHADOW
          ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          bottom-[7%]
          z-0
          h-[32px]
          w-[250px]
          -translate-x-1/2
          rounded-[50%]
          bg-black/15
         
          blur-[18px]
        "
      />

      {/* =================================================
          HOLOGRAPHIC GLOW
          ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          bottom-[6%]
          z-0
          h-[45px]
          w-[280px]
          -translate-x-1/2
          rounded-[50%]
          bg-[radial-gradient(ellipse,rgba(139,124,255,0.18),rgba(236,72,153,0.08),transparent_70%)]
          blur-[20px]
        "
      />

      {/* =================================================
          CANVAS
          ================================================= */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          z-10
          block
          h-full
          w-full
        "
      />

    </div>
  );
}