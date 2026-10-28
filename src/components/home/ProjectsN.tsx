"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// placeholder data: replace stack/role/links with your real ones
const projects = [
  { name: "Heaven Furniture Mart", stack: "Next.js, GSAP", role: "Web design & development", bg: "linear-gradient(135deg,#c1281c,#6b0f0a)" },
  { name: "Oran", stack: "Next.js, Tailwind, GSAP", role: "Web development", bg: "linear-gradient(135deg,#f59a2b,#d1451f)" },
  { name: "Upto", stack: "Next.js, Tailwind, GSAP", role: "Web design & development", bg: "linear-gradient(135deg,#7a1020,#1b0a10)" },
];

export default function ProjectsN() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        const card = panel.querySelector("[data-card]") as HTMLElement;
        // scroll parallax on y, mouse drift on x
        gsap.fromTo(card, { yPercent: 12 }, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        });
        const qx = gsap.quickTo(card, "x", { duration: 0.8, ease: "power3" });
        panel.addEventListener("pointermove", (e) => {
          const r = panel.getBoundingClientRect();
          qx((e.clientX - r.left - r.width / 2) * 0.04);
        });
        panel.addEventListener("pointerleave", () => qx(0));
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="bg-[#000] z-10 text-white">
      <h2 className="px-6 pb-12 pt-32 text-[clamp(3rem,11vw,12rem)] font-light uppercase leading-[0.9] tracking-tight md:px-8">
        Selected work
      </h2>

      {projects.map((p) => (
        <article key={p.name} className="group grid min-h-[80svh] md:grid-cols-[62fr_38fr]">
          <div data-panel className="relative flex items-center justify-center overflow-hidden py-16" style={{ background: p.bg }}>
            <div data-card className="flex aspect-[16/10] w-[72%] items-end bg-neutral-950 p-6 shadow-2xl ring-1 ring-white/10">
              <span className="text-[clamp(1.5rem,4vw,3.5rem)] font-light leading-none">{p.name}</span>
            </div>
          </div>

          <div className="px-6 py-10 md:px-10 md:py-0">
            <div className="md:sticky md:top-[24vh]">
              <h3 className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-light uppercase leading-tight">
                <a href="#" className="relative inline-block focus-visible:outline focus-visible:outline-1 focus-visible:outline-white">
                  {p.name}
                  <sup className="ml-1 text-[10px] text-white/50">[view]</sup>
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </h3>
              <p className="mt-4 text-xs uppercase leading-5 tracking-wide text-white/50">
                {p.stack}<br />Role: {p.role}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}