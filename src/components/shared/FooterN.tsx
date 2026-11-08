"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import LiquidHover from "./LiquidHover";

// Dummy links/email: nijer real route ar contact info diye replace koro
const PAGES = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ioxora" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61577942214326" },
  { label: "X / Twitter", href: "https://x.com" },
  
];

const CONTACT = [
  { label: "ioxoratech@gmail.com", href: "mailto:ioxoratech@gmail.com" },
  { label: "01568606376", href: "01568606376" },
];

const LEGAL = [
  { label: "Privacy", href: "/" },
  { label: "Terms", href: "/" },
];

/* ---------- Dithered smoke (Canvas 2D), same effect as testimonial section ---------- */

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

function DitherSmoke({ className = "", alpha = 0.3 }: { className?: string; alpha?: number }) {
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
      // chhoto screen e cell boro = kom draw, mobile e smooth
      CELL = w < 520 ? 5 : 4;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      const s = CELL / 4; // noise scale same rakhar jonno
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      for (let cy = 0; cy < rows; cy++) {
        const m = smooth(0.05, 1, cy / rows);
        for (let cx = 0; cx < cols; cx++) {
          const n = fbm(cx * s * 0.03 + t * 0.06, cy * s * 0.05 - t * 0.035);
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
  }, [alpha]);

  return <canvas ref={ref} aria-hidden className={className} />;
}

/* ---------- Wordmark: full width fit + niche theke 1/3 ongsho cut ---------- */

const LINE = 0.8; // leading-[0.8]
const VISIBLE = 2 / 3; // 2/3 dekha jabe, niche er 1/3 cut

function FitWordmark({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLElement>(null); // baseline marker
  const [size, setSize] = useState<number | null>(null);
  // em unit e: h = wrapper height (glyph er 2/3), shift = glyph top ke wrapper er top e anar offset
  const [crop, setCrop] = useState<{ h: number; shift: number } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const el = textRef.current!;

    const fit = () => {
      const cs = getComputedStyle(el);
      const current = parseFloat(cs.fontSize);
      const textWidth = el.getBoundingClientRect().width;
      if (!textWidth) return;
      const next = (current * wrap.clientWidth) / textWidth;
      setSize((prev) => (prev && Math.abs(prev - next) < 0.5 ? prev : next));

      // Asol glyph er height measure kori (font metrics onujayi), tai kono font e
      // thik 1/3 cut hoy. Line-height er upor depend kore na.
      const ctx = document.createElement("canvas").getContext("2d");
      const mark = markRef.current;
      if (!ctx || !mark) return;
      ctx.font = `${cs.fontWeight} ${current}px ${cs.fontFamily}`;
      const m = ctx.measureText(text);
      const asc = m.actualBoundingBoxAscent; // baseline theke letter er top
      const desc = m.actualBoundingBoxDescent; // baseline er niche (o er overshoot)
      // Baseline er position DOM theke nei (0-size inline-block baseline e boshe)
      const baseline = mark.getBoundingClientRect().bottom - el.getBoundingClientRect().top;
      const glyphTop = baseline - asc;
      const glyphH = asc + desc;
      if (!isFinite(glyphTop) || !isFinite(glyphH) || glyphH < current * 0.3) return;
      setCrop({ h: (glyphH * VISIBLE) / current, shift: glyphTop / current });
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    document.fonts?.ready.then(fit); // font load hoye gele abar measure
    return () => ro.disconnect();
  }, []);

  return (
    // overflow-hidden + kom height = text er niche er ongsho cut
    <div
      aria-hidden
      className="h-[10.7vw] overflow-hidden"
      style={size ? { height: size * (crop?.h ?? 0.5) } : undefined}
    >
      <div ref={wrapRef} className="w-full">
        <span
          ref={textRef}
          style={{
            fontSize: size ?? undefined,
            transform: size && crop ? `translateY(${-size * crop.shift}px)` : undefined,
          }}
          className="block w-max select-none whitespace-nowrap text-[20vw] font-medium leading-[0.8] tracking-[-0.06em] pr-[0.06em]"
        >
          {text}
          <i ref={markRef} aria-hidden className="inline-block h-0 w-0" />
        </span>
      </div>
    </div>
  );
}

/* ---------- [Item] hover: bracket duto dui pashe slide kore ashe ---------- */

function Bracketed({ children }: { children: ReactNode }) {
  const b =
    "pointer-events-none absolute top-0 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none";
  return (
    <span className="relative inline-block">
      <span
        aria-hidden
        className={`${b} right-full mr-1 translate-x-2 group-hover/b:translate-x-0 group-hover/b:opacity-100 group-focus-visible/b:translate-x-0 group-focus-visible/b:opacity-100`}
      >
        [
      </span>
      {children}
      <span
        aria-hidden
        className={`${b} left-full ml-1 -translate-x-2 group-hover/b:translate-x-0 group-hover/b:opacity-100 group-focus-visible/b:translate-x-0 group-focus-visible/b:opacity-100`}
      >
        ]
      </span>
    </span>
  );
}

