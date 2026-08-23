"use client";

import { useEffect, useRef, useState } from "react";
import ClHologramLogo from "./ClHologramLogo";
import { useSectionEntrance } from "./Usesectionentrance";

/* =========================================================
   CONTENT
   ========================================================= */

type Token =
  | { type: "text"; value: string }
  | { type: "image"; src: string; alt: string };

const text = (value: string): Token => ({
  type: "text",
  value,
});

const image = (src: string, alt = ""): Token => ({
  type: "image",
  src,
  alt,
});

const SPARK_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
      <path
        fill='#ffffff'
        d='M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z'
      />
    </svg>
  `);

const PARAGRAPHS: Token[][] = [
  [
    text(
      "Your product deserves more than a generic template — it deserves an interface people actually enjoy using."
    ),
  ],

  [text("We build different.")],

  [
    text("At ioXora"),
    text("®"),
    text("we craft"),
    image(SPARK_ICON, "spark"),
    text(
      "UX-driven websites, AI-powered experiences, interactive web experiences, and custom AI SaaS for ambitious brands."
    ),
  ],
];

/* =========================================================
   TIMING
   ========================================================= */

const LOGO_PHASE_VH = 100;
const STAGE_VH = 140;
const TRANSITION_ZONE = 0.22;

/* =========================================================
   WORD REVEAL
   ========================================================= */

type Piece =
  | {
      kind: "word";
      value: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
    };

function flatten(tokens: Token[]): Piece[] {
  const pieces: Piece[] = [];

  for (const token of tokens) {
    if (token.type === "text") {
      token.value
        .split(" ")
        .filter(Boolean)
        .forEach((word) => {
          pieces.push({
            kind: "word",
            value: word,
          });
        });
    } else {
      pieces.push({
        kind: "image",
        src: token.src,
        alt: token.alt,
      });
    }
  }

  return pieces;
}

function smoothstep(value: number) {
  const t = Math.min(Math.max(value, 0), 1);

  return t * t * (3 - 2 * t);
}

function WordReveal({
  tokens,
  progress,
}: {
  tokens: Token[];
  progress: number;
}) {
  const pieces = flatten(tokens);
  const n = pieces.length;

  const windowSize = Math.max(
    1 / n,
    0.35
  );

  return (
    <p
      className="
        w-full
        text-center
        text-2xl
        font-bold
        leading-snug
        tracking-tight

        sm:text-4xl
        md:text-5xl
        lg:text-6xl
      "
    >
      {pieces.map((piece, index) => {
        const end = (index + 1) / n;

        const start =
          end - windowSize;

        const t = smoothstep(
          (progress - start) /
            windowSize
        );

        /* IMAGE */
        if (piece.kind === "image") {
          return (
            <img
              key={index}
              src={piece.src}
              alt={piece.alt}
              className="
                mx-1
                inline-block
                h-[0.8em]
                w-[0.8em]
                align-middle

                sm:mx-2
              "
              style={{
                opacity:
                  0.2 + 0.8 * t,

                transition:
                  "opacity 0.15s linear",
              }}
            />
          );
        }

        /* TEXT */
        return (
          <span
            key={index}
            style={{
              color: `rgba(255,255,255,${
                0.25 + 0.75 * t
              })`,

              textShadow:
                t > 0.05
                  ? `
                    0 2px 24px rgba(0,0,0,${
                      0.85 * t
                    }),
                    0 0 40px rgba(
                      180,
                      140,
                      255,
                      ${0.35 * t}
                    )
                  `
                  : "none",

              transition:
                "color 0.15s linear, text-shadow 0.15s linear",
            }}
          >
            {piece.value}{" "}
          </span>
        );
      })}
    </p>
  );
}

/* =========================================================
   MAIN SECTION
   ========================================================= */

export default function ScrollReveal3D() {
  const {
    ref: sectionRef,
    style: entranceStyle,
  } = useSectionEntrance();

  const stickyWrapRef =
    useRef<HTMLDivElement>(null);

  const rawProgress =
    useRef(0);

  const smoothProgress =
    useRef(0);

  const [progress, setProgress] =
    useState(0);

  /* =======================================================
     SCROLL LOOP
     ======================================================= */

  useEffect(() => {
    let frame = 0;

    function measure() {
      const element =
        stickyWrapRef.current;

      if (!element) return;

      const rect =
        element.getBoundingClientRect();

      const total =
        rect.height -
        window.innerHeight;

      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        total
      );

      rawProgress.current =
        total > 0
          ? scrolled / total
          : 0;
    }

    function loop() {
      measure();

      smoothProgress.current +=
        (rawProgress.current -
          smoothProgress.current) *
        0.07;

      setProgress(
        smoothProgress.current
      );

      frame =
        requestAnimationFrame(loop);
    }

    frame =
      requestAnimationFrame(loop);

    return () =>
      cancelAnimationFrame(frame);
  }, []);

  /* =======================================================
     TOTAL SCROLL
     ======================================================= */

  const stageCount =
    PARAGRAPHS.length;

  const totalVh =
    LOGO_PHASE_VH +
    stageCount * STAGE_VH;

  const logoPhaseFrac =
    LOGO_PHASE_VH / totalVh;

  /* =======================================================
     LOGO PHASE
     ======================================================= */

  const logoTravel = Math.min(
    progress / logoPhaseFrac,
    1
  );

  const logoEased =
    smoothstep(logoTravel);

  const logoTranslateVh =
    (1 - logoEased) * -120;

  /* =======================================================
     TEXT PHASE
     ======================================================= */

  const textPhaseProgress =
    progress <= logoPhaseFrac
      ? 0
      : (progress - logoPhaseFrac) /
        (1 - logoPhaseFrac);

  const stageProgressRaw =
    textPhaseProgress *
    stageCount;

  const currentIndex = Math.min(
    Math.floor(stageProgressRaw),
    stageCount - 1
  );

  const t = Math.min(
    Math.max(
      stageProgressRaw -
        currentIndex,
      0
    ),
    1
  );

  /* =======================================================
     WORD REVEAL
     ======================================================= */

  const revealT = Math.min(
    t / (1 - TRANSITION_ZONE),
    1
  );

  /* =======================================================
     CROSSFADE
     ======================================================= */

  const hasNext =
    currentIndex <
    stageCount - 1;

  const rawCrossfade =
    hasNext &&
    t > 1 - TRANSITION_ZONE
      ? (t -
          (1 - TRANSITION_ZONE)) /
        TRANSITION_ZONE
      : 0;

  const crossfadeT =
    smoothstep(rawCrossfade);

  /* =======================================================
     FIRST TEXT FADE
     ======================================================= */

  const introFade =
    smoothstep(
      Math.min(
        textPhaseProgress * 6,
        1
      )
    );

  const currentOpacityBase =
    currentIndex === 0
      ? introFade
      : 1;

  /* =======================================================
     UI
     ======================================================= */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        z-10
        -mt-16
        rounded-t-[2.5rem]
        bg-black

        sm:-mt-24
      "
      style={entranceStyle}
    >
      <div
        ref={stickyWrapRef}
        className="relative"
        style={{
          height: `${totalVh}vh`,
        }}
      >
        <div
          className="
            sticky
            top-0
            flex
            h-screen
            flex-col
            items-center
            justify-center
            overflow-hidden

            px-4
            py-10

            sm:px-12
            sm:py-16

            md:p-20
          "
        >
          {/* =================================================
              BACKGROUND VIGNETTE
             ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              bg-[radial-gradient(
                ellipse_at_center,
                rgba(0,0,0,0.55)_0%,
                rgba(0,0,0,0)_60%
              )]
            "
          />

          {/* =================================================
              LOGO

              IMPORTANT:
              Desktop sizes remain exactly large.

              Mobile:
              220px

              SM:
              300px

              MD:
              380px

              LG:
              460px

              XL:
              520px
             ================================================= */}

          <div
            className="
              pointer-events-auto
              absolute
              left-1/2
              top-1/2
              z-10

              h-[220px]
              w-[220px]

              sm:h-[300px]
              sm:w-[300px]

              md:h-[380px]
              md:w-[380px]

              lg:h-[460px]
              lg:w-[460px]

              xl:h-[520px]
              xl:w-[520px]
            "
            style={{
              transform: `
                translate(-50%, -50%)
                translateY(${logoTranslateVh}vh)
              `,

              filter:
                "brightness(0.55) saturate(0.85)",
            }}
          >
            <ClHologramLogo />
          </div>

          {/* =================================================
              TEXT

              IMPORTANT:
              WIDTH IS NOT REDUCED.

              w-full stays exactly as before.
             ================================================= */}

          <div
            className="
              relative
              z-20
              flex
              w-full
              items-center
              justify-center
            "
          >
            {/* =================================================
                CURRENT / OUTGOING TEXT
               ================================================= */}

            <div
              className="w-full"
              style={{
                opacity:
                  currentOpacityBase *
                  (1 - crossfadeT),

                transform: `
                  translateY(${
                    -crossfadeT * 36
                  }px)
                  scale(${
                    1 -
                    crossfadeT * 0.04
                  })
                `,
              }}
            >
              <WordReveal
                tokens={
                  PARAGRAPHS[
                    currentIndex
                  ]
                }
                progress={revealT}
              />
            </div>

            {/* =================================================
                NEXT / INCOMING TEXT
               ================================================= */}

            {hasNext &&
              crossfadeT > 0 && (
                <div
                  className="
                    absolute
                    w-full
                  "
                  style={{
                    opacity:
                      crossfadeT,

                    transform: `
                      translateY(${
                        (1 -
                          crossfadeT) *
                        36
                      }px)
                      scale(${
                        0.98 +
                        crossfadeT *
                          0.02
                      })
                    `,
                  }}
                >
                  <WordReveal
                    tokens={
                      PARAGRAPHS[
                        currentIndex +
                          1
                      ]
                    }
                    progress={0}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}