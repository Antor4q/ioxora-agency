"use client";
import { useEffect, useRef } from "react";
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

const services = [
  "UX-driven builds",
  "AI-powered products",
  "Interactive web",
  "SEO & GEO",
  "SaaS",
  "No Code Web",
];

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".i-num");

      if (reduce) {
        nums.forEach((n) => (n.textContent = n.dataset.count ?? "0"));
        return;
      }

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

      // 3) count-up stats
      nums.forEach((n) => {
        const target = Number(n.dataset.count ?? 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => (n.textContent = String(Math.round(obj.v))),
          scrollTrigger: { trigger: n, start: "top 90%", once: true },
        });
      });

      // 4) bottom columns fade up
      gsap.from(".i-col", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".i-cols", start: "top 85%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative z-10 -mt-px bg-white px-6 pb-20 pt-10 text-[#0a0a0a]  md:px-8 md:pb-28 md:pt-14"
    >
      {/* label row */}
      <div className="flex items-center justify-between text-sm">
        <p>[01 / Intro]</p>
        <p className="hidden md:block">(About)</p>
      </div>

      {/* big statement */}
      <p className="i-para mx-auto mt-16 max-w-[1400px] uppercase text-[clamp(1.8rem,4vw,4rem)] font-medium leading-[1.12] tracking-[-0.03em] md:mt-28">
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

      {/* bottom columns */}
      <div className="i-cols mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
        {/* left: short copy + link */}
        <div className="i-col max-w-xs">
          <p className="text-base leading-snug text-black/70">
            From first sketch to launch, we build fast, polished products with a focus on
            performance, motion and conversion.
          </p>
          <a
            href="#work"
            className="mt-5 inline-block border-b border-black pb-0.5 text-sm font-medium focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
          >
            Learn more →
          </a>
        </div>

        {/* middle: stats */}
        <div className="i-col grid grid-cols-3 gap-4 md:gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]">
                <span className="i-num" data-count={s.n}>0</span>
                {s.suffix}
              </p>
              <p className="mt-2 text-[13px] text-black/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* right: services */}
        <ul className="i-col group/list md:justify-self-end">
          {services.map((s) => (
            <li
              key={s}
              className="cursor-default text-lg font-medium leading-relaxed transition-opacity duration-300 group-hover/list:opacity-30 hover:!opacity-100"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}