"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TrustedBrands from "../shared/TrustedBrands";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const statement: { w: string; strong?: boolean }[] = [
  { w: "We" },
  { w: "design" },
  { w: "and" },
  { w: "engineer" },
  { w: "3D,", strong: true },
  { w: "interactive" },
  { w: "and" },
  { w: "AI-powered", strong: true },
  { w: "websites" },
  { w: "that" },
  { w: "help" },
  { w: "ambitious", strong: true },
  { w: "brands" },
  { w: "stand" },
  { w: "out," },
  { w: "convert" },
  { w: "better" },
  { w: "and" },
  { w: "scale" },
  { w: "without" },
  { w: "limits." },
];

const VIDEO_SRC = "/pro/rooooo.mp4";
const VIDEO_POSTER = "/video.png";

// Small grayscale image at the bottom-left once the video has shrunk.
const SIDE_IMG = "/video.png";

// TODO: nijer Cal.com / Calendly link dao (Hero er sathe same)
const BOOK_CALL_URL = "/bookcall";

export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reelRef = useRef(false);

  const [reel, setReel] = useState(false);

  /* ---------- VIDEO CONTROLS ---------- */

  // Sudhu sound on. Video restart / loop change hobe na.
  const startReel = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.play().catch(() => {}); // browser paused kore rakhle safe

    reelRef.current = true;
    setReel(true);
  };

  // Sudhu sound off. Video cholte thakbe.
  const stopReel = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    reelRef.current = false;
    setReel(false);
  };

  const toggleReel = () => {
    reelRef.current ? stopReel() : startReel();
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  // Turn off sound when Intro leaves viewport
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && reelRef.current) {
        stopReel();
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* ---------- GSAP ANIMATIONS ---------- */

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let mm: gsap.MatchMedia | undefined;

    const ctx = gsap.context(() => {
      if (!reduce) {
        // Word-by-word statement reveal
        gsap.fromTo(
          ".i-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: ".i-para",
              start: "top 80%",
              end: "bottom 55%",
              scrub: 0.6,
            },
          }
        );
      }

      mm = gsap.matchMedia();

      /* ===== TABLET + DESKTOP: VIDEO SHRINKS, BENDS WITH SCROLL SPEED ===== */

      mm.add("(min-width: 768px)", () => {
        const stage = root.current!.querySelector<HTMLElement>(".i-stage")!;
        const target = root.current!.querySelector<HTMLElement>(".i-target")!;
        const curvePath =
          root.current!.querySelector<SVGPathElement>(".i-curve-path")!;

        const toX = () => target.offsetLeft;
        const toY = () => target.offsetTop;
        const toW = () => target.offsetWidth;
        const toH = () => target.offsetHeight;

        const videoEl = videoRef.current!;

        const fromH = () => toY() + toH();
        const fromW = () => stage.offsetWidth;

        const SPEED_FOR_MAX_BEND = 1500; // px/s of motion that gives full bend
        const RELAX_MS = 170;

        const curve = { c: 0 };

        const drawCurve = () => {
          const c = curve.c;

          const px = 0.3 * c;
          const tr = 0.32 * c;

          curvePath.setAttribute(
            "d",
            `M0,1
             C0,0.45 ${0.55 * px},0 ${px},0
             C${px + 0.18},0 0.7,${0.6 * tr} 1,${tr}
             L1,1
             Z`
          );

          videoEl.style.transformOrigin = "100% 100%";
          videoEl.style.transform = `skewY(${(6 * c).toFixed(3)}deg) scale(${(
            1 +
            0.16 * c
          ).toFixed(4)})`;
        };

        // Reduced motion: video seedha target e boshe thake, resize e update hoy
        if (reduce) {
          const place = () =>
            gsap.set(".i-video", {
              x: toX(),
              y: toY(),
              width: toW(),
              height: toH(),
            });
          place();
          window.addEventListener("resize", place);
          return () => window.removeEventListener("resize", place);
        }

        drawCurve();

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 20%",
            end: "bottom 92%",
            scrub: 0.8,
            invalidateOnRefresh: true, // resize / rotate e measure abar hoy
          },
        });

        timeline.fromTo(
          ".i-video",
          { x: 0, y: 0, width: fromW, height: fromH },
          {
            x: toX,
            y: toY,
            width: toW,
            height: toH,
            ease: "power2.inOut",
            duration: 1,
          },
          0
        );

        let lastScroll = window.scrollY;
        let lastX = Number(gsap.getProperty(".i-video", "x")) || 0;
        let lastY = Number(gsap.getProperty(".i-video", "y")) || 0;

        const tick = (_time: number, deltaMs: number) => {
          const dt = Math.max(deltaMs, 1) / 1000;

          const scrollY = window.scrollY;
          const vx = Number(gsap.getProperty(".i-video", "x")) || 0;
          const vy = Number(gsap.getProperty(".i-video", "y")) || 0;

          const moved =
            Math.abs(scrollY - lastScroll) +
            Math.abs(vy - lastY) * 0.6 +
            Math.abs(vx - lastX) * 0.3;

          lastScroll = scrollY;
          lastX = vx;
          lastY = vy;

          const speed = moved / dt;
          const p = Math.min(Math.max(timeline.progress(), 0), 1);

          const boost = 1 + 1.2 * Math.sin(Math.PI * p);
          const shrinking = p > 0.001 && p < 0.999;

          const goal = shrinking
            ? Math.min((speed / SPEED_FOR_MAX_BEND) * boost, 1)
            : 0;

          const next =
            curve.c + (goal - curve.c) * (1 - Math.exp(-deltaMs / RELAX_MS));

          if (next < 0.001 && curve.c === 0) return;

          curve.c = next < 0.001 ? 0 : next;
          drawCurve();
        };

        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          curve.c = 0;
          drawCurve();
          videoEl.style.transform = "";
          videoEl.style.transformOrigin = "";
        };
      });

      /* ===== MOBILE: SIMPLE STACK ===== */

      mm.add("(max-width: 767px)", () => {
        if (reduce) return;

        gsap.from(".i-reveal", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".i-cols",
            start: "top 85%",
            once: true,
          },
        });
      });
    }, root);

    // Layout shifts after first paint (fonts, video metadata, images)
    const refresh = () => ScrollTrigger.refresh();
    const video = videoRef.current;

    window.addEventListener("load", refresh);
    video?.addEventListener("loadedmetadata", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      video?.removeEventListener("loadedmetadata", refresh);
      mm?.revert();
      ctx.revert();
    };
  }, []);

  /* ---------- JSX ---------- */

  return (
    <section
      id="about"
      ref={root}
      className="relative z-10 -mt-px bg-white px-5 pb-16 pt-10 text-[#0a0a0a] sm:px-6 sm:pb-20 md:overflow-x-clip md:px-8 md:pb-[14svh] md:pt-14 lg:pb-[20svh]"
    >
      {/* Full-bleed: section er padding bhenge dui pashe pouchhay */}
      <div className="-mx-5 sm:-mx-6 md:-mx-8">
        <TrustedBrands />
      </div>

      {/* LABEL */}
      <div className="flex items-center justify-between text-sm">
        <p>[Intro]</p>
      </div>

      {/* STATEMENT */}
      <p className="i-para mt-6 max-w-[1400px] text-left text-[clamp(1.6rem,4.2vw,4rem)] font-medium uppercase leading-[1.12] tracking-[-0.03em] sm:mt-8 md:mt-10">
        {statement.map((word, index) => (
          <span
            key={index}
            className="i-word inline-block pr-[0.28em] text-black"
          >
            {word.w}
          </span>
        ))}
      </p>

      {/* VIDEO STAGE
          Tablet/desktop: kokhono 800px er niche na, nahole viewport height */}
      <div className="i-stage relative mt-8 sm:mt-10 md:mt-12 md:h-[max(100svh,50rem)]">
        <div className="i-sticky relative md:h-full">
          {/* CURVE MASK */}
          <svg
            aria-hidden
            width="0"
            height="0"
            className="pointer-events-none absolute"
          >
            <defs>
              <clipPath id="i-curve" clipPathUnits="objectBoundingBox">
                <path className="i-curve-path" d="M0,0 L1,0 L1,1 L0,1 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* VIDEO */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={reel}
            aria-label={reel ? "Stop reel sound" : "Play reel with sound"}
            data-cursor-text={reel ? undefined : "Play reel"}
            onClick={toggleReel}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleReel();
              }
            }}
            className="i-video relative z-10 aspect-video w-full cursor-pointer overflow-hidden bg-black will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:absolute md:left-0 md:top-0 md:aspect-auto md:h-full md:w-full md:[clip-path:url(#i-curve)]"
          >
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>

          {/* CONTENT
              IMPORTANT: columns / .i-target e `relative` dio na,
              offsetLeft/Top .i-cols er against e resolve hote hobe. */}
          <div className="i-cols mt-8 grid gap-10 md:absolute md:inset-0 md:z-0 md:mt-0 md:grid-cols-12 md:grid-rows-1 md:gap-x-6 md:gap-y-0 lg:gap-x-8">
            {/* LEFT */}
            <div className="flex flex-col justify-between gap-10 md:col-span-5 md:gap-6 md:pt-[28svh] lg:col-span-4 lg:pt-[32svh]">
              <div className="md:max-w-none lg:max-w-[min(28vw,32rem)]">
                <p className="i-reveal mb-4 text-[clamp(12px,0.72vw,14px)] text-black/50 md:mb-5">
                  (What we do)
                </p>

                <p className="i-reveal text-[15px] leading-[1.35] lg:text-[clamp(15px,0.95vw,19px)]">
                  Ambitious brands build extraordinary products, and
                  rarely have the time to make the website match.
                </p>

                <p className="i-reveal mt-4 text-[15px] leading-[1.35] lg:text-[clamp(15px,0.95vw,19px)]">
                  We give complex ideas the clarity they need: fast,
                  polished websites with motion, 3D and AI built in,
                  so visitors get it in seconds. A small team, and a
                  direct line to the people who design and build.
                </p>

                {/* Book a 30 min call: bracket style button */}
                <Link
                  href={BOOK_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-5 inline-flex items-center overflow-hidden bg-[#0a0a0a] px-4 py-3 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:mt-6"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3f] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 motion-reduce:transition-none"
                  />

                  <span
                    aria-hidden
                    className="relative mr-3 text-xl font-light leading-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none"
                  >
                    [
                  </span>

                  <span className="relative block h-[1.25em] overflow-hidden leading-[1.25]">
                    <span className="block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full motion-reduce:transition-none">
                      Book a 30 min call
                    </span>
                    <span
                      aria-hidden
                      className="absolute left-0 top-full block whitespace-nowrap text-[#0a0a0a] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full motion-reduce:transition-none"
                    >
                      Book a 30 min call
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="relative ml-3 text-xl font-light leading-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none"
                  >
                    ]
                  </span>
                </Link>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SIDE_IMG}
                alt=""
                className="i-reveal aspect-[3/2] w-2/3 bg-black/10 object-cover grayscale sm:w-1/2 md:w-[70%] lg:w-[60%]"
              />
            </div>
{/* sdfsdf */}
            {/* RIGHT: landing slot, bottom-aligned */}
            <div className="hidden md:col-span-5 md:col-start-8 md:flex md:items-end lg:col-span-4 lg:col-start-9">
              <div className="i-target aspect-[16/10] w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}