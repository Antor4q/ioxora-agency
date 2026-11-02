"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
const VIDEO_POSTER = "/work2.png";

// Small grayscale image at the bottom-left once the video has shrunk.
// Swap this for your team / studio photo.
const SIDE_IMG = "/work2.png";

export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reelRef = useRef(false);

  const [reel, setReel] = useState(false);

  /* ---------- VIDEO CONTROLS ---------- */

  const startReel = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.loop = false;
    video.currentTime = 0;

    video.play().catch(() => {});

    reelRef.current = true;
    setReel(true);
  };

  const stopReel = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;

    video.play().catch(() => {});

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
        // Word-by-word statement reveal (unchanged)
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

      /* ===== DESKTOP: VIDEO SHRINKS, BENDS WITH SCROLL SPEED =====
         No pin. The video shrinks toward the bottom-right slot with its
         bottom and right edges fixed. While you scroll it bends (SVG clipPath
         redrawn on every frame from the scroll speed); when scrolling stops
         it relaxes back to a flat rectangle. The content columns are static,
         the video simply uncovers them as it leaves. */

      mm.add("(min-width: 768px)", () => {
        const stage = root.current!.querySelector<HTMLElement>(
          ".i-stage"
        )!;

        const target = root.current!.querySelector<HTMLElement>(
          ".i-target"
        )!;

        const curvePath = root.current!.querySelector<SVGPathElement>(
          ".i-curve-path"
        )!;

        // Stage is not the same aspect as the slot, so tween real
        // width/height. Video's top-left is the stage's top-left, so the
        // target's offsets are already in the right coordinate space.
        const toX = () => target.offsetLeft;
        const toY = () => target.offsetTop;
        const toW = () => target.offsetWidth;
        const toH = () => target.offsetHeight;

        const videoEl = videoRef.current!;

        // The stage is exactly one video-height tall and scrolls with the page
        // (no pin). The video starts at full stage size, so there is one video
        // height of empty space between the statement above and what follows.
        // Its bottom and right edges never move inside the stage: only the
        // left edge and the top edge travel, so the bottom stays level with
        // the slot bottom and the left image bottom.
        const fromH = () => toY() + toH();
        const fromW = () => stage.offsetWidth;

        /* ---- SCROLL-SPEED BEND ----
           In the reference the bend is NOT tied to how far the video has
           shrunk. It follows scroll speed: while you scroll, the video bends
           (left side rises as an arc, top edge slopes down to the right, the
           picture inside is sheared). When you stop, it relaxes back to a
           flat rectangle. c = 0 flat, c = 1 maximum bend. */

        const SPEED_FOR_MAX_BEND = 1500; // px/s of motion that gives full bend
        const RELAX_MS = 170; // bigger = slower to follow / relax

        const curve = { c: 0 };

        const drawCurve = () => {
          const c = curve.c;

          const px = 0.3 * c; // x of the arc peak (top edge starts here)
          const tr = 0.32 * c; // top-right corner sits this far below the peak

          curvePath.setAttribute(
            "d",
            `M0,1
             C0,0.45 ${0.55 * px},0 ${px},0
             C${px + 0.18},0 0.7,${0.6 * tr} 1,${tr}
             L1,1
             Z`
          );

          // Bend the picture inside the mask too. The origin is the bottom
          // right corner, so the bottom/right edges stay where they are.
          videoEl.style.transformOrigin = "100% 100%";
          videoEl.style.transform = `skewY(${(6 * c).toFixed(3)}deg) scale(${(
            1 +
            0.16 * c
          ).toFixed(4)})`;
        };

        if (reduce) {
          gsap.set(".i-video", {
            x: toX,
            y: toY,
            width: toW,
            height: toH,
          });

          return;
        }

        drawCurve();

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            // Nothing shrinks until 80% of the video's height is on screen
            // (stage top is 20% down the screen). Before that the video just
            // scrolls in with the page. It is finished when the stage bottom
            // reaches 92% of the screen (the left image bottom, slot bottom
            // and video bottom all sit on that same line, because they all
            // live in the stage).
            start: "top 20%",
            end: "bottom 92%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // y + height and x + width stay constant, so bottom/right are fixed
        timeline.fromTo(
          ".i-video",
          {
            x: 0,
            y: 0,
            width: fromW,
            height: fromH,
          },
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

        // Measure how fast things are moving (page scroll + the scrubbed
        // video box catching up) and ease the bend toward that.
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

          // While the video is shrinking the same scroll bends it more
          const boost = 1 + 1.2 * Math.sin(Math.PI * p);

          // Only react while the shrink is actually running. Before the video
          // is 80% on screen (p = 0) and after it has landed (p = 1) scrolling
          // must not touch the video at all.
          const shrinking = p > 0.001 && p < 0.999;

          const goal = shrinking
            ? Math.min((speed / SPEED_FOR_MAX_BEND) * boost, 1)
            : 0;

          const next =
            curve.c + (goal - curve.c) * (1 - Math.exp(-deltaMs / RELAX_MS));

          // Skip redraws while it is resting flat
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

    // Layout shifts after first paint (fonts, video metadata, images) move the
    // stage, so re-measure every trigger once they have settled.
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
      ref={root}
      className="relative z-10 -mt-px bg-white px-6 pb-20 pt-10 text-[#0a0a0a] md:overflow-x-clip md:px-8 md:pb-[20svh] md:pt-14"
    >
      {/* LABEL */}

      <div className="flex items-center justify-between text-sm">
        <p>[Intro]</p>
       
      </div>

      {/* STATEMENT */}

      <p className="i-para mt-8 max-w-[1400px] text-left text-[clamp(1.8rem,4vw,4rem)] font-medium uppercase leading-[1.12] tracking-[-0.03em] md:mt-10">
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
          Desktop: exactly one viewport tall. The video starts covering the
          whole stage and shrinks into the bottom-right slot. */}

      <div className="i-stage relative mt-10 md:mt-12 md:h-[100svh]">
        {/* Sticky frame: scrolls in normally, then holds at the top of the
            screen while the video finishes shrinking. overflow-clip keeps the
            video from ever drawing over the statement text above. */}
        <div className="i-sticky relative md:h-full">
          {/* CURVE MASK
              Path is redrawn by GSAP while the video shrinks. Bounding-box
              units, so it scales with the video. */}

          <svg
            aria-hidden
            width="0"
            height="0"
            className="pointer-events-none absolute"
          >
            <defs>
              <clipPath id="i-curve" clipPathUnits="objectBoundingBox">
                <path
                  className="i-curve-path"
                  d="M0,0 L1,0 L1,1 L0,1 Z"
                />
              </clipPath>
            </defs>
          </svg>

          {/* VIDEO */}

          <div
            role="button"
            tabIndex={0}
            aria-pressed={reel}
            aria-label={
              reel ? "Stop reel sound" : "Play reel with sound"
            }
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
              onEnded={stopReel}
            />
          </div>

          {/* CONTENT (static, sits behind the video until it shrinks)

              Measured from the reference, as a share of the viewport:
                label           ~19% from top
                text block      ~19% to ~51%, max width ~28vw
                video slot      ~40% to ~81% tall, right 4 cols, ratio ~16:10
                left image      bottom edge aligned with the video, ~19vw wide
                bottom reserve  ~7% empty

              IMPORTANT: no `relative` on the columns or .i-target, the target's
              offsetLeft/Top must resolve against .i-cols. */}

          <div className="i-cols mt-8 grid gap-10 md:absolute md:inset-0 md:z-0 md:mt-0 md:grid-cols-12 md:grid-rows-1 md:gap-x-8 md:gap-y-0">
            {/* LEFT */}

            <div className="flex flex-col justify-between gap-10 md:col-span-4 md:pt-[34svh]">
              <div className="md:max-w-[28vw]">
                <p className="i-reveal mb-5 text-[clamp(12px,0.72vw,14px)] text-black/50">
                  (What we do)
                </p>

                <p className="i-reveal text-[clamp(15px,0.95vw,19px)] leading-[1.35]">
                  Ambitious brands build extraordinary products, and
                  rarely have the time to make the website match.
                </p>

                <p className="i-reveal mt-4 text-[clamp(15px,0.95vw,19px)] leading-[1.35]">
                  We give complex ideas the clarity they need: fast,
                  polished websites with motion, 3D and AI built in,
                  so visitors get it in seconds. A small team, and a
                  direct line to the people who design and build.
                </p>

                    {/* Book a 30 min call: bracket style button */}
<a
  href="/"
  target="_blank"
  rel="noopener noreferrer"
  className="group relative mt-6 inline-flex items-center overflow-hidden bg-[#0a0a0a] px-4 py-3 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
>
  {/* hover e niche theke lime fill uthe ashe */}
  <span
    aria-hidden
    className="absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3f] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 motion-reduce:transition-none"
  />

  {/* left bracket: hover e text er dike ashe */}
  <span
    aria-hidden
    className="relative mr-3 text-xl font-light leading-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none"
  >
    [
  </span>

  {/* text roll */}
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

  {/* right bracket: hover e text er dike ashe */}
  <span
    aria-hidden
    className="relative ml-3 text-xl font-light leading-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none"
  >
    ]
  </span>
</a>
              </div>

              <img
                src={SIDE_IMG}
                alt=""
                className="i-reveal aspect-[3/2] w-1/2 bg-black/10 object-cover grayscale md:w-[60%]"
              />
            </div>

            {/* RIGHT: landing slot, bottom-aligned */}

            <div className="hidden md:col-span-4 md:col-start-9 md:flex md:items-end">
              <div className="i-target aspect-[16/10] w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}