// Link / email / button shob e same hover
const linkCls =
  "group/b inline-block py-1 text-lg text-white outline-none focus-visible:underline focus-visible:underline-offset-4";

// Plain text item (copyright etc.) o hover e bracket + brighter color
const textCls = "group/b inline-block py-1 text-white/60 transition-colors duration-300 hover:text-white";

function FooterLink({ label, href, className = linkCls }: { label: string; href: string; className?: string }) {
  const isHttp = href.startsWith("http");
  const isMail = href.startsWith("mailto:");
  const content = <Bracketed>{label}</Bracketed>;

  if (isHttp || isMail) {
    return (
      <a
        href={href}
        className={className}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function LinkColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="mb-4 text-sm font-medium tracking-tight text-white/50 sm:mb-5 sm:text-base">[{title}]</p>
      <ul className="space-y-1.5 sm:space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <FooterLink {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Footer ---------- */

export default function FooterN() {
  const backToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer
      style={{ backgroundColor: "#000000" }}
      className="relative z-10 overflow-hidden bg-black text-white"
    >
      {/* Smoke, wordmark er pichone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%]"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%)",
        }}
      >
        <DitherSmoke className="h-full w-full" />
      </div>

      <div className="relative z-10 px-4 pt-14 sm:px-6 sm:pt-16 lg:px-12 lg:pt-24">
        {/* Row 1: boro headline (left) + pitch ar email (right) */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-8">
            <h2 className="max-w-[14ch] text-balance text-[clamp(2.5rem,8.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] lg:max-w-[16ch]">
              Have a hard product to explain?
            </h2>

            <Link
              href="/bookcall"
              className="group relative mt-8 inline-flex items-center overflow-hidden bg-white px-4 py-3 text-sm font-medium text-[#0a0a0a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-10"
            >
              {/* hover e niche theke lime fill uthe ashe */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3f] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 motion-reduce:transition-none"
              />
              <span
                aria-hidden
                className="relative mr-3 text-xl font-light leading-none transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-2 motion-reduce:transition-none"
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
                  className="absolute left-0 top-full block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full motion-reduce:transition-none"
                >
                  Book a 30 min call
                </span>
              </span>
              <span
                aria-hidden
                className="relative ml-3 text-xl font-light leading-none transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-x-2 motion-reduce:transition-none"
              >
                ]
              </span>
            </Link>
          </div>

          <div className="lg:col-span-4 lg:pb-3">
            <p className="max-w-[38ch] text-base leading-relaxed text-white/65 sm:text-lg">
              Tell us what you are building and we will show you how to make it obvious.
            </p>
            <div className="mt-5">
             
            </div>
          </div>
        </div>

        {/* Row 2: brand note + link columns, upore divider */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/15 pt-8 sm:grid-cols-3 lg:mt-20 lg:grid-cols-12 lg:gap-x-6 lg:pt-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-5">
            <p className="mb-4 text-sm font-medium tracking-tight text-white/50 sm:mb-5 sm:text-base">[ioXora]</p>
            <p className="max-w-[32ch] text-lg leading-snug text-white/80">
              A small studio building 3D interactive motion websites and AI-powered products for startups, product teams and agencies.
            </p>

            <div className="mt-8">
              <p className="mb-2 text-sm font-medium tracking-tight text-white/50 sm:text-base">[Office]</p>
              <p className="group/b inline-block py-1 text-lg text-white">
                Remote
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Pages" items={PAGES} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Social" items={SOCIALS} />
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <LinkColumn title="Contact" items={CONTACT} />
          </div>
        </div>

        {/* Row 3: bottom bar, wordmark er upore */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p className="py-1 text-white/60">
            &copy; {new Date().getFullYear()} ioXora. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {LEGAL.map((l) => (
              <FooterLink key={l.label} {...l} className={`${textCls} outline-none focus-visible:text-white`} />
            ))}
            <button
              type="button"
              onClick={backToTop}
              className="group/b inline-block py-1 text-white outline-none focus-visible:underline focus-visible:underline-offset-4"
            >
              <Bracketed>Back to top</Bracketed>
            </button>
          </div>
        </div>
      </div>

      {/* Wordmark: edge to edge, niche er 1/3 cut, footer er ekdom shesh e */}
      <div className="relative z-10 mt-8 px-2 sm:px-3 lg:mt-12 lg:px-4">
        <LiquidHover intensity={1.2} radius={0.2}>
    <FitWordmark text="ioXora" />
  </LiquidHover>
      </div>
    </footer>
  );
}