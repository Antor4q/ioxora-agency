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
          py-5
          md:py-6
          will-change-transform
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
                px-4
                text-[clamp(2rem,4.5vw,5rem)]
                font-medium
                leading-[0.9]
                tracking-[-0.055em]
                text-[#797B7C]
                md:px-7
              "
            >
              {tech.name}
            </span>

            <span
              className="
                pointer-events-none
                mr-4
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-[#797B7C]/60
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
          px-20
          pb-24
          pt-28
          md:pb-32
          md:pt-40
        "
      >
        {/* =========================
            HEADER
        ========================== */}

        <div
          className="
            tech-header
            mb-24
            grid
            gap-10
            md:grid-cols-[1fr_auto]
            md:items-end
          "
        >
          <div>
            <h4
              className="
                tech-label
                mb-4
                text-xl
                font-bold
                text-[#797B7C]
                md:text-2xl
              "
            >
              Technology
            </h4>

            <h1
              data-cursor-text=" "
              className="
                whitespace-nowrap
                text-[15vw]
                font-bold
                leading-[0.88]
                tracking-[-0.06em]
                text-[#222628]
                md:text-[160px]
              "
            >
              What We Offer
            </h1>
          </div>

          <div className="max-w-[320px]">
            <p
              className="
                tech-label
                text-sm
                leading-relaxed
                text-[#797B7C]
                md:text-base
              "
            >
              The technologies behind our digital
              experiences, products and interactive
              web applications.
            </p>
          </div>
        </div>

        {/* =========================
            FRONTEND
        ========================== */}

        <div
          className="
            tech-category
            mb-4
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3
          "
        >
          <span
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#797B7C]
            "
          >
            Frontend
          </span>

          <span className="text-xs text-[#797B7C]/50">
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
            mb-4
            mt-10
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3
          "
        >
          <span
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#797B7C]
            "
          >
            Backend & Database
          </span>

          <span className="text-xs text-[#797B7C]/50">
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
            mb-4
            mt-10
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3
          "
        >
          <span
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#797B7C]
            "
          >
            Motion & 3D
          </span>

          <span className="text-xs text-[#797B7C]/50">
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
            mb-4
            mt-10
            flex
            items-center
            justify-between
            border-b
            border-[#797B7C]/20
            pb-3
          "
        >
          <span
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#797B7C]
            "
          >
            Tools
          </span>

          <span className="text-xs text-[#797B7C]/50">
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