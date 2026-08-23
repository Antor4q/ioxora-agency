"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  number: number;
  suffix: string;
  label: string;
  text: string;
};

const stats: Stat[] = [
  {
    number: 32,
    suffix: "+",
    label: "Projects Delivered",
    text: "Websites, AI experiences and digital products built for ambitious brands.",
  },
  {
    number: 95,
    suffix: "%",
    label: "Client Satisfaction",
    text: "Focused on clear communication, reliable delivery and quality execution.",
  },
  {
    number: 4.5,
    suffix: "+",
    label: "Average Rating",
    text: "Trusted by clients for thoughtful design, development and ongoing support.",
  },
];

export default function InNumber() {
  const sectionRef = useRef<HTMLElement>(null);

  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         INTRO
      ===================================================== */

      gsap.set(".numbers-eyebrow", {
        y: 30,
        opacity: 0,
      });

      gsap.set(".numbers-heading-line", {
        yPercent: 110,
      });

      gsap.set(".numbers-intro", {
        y: 30,
        opacity: 0,
      });

      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      introTimeline
        .to(".numbers-eyebrow", {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".numbers-heading-line",
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          ".numbers-intro",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        );

      /* =====================================================
         STATS
      ===================================================== */

      statRefs.current.forEach((stat, index) => {
        if (!stat) return;

        const number = numberRefs.current[index];

        const label = stat.querySelector(
          ".numbers-label"
        );

        const description = stat.querySelector(
          ".numbers-description"
        );

        const accent = stat.querySelector(
          ".numbers-accent"
        );

        /* =================================================
           INITIAL STATE
        ================================================= */

        gsap.set(stat, {
          y: 70,
          opacity: 0,
        });

        gsap.set(
          [label, description, accent],
          {
            y: 25,
            opacity: 0,
          }
        );

        /* =================================================
           STAT ANIMATION
        ================================================= */

        const animateStat = () => {
          if (!number) return;

          const target = stats[index].number;

          /* -----------------------------------------------
             Kill previous counter
          ----------------------------------------------- */

          gsap.killTweensOf(number);

          /* -----------------------------------------------
             Reset counter
          ----------------------------------------------- */

          number.textContent = "0";

          /* -----------------------------------------------
             Card
          ----------------------------------------------- */

          gsap.fromTo(
            stat,
            {
              y: 70,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power4.out",
              overwrite: true,
            }
          );

          /* -----------------------------------------------
             Accent
          ----------------------------------------------- */

          gsap.fromTo(
            accent,
            {
              y: 25,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              delay: 0.08,
              ease: "power3.out",
              overwrite: true,
            }
          );

          /* -----------------------------------------------
             Label
          ----------------------------------------------- */

          gsap.fromTo(
            label,
            {
              y: 25,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: 0.15,
              ease: "power3.out",
              overwrite: true,
            }
          );

          /* -----------------------------------------------
             Description
          ----------------------------------------------- */

          gsap.fromTo(
            description,
            {
              y: 25,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              delay: 0.25,
              ease: "power3.out",
              overwrite: true,
            }
          );

          /* =================================================
             COUNTER
          ================================================= */

          const counter = {
            value: 0,
          };

          gsap.to(counter, {
            value: target,
            duration: 1.7,
            delay: 0.1,
            ease: "power3.out",
            overwrite: true,

            onUpdate: () => {
              if (!number) return;

              if (target % 1 !== 0) {
                number.textContent =
                  counter.value.toFixed(1);
              } else {
                number.textContent =
                  Math.round(
                    counter.value
                  ).toString();
              }
            },

            onComplete: () => {
              if (!number) return;

              number.textContent =
                target % 1 !== 0
                  ? target.toFixed(1)
                  : target.toString();
            },
          });
        };

        ScrollTrigger.create({
          trigger: stat,

          start: "top 82%",

          /*
           * IMPORTANT:
           * This gives every stat,
           * including the last one,
           * a proper active area.
           */
          end: "bottom 18%",

          onEnter: () => {
            animateStat();
          },

          onEnterBack: () => {
            animateStat();
          },

          onLeave: () => {
            /*
             * Don't reset here.
             *
             * This is important for the last
             * number when scrolling upward.
             */
            if (number) {
              gsap.killTweensOf(number);
            }
          },

          onLeaveBack: () => {
            /*
             * Reset only when moving upward
             * past the top of the stat.
             */

            if (number) {
              gsap.killTweensOf(number);
              number.textContent = "0";
            }

            gsap.set(stat, {
              y: 70,
              opacity: 0,
            });

            gsap.set(
              [label, description, accent],
              {
                y: 25,
                opacity: 0,
              }
            );
          },
        });
      });

      /* =====================================================
         MARQUEE
      ===================================================== */

      gsap.to(".numbers-marquee-track", {
        xPercent: -25,
        ease: "none",

        scrollTrigger: {
          trigger: ".numbers-marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      /* =====================================================
         FINAL STATEMENT
      ===================================================== */

      gsap.fromTo(
        ".numbers-final",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",

          scrollTrigger: {
            trigger: ".numbers-final",
            start: "top 82%",
            once: true,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-[#050505]
        text-[#C9CDCB]

        px-5
        py-16

        sm:px-8
        sm:py-20

        md:px-12
        md:py-24

        lg:px-16

        xl:p-20
      "
    >
      {/* =====================================================
          INTRO
      ===================================================== */}

      <div className="mb-8 sm:mb-10">
        <h4
          className="
            tech-label
            mb-3
            text-lg
            font-bold
            text-[#797B7C]

            sm:mb-4
            sm:text-xl

            md:text-2xl
          "
        >
          In Numbers
        </h4>

        <h1
          className="
            whitespace-normal
            text-[11vw]
            font-bold
            leading-[1]
            tracking-[-0.03em]
            text-[#BFC4BF]

            sm:text-[64px]
            sm:leading-[0.95]
            sm:tracking-[-0.04em]

            md:text-[9vw]
            md:leading-[0.9]
            md:tracking-[-0.05em]

            lg:text-[110px]

            xl:whitespace-nowrap
            xl:text-[160px]
            xl:leading-[0.88]
            xl:tracking-[-0.06em]
          "
        >
          Experience, Scale
          <br /> & Impact
        </h1>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="relative z-10">
        <div className="flex flex-col">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(element) => {
                statRefs.current[index] = element;
              }}
              className="
                numbers-stat
                relative
                flex
                flex-col
                py-10

                sm:py-12

                md:min-h-[20vh]
                md:flex-row
                md:items-center
                md:py-16
              "
            >
              {/* =================================================
                  NUMBER
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  min-w-0
                  flex-1
                  items-center
                  overflow-visible
                "
              >
                <div
                  className="
                    relative
                    overflow-visible
                    py-4

                    sm:py-6

                    md:py-8
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      whitespace-nowrap
                      text-[clamp(3.2rem,24vw,21rem)]
                      font-bold
                      leading-[0.78]
                      tracking-[-0.06em]

                      sm:text-[clamp(5rem,20vw,21rem)]
                      sm:tracking-[-0.08em]

                      md:text-[clamp(8rem,20vw,21rem)]
                      md:tracking-[-0.105em]
                    "
                  >
                    <span
                      ref={(element) => {
                        numberRefs.current[index] = element;
                      }}
                      className="
                        text-[#C9CDCB]
                      "
                    >
                      0
                    </span>

                    <span
                      className="
                        ml-2
                        pt-2
                        text-[clamp(1.4rem,7vw,5rem)]
                        font-medium
                        leading-none
                        tracking-[-0.04em]
                        text-[#D5F139]

                        sm:ml-3
                        sm:pt-4
                        sm:text-[clamp(2rem,5vw,5rem)]
                        sm:tracking-[-0.05em]

                        md:pt-7
                      "
                    >
                      {stat.suffix}
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  RIGHT CONTENT
              ================================================= */}

              <div
                className="
                  mt-6
                  w-full

                  sm:mt-8

                  md:mt-0
                  md:w-[42%]

                  lg:w-[40%]
                "
              >
                {/* ACCENT */}

                <div
                  className="
                    numbers-accent
                    mb-4
                    h-1
                    w-10
                    rounded-full
                    bg-[#BFC4BF]

                    sm:mb-6
                  "
                />

                {/* LABEL */}

                <div className="overflow-hidden">
                  <h3
                    className="
                      numbers-label
                      text-[clamp(1.6rem,7vw,3.5rem)]
                      font-bold
                      leading-[0.95]
                      tracking-[-0.03em]
                      text-[#BFC4BF]

                      sm:text-[clamp(2rem,4vw,3.5rem)]
                      sm:leading-[0.9]
                      sm:tracking-[-0.065em]
                    "
                  >
                    {stat.label}
                  </h3>
                </div>

                {/* DESCRIPTION */}

                <div
                  className="
                    mt-5
                    max-w-full
                    overflow-hidden

                    sm:mt-7
                    sm:max-w-[560px]
                  "
                >
                  <p
                    className="
                      numbers-description
                      text-[clamp(1rem,4vw,1.55rem)]
                      font-medium
                      leading-[1.55]
                      tracking-[-0.01em]
                      text-[#777C77]

                      sm:text-[clamp(1.2rem,2vw,1.55rem)]
                      sm:leading-[1.6]
                      sm:tracking-[-0.02em]
                    "
                  >
                    {stat.text}
                  </p>
                </div>

                {/* INDEX */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#626762]

                    sm:mt-8
                  "
                >
                  <span>0{index + 1}</span>

                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#D5F139]
                    "
                  />

                  <span className="truncate">
                    {stat.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          MARQUEE
      ===================================================== */}

      <div
        className="
          numbers-marquee
          relative
          z-10
          mt-4
          overflow-hidden
          py-6

          sm:py-8

          md:py-10
        "
      >
        <div
          className="
            numbers-marquee-track
            flex
            w-max
            items-center
            gap-6
            whitespace-nowrap

            sm:gap-10
          "
        >
          {[
            "PROJECTS COMPLETED",
            "AVERAGE RATING",
            "CLIENT SATISFACTION",
            "PROJECTS COMPLETED",
            "AVERAGE RATING",
            "CLIENT SATISFACTION",
            "PROJECTS COMPLETED",
            "AVERAGE RATING",
          ].map((text, index) => (
            <div
              key={`${text}-${index}`}
              className="
                flex
                items-center
                gap-6

                sm:gap-10
              "
            >
              <span
                className="
                  text-[clamp(1.1rem,5vw,2.6rem)]
                  font-bold
                  uppercase
                  tracking-[-0.03em]
                  text-[#AEB3AE]

                  sm:text-[clamp(1.4rem,2.5vw,2.6rem)]
                  sm:tracking-[-0.04em]
                "
              >
                {text}
              </span>

              <span
                className="
                  h-2
                  w-2
                  shrink-0
                  rounded-full
                  bg-[#D5F139]
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          FINAL
      ===================================================== */}
    </section>
  );
}