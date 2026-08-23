"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AIStage = {
  number: string;
  title: string;
  description: string;
  items: string[];
  insight: string;
};

const stages: AIStage[] = [
  {
    number: "01",
    title: "Research",
    description:
      "AI helps us process large amounts of information faster, identify patterns and uncover useful insights before we make important product decisions.",
    items: ["Market research", "Competitor analysis", "User insights"],
    insight:
      "Less time collecting information. More time understanding what actually matters.",
  },
  {
    number: "02",
    title: "Ideation",
    description:
      "We use AI to expand the creative space and explore different possibilities before deciding which direction deserves our attention.",
    items: ["Concept exploration", "Visual directions", "Content ideas"],
    insight:
      "More possibilities explored early means stronger ideas survive the process.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "AI accelerates design exploration while our designers remain responsible for the decisions that shape the final experience, interaction and visual language.",
    items: ["UX exploration", "Interface variations", "Rapid prototypes"],
    insight: "AI creates variations. Human judgement decides what feels right.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "AI assists our developers with repetitive and time-consuming tasks so they can focus more deeply on architecture, performance and the actual product experience.",
    items: ["Code assistance", "Development automation", "Testing support"],
    insight:
      "Less repetitive work gives developers more room to solve meaningful problems.",
  },
  {
    number: "05",
    title: "Refine",
    description:
      "We use AI to test, compare and iterate on what we build. The final decisions always remain human, because technology should support judgement rather than replace it.",
    items: ["Performance checks", "Rapid iteration", "Quality control"],
    insight:
      "AI helps us iterate faster without compromising the quality of the final result.",
  },
];

/* ============================================================
   FLIP TEXT
============================================================ */

