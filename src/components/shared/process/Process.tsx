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
      // Skip the blur/scale scroll animation for reduced-motion users —
      // just show every card fully visible.
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(cardRefs.current.filter(Boolean), {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
        });
        return;
      }

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
      window.addEventListener("resize", refresh);
      const t = setTimeout(refresh, 500);

      return () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        clearTimeout(t);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        bg-[#0A0A0A]
        px-5
        py-16

        sm:px-8
        sm:py-20

        md:px-12
        md:py-24

        lg:px-16
        lg:py-28

        xl:px-20
        xl:py-32
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-12

          md:grid-cols-2
          md:gap-10

          lg:gap-16

          xl:gap-20
        "
      >
        {/* ===== LEFT: title (sticky on desktop only) ===== */}
        <div className="relative">
          <div
            className="
              h-max

              md:sticky
              md:top-28

              lg:top-32

              xl:top-40
            "
          >
            <h4
              className="
                mb-3
                text-lg
                font-bold
                text-[#797B7C]

                sm:mb-4
                sm:text-xl

                md:text-2xl
              "
            >
              {"Our Process"}
            </h4>

            <h1
              className="
                whitespace-normal
                text-[13vw]
                font-bold
                leading-[0.95]
                tracking-[-0.03em]
                text-white

                sm:text-[64px]
                sm:leading-[0.92]
                sm:tracking-[-0.04em]

                md:text-[48px]
                md:leading-[0.9]
                md:tracking-[-0.05em]

                lg:text-[72px]

                xl:whitespace-nowrap
                xl:text-[160px]
                xl:leading-[0.88]
                xl:tracking-[-0.06em]
              "
            >
              From Idea <br />
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
              className="
                group
                border-b
                border-white/[0.08]
                py-8

                first:pt-0
                last:border-b-0

                sm:py-9

                md:py-10
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-5

                  sm:flex-row
                  sm:gap-6

                  md:gap-7

                  lg:gap-8
                "
              >
                {/* Image */}
                <div
                  className="
                    relative
                    h-[220px]
                    w-full
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    bg-white/[0.04]

                    sm:h-[220px]
                    sm:w-[200px]

                    md:h-[260px]
                    md:w-[220px]

                    lg:h-[300px]
                    lg:w-[250px]

                    xl:h-[340px]
                    xl:w-[280px]
                  "
                >
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 280px, 280px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Text */}
                <div className="flex flex-1 flex-col justify-between py-1 sm:py-2">
                  <div>
                    <span
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-[0.1em]
                        text-[#5C5F62]

                        sm:mb-3
                        sm:text-base

                        md:mb-4
                        md:text-[17px]
                      "
                    >
                      {s.number}
                    </span>

                    <h3
                      className="
                        text-2xl
                        font-bold
                        leading-[1.15]
                        tracking-[-0.02em]
                        text-white

                        sm:text-[28px]

                        md:text-3xl

                        lg:text-4xl
                      "
                    >
                      {s.title}
                    </h3>
                    <p
                      className="
                        mt-1
                        text-sm
                        font-medium
                        text-[#8A8D90]

                        sm:text-base

                        md:text-[17px]
                      "
                    >
                      {s.category}
                    </p>
                  </div>

                  <p
                    className="
                      mt-4
                      max-w-full
                      text-[15px]
                      leading-relaxed
                      text-[#7C7F82]

                      sm:mt-5
                      sm:max-w-[380px]

                      md:mt-6
                      md:text-[16px]

                      lg:max-w-[440px]
                    "
                  >
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