"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ComparisonItem = {
  title: string;
  freelancer: string;
  agency: string;
  ours: string;
};

const comparisons: ComparisonItem[] = [
  {
    title: "Flexibility",
    freelancer: "High",
    agency: "Moderate",
    ours: "High",
  },
  {
    title: "Cost",
    freelancer: "Lower",
    agency: "Higher",
    ours: "Balanced",
  },
  {
    title: "AI Integration",
    freelancer: "Limited",
    agency: "Available",
    ours: "Built-in",
  },
  {
    title: "Interactive & 3D",
    freelancer: "Limited",
    agency: "Available",
    ours: "Advanced",
  },
  {
    title: "Scalability",
    freelancer: "Limited",
    agency: "Structured",
    ours: "Built to scale",
  },
  {
    title: "Quality",
    freelancer: "Variable",
    agency: "Consistent",
    ours: "High",
  },
  {
    title: "Technical Depth",
    freelancer: "Varies",
    agency: "Strong",
    ours: "Full-stack",
  },
];

const columns = [
  {
    title: "Freelancers",
    number: "01",
  },
  {
    title: "Other Agencies",
    number: "02",
  },
  {
    title: "ioXora",
    number: "03",
  },
];

/* =====================================================
   FLIP TEXT
===================================================== */

function FlipText({
  children,
  active,
  className = "",
  color = "gray",
}: {
  children: React.ReactNode;
  active: boolean;
  className?: string;
  color?: "gray" | "dark";
}) {
  const originalColor =
    color === "dark"
      ? "text-[#151719]"
      : "text-[#8B8D8E]";

  return (
    <span
      className="
        relative
        block
        overflow-hidden
      "
      style={{
        isolation: "isolate",
      }}
    >
      {/* =================================================
          ORIGINAL TEXT
      ================================================= */}

      <span
        className={`
          block
          ${originalColor}
          ${className}
        `}
        style={{
          opacity: active ? 0 : 1,

          transition: active
            ? "opacity 120ms ease-out"
            : "opacity 180ms ease-out 650ms",
        }}
      >
        {children}
      </span>

      {/* =================================================
          DARK FLIP TEXT
      ================================================= */}

      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          inset-0
          block
          text-[#151719]
          ${className}
        `}
        style={{
          transformOrigin: "50% 100%",

          transform: active
            ? "translate3d(0, 0, 0) rotateX(0deg)"
            : "translate3d(0, 105%, 0) rotateX(-90deg)",

          transition:
            "transform 650ms cubic-bezier(0.76, 0, 0.24, 1)",

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

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  const [activeRow, setActiveRow] = useState<number | null>(
    null
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      /* =================================================
         HEADER ANIMATION
      ================================================= */

      const headerItems = section.querySelectorAll(
        ".comparison-header-item"
      );

      gsap.fromTo(
        headerItems,
        {
          y: 70,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",

          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        }
      );

      /* =================================================
         COLUMN HEADINGS
      ================================================= */

      const columnTitles = section.querySelectorAll(
        ".comparison-column-title"
      );

      gsap.fromTo(
        columnTitles,
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",

          scrollTrigger: {
            trigger: ".comparison-content",
            start: "top 78%",
            once: true,
          },
        }
      );

      /* =================================================
         ROW CARDS
      ================================================= */

      const rows = section.querySelectorAll(
        ".comparison-row"
      );

      gsap.fromTo(
        rows,
        {
          y: 40,
          opacity: 1,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",

          clearProps: "transform",

          scrollTrigger: {
            trigger: ".comparison-list",
            start: "top 80%",
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
        bg-[#F5F5F2]
        text-[#151719]
      "
    >
      {/* =================================================
          SOFT BACKGROUND DETAIL
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[600px]
          w-[900px]
          -translate-x-1/2
          opacity-70
          blur-3xl
        "
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(245,245,242,0) 70%)",
        }}
      />

      <div
        className="
          relative
          z-10
          w-full
         p-20
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <h4
          className="
            mb-4
            text-xl
            font-bold
            text-[#797B7C]
            md:text-2xl
          "
        >
          {"Comparison"}
        </h4>

        <h2
          className="
            mb-20
            whitespace-nowrap
            text-[15vw]
            font-bold
            leading-[0.88]
            tracking-[-0.06em]
            text-[#222628]
            md:text-[160px]
          "
        >
          The Difference
        </h2>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="comparison-content w-full">
          {/* =================================================
              COLUMN HEADERS
          ================================================= */}

          <div
            className="
              mb-8
              grid
              grid-cols-[1.1fr_1fr_1fr_1fr]
              items-end
              gap-6
            "
          >
            {/* EMPTY FIRST COLUMN */}

            <div />

            {/* COLUMNS */}

            {columns.map((column) => (
              <div
                key={column.title}
                className="
                  comparison-column-title
                  flex
                  min-w-0
                  flex-col
                "
              >
                <span
                  className="
                    mb-4
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#9A9C9D]
                  "
                >
                  {column.number}
                </span>

                <h3
                  className="
                    text-[clamp(1.7rem,2.7vw,3rem)]
                    font-bold
                    leading-[0.9]
                    tracking-[-0.06em]
                    text-[#151719]
                  "
                >
                  {column.title}
                </h3>
              </div>
            ))}
          </div>

          {/* =================================================
              ROW CARDS
          ================================================= */}

          <div
            className="
              comparison-list
              flex
              flex-col
              gap-3
            "
          >
            {comparisons.map((item, index) => {
              const active = activeRow === index;

              return (
                <div
                  key={item.title}
                  className="
                    comparison-row
                    group
                    relative
                    w-full
                    cursor-pointer
                    overflow-hidden
                    rounded-[4px]
                    border
                    border-[#E3E4E0]
                    bg-[#FFFFFF]
                    px-6
                    py-8
                    transform-gpu
                    shadow-[0_1px_0_rgba(0,0,0,0.02)]
                    [backface-visibility:hidden]
                    transition-all
                    duration-500
                    hover:border-[#D5D6D2]
                    hover:bg-[#FAFAF8]
                    hover:shadow-[0_12px_40px_rgba(0,0,0,0.045)]
                    md:px-10
                    md:py-10
                  "
                  onMouseEnter={() => {
                    setActiveRow(index);
                  }}
                  onMouseLeave={() => {
                    setActiveRow(null);
                  }}
                >
                  {/* =================================================
                      HOVER LIGHT
                  ================================================= */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                    style={{
                      background:
                        "radial-gradient(circle at 50% 100%, rgba(0,0,0,0.035), transparent 55%)",
                    }}
                  />

                  {/* =================================================
                      TOP LINE
                  ================================================= */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-0
                      top-0
                      h-px
                      w-full
                      origin-left
                      scale-x-0
                      bg-[#151719]/10
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-x-100
                    "
                  />

                  {/* =================================================
                      ROW CONTENT
                  ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      grid
                      grid-cols-[1.1fr_1fr_1fr_1fr]
                      items-center
                      gap-6
                    "
                  >
                    {/* =================================================
                        OPTION
                    ================================================= */}

                    <div className="min-w-0">
                      <FlipText
                        active={active}
                        color="dark"
                        className="
                          text-[clamp(1.6rem,2.7vw,2.7rem)]
                          font-bold
                          leading-none
                          tracking-[-0.06em]
                        "
                      >
                        {item.title}
                      </FlipText>
                    </div>

                    {/* =================================================
                        FREELANCERS
                    ================================================= */}

                    <div className="min-w-0">
                      <FlipText
                        active={active}
                        color="gray"
                        className="
                          text-[clamp(1.15rem,2vw,1.9rem)]
                          font-semibold
                          leading-none
                          tracking-[-0.045em]
                        "
                      >
                        {item.freelancer}
                      </FlipText>
                    </div>

                    {/* =================================================
                        OTHER AGENCIES
                    ================================================= */}

                    <div className="min-w-0">
                      <FlipText
                        active={active}
                        color="gray"
                        className="
                          text-[clamp(1.15rem,2vw,1.9rem)]
                          font-semibold
                          leading-none
                          tracking-[-0.045em]
                        "
                      >
                        {item.agency}
                      </FlipText>
                    </div>

                    {/* =================================================
                        IOXORA
                    ================================================= */}

                    <div className="min-w-0">
                      <FlipText
                        active={active}
                        color="dark"
                        className="
                          text-[clamp(1.2rem,2.1vw,2rem)]
                          font-bold
                          leading-none
                          tracking-[-0.045em]
                        "
                      >
                        {item.ours}
                      </FlipText>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}