function FlipText({
  children,
  active,
  className = "",
}: {
  children: React.ReactNode;
  active: boolean;
  className?: string;
}) {
  return (
    <span className="relative block overflow-hidden">
      <span
        className={`
          block
          text-[#72766F]
          transition-opacity
          duration-150
          ${active ? "opacity-0" : "opacity-100"}
          ${className}
        `}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          inset-0
          block
          text-[#C7CBC4]
          ${className}
        `}
        style={{
          transformOrigin: "50% 100%",
          transform: active
            ? "translate3d(0,0,0) rotateX(0deg)"
            : "translate3d(0,105%,0) rotateX(-90deg)",
          transition: "transform 650ms cubic-bezier(0.76,0,0.24,1)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: "transform",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function HowWeUseAI() {
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeStage = stages[activeIndex];

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      if (!isHoveringRef.current) {
        setActiveIndex((current) => (current + 1) % stages.length);
      }
    }, 3500);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".ai-dynamic-content");

    gsap.fromTo(
      elements,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.05,
        ease: "power3.out",
      }
    );
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ai-header-item",
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".ai-option-item",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-workspace",
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".ai-right-content",
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".ai-workspace",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleOptionEnter = (index: number) => {
    isHoveringRef.current = true;
    setActiveIndex(index);
  };

  const handleOptionLeave = () => {
    isHoveringRef.current = false;
  };

  return (
    <section
    id="ai"
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-[#10110D]
        text-[#C7CBC4]
      "
    >
      <div
        className="
          p-6
          sm:p-10
          md:p-14
          lg:p-20
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-0">
          <h4
            className="
              ai-header-item
              tech-label
              mb-3
              text-lg
              font-bold
              text-[#797B7C]
              sm:text-xl
              md:mb-4
              md:text-2xl
            "
          >
            How We Use Ai
          </h4>

          <h1
            className="
              ai-header-item
              whitespace-nowrap
              text-[12vw]
              font-bold
              leading-[0.9]
              tracking-[-0.05em]
              text-[#BFC4BF]
              sm:text-[15vw]
              sm:leading-[0.88]
              sm:tracking-[-0.06em]
              lg:text-[clamp(4rem,10vw,160px)]
            "
          >
            AI isn`t
            <br />
            the process.
          </h1>
        </div>

        {/* ==================================================
            MAIN WORKSPACE
        ================================================== */}

        <div
          className="
            ai-workspace
            mt-12
            grid
            grid-cols-1
            gap-y-12
            sm:mt-16
            sm:gap-y-16
            lg:mt-20
            lg:grid-cols-[0.65fr_1.35fr]
            lg:gap-x-36
            lg:gap-y-20
            xl:gap-x-48
          "
        >
          {/* =================================================
              LEFT OPTIONS
          ================================================= */}

          <div
            className="
              flex
              flex-col
              justify-center
            "
            onMouseLeave={handleOptionLeave}
          >
            <p
              className="
                mb-5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#555A55]
                sm:mb-8
              "
            >
              AI in our workflow
            </p>

            <div className="flex flex-col">
              {stages.map((stage, index) => {
                const active = activeIndex === index;

                return (
                  <button
                    key={stage.number}
                    type="button"
                    onMouseEnter={() => handleOptionEnter(index)}
                    onFocus={() => handleOptionEnter(index)}
                    onClick={() => setActiveIndex(index)}
                    className="
                      ai-option-item
                      flex
                      w-full
                      items-center
                      py-2.5
                      text-left
                      outline-none
                      sm:py-3
                      md:py-4
                    "
                  >
                    <span
                      className={`
                        mr-3
                        w-7
                        shrink-0
                        text-[9px]
                        font-semibold
                        tracking-[0.15em]
                        transition-colors
                        duration-500
                        sm:mr-5
                        sm:w-9
                        sm:text-[10px]
                        ${active ? "text-[#A5AAA2]" : "text-[#4F544E]"}
                      `}
                    >
                      {stage.number}.
                    </span>

                    <FlipText
                      active={active}
                      className="
                        text-[clamp(1.6rem,7vw,4.5rem)]
                        font-bold
                        leading-[0.9]
                        tracking-[-0.06em]
                        sm:text-[clamp(2rem,4vw,4.5rem)]
                        sm:tracking-[-0.07em]
                      "
                    >
                      {stage.title}
                    </FlipText>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div
            className="
              ai-right-content
              flex
              items-center
              lg:min-h-[560px]
            "
          >
            <div
              key={activeStage.number}
              className="
                w-full
                max-w-[900px]
              "
            >
              {/* TOP LABEL */}

              <p
                className="
                  ai-dynamic-content
                  mb-5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#555A55]
                  sm:mb-8
                "
              >
                {activeStage.number} / AI IN THE WORKFLOW
              </p>

              {/* TITLE */}

              <h3
                className="
                  ai-dynamic-content
                  text-[clamp(2.5rem,13vw,8rem)]
                  font-bold
                  leading-[0.85]
                  tracking-[-0.06em]
                  text-[#C7CBC4]
                  sm:text-[clamp(4rem,8vw,8rem)]
                  sm:leading-[0.78]
                  sm:tracking-[-0.09em]
                "
              >
                {activeStage.title}
              </h3>

              {/* DESCRIPTION */}

              <p
                className="
                  ai-dynamic-content
                  mt-6
                  max-w-[780px]
                  text-[clamp(1.05rem,4vw,1.75rem)]
                  font-medium
                  leading-[1.5]
                  tracking-[-0.02em]
                  text-[#72766F]
                  sm:mt-10
                  sm:text-[clamp(1.3rem,2.1vw,1.75rem)]
                  sm:leading-[1.55]
                  sm:tracking-[-0.025em]
                "
              >
                {activeStage.description}
              </p>

              {/* =================================================
                  AI ASSISTS
              ================================================= */}

              <div className="ai-dynamic-content mt-10 sm:mt-14">
                <p
                  className="
                    mb-4
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#555A55]
                    sm:mb-5
                  "
                >
                  AI assists with
                </p>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-2
                    sm:grid-cols-3
                  "
                >
                  {activeStage.items.map((item, index) => (
                    <div key={item} className="py-3 pr-5 sm:py-4">
                      <span
                        className="
                          mb-3
                          block
                          text-[9px]
                          font-semibold
                          tracking-[0.15em]
                          text-[#555A55]
                        "
                      >
                        0{index + 1}
                      </span>

                      <span
                        className="
                          block
                          text-[15px]
                          font-medium
                          leading-[1.35]
                          tracking-[-0.02em]
                          text-[#969B94]
                        "
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* =================================================
                  INSIGHT
              ================================================= */}

              <div className="ai-dynamic-content mt-10 max-w-[780px] sm:mt-12">
                <p
                  className="
                    text-[clamp(0.95rem,3vw,1.15rem)]
                    font-medium
                    leading-[1.55]
                    tracking-[-0.015em]
                    text-[#555A55]
                  "
                >
                  <span className="text-[#72766F]">Why it matters —</span>{" "}
                  {activeStage.insight}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}