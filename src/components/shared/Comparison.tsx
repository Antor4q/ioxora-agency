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
        {/* =================================================
            HEADER
        ================================================= */}

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
          {"Comparison"}
        </h4>

        <h2
          className="
            mb-10
            whitespace-normal
            text-[13vw]
            font-bold
            leading-[0.95]
            tracking-[-0.03em]
            text-[#222628]

            sm:mb-14
            sm:whitespace-nowrap
            sm:text-[11vw]
            sm:leading-[0.9]
            sm:tracking-[-0.05em]

            md:mb-20
            md:text-[9vw]
            md:tracking-[-0.06em]

            lg:text-[110px]

            xl:text-[160px]
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
              Only shown from md up — on mobile each row shows
              its own inline labels instead (see stacked layout
              below), since a 4-column grid can't fit small
              screens without crushing the text.
          ================================================= */}

          <div
            className="
              mb-8
              hidden
              grid-cols-[1.1fr_1fr_1fr_1fr]
              items-end
              gap-6

              md:grid
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
                    px-5
                    py-6
                    transform-gpu
                    shadow-[0_1px_0_rgba(0,0,0,0.02)]
                    [backface-visibility:hidden]
                    transition-all
                    duration-500
                    hover:border-[#D5D6D2]
                    hover:bg-[#FAFAF8]
                    hover:shadow-[0_12px_40px_rgba(0,0,0,0.045)]

                    sm:px-6
                    sm:py-8

                    md:px-10
                    md:py-10
                  "
                  onMouseEnter={() => {
                    setActiveRow(index);
                  }}
                  onMouseLeave={() => {
                    setActiveRow(null);
                  }}
                  onClick={() => {
                    // Touch devices have no hover — tap to reveal
                    // the flip state, tap again (or tap another
                    // row) to release it.
                    setActiveRow((current) =>
                      current === index ? null : index
                    );
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
                      DESKTOP/TABLET: 4-COLUMN GRID (md and up)
                  ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      hidden
                      grid-cols-[1.1fr_1fr_1fr_1fr]
                      items-center
                      gap-6

                      md:grid
                    "
                  >
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

                  {/* =================================================
                      MOBILE: STACKED LABEL/VALUE LAYOUT (below md)

                      A 4-column grid can't hold "Interactive & 3D" /
                      "Built to scale" etc. on a phone without either
                      truncating or shrinking the text unreadably, so
                      below md each row becomes a title + a simple
                      label:value list instead.
                  ================================================= */}

                  <div className="relative z-10 flex flex-col gap-4 md:hidden">
                    <FlipText
                      active={active}
                      color="dark"
                      className="
                        text-[clamp(1.4rem,7vw,2rem)]
                        font-bold
                        leading-none
                        tracking-[-0.04em]
                      "
                    >
                      {item.title}
                    </FlipText>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9A9C9D]">
                          {columns[0].title}
                        </span>
                        <span className="text-right text-base font-semibold leading-none tracking-[-0.02em] text-[#8B8D8E]">
                          {item.freelancer}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9A9C9D]">
                          {columns[1].title}
                        </span>
                        <span className="text-right text-base font-semibold leading-none tracking-[-0.02em] text-[#8B8D8E]">
                          {item.agency}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-4">
                        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9A9C9D]">
                          {columns[2].title}
                        </span>
                        <span className="text-right text-base font-bold leading-none tracking-[-0.02em] text-[#151719]">
                          {item.ours}
                        </span>
                      </div>
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