"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

// Dummy links/email: nijer real route ar contact info diye replace koro
const PAGES = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X / Twitter", href: "https://x.com" },
  { label: "GitHub", href: "https://github.com" },
];

const CONTACT = [
  { label: "hello@ioxoraa.com", href: "mailto:hello@ioxoraa.com" },
  { label: "ioxoraa.com", href: "https://ioxoraa.com" },
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
    const CELL = 4;
    let w = 0, h = 0, raf = 0, visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      for (let cy = 0; cy < rows; cy++) {
        const m = smooth(0.05, 1, cy / rows);
        for (let cx = 0; cx < cols; cx++) {
          const n = fbm(cx * 0.03 + t * 0.06, cy * 0.05 - t * 0.035);
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

/* ---------- Wordmark: font size auto-fit kore, container er full width nei ---------- */

function FitWordmark({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const el = textRef.current!;

    const fit = () => {
      const current = parseFloat(getComputedStyle(el).fontSize);
      const textWidth = el.getBoundingClientRect().width;
      if (!textWidth) return;
      const next = (current * wrap.clientWidth) / textWidth;
      setSize((prev) => (prev && Math.abs(prev - next) < 0.5 ? prev : next));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    document.fonts?.ready.then(fit); // font load hoye gele abar measure
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <span
        ref={textRef}
        aria-hidden
        style={{ fontSize: size ?? undefined }}
        className="block w-max select-none whitespace-nowrap text-[20vw] font-semibold leading-[0.8] tracking-[-0.06em]"
      >
        {text}
      </span>
    </div>
  );
}

/* ---------- [Item] hover: bracket duto dui pashe slide kore ashe, color bodlay na ---------- */

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

const linkCls = "group/b text-lg text-white outline-none";

function LinkColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="mb-5 text-sm font-medium tracking-tight text-white/50 sm:text-base">[{title}]</p>
      <ul className="space-y-3">
        {items.map((item) => {
          const isHttp = item.href.startsWith("http");
          const isMail = item.href.startsWith("mailto:");
          return (
            <li key={item.label}>
              {isHttp || isMail ? (
                <a
                  href={item.href}
                  className={linkCls}
                  {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Bracketed>{item.label}</Bracketed>
                </a>
              ) : (
                <Link href={item.href} className={linkCls}>
                  <Bracketed>{item.label}</Bracketed>
                </Link>
              )}
            </li>
          );
        })}
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

      {/* Top: heading + link columns */}
      <div className="relative z-10 grid gap-14 px-6 pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:px-12 lg:pt-24">
        <div>
          <h2 className="max-w-[16ch] text-[clamp(2.2rem,4.8vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Have a hard product to explain?
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-white/65">
            Tell us what you are building and we will show you how to make it obvious.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <LinkColumn title="Pages" items={PAGES} />
          <LinkColumn title="Social" items={SOCIALS} />
          <div className="col-span-2 sm:col-span-1">
            <LinkColumn title="Contact" items={CONTACT} />
          </div>
        </div>
      </div>

      {/* Wordmark: edge to edge */}
      <div className="relative z-10 mt-16 lg:mt-24">
        <FitWordmark text="ioXora" />
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex flex-col gap-4 px-6 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <p>&copy; {new Date().getFullYear()} ioXora. All rights reserved.</p>
        <button type="button" onClick={backToTop} className="group/b w-fit text-white outline-none">
          <Bracketed>Back to top</Bracketed>
        </button>
      </div>
    </footer>
  );
}