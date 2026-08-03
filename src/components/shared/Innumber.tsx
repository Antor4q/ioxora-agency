"use client";

/**
 * InNumber.tsx
 *
 * Hero section: rotating iridescent hologram cube (real PNG asset, distorted
 * with LiquidHover) centered inside pulsing orbit rings, a small
 * "01 / 5 / Year Experience" tag card that gently tumbles in 3D, three glowing
 * signal lines, and three full-bleed image stat cards ("250+ Projects
 * Delivered" / "2 Products" / "20% Conversion Rate Increase") — positioned
 * to match the reference layout 1:1.
 *
 * SETUP
 * 1. Put the cube image at:  /public/number1.png
 * 2. Drop stat card photos at:
 *      /public/number2.png   (Projects Delivered)
 *      /public/number4.png   (Products)
 *      /public/number3.png   (Conversion Rate)
 * 3. Drop in:  import InNumber from "@/components/InNumber"; <InNumber />
 *
 * No extra packages required — pure Tailwind + CSS (styled-jsx, built into Next.js).
 */

import Image from "next/image";
import LiquidHover from "./LiquidHover";
import TextReveal from "./textreveal/TextReveal";

const ACCENT = "#D5F139";

function StatCard({
  className,
  src,
  alt,
  value,
  label,
}: {
  className: string;
  src: string;
  alt: string;
  value: string;
  label: string;
}) {
  return (
    <div
      className={`card group absolute hidden overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out hover:-rotate-1 lg:block ${className}`}
    >
      <div className="relative h-[230px] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* scrim so the stat stays legible over any photo, bg color itself is gone — it's all image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end gap-1.5 p-5">
          <p className="text-[34px] font-semibold leading-none text-white">{value}</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
            <p className="text-[12px] font-medium tracking-[0.04em] text-white/55">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InNumber() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] px-20  py-24">
        <div className="mb-14">
             <h4 className="text-2xl font-bold text-[#797B7C] mb-5">{"Work's"}</h4>
                       <TextReveal
                        start="top 85%"
              end="top 55%"
              scrub={0.3}
                        as="h2" 
                       className="
                 text-[112px] 
                  text-[#6e7071]
                  font-bold
                  leading-[1.0]
                  tracking-[-0.06em]
                  whitespace-nowrap">
                        A Glimpse Into The Work 
                       </TextReveal>
        </div>
                 
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[920px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]" />
      </div>

      {/* stage — proportions locked to the reference layout, scales as one unit */}
      <div className="stage relative mx-auto w-full max-w-[1440px]">
        {/* connecting signal lines */}
  <svg
  className="pointer-events-none absolute inset-0 h-full w-full"
  viewBox="0 0 1603 837"
  preserveAspectRatio="none"
  fill="none"
>
  <defs>
    <linearGradient id="lineLeft" x1="480" y1="300" x2="640" y2="392" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#f5b878" stopOpacity="0" />
      <stop offset="0.6" stopColor="#f5b878" stopOpacity="0.9" />
      <stop offset="1" stopColor="#ffe8c9" stopOpacity="1" />
    </linearGradient>
    <linearGradient id="lineRight" x1="945" y1="392" x2="1112" y2="470" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#bfe9ff" stopOpacity="1" />
      <stop offset="0.5" stopColor="#8fd6ff" stopOpacity="0.7" />
      <stop offset="1" stopColor="#8fd6ff" stopOpacity="0" />
    </linearGradient>
    {/* cube bottom-edge → Products card (bottom-left). x2/y2 sits just below the
        cube's visual footprint (~x:674-930, y:290-546 in this viewBox) so the
        line starts outside the cube instead of being hidden under it. */}
    <linearGradient id="lineBottomLeft" x1="430" y1="600" x2="700" y2="552" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#f5b878" stopOpacity="0" />
      <stop offset="0.5" stopColor="#f5b878" stopOpacity="0.75" />
      <stop offset="1" stopColor="#ffe8c9" stopOpacity="1" />
    </linearGradient>
  </defs>

  <line x1="480" y1="300" x2="640" y2="392" stroke="url(#lineLeft)" strokeWidth="2" />
  <line x1="945" y1="392" x2="1112" y2="470" stroke="url(#lineRight)" strokeWidth="2" />
  <line x1="430" y1="600" x2="700" y2="552" stroke="url(#lineBottomLeft)" strokeWidth="2" />

  <circle cx="640" cy="392" r="4" fill="#ffe8c9" className="spark" />
  <circle cx="945" cy="392" r="4" fill="#bfe9ff" className="spark spark--b" />
  <circle cx="700" cy="552" r="4" fill="#ffe8c9" className="spark" />
</svg>
        {/* centerpiece: rings + cube + tag card, pinned at layout center */}
        <div className="center-anchor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="orbit-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="ring ring--a" />
            <div className="ring ring--b" />
            <div className="ring ring--c" />
            <div className="ring ring--static" />
          </div>

          <div className="cube-wrap relative z-10">
            <LiquidHover intensity={2.2} radius={0.13} className="w-max overflow-visible">
              <Image
                src="/number1.png"
                alt="Iridescent chrome hologram cube"
                width={420}
                height={428}
                priority
                className="cube-img h-auto w-[230px] select-none sm:w-[280px]"
              />
            </LiquidHover>
            <div className="pointer-events-none absolute left-1/2 top-[62%] h-8 w-32 -translate-x-1/2 rounded-full bg-cyan-300/25 blur-2xl" />
          </div>

          {/* tag card — 3D seesaw tumble: left corner lifts while right dips, then reverses (unchanged) */}
          <div className="tag-card-perspective absolute -right-6 top-[6%] z-20">
            <div className="tag-card w-[110px] rounded-xl border border-white/10 bg-[#0a0c11]/90 px-3 py-2.5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <p className="text-[11px] font-medium text-white/50">01</p>
              <p className="text-3xl font-semibold text-center leading-none text-white">5</p>
              <p className="mt-1.5 text-[9px] text-center font-medium tracking-[0.18em] text-white/40">Year Experience</p>
            </div>
          </div>
        </div>

        {/* stat card — Projects Delivered */}
        <StatCard
          className="card--left"
          src="/number2.png"
          alt="Projects delivered"
          value="250+"
          label="Projects Delivered"
        />

        {/* stat card — Products */}
        <StatCard
          className="card--products"
          src="/number2.png"
          alt="Products"
          value="2"
          label="Products"
        />

        {/* stat card — Conversion Rate */}
        <StatCard
          className="card--right"
          src="/number3.png"
          alt="Conversion rate increase"
          value="20%"
          label="Conversion Rate Increase"
        />
      </div>

      <style jsx>{`
        .stage {
          aspect-ratio: 1603 / 837;
        }
        .center-anchor {
          width: 300px;
          height: 300px;
        }
        .cube-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: cube-float 6s ease-in-out infinite;
        }
        .cube-img {
          animation: cube-sway 9s ease-in-out infinite;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6));
        }
        @keyframes cube-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes cube-sway {
          0%,
          100% {
            transform: rotate(-2deg) scale(1);
          }
          50% {
            transform: rotate(2deg) scale(1.015);
          }
        }

        /* orbit rings */
        .orbit-wrap {
          width: 620px;
          height: 620px;
        }
        .ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
        }
        .ring--static {
          border: 1px solid rgba(255, 255, 255, 0.08);
          inset: 90px;
        }
        .ring--static::before {
          content: "";
          position: absolute;
          inset: -70px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ring--static::after {
          content: "";
          position: absolute;
          inset: -140px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.035);
        }
        .ring--a,
        .ring--b,
        .ring--c {
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
        }
        .ring--a {
          inset: 90px;
          background: conic-gradient(from 200deg, transparent 0deg, rgba(245, 184, 120, 0.85) 30deg, transparent 70deg, transparent 360deg);
          animation: spin 9s linear infinite;
        }
        .ring--b {
          inset: 20px;
          background: conic-gradient(from 30deg, transparent 0deg, rgba(143, 214, 255, 0.8) 26deg, transparent 65deg, transparent 360deg);
          animation: spin-rev 13s linear infinite;
        }
        .ring--c {
          inset: -50px;
          background: conic-gradient(from 260deg, transparent 0deg, rgba(255, 255, 255, 0.5) 20deg, transparent 55deg, transparent 360deg);
          animation: spin 17s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-rev {
          to {
            transform: rotate(-360deg);
          }
        }

        /* tag card — real 3D tilt: perspective on the wrapper, rotation on the card */
        .tag-card-perspective {
          perspective: 700px;
          perspective-origin: 50% 100%;
        }
        .tag-card {
          transform-style: preserve-3d;
          animation: tag-seesaw 6s ease-in-out infinite;
        }
        @keyframes tag-seesaw {
          0% {
            transform: translateY(0px) rotateY(-18deg) rotateZ(-6deg);
          }
          25% {
            transform: translateY(-7px) rotateY(-4deg) rotateZ(-1deg);
          }
          50% {
            transform: translateY(0px) rotateY(18deg) rotateZ(6deg);
          }
          75% {
            transform: translateY(-7px) rotateY(4deg) rotateZ(1deg);
          }
          100% {
            transform: translateY(0px) rotateY(-18deg) rotateZ(-6deg);
          }
        }

        /* sparks on the signal lines */
        .spark {
          animation: spark-pulse 2.4s ease-in-out infinite;
        }
        .spark--b {
          animation-delay: 1.1s;
        }
        @keyframes spark-pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        /* card positions, percentage-locked to the reference layout */
        /* :global() is required here — StatCard is a separate child component,
           so styled-jsx's automatic scoping never reaches its elements. Without
           :global(), these rules silently never match and every card collapses
           to the same (0,0) position, which is the bug seen in testing. */
        :global(.card--left) {
          left: 7.4%;
          top: 14.3%;
          width: 22.5%;
          min-width: 300px;
        }
        :global(.card--products) {
          left: 20.4%;
          bottom: -3%;
          width: 21.8%;
          min-width: 290px;
        }
        :global(.card--right) {
          right: 9.5%;
          bottom: 12.1%;
          width: 21.8%;
          min-width: 290px;
        }
      `}</style>
    </section>
  );
}