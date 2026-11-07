"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

type Testimonial = {
  name: string;
  role: string; // "CEO, BotBlox Systems"
  quote: string;
  image: string; // avatar, /public path ba URL
};

// Dummy data: real client content diye replace koro
const TESTIMONIALS: Testimonial[] = [
 {
  name: "Moonalika",
  role: "Founder, Student Travel Buddy",
  quote:
    "This team understood our vision and turned it into a website that makes student travel planning feel simple and accessible. The design is fresh, easy to navigate, and presents our travel resources beautifully. We're really happy with the result.",
  image: "/test1.jpg",
},
{
  name: "Mack Toe",
  role: "Founder, Frontier Travel",
  quote:
    "ioXora brought our vision to life with a professional website that reflects our brand perfectly. The attention to detail, clean layout, and overall user experience made the entire process enjoyable. We're very pleased with the final result.",
  image: "/test2.jpg",
},
{
  name: "Rike",
  role: "Owner, Ravosa Marine",
  quote:
    "They did a great job understanding our business and creating a website that presents our marine products and services clearly. The design feels professional, navigation is smooth, and the overall experience makes it easier for customers to connect with us.",
  image: "/test3.jpg",
},
{
  name: "Melin Soya",
  role: "Founder, Fog Off Tenerife",
  quote:
    "Working with ioXora was a smooth experience from start to finish. They created a clean, professional website that communicates our services effectively and makes it easy for customers to find the information they need. We're very happy with their work.",
  image: "/test4.jpg",
},
];

/* ---------- Dithered smoke (Canvas 2D) ---------- */

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const noise = (x: number, y: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x: number, y: number) =>
  (noise(x, y) * 0.5 + noise(x * 2, y * 2) * 0.25 + noise(x * 4, y * 4) * 0.125) / 0.875;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function DitherSmoke({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let CELL = 4;
    let w = 0, h = 0, raf = 0, visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      // choto screen e cell ektu boro = kom cell, mobile e smooth performance
      CELL = w < 520 ? 5 : 4;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      // cell size change hole noise scale same rakhar jonno 4 diye normalize
      const s = CELL / 4;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.beginPath();
      for (let cy = 0; cy < rows; cy++) {
        const m = smooth(0.05, 1, cy / rows); // niche e beshi ghono
        for (let cx = 0; cx < cols; cx++) {
          const n = fbm(cx * s * 0.035 + t * 0.06, cy * s * 0.05 - t * 0.035);
          const v = smooth(0.4, 0.8, n) * (0.2 + 0.8 * m);
          if (v > BAYER4[(cy & 3) * 4 + (cx & 3)]) ctx.rect(cx * CELL, cy * CELL, CELL - 1, CELL - 1);
        }
      }
      ctx.fill();
    };

    const loop = (ms: number) => {
      if (visible) draw(ms / 1000);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(4); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (reduce) draw(4);
    else raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

/* ---------- Slider: desktop e cursor = Previous/Next, touch e arrow buttons ---------- */

function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const [side, setSide] = useState<"prev" | "next">("next");

  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const dir = useRef<1 | -1>(1);
  const first = useRef(true);
  const qx = useRef<ReturnType<typeof gsap.quickTo>>();
  const qy = useRef<ReturnType<typeof gsap.quickTo>>();
  const reduce = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = cursorRef.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
    qx.current = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    qy.current = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
  }, []);

  // Notun slide ashle ভিতরে slide-in
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const k = reduce.current ? 0.01 : 1;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: dir.current * 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5 * k,
        ease: "power3.out",
        onComplete: () => {
          busy.current = false;
        },
      }
    );
  }, [index]);

  const go = (d: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    dir.current = d;
    const k = reduce.current ? 0.01 : 1;
    gsap.to(contentRef.current, {
      opacity: 0,
      x: -d * 40,
      duration: 0.28 * k,
      ease: "power2.in",
      onComplete: () => setIndex((i) => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length),
    });
  };

  const sideOf = (clientX: number): "prev" | "next" => {
    const r = boxRef.current!.getBoundingClientRect();
    return clientX < r.left + r.width / 2 ? "prev" : "next";
  };

  const t = TESTIMONIALS[index];

  return (
    <>
      <div
        ref={boxRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        style={{ backgroundColor: "#ffffff" }}
        className="relative flex min-h-[24rem] overflow-hidden rounded-xl bg-white outline-none focus-visible:ring-2 focus-visible:ring-black sm:min-h-[28rem] lg:min-h-[26rem] [@media(pointer:fine)]:cursor-none"
        onClick={(e) => go(sideOf(e.clientX) === "prev" ? -1 : 1)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
        // Touch swipe: left swipe = next, right swipe = previous
        onTouchStart={(e) => {
          const p = e.touches[0];
          touchStart.current = { x: p.clientX, y: p.clientY };
        }}
        onTouchEnd={(e) => {
          const s = touchStart.current;
          touchStart.current = null;
          if (!s) return;
          const p = e.changedTouches[0];
          const dx = p.clientX - s.x;
          const dy = p.clientY - s.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            // swipe hole tap-click double fire na hoy
            e.preventDefault();
            go(dx < 0 ? 1 : -1);
          }
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
          setSide(sideOf(e.clientX));
          gsap.to(cursorRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          qx.current?.(e.clientX);
          qy.current?.(e.clientY);
          const s = sideOf(e.clientX);
          setSide((prev) => (prev === s ? prev : s));
        }}
        onPointerLeave={() => gsap.to(cursorRef.current, { scale: 0, duration: 0.25, ease: "power2.in" })}
      >
        <div
          ref={contentRef}
          aria-live="polite"
          className="flex w-full flex-col items-center justify-center gap-5 px-5 pb-20 pt-8 text-center sm:gap-7 sm:px-10 sm:pb-24 lg:gap-8 lg:p-14 lg:pb-14"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.image}
            alt={`${t.name}`}
            draggable={false}
            className="h-12 w-12 rounded-none object-cover object-top grayscale sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          />

          <blockquote className="max-w-[28ch] text-balance text-[1.25rem] font-medium leading-[1.25] tracking-[-0.025em] sm:max-w-[30ch] sm:text-[1.6rem] lg:max-w-[26ch] lg:text-[1.9rem] xl:text-[2.1rem]">
            “{t.quote}”
          </blockquote>

          <div>
            <p className="text-base font-semibold sm:text-lg">{t.name}</p>
            <p className="text-sm text-black/60 sm:text-base">{t.role}</p>
          </div>
        </div>

        {/* Touch / coarse pointer controls: cursor nai, tai visible buttons */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4 sm:px-6 sm:pb-6 [@media(pointer:fine)]:hidden">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="flex h-11 min-w-[44px] items-center justify-center rounded-full border border-black/15 px-4 text-sm font-medium text-black active:bg-black active:text-white"
          >
            [Prev]
          </button>

          <span className="text-sm tabular-nums text-black/60" aria-hidden>
            {index + 1} / {TESTIMONIALS.length}
          </span>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="flex h-11 min-w-[44px] items-center justify-center rounded-full border border-black/15 px-4 text-sm font-medium text-black active:bg-black active:text-white"
          >
            [Next]
          </button>
        </div>
      </div>

      {/* Custom cursor (sudhu mouse e dekhay) */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 whitespace-nowrap text-base font-medium tracking-tight text-black"
      >
        {side === "prev" ? "[Previous]" : "[Next]"}
      </div>
    </>
  );
}

/* ---------- Section ---------- */

export default function TestimonialsN() {
  const textRef = useRef<HTMLDivElement>(null);
  const [smokeTop, setSmokeTop] = useState(0);

  // Smoke shuru hoy text block er height er half theke, ar box er sheshe porjonto jay
  useEffect(() => {
    const el = textRef.current!;
    const update = () => setSmokeTop(el.offsetHeight / 2);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      style={{ backgroundColor: "#ffffff" }}
      className="relative z-10 overflow-x-clip bg-white px-3 pb-3 pt-16 text-black sm:pt-24 md:pt-32 lg:pt-40"
    >
      <div className="mb-6 px-2 text-sm sm:px-4 md:mb-10 lg:px-8">
        <p>[Testimonials]</p>

        {/* 130px fixed chilo; ekhon screen er shathe scale kore, max 130px */}
        <h2 className="mt-4 max-w-[1400px] text-left text-[clamp(2.75rem,12.5vw,8.125rem)] font-medium leading-[1.02] tracking-[-0.03em] text-black sm:mt-6 md:mt-10">
          What They Say
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.05fr]">
        {/* Left: dark text panel + smoke + button */}
        <div
          style={{ backgroundColor: "#000000" }}
          className="relative overflow-hidden rounded-xl bg-black text-white"
        >
          <div
            ref={textRef}
            className="relative z-10 max-w-[34rem] space-y-4 p-5 pb-40 text-[1.05rem] leading-[1.45] tracking-[-0.01em] sm:space-y-5 sm:p-8 sm:pb-48 sm:text-[1.2rem] lg:space-y-6 lg:p-10 lg:pb-10 lg:text-[1.3rem]"
          >
            <p>
              ioXora works with <strong>startups</strong> and <strong>product teams</strong>: founders who build
              real things and need a website that makes them obvious.
            </p>
            <p>
              We keep part of our time for <strong>agencies</strong> and studios, the projects where we push{" "}
              <strong>craft</strong>, motion and canvas work further.
            </p>
            <p>
              We think most business websites look the same: templates, stock visuals, copy nobody reads. We
              believe in <strong>clarity</strong>, <strong>character</strong> and <strong>conversion</strong>.
            </p>

            <Link
              href="/bookcall"
             
              rel="noopener noreferrer"
              className="group relative mt-4 inline-flex items-center overflow-hidden bg-[#fff] px-4 py-3 text-sm font-medium text-[#0a0a0a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-6"
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
            </Link>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
            style={{
              top: smokeTop,
              maskImage: "linear-gradient(to bottom, transparent, #000 35%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 35%)",
            }}
          >
            <DitherSmoke className="h-full w-full" />
          </div>
        </div>

        {/* Right: slider */}
        <TestimonialSlider />
      </div>
    </section>
  );
}