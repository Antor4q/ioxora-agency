"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ProcessSection (DARK — screenshot exact match)
 * -------------------------------------------------------------------
 * - Pure black bg, faded icon grid upore (decorative, optional).
 * - Center e glowing ring + white circle logo.
 * - Trunk line niche name, horizontal bar e branch hoy, tarpor rounded
 *   elbow kore protyekta card e namche — exactly screenshot er moto.
 * - Line er start/end e choto glowing dot.
 * - Card: dark navy/almost-black, subtle border, colored icon box,
 *   "PRODUCES:" label, lavender pill tag.
 */

interface ProcessStep {
  title: string;
  icons: ReactNode[];
  produces: string[];
}

interface ProcessSectionProps {
  logo?: ReactNode;
  steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep];
}

const LINE_COLOR = "#7DD3FC";
const LINE_GLOW = "#38BDF8";
const CARD_BG = "#0A0F1A";
const CARD_BORDER = "rgba(148, 163, 184, 0.12)";
const ICON_BOX_BG = "#0F1622";
const ICON_BOX_BORDER = "rgba(148, 163, 184, 0.14)";
const TAG_BG = "rgba(30, 27, 55, 0.9)";
const TAG_TEXT = "#C4B5FD";
const TAG_BORDER = "rgba(139, 92, 246, 0.25)";

// 4 card er center x (1000-wide viewBox e)
const CARD_X = [125, 375, 625, 875];
const TRUNK_Y = 90; // horizontal bar er height
const DROP_Y = 170; // card er top porjonto line namche
const RADIUS = 14; // elbow corner radius

// Rounded-elbow path banano: horizontal theke vertical e round kore mode kore
function branchPath(centerX: number, x: number, trunkY: number, dropY: number, r: number) {
  const dir = x > centerX ? 1 : x < centerX ? -1 : 0;
  if (dir === 0) {
    return `M ${centerX} ${trunkY} L ${x} ${dropY}`;
  }
  const cornerX = x - dir * r;
  return `M ${centerX} ${trunkY} L ${cornerX} ${trunkY} Q ${x} ${trunkY} ${x} ${trunkY + r} L ${x} ${dropY}`;
}

export default function ProcessSection({ logo, steps }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const branchRefs = useRef<Array<SVGPathElement | null>>([]);
  const trunkRef = useRef<SVGPathElement | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const logoEl = logoRef.current;
    const trunk = trunkRef.current;
    if (!section || !pin || !logoEl || !trunk) return;

    const ctx = gsap.context(() => {
      gsap.set(logoEl, { scale: 0.4, opacity: 0 });
      gsap.set(cardRefs.current, { opacity: 0, y: 28 });

      const trunkLen = trunk.getTotalLength();
      gsap.set(trunk, { strokeDasharray: trunkLen, strokeDashoffset: trunkLen });

      branchRefs.current.forEach((line) => {
        if (!line) return;
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: true,
        },
      });

      tl.to(logoEl, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" });
      tl.to(trunk, { strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" });

      steps.forEach((_, i) => {
        const line = branchRefs.current[i];
        const card = cardRefs.current[i];
        if (line) {
          tl.to(line, { strokeDashoffset: 0, duration: 0.35, ease: "power2.inOut" });
        }
        if (card) {
          tl.to(card, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "<0.05");
        }
      });
    }, section);

    return () => ctx.revert();
  }, [steps]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-black">
      {/* ---- Background e faded decorative icon grid ---- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        ref={pinRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-center gap-10 py-24"
      >
        {/* ---- Center glowing logo ---- */}
        <div
          ref={logoRef}
          className="relative z-20 flex h-40 w-40 items-center justify-center rounded-full sm:h-48 sm:w-48"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${LINE_GLOW}2e, transparent 72%)`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${LINE_GLOW}40`,
              boxShadow: `0 0 70px 14px ${LINE_GLOW}26, inset 0 0 30px ${LINE_GLOW}1a`,
            }}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_45px_rgba(56,189,248,0.55)] sm:h-20 sm:w-20">
            {logo ?? <span className="text-2xl font-bold text-[#0B1220]">X</span>}
          </div>
        </div>

        {/* ---- Connector lines + card row ---- */}
        <div className="relative w-full max-w-6xl px-6">
          <svg
            className="pointer-events-none absolute inset-0 -top-10 h-[calc(100%+2.5rem)] w-full overflow-visible"
            viewBox="0 0 1000 260"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* trunk: logo theke horizontal bar porjonto */}
            <path
              ref={trunkRef}
              d={`M 500 0 L 500 ${TRUNK_Y}`}
              fill="none"
              stroke={LINE_COLOR}
              strokeWidth={2}
              strokeLinecap="round"
              filter="url(#lineGlow)"
            />
            <circle cx={500} cy={0} r={3} fill={LINE_COLOR} filter="url(#lineGlow)" />

            {CARD_X.map((x, i) => (
              <g key={x}>
                <path
                  ref={(el) => {
                    branchRefs.current[i] = el;
                  }}
                  d={branchPath(500, x, TRUNK_Y, DROP_Y, RADIUS)}
                  fill="none"
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineGlow)"
                />
                <circle cx={x} cy={DROP_Y} r={3.5} fill={LINE_COLOR} filter="url(#lineGlow)" />
              </g>
            ))}
          </svg>

          <div className="relative z-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="relative rounded-2xl p-6"
                style={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  boxShadow: `0 0 30px -10px ${LINE_GLOW}22, 0 4px 20px -6px rgba(0,0,0,0.5)`,
                }}
              >
                <h3 className="text-lg font-bold text-white">{step.title}</h3>

                <div className="mt-4 flex gap-2">
                  {step.icons.map((icon, iconIdx) => (
                    <div
                      key={iconIdx}
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: ICON_BOX_BG,
                        border: `1px solid ${ICON_BOX_BORDER}`,
                        boxShadow: `0 0 14px -4px ${LINE_GLOW}33`,
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/35">
                  Produces:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {step.produces.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: TAG_BG,
                        color: TAG_TEXT,
                        border: `1px solid ${TAG_BORDER}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}