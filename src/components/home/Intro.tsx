"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// strong: true words stay visually emphasised after the reveal
const statement: { w: string; strong?: boolean }[] = [
  { w: "We" }, { w: "design" }, { w: "and" }, { w: "engineer" },
  { w: "3D,", strong: true }, { w: "interactive" }, { w: "and" },
  { w: "AI-powered", strong: true }, { w: "websites" }, { w: "that" },
  { w: "help" }, { w: "ambitious", strong: true }, { w: "brands" },
  { w: "stand" }, { w: "out," }, { w: "convert" }, { w: "better" },
  { w: "and" }, { w: "scale" }, { w: "without" }, { w: "limits." },
];

const stats = [
  { n: 120, suffix: "+", label: "Projects shipped" },
  { n: 8, suffix: "", label: "Countries served" },
  { n: 5, suffix: " yrs", label: "Of experience" },
];

const VIDEO_SRC = "/pro/rooooo.mp4"; // <-- tomar reel ekhane
const VIDEO_POSTER = "/work2.png"; // optional
export default function Intro() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reelRef = useRef(false);
  const [reel, setReel] = useState(false); // true = sound mode

  /* ---------- video controls ---------- */
  const startReel = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.loop = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    reelRef.current = true;
    setReel(true);
  };

  const stopReel = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.play().catch(() => {});
    reelRef.current = false;
    setReel(false);
  };

  const toggleReel = () => (reelRef.current ? stopReel() : startReel());

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true; // autoplay safe
  }, []);

  // section viewport theke bahire gele sound off
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && reelRef.current) stopReel();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------- animations ---------- */
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mm: gsap.MatchMedia | undefined;

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".i-num");
      const showFinalNums = () =>
        nums.forEach((n) => (n.textContent = n.dataset.count ?? "0"));

      const countUp = () =>
        nums.forEach((n) => {
          const target = Number(n.dataset.count ?? 0);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => (n.textContent = String(Math.round(obj.v))),
          });
        });

      if (!reduce) {
        // 1) word-by-word scroll reveal
        gsap.fromTo(
          ".i-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".i-para",
              start: "top 80%",
              end: "bottom 55%",
              scrub: true,
            },
          }
        );

        // 2) dotted line draws left -> right
        gsap.fromTo(
          ".i-divider",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "power3.out",
            duration: 1.4,
            scrollTrigger: { trigger: ".i-divider", start: "top 90%", once: true },
          }
        );
      }

      mm = gsap.matchMedia();

      /* ===== DESKTOP: pin + 3D curve + shrink to top-right ===== */
      mm.add("(min-width: 768px)", () => {
        const stage = root.current!.querySelector<HTMLElement>(".i-stage")!;
        const target = root.current!.querySelector<HTMLElement>(".i-target")!;

        const m = () => {
          const sw = stage.offsetWidth;
          const sh = stage.offsetHeight;
          const tw = target.offsetWidth;
          return { sw, sh, tw, s: tw / sw };
        };
        const toX = () => (m().sw - m().tw) / 2;
        const toY = () => -(m().sh * (1 - m().s)) / 2;
        const toScale = () => m().s;

        if (reduce) {
          gsap.set(".i-video", { x: toX, y: toY, scale: toScale, borderRadius: "3rem" });
          showFinalNums();
          return;
        }

        // 3D depth ekhane set hoy
        gsap.set(".i-video", { transformPerspective: 1400, transformOrigin: "50% 50%" });
        gsap.set(".i-info", { opacity: 0, y: 60 });

        let counted = false;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "center center",
            end: "+=140%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl
          // x agey, y pore -> arc path
          .to(".i-video", { x: toX, ease: "power3.out", duration: 1 }, 0)
          .to(".i-video", { y: toY, ease: "power2.in", duration: 1 }, 0)
          .to(
            ".i-video",
            { scale: toScale, borderRadius: "3rem", ease: "power2.inOut", duration: 1 },
            0
          )
          // 3D swing: majhpothe Y/X axis e ghure, shesh e ekdom shoja
          .to(
            ".i-video",
            {
              keyframes: [
                { rotationY: 32, rotationX: 14, rotation: -6, duration: 0.5, ease: "power2.out" },
                { rotationY: 0, rotationX: 0, rotation: 0, duration: 0.5, ease: "power2.inOut" },
              ],
            },
            0
          )
          // video choto hole content top theke nicer dike nambe, shesh e video top er shathe align
          .to(
            ".i-info",
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out" },
            0.6
          )
          .call(
            () => {
              if (counted) return;
              counted = true;
              countUp();
            },
            undefined,
            0.7
          );
      });

      /* ===== MOBILE: simple stack ===== */
      mm.add("(max-width: 767px)", () => {
        if (reduce) {
          showFinalNums();
          return;
        }
        ScrollTrigger.create({
          trigger: ".i-stats",
          start: "top 90%",
          once: true,
          onEnter: countUp,
        });
        gsap.from(".i-info", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".i-cols", start: "top 85%", once: true },
        });
      });
    }, root);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative z-10 -mt-px bg-white px-6 pb-20 pt-10 text-[#0a0a0a] md:px-8 md:pb-28 md:pt-14"
    >
      {/* label row */}
      <div className="flex items-center justify-between text-sm">
        <p>[01 / Intro]</p>
        <p className="hidden md:block">(About)</p>
      </div>

      {/* big statement, left aligned */}
      <p className="i-para mt-16 max-w-[1400px] text-left uppercase text-[clamp(1.8rem,4vw,4rem)] font-medium leading-[1.12] tracking-[-0.03em] md:mt-28">
        {statement.map((s, i) => (
          <span
            key={i}
            className={`i-word inline-block pr-[0.28em] ${s.strong ? "text-black" : "text-black"}`}
          >
            {s.w}
          </span>
        ))}
      </p>

      {/* divider */}
      <div className="i-divider mt-20 w-full border-t border-dotted border-black/40 md:mt-32" />

      {/* stage: full-width video -> shrinks to top-right */}
      <div className="i-stage relative mt-10 md:mt-14 md:h-[min(calc((100vw_-_4rem)*0.5625),85vh)]">
        {/* VIDEO — cursor attrs sound on hole remove hoye jay -> dot */}
        <div
          role="button"
          tabIndex={0}
          aria-pressed={reel}
          aria-label={reel ? "Stop reel sound" : "Play reel with sound"}
          data-cursor-text={reel ? undefined : "Play reel"}
          onClick={toggleReel}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleReel();
            }
          }}
          className="i-video relative z-10 aspect-video w-full overflow-hidden bg-black will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:absolute md:inset-0 md:aspect-auto md:h-full"
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

          {/* touch device e cursor nei, tai chhoto hint */}
          {!reel && (
            <span className="pointer-events-none absolute bottom-3 left-3 hidden rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black [@media(hover:none)]:block">
              Tap for sound
            </span>
          )}
        </div>

        {/* COLUMNS (video choto hole dekha jabe) */}
        <div className="i-cols mt-10 grid gap-12 md:absolute md:inset-0 md:z-0 md:mt-0 md:grid-cols-12 md:grid-rows-1 md:gap-x-8 md:gap-y-0">
          {/* LEFT: top = video top (same align) */}
          <div className="flex flex-col justify-between gap-12 md:col-span-7">
            {/* description + underline link */}
            <div className="i-info max-w-md">
              <p className="mb-4 text-sm text-black/50">(Who we are)</p>
              <p className="text-xl leading-snug md:text-2xl">
                From first sketch to launch, we build fast, polished products with a focus
                on <span className="text-black/50">performance, motion and conversion.</span>
              </p>
              <a
                href="#work"
                className="group/link mt-6 inline-flex items-center gap-2 border-b border-black pb-0.5 text-sm font-medium focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
              >
                Learn more
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>

            {/* stats: staircase offset */}
            <div className="i-stats i-info grid grid-cols-3 gap-4 md:gap-8">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{ "--o": `${i * 26}px` } as React.CSSProperties}
                  className="border-l border-dotted border-black/40 pl-4 md:mt-[var(--o)]"
                >
                  <p className="text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-none tracking-[-0.03em]">
                    <span className="i-num" data-count={s.n}>0</span>
                    {s.suffix}
                  </p>
                  <p className="mt-2 text-[13px] text-black/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: video er final jayga (top-right) */}
          <div className="hidden md:col-span-4 md:col-start-9 md:block">
            <div className="i-target aspect-video w-full" />
            <div className="i-info mt-4 flex items-center justify-between text-sm">
              <p>(Showreel 2026)</p>
              <p className="text-black/50">Click for sound</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}