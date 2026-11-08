"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidHover from "../shared/LiquidHover";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const previews = [
  { src: "/bann/bann1.jpg", label: "UX-driven builds" },
  { src: "/bann/bann6.jpg", label: "AI-powered products" },
  { src: "/bann/bann5.jpg", label: "Interactive web" },
  { src: "/bann/bann4.jpg", label: "SEO & GEO" },
  { src: "/bann/bann3.jpg", label: "SaaS" },
  { src: "/bann/bann2.jpg", label: "No Code Web" },
];

// TODO: nijer Cal.com / Calendly link dao
const BOOK_CALL_URL = "/bookcall";

export default function HeroN() {
  const root = useRef<HTMLElement>(null);
  const vline = useRef<HTMLDivElement>(null);
  const hline = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const headWrap = useRef<HTMLDivElement>(null);

  // liquid effect: intro shesh + scroll top e + mouse device hole on
  const [liquidOn, setLiquidOn] = useState(false);
  const introDone = useRef(false);
  const atTop = useRef(true);
  const canHover = useRef(false);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = root.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => el.getBoundingClientRect();
    const sync = () => setLiquidOn(canHover.current && introDone.current && atTop.current);

    let mm: gsap.MatchMedia | undefined;

    const ctx = gsap.context(() => {
      /* ---------- images (shared) ---------- */
      const imgs = gsap.utils.toArray<HTMLImageElement>(".pv-img");
      gsap.set(imgs, { opacity: 0, scale: 1.08 });
      gsap.set(imgs[0], { opacity: 1, scale: 1 });

      let current = 0;
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

      /* ---------- intro + scroll (shared) ---------- */
      if (!reduce) {
        gsap.from(".h-line", { yPercent: 110, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.15 });
        gsap.from(".h-fade", { opacity: 0, duration: 0.8, delay: 0.9 });

        const st = { trigger: el, start: "top top", end: "+=100%" };

        // chhoto screen e parallax distance kom
        const k = Math.max(0.5, Math.min(1, window.innerWidth / 1200));
        const rows = gsap.utils.toArray<HTMLElement>(".h-row");
        const speeds = [-50, -110, -170];
        rows.forEach((row, i) => {
          gsap.to(row, {
            y: (speeds[i] ?? -110) * k,
            ease: "none",
            scrollTrigger: { ...st, scrub: 0.6 },
          });
        });

        gsap.to(headWrap.current, {
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { ...st, scrub: true },
        });

        gsap.to(".h-intro", {
          y: -60 * k,
          ease: "none",
          scrollTrigger: { ...st, scrub: 0.6 },
        });

        gsap.delayedCall(1.6, () => {
          introDone.current = true;
          sync();
        });

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

      /* ---------- device based behaviour ---------- */
      mm = gsap.matchMedia();

      // Mouse device: cursor follow
      mm.add("(hover: hover) and (pointer: fine)", () => {
        canHover.current = true;
        sync();

        const FY = 0.38;
        let moved = false;
        let hidden = false;

        const place = () => {
          const { width: w, height: h } = size();
          gsap.set(vline.current, { x: w * 0.5, autoAlpha: 1 });
          gsap.set(hline.current, { y: h * FY, autoAlpha: 1 });
          gsap.set(box.current, { x: w * 0.5, y: h * FY, xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1 });
        };
        place();

        const dl = reduce ? 0 : 0.15;
        const db = reduce ? 0 : 0.6;
        const vx = gsap.quickTo(vline.current, "x", { duration: dl, ease: "power3" });
        const hy = gsap.quickTo(hline.current, "y", { duration: dl, ease: "power3" });
        const bx = gsap.quickTo(box.current, "x", { duration: db, ease: "power3" });
        const by = gsap.quickTo(box.current, "y", { duration: db, ease: "power3" });

        const STEP = 80;
        const GAP = 140;
        let last = { x: 0, y: 0 };
        let lastT = 0;

        const setHidden = (v: boolean) => {
          if (v === hidden) return;
          hidden = v;
          gsap.to(box.current, { autoAlpha: v ? 0 : 1, scale: v ? 0.6 : 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
          gsap.to([vline.current, hline.current], { autoAlpha: v ? 0 : 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        };

        const move = (e: PointerEvent) => {
          moved = true;
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
        const onResize = () => { if (!moved) place(); };

        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        window.addEventListener("resize", onResize);

        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          window.removeEventListener("resize", onResize);
          canHover.current = false;
          sync();
        };
      });

      // Touch device: cursor nai, tai auto drift + auto image change
      mm.add("(hover: none), (pointer: coarse)", () => {
        const FY = 0.58;
        let drift: gsap.core.Tween | undefined;
        let loop: gsap.core.Tween | undefined;
        let lastW = 0;

        gsap.set([vline.current, hline.current], { autoAlpha: 0 });

        const place = () => {
          const { width: w, height: h } = size();
          lastW = w;
          drift?.kill();
          gsap.set(box.current, { y: h * FY, xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1 });
          if (reduce) {
            gsap.set(box.current, { x: w * 0.5 });
            return;
          }
          gsap.set(box.current, { x: w * 0.38 });
          drift = gsap.to(box.current, { x: w * 0.62, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        };
        place();

        if (!reduce) {
          const next = () => {
            show((current + 1) % previews.length);
            loop = gsap.delayedCall(1.8, next);
          };
          loop = gsap.delayedCall(1.8, next);
        }

        // shudhu width change hole (rotate / resize), address bar er height change e na
        const onResize = () => {
          if (Math.abs(size().width - lastW) > 1) place();
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          drift?.kill();
          loop?.kill();
          gsap.set([vline.current, hline.current], { autoAlpha: 1 });
        };
      });
    }, root);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="sticky top-0 z-0 h-[100svh] overflow-hidden bg-[#f3f3f3] text-[#0a0a0a]">
      <div ref={vline} className="pointer-events-none absolute left-0 top-0 h-full border-l border-dotted border-black/40" />
      <div ref={hline} className="pointer-events-none absolute left-0 top-0 w-full border-t border-dotted border-black/40" />

      {/* cursor follower (touch e auto drift) */}
      <div
        ref={box}
        className="pointer-events-none absolute left-0 top-0 z-0 w-[150px] will-change-transform sm:w-[200px] [@media(max-height:520px)]:hidden"
      >
        <div className="relative h-[105px] w-full overflow-hidden bg-neutral-300 sm:h-[140px]">
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
        <p ref={label} className="mt-2 text-center text-xs sm:text-[13px]">[{previews[0].label}]</p>
      </div>

      <p className="h-fade absolute left-5 top-24 text-sm font-medium sm:left-6 sm:text-base lg:left-8 lg:top-[38%] lg:-translate-y-[130%] [@media(max-height:520px)]:hidden">
        Web &amp; AI agency
      </p>

      {/* headline */}
      <div ref={headWrap} className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 sm:px-6 sm:pb-8 lg:px-8">
        <LiquidHover intensity={2.2} radius={0.13} className="w-full lg:w-max" enabled={liquidOn}>
          <h1 className="text-[clamp(2rem,min(10vw,11vh),5rem)] font-semibold leading-[0.98] tracking-[-0.035em] md:text-[clamp(3rem,min(9vw,11vh),7rem)] lg:text-[clamp(3.5rem,7.6vw,14rem)] xl:text-[clamp(3.5rem,8vw,14rem)]">
            <span className="h-row block overflow-hidden will-change-transform"><span className="h-line block">Engineering 3D,</span></span>
            <span className="h-row block overflow-hidden will-change-transform"><span className="h-line block">interactive, AI-powered</span></span>
            <span className="h-row block overflow-hidden will-change-transform"><span className="h-line block">websites</span></span>
          </h1>
        </LiquidHover>
      </div>

      {/* intro + CTA */}
      <div className="h-fade absolute inset-x-5 top-[8.25rem] z-10 sm:inset-x-6 lg:inset-x-auto lg:right-8 lg:top-1/2 lg:w-[min(22rem,36vw)] lg:-translate-y-1/2">
        <div className="h-intro">
          <p className="max-w-[30rem] text-base font-medium leading-snug lg:text-[20px]">
            ioXora builds UX-driven websites, interactive web experiences and custom AI SaaS for ambitious brands.
          </p>

          {/* Book a 30 min call: bracket style button */}
          <Link
            href={BOOK_CALL_URL}
           
            rel="noopener noreferrer"
            className="group relative mt-5 inline-flex items-center overflow-hidden bg-[#0a0a0a] px-4 py-3 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:mt-6"
          >
            {/* hover e niche theke lime fill uthe ashe */}
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

            <span
              aria-hidden
              className="relative ml-3 text-xl font-light leading-none transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-x-2 group-hover:text-[#0a0a0a] motion-reduce:transition-none"
            >
              ]
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}