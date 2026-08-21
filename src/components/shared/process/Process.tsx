"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Placeholder process step data — swap in your real step names,
 * short descriptions, and image paths. Structure only, nothing
 * else in the component depends on these values.
 */
const steps = [
  {
    number: "01",
    title: "Discovery & Strategy",
    category: "Research & Planning",
    description:
      "We start by understanding your business, your users, and the problem you're actually trying to solve. This phase maps out goals, constraints, and success metrics before a single pixel or line of code exists.",
    image: "/work1.png",
  },
  {
    number: "02",
    title: "Design & Prototyping",
    category: "UX / UI",
    description:
      "From wireframes to high-fidelity prototypes, we shape the experience around clarity and intent. Every screen is tested against the strategy defined in phase one, not just visual trends.",
    image: "/work2.png",
  },
  {
    number: "03",
    title: "Development & Build",
    category: "Engineering",
    description:
      "The design gets translated into a fast, scalable, production-ready product. We prioritize clean architecture and performance from day one, not as an afterthought.",
    image: "/work3.png",
  },
  {
    number: "04",
    title: "Launch & Iterate",
    category: "Deployment & Growth",
    description:
      "We ship, monitor real usage, and refine based on actual data. Launch isn't the finish line — it's where the product starts learning from its users.",
    image: "/work4.png",
  },
];

const Process = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0.25, filter: "blur(2px)", scale: 0.97 },
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "top 45%",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          card,
          { opacity: 1, filter: "blur(0px)", scale: 1 },
          {
            opacity: 0.25,
            filter: "blur(2px)",
            scale: 0.97,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "bottom 45%",
              end: "bottom 15%",
              scrub: true,
            },
          }
        );
      });

      // Images and web fonts can finish loading after this effect runs,
      // which shifts layout and makes ScrollTrigger's cached start/end
      // positions wrong. Refresh once everything has settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = setTimeout(refresh, 500);

      return () => {
        window.removeEventListener("load", refresh);
        clearTimeout(t);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0A0A0A] px-20 py-32">
      <div className="grid grid-cols-2 gap-20">
        {/* ===== LEFT: sticky title ===== */}
        <div className="relative">
          <div className="sticky top-40 h-max">
            <h4 className="mb-5 text-2xl font-bold text-[#797B7C]">
              {"Our Process"}
            </h4>

            <h1
              
              className="
                text-[160px]
                text-white
                font-bold
                leading-[0.88]
                tracking-[-0.06em]
                whitespace-nowrap
              "
            >
              From Idea  <br />
              to Impact
            </h1>
          </div>
        </div>

        {/* ===== RIGHT: scrolling process steps ===== */}
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div
              key={s.number}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group border-b border-white/[0.08] py-10 first:pt-0 last:border-b-0"
            >
              <div className="flex gap-8">
                {/* Image */}
                <div className="relative h-[340px] w-[280px] shrink-0 overflow-hidden rounded-2xl bg-white/[0.04]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Text */}
                <div className="flex flex-1 flex-col justify-between py-2">
                  <div>
                    <span className="mb-4 block text-[17px] font-semibold tracking-[0.1em] text-[#5C5F62]">
                      {s.number}
                    </span>

                    <h3 className="text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-white">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[17px] font-medium text-[#8A8D90]">
                      {s.category}
                    </p>
                  </div>

                  <p className="mt-6 max-w-[440px] text-[16px] leading-relaxed text-[#7C7F82]">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;