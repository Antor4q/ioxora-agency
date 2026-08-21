"use client";

import { useEffect, useRef, useState } from "react";
import ClHologramLogo from "./ClHologramLogo";
import { useSectionEntrance } from "./Usesectionentrance";


/* =========================================================
   CONTENT
   ========================================================= */

type Token = { type: "text"; value: string } | { type: "image"; src: string; alt: string };

const text = (value: string): Token => ({ type: "text", value });
const image = (src: string, alt = ""): Token => ({ type: "image", src, alt });

const SPARK_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
       <path fill='#ffffff' d='M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z'/>
     </svg>`
  );

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
    text("UX-driven websites, AI-powered experiences, interactive web experiences, and custom AI SaaS for ambitious brands."),
  ],
];

/* =========================================================
   TIMING CONFIG
   - LOGO_PHASE_VH: scroll (vh) spent purely on the logo traveling
     from above -> center, before any text appears.
   - STAGE_VH: scroll (vh) each paragraph gets. Inside this, a
     portion goes to word-by-word reveal, a portion is a hold, and
     the tail is the crossfade transition into the next paragraph.
   - TRANSITION_ZONE: fraction (0-1) of each stage's tail reserved
     for the outgoing/incoming crossfade animation.
   ========================================================= */

const LOGO_PHASE_VH = 100;
const STAGE_VH = 140;
const TRANSITION_ZONE = 0.22;

/* =========================================================
   WORD-BY-WORD REVEAL
   ========================================================= */

type Piece = { kind: "word"; value: string } | { kind: "image"; src: string; alt: string };

function flatten(tokens: Token[]): Piece[] {
  const pieces: Piece[] = [];
  for (const t of tokens) {
    if (t.type === "text") {
      t.value
        .split(" ")
        .filter(Boolean)
        .forEach((w) => pieces.push({ kind: "word", value: w }));
    } else {
      pieces.push({ kind: "image", src: t.src, alt: t.alt });
    }
  }
  return pieces;
}

function smoothstep(t: number) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

function WordReveal({ tokens, progress }: { tokens: Token[]; progress: number }) {
  const pieces = flatten(tokens);
  const n = pieces.length;
  const windowSize = Math.max(1 / n, 0.35);

  return (
    <p className="w-full text-center text-3xl font-bold leading-snug tracking-tight sm:text-5xl md:text-6xl">
      {pieces.map((p, i) => {
        const end = (i + 1) / n;
        const start = end - windowSize;
        const t = smoothstep((progress - start) / windowSize);

        if (p.kind === "image") {
          return (
            <img
              key={i}
              src={p.src}
              alt={p.alt}
              className="mx-2 inline-block h-[0.8em] w-[0.8em] align-middle"
              style={{ opacity: 0.2 + 0.8 * t, transition: "opacity 0.15s linear" }}
            />
          );
        }

        return (
          <span
            key={i}
            style={{
              color: `rgba(255,255,255, ${0.25 + 0.75 * t})`,
              textShadow:
                t > 0.05
                  ? `0 2px 24px rgba(0,0,0,${0.85 * t}), 0 0 40px rgba(180,140,255,${0.35 * t})`
                  : "none",
              transition: "color 0.15s linear, text-shadow 0.15s linear",
            }}
          >
            {p.value}{" "}
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
  const { ref: sectionRef, style: entranceStyle } = useSectionEntrance();
  const stickyWrapRef = useRef<HTMLDivElement>(null);

  const rawProgress = useRef(0);
  const smoothProgress = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function measure() {
      const el = stickyWrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        rawProgress.current = total > 0 ? scrolled / total : 0;
      }
    }

    function loop() {
      measure();
      smoothProgress.current += (rawProgress.current - smoothProgress.current) * 0.07;
      setProgress(smoothProgress.current);
      frame = requestAnimationFrame(loop);
    }

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const stageCount = PARAGRAPHS.length;

  const totalVh = LOGO_PHASE_VH + stageCount * STAGE_VH;
  const logoPhaseFrac = LOGO_PHASE_VH / totalVh;

  /* ---------- PHASE 1: logo travels top -> center ---------- */
  const logoTravel = Math.min(progress / logoPhaseFrac, 1);
  const logoEased = smoothstep(logoTravel);
  const logoTranslateVh = (1 - logoEased) * -120;

  /* ---------- PHASE 2: text reveals + crossfades between stages --------- */
  const textPhaseProgress =
    progress <= logoPhaseFrac ? 0 : (progress - logoPhaseFrac) / (1 - logoPhaseFrac);

  const stageProgressRaw = textPhaseProgress * stageCount;
  const currentIndex = Math.min(Math.floor(stageProgressRaw), stageCount - 1);
  const t = Math.min(Math.max(stageProgressRaw - currentIndex, 0), 1);

  // word-by-word reveal happens over the non-transition portion of the stage
  const revealT = Math.min(t / (1 - TRANSITION_ZONE), 1);

  // crossfade only kicks in during the tail of the stage (after the words
  // are already fully revealed), and only if there is a next paragraph
  const hasNext = currentIndex < stageCount - 1;
  const rawCrossfade =
    hasNext && t > 1 - TRANSITION_ZONE ? (t - (1 - TRANSITION_ZONE)) / TRANSITION_ZONE : 0;
  const crossfadeT = smoothstep(rawCrossfade);

  // gentle fade-in for the very first paragraph right as phase 2 begins
  const introFade = smoothstep(Math.min(textPhaseProgress * 6, 1));
  const currentOpacityBase = currentIndex === 0 ? introFade : 1;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 -mt-16 rounded-t-[2.5rem] bg-black sm:-mt-24"
      style={entranceStyle}
    >
      <div ref={stickyWrapRef} className="relative" style={{ height: `${totalVh}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 sm:px-12 sm:py-16 md:p-20">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_60%)]" />

          <div
            className="pointer-events-auto absolute left-1/2 top-1/2 h-[240px] w-[240px] sm:h-[320px] sm:w-[320px] md:h-[420px] md:w-[420px]"
            style={{
              transform: `translate(-50%, -50%) translateY(${logoTranslateVh}vh)`,
              filter: "brightness(0.55) saturate(0.85)",
            }}
          >
            <ClHologramLogo />
          </div>

          {/* text stage crossfade wrapper */}
          <div className="relative z-20 flex w-full items-center justify-center">
            {/* outgoing / current stage: fully revealed, then fades + slides up */}
            <div
              className="w-full"
              style={{
                opacity: currentOpacityBase * (1 - crossfadeT),
                transform: `translateY(${-crossfadeT * 36}px) scale(${1 - crossfadeT * 0.04})`,
              }}
            >
              <WordReveal tokens={PARAGRAPHS[currentIndex]} progress={revealT} />
            </div>

            {/* incoming next stage: fades + slides up into place underneath,
                still fully dim (unrevealed) — its own word reveal takes over
                once it becomes the active stage */}
            {hasNext && crossfadeT > 0 && (
              <div
                className="absolute w-full"
                style={{
                  opacity: crossfadeT,
                  transform: `translateY(${(1 - crossfadeT) * 36}px) scale(${0.98 + crossfadeT * 0.02})`,
                }}
              >
                <WordReveal tokens={PARAGRAPHS[currentIndex + 1]} progress={0} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}