"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Tech = {
  name: string;
  category: string;
};

const frontend: Tech[] = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
];

const backend: Tech[] = [
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Firebase", category: "Backend" },
  { name: "REST API", category: "Backend" },
];

const motion: Tech[] = [
  { name: "GSAP", category: "Animation" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Three.js", category: "3D / WebGL" },
  { name: "WebGL", category: "3D / WebGL" },
];

const tools: Tech[] = [
  { name: "Git", category: "Development" },
  { name: "GitHub", category: "Development" },
  { name: "Vercel", category: "Deployment" },
  { name: "Stripe", category: "Payments" },
  { name: "Figma", category: "Design" },
];

const Row = ({
  items,
  direction = 1,
  index,
}: {
  items: Tech[];
  direction?: 1 | -1;
  index: number;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const xRef = useRef(0);
  const widthRef = useRef(0);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startPosition: 0,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const row = rowRef.current;

    if (!wrapper || !row) return;

    const ctx = gsap.context(() => {
      const setupLoop = () => {
        /*
         * We render the same items 4 times.
         * One copy width = total width / 4.
         */
        widthRef.current = row.scrollWidth / 4;

        gsap.set(row, {
          x: 0,
        });
      };

      setupLoop();

      /*
       * -----------------------------
       * SEAMLESS LOOP
       * -----------------------------
       */
      const normalizeX = () => {
        const width = widthRef.current;

        if (!width) return;

        /*
         * Moving LEFT
         */
        if (xRef.current <= -width) {
          xRef.current += width;
        }

        /*
         * Moving RIGHT
         */
        if (xRef.current >= 0) {
          xRef.current -= width;
        }
      };

      const render = () => {
        normalizeX();

        gsap.set(row, {
          x: xRef.current,
        });
      };

      /*
       * -----------------------------
       * SCROLL
       * -----------------------------
       */

      let previousScroll = window.scrollY;

      const scrollTrigger = ScrollTrigger.create({
        trigger: wrapper,

        start: "top bottom",
        end: "bottom top",

        onUpdate: () => {
          if (dragRef.current.active) return;

          const currentScroll = window.scrollY;

          const scrollDelta =
            currentScroll - previousScroll;

          previousScroll = currentScroll;

          /*
           * Slow marquee movement
           *
           * direction 1  = right
           * direction -1 = left
           */
          xRef.current +=
            scrollDelta *
            0.45 *
            direction;

          render();
        },
      });

      /*
       * -----------------------------
       * DRAG START
       * -----------------------------
       */

      const handlePointerDown = (
        event: PointerEvent
      ) => {
        dragRef.current.active = true;

        dragRef.current.startX =
          event.clientX;

        dragRef.current.startPosition =
          xRef.current;

        wrapper.setPointerCapture(
          event.pointerId
        );

        wrapper.style.cursor = "grabbing";
      };

      /*
       * -----------------------------
       * DRAG MOVE
       * -----------------------------
       */

      const handlePointerMove = (
        event: PointerEvent
      ) => {
        if (!dragRef.current.active) return;

        const delta =
          event.clientX -
          dragRef.current.startX;

        xRef.current =
          dragRef.current.startPosition +
          delta;

        render();
      };

      /*
       * -----------------------------
       * DRAG END
       * -----------------------------
       */

      const handlePointerUp = (
        event: PointerEvent
      ) => {
        dragRef.current.active = false;

        try {
          wrapper.releasePointerCapture(
            event.pointerId
          );
        } catch {}

        wrapper.style.cursor = "grab";
      };

      wrapper.addEventListener(
        "pointerdown",
        handlePointerDown
      );

      wrapper.addEventListener(
        "pointermove",
        handlePointerMove
      );

      wrapper.addEventListener(
        "pointerup",
        handlePointerUp
      );

      wrapper.addEventListener(
        "pointercancel",
        handlePointerUp
      );

      /*
       * -----------------------------
       * RESIZE
       *
       * Also recalc on viewport resize/orientation change —
       * the row's rendered width (and therefore the loop-reset
       * point) changes when clamp()-based font sizes respond
       * to a new breakpoint.
       * -----------------------------
       */

      const resizeObserver =
        new ResizeObserver(() => {
          widthRef.current =
            row.scrollWidth / 4;
        });

      resizeObserver.observe(row);

      wrapper.style.cursor = "grab";

      /*
       * Important:
       * pan-y allows vertical page scrolling
       * while horizontal dragging still works.
       */
      wrapper.style.touchAction = "pan-y";

      return () => {
        scrollTrigger.kill();

        wrapper.removeEventListener(
          "pointerdown",
          handlePointerDown
        );

        wrapper.removeEventListener(
          "pointermove",
          handlePointerMove
        );

        wrapper.removeEventListener(
          "pointerup",
          handlePointerUp
        );

        wrapper.removeEventListener(
          "pointercancel",
          handlePointerUp
        );

        resizeObserver.disconnect();
      };
    }, wrapperRef);

    return () => ctx.revert();
  }, [direction]);

  /*
   * 4 copies
   */
  const repeatedItems = [
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  return (
    <div
      ref={wrapperRef}
      className="
        w-full
        overflow-hidden
        border-t
        border-[#797B7C]/20
        select-none
      "
      data-row={index}
    >
      <div
        ref={rowRef}
        className="
          flex
          w-max
          items-center
          whitespace-nowrap
          py-4
          will-change-transform

          sm:py-5

          md:py-6
        "
      >
        {repeatedItems.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="
              flex
              shrink-0
              items-center
            "
          >
            <span
              className="
                pointer-events-none
                px-3
                text-[clamp(0.85rem,4.5vw,3rem)]
                font-medium
                leading-[0.9]
                tracking-[-0.04em]
                text-[#797B7C]

                sm:px-4
                sm:text-[clamp(1rem,3vw,3rem)]
                sm:tracking-[-0.05em]

                md:px-7
                md:tracking-[-0.055em]
              "
            >
              {tech.name}
            </span>

            <span
              className="
                pointer-events-none
                mr-3
                h-1
                w-1
                shrink-0
                rounded-full
                bg-[#797B7C]/60

                sm:mr-4
                sm:h-1.5
                sm:w-1.5

                md:mr-7
                md:h-2
                md:w-2
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /*
       * Header reveal
       */
      gsap.from(".tech-header", {
        y: 70,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      /*
       * Small labels
       */
      gsap.from(".tech-label", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      /*
       * Category labels
       */
      gsap.from(".tech-category", {
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",

        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-[#050505]
      "
    >
      <div
        className="
          w-full
          px-5
          pb-16
          pt-16

          sm:px-8
          sm:pb-20
          sm:pt-20

          md:px-12
          md:pb-32
          md:pt-40

          lg:px-16

          xl:px-20
        "
      >
        {/* =========================
            HEADER
        ========================== */}

        <div className="tech-header">
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
              Technology
            </h4>

            <h1
              className="
                whitespace-normal
                text-[13vw]
                font-bold
                leading-[0.95]
                tracking-[-0.03em]
                text-[#BFC4BF]

                sm:text-[64px]
                sm:leading-[0.92]
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
              Our Tech Stack
            </h1>
          </div>
        </div>

        {/* =========================
            FRONTEND
        ========================== */}

        <div
          className="
            tech-category
            mb-3
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3

            sm:mb-4
          "
        >
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.15em]
              text-[#797B7C]

              sm:text-xs
              sm:tracking-[0.2em]
            "
          >
            Frontend
          </span>

          <span className="text-[10px] text-[#797B7C]/50 sm:text-xs">
            01
          </span>
        </div>

        <Row
          items={frontend}
          direction={1}
          index={1}
        />

        {/* =========================
            BACKEND
        ========================== */}

        <div
          className="
            tech-category
            mb-3
            mt-8
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3

            sm:mb-4
            sm:mt-10
          "
        >
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.15em]
              text-[#797B7C]

              sm:text-xs
              sm:tracking-[0.2em]
            "
          >
            Backend & Database
          </span>

          <span className="text-[10px] text-[#797B7C]/50 sm:text-xs">
            02
          </span>
        </div>

        <Row
          items={backend}
          direction={-1}
          index={2}
        />

        {/* =========================
            MOTION
        ========================== */}

        <div
          className="
            tech-category
            mb-3
            mt-8
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3

            sm:mb-4
            sm:mt-10
          "
        >
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.15em]
              text-[#797B7C]

              sm:text-xs
              sm:tracking-[0.2em]
            "
          >
            Motion & 3D
          </span>

          <span className="text-[10px] text-[#797B7C]/50 sm:text-xs">
            03
          </span>
        </div>

        <Row
          items={motion}
          direction={1}
          index={3}
        />

        {/* =========================
            TOOLS
        ========================== */}

        <div
          className="
            tech-category
            mb-3
            mt-8
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3

            sm:mb-4
            sm:mt-10
          "
        >
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.15em]
              text-[#797B7C]

              sm:text-xs
              sm:tracking-[0.2em]
            "
          >
            Tools
          </span>

          <span className="text-[10px] text-[#797B7C]/50 sm:text-xs">
            04
          </span>
        </div>

        <Row
          items={tools}
          direction={-1}
          index={4}
        />
      </div>

      {/* Bottom line */}
      <div className="h-px w-full bg-[#797B7C]/20" />
    </section>
  );
}