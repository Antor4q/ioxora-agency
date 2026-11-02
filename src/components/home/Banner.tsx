"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidHover from "../shared/LiquidHover";

gsap.registerPlugin(ScrollTrigger);

const previews = [
  { src: "/bann/ba1.jpg", label: "UX-driven builds" },
  { src: "/bann/ba2.jpg", label: "AI-powered products" },
  { src: "/bann/ba3.jpg", label: "Interactive web" },
  { src: "/bann/ba4.jpg", label: "SEO & GEO" },
  { src: "/bann/ba5.jpg", label: "SaaS" },
  { src: "/bann/ba6.jpg", label: "No Code Web" },
];

// TODO: nijer Cal.com / Calendly link dao
const BOOK_CALL_URL = "https://cal.com/your-username/30min";

export default function HeroN() {
  const root = useRef<HTMLElement>(null);
  const vline = useRef<HTMLDivElement>(null);
  const hline = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const headWrap = useRef<HTMLDivElement>(null);

  // liquid effect on/off (intro shesh + scroll top e thakle on)
  const [liquidOn, setLiquidOn] = useState(false);
  const introDone = useRef(false);
  const atTop = useRef(true);

  useEffect(() => {
    const el = root.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { width: w, height: h } = el.getBoundingClientRect();

    const sync = () => setLiquidOn(introDone.current && atTop.current);

    const ctx = gsap.context(() => {
      gsap.set(vline.current, { x: w * 0.5 });
      gsap.set(hline.current, { y: h * 0.38 });
      gsap.set(box.current, { x: w * 0.5, y: h * 0.38, xPercent: -50, yPercent: -50 });

      const imgs = gsap.utils.toArray<HTMLImageElement>(".pv-img");
      gsap.set(imgs, { opacity: 0, scale: 1.08 });
      gsap.set(imgs[0], { opacity: 1, scale: 1 });

      if (!reduce) {
        // intro
        gsap.from(".h-line", { yPercent: 110, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.15 });
        gsap.from(".h-fade", { opacity: 0, duration: 0.8, delay: 0.9 });

        // hero is sticky, so scroll distance = one screen while the intro covers it
        const st = {
          trigger: el,
          start: "top top",
          end: "+=100%",
        };

        // headline parallax: each row moves at its own speed
        const rows = gsap.utils.toArray<HTMLElement>(".h-row");
        const speeds = [-50, -110, -170];
        rows.forEach((row, i) => {
          gsap.to(row, {
            y: speeds[i] ?? -110,
            ease: "none",
            scrollTrigger: { ...st, scrub: 0.6 },
          });
        });

        // headline fades as the intro covers the hero
        gsap.to(headWrap.current, {
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { ...st, scrub: true },
        });

        // right-side intro drifts up slower than the headline (extra depth)
        gsap.to(".h-intro", {
          y: -60,
          ease: "none",
          scrollTrigger: { ...st, scrub: 0.6 },
        });

        // intro shesh hole liquid on
        gsap.delayedCall(1.6, () => {
          introDone.current = true;
          sync();
        });

        // scroll top theke soreche kina track
        ScrollTrigger.create({
          ...st,
          onUpdate: (self) => {
            const top = self.progress < 0.005;
            if (top !== atTop.current) {
              atTop.current = top;
              sync();
            }
          },
        });
      } else {
        introDone.current = true;
        sync();
      }

      // cursor follow: lines tight, box soft lag (no rotation)
      const dl = reduce ? 0 : 0.15;
      const db = reduce ? 0 : 0.6;
      const vx = gsap.quickTo(vline.current, "x", { duration: dl, ease: "power3" });
      const hy = gsap.quickTo(hline.current, "y", { duration: dl, ease: "power3" });
      const bx = gsap.quickTo(box.current, "x", { duration: db, ease: "power3" });
      const by = gsap.quickTo(box.current, "y", { duration: db, ease: "power3" });

      // image swap
      const STEP = 80;
      const GAP = 140;
      let last = { x: 0, y: 0 };
      let lastT = 0;
      let current = 0;
      let hidden = false;

      const show = (next: number) => {
        if (next === current) return;
        const prev = imgs[current];
        const cur = imgs[next];
        current = next;

        if (reduce) {
          gsap.set(prev, { opacity: 0 });
          gsap.set(cur, { opacity: 1, scale: 1 });
        } else {
          gsap.set(cur, { zIndex: 2 });
          gsap.set(prev, { zIndex: 1 });
          gsap.fromTo(cur, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out", overwrite: true });
          gsap.to(prev, { opacity: 0, duration: 0.55, ease: "power2.out", overwrite: true });
        }

        gsap.to(label.current, {
          opacity: 0, y: 4, duration: 0.12, ease: "power1.in",
          onComplete: () => {
            if (label.current) label.current.textContent = `[${previews[next].label}]`;
            gsap.to(label.current, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
          },
          overwrite: true,
        });
      };

      const setHidden = (v: boolean) => {
        if (v === hidden) return;
        hidden = v;
        gsap.to(box.current, { autoAlpha: v ? 0 : 1, scale: v ? 0.6 : 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
        gsap.to([vline.current, hline.current], { autoAlpha: v ? 0 : 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      };

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const navH = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
        setHidden(e.clientY < navH);
        vx(x); hy(y); bx(x); by(y);

        const now = performance.now();
        if (Math.hypot(x - last.x, y - last.y) > STEP && now - lastT > GAP) {
          last = { x, y };
          lastT = now;
          show((current + 1) % previews.length);
        }
      };
      const leave = () => setHidden(true);

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="sticky top-0 z-0 h-[100svh] overflow-hidden bg-[#f3f3f3] text-[#0a0a0a]">
      <div ref={vline} className="pointer-events-none absolute left-0 top-0 h-full border-l border-dotted border-black/40" />
      <div ref={hline} className="pointer-events-none absolute left-0 top-0 w-full border-t border-dotted border-black/40" />

      {/* cursor follower */}
      <div ref={box} className="pointer-events-none absolute left-0 top-0 z-0 w-[200px] will-change-transform">
        <div className="relative h-[140px] w-full overflow-hidden bg-neutral-300">
          {previews.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={p.src}
              alt=""
              className="pv-img absolute inset-0 h-full w-full object-cover will-change-[opacity,transform]"
            />
          ))}
        </div>
        <p ref={label} className="mt-2 text-center text-[13px]">[{previews[0].label}]</p>
      </div>

      <p className="h-fade absolute left-6 top-[38%] -translate-y-[130%] text-base font-medium md:left-8">Web &amp; AI agency</p>

      {/* headline: absolute wrapper bahire, LiquidHover bhitore */}
      <div ref={headWrap} className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 md:px-8">
        <LiquidHover intensity={2.2} radius={0.13} className="w-max" enabled={liquidOn}>
          <h1 className="text-[clamp(2.2rem,8vw,14rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            <span className="h-row block overflow-hidden will-change-transform"><span className="h-line block">Engineering 3D,</span></span>
            <span className="h-row block overflow-hidden will-change-transform"><span className="h-line block">interactive, AI-powered</span></span>
            <span className="h-row block overflow-hidden will-change-transform"><span className="h-line block">websites</span></span>
          </h1>
        </LiquidHover>
      </div>

      {/* intro + CTA */}
      <div className="h-fade absolute right-6 top-[20%] z-10 w-[min(22rem,70vw)] md:right-8 md:top-1/2 md:-translate-y-1/2">
        <div className="h-intro">
          <p className="text-base font-medium leading-snug md:text-[20px]">
            ioXora builds UX-driven websites, interactive web experiences and custom AI SaaS for ambitious brands.
          </p>

          {/* Book a 30 min call: animated button */}
        {/* Book a 30 min call: bracket style button */}
<a
  href={BOOK_CALL_URL}
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
      </div>
    </section>
  );
}