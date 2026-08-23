"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: "01",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "02",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "03",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "04",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "05",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function SelectedWorks() {
  /*
   * ==========================================================
   * REFS
   * ==========================================================
   */

  const sectionRef = useRef<HTMLElement | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /*
   * ==========================================================
   * GSAP
   * ==========================================================
   */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    // Respect users who prefer reduced motion — skip the animation
    // entirely and just show the cards in place.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let resizeObserver: ResizeObserver | null = null;

    let loadHandler: (() => void) | null = null;

    /*
     * ========================================================
     * GSAP CONTEXT
     * ========================================================
     */

    const ctx = gsap.context(() => {
      const cardElements = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null
      );

      if (prefersReducedMotion) {
        gsap.set(cardElements, { xPercent: 0, force3D: true });
        return;
      }

      /*
       * ======================================================
       * INITIAL POSITION
       * ======================================================
       */

      // On small screens a full 110% slide-in can overshoot the
      // viewport and cause horizontal scroll jank — dial it back.
      const isMobile = window.innerWidth < 768;
      const startXPercent = isMobile ? 60 : 110;

      gsap.set(cardElements, {
        xPercent: startXPercent,
        force3D: true,
      });

      /*
       * ======================================================
       * CARD ANIMATION
       * ======================================================
       */

      cardElements.forEach((card, index) => {
        const wrapper = card.parentElement;

        if (!wrapper) return;

        /*
         * ====================================================
         * SLIDE CARD FROM RIGHT
         * ====================================================
         */

        gsap.to(card, {
          xPercent: 0,

          ease: "none",

          force3D: true,

          scrollTrigger: {
            trigger: wrapper,

            start: "top bottom",

            end: "top 18%",

            scrub: 1.1,

            invalidateOnRefresh: true,

            refreshPriority: -1,
          },
        });

        /*
         * ====================================================
         * PREVIOUS CARD SCALE
         * ====================================================
         */

        if (index > 0) {
          const previousCard = cardElements[index - 1];

          gsap.to(previousCard, {
            scale: 0.965,

            ease: "none",

            scrollTrigger: {
              trigger: wrapper,

              start: "top 68%",

              end: "top 38%",

              scrub: 1.1,

              invalidateOnRefresh: true,

              refreshPriority: -1,
            },
          });
        }
      });
    }, section);

    /*
     * ========================================================
     * SAFE SCROLLTRIGGER REFRESH
     * ========================================================
     */

    const safeRefresh = () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      refreshTimeout.current = setTimeout(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 50);
    };

    /*
     * ========================================================
     * IMAGE LOAD
     * ========================================================
     */

    const images = Array.from(
      section.querySelectorAll<HTMLImageElement>("img")
    );

    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", safeRefresh, {
          once: true,
        });
      }
    });

    /*
     * ========================================================
     * WINDOW LOAD
     * ========================================================
     */

    loadHandler = () => {
      safeRefresh();
    };

    window.addEventListener("load", loadHandler);

    /*
     * ========================================================
     * RESIZE OBSERVER — also triggers ScrollTrigger.refresh()
     * on orientation change / viewport resize so the animation
     * stays correct when a phone/tablet is rotated.
     * ========================================================
     */

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        safeRefresh();
      });

      resizeObserver.observe(section);

      Array.from(section.children).forEach((child) => {
        resizeObserver?.observe(child);
      });
    }

    /*
     * ========================================================
     * INITIAL REFRESH
     * ========================================================
     */

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      if (loadHandler) {
        window.removeEventListener("load", loadHandler);
      }

      images.forEach((image) => {
        image.removeEventListener("load", safeRefresh);
      });

      resizeObserver?.disconnect();

      ctx.revert();
    };
  }, []);

  /*
   * ==========================================================
   * JSX
   * ==========================================================
   */

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-x-hidden
        pt-12
        text-black
        sm:pt-16
        md:pt-20
      "
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className="
          relative
          z-10
          px-4
          sm:px-6
          md:px-12
          lg:px-20
        "
      >
        <div>
          <h4
            className="
              mb-2
              text-base
              font-bold
              text-[#797B7C]
              sm:mb-3
              sm:text-lg
              md:mb-4
              md:text-2xl
            "
          >
            {"Work's"}
          </h4>

          <h1
            className="
              mb-10
              whitespace-normal
              text-[13vw]
              font-bold
              leading-[0.95]
              tracking-[-0.04em]
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
            Selected Works
          </h1>
        </div>
      </div>

      {/* ======================================================
          CARDS
      ======================================================= */}

      <div className="relative mt-[1vh] sm:mt-[2vh]">
        {cards.map((card, index) => (
          /*
           * ====================================================
           * CARD WRAPPER
           * ====================================================
           */

          <div
            key={card.id}
            className="
              relative
              h-[46vh]
              sm:h-[58vh]
              md:h-[68vh]
            "
          >
            {/* ==================================================
                ACTUAL STICKY CARD
            =================================================== */}

            <div
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              data-cursor-text="View Case Study"
              data-cursor-icon="arrow"
              className="
                group

                sticky
                top-[8vh]

                mx-auto

                h-[38vh]
                w-[92vw]

                cursor-pointer

                overflow-hidden

                rounded-sm

                border
                border-black/10

                bg-neutral-200

                shadow-[0_10px_30px_rgba(0,0,0,0.08)]

                will-change-transform

                sm:top-[10vh]
                sm:h-[46vh]
                sm:w-[90vw]
                sm:shadow-[0_16px_45px_rgba(0,0,0,0.08)]

                md:top-[12vh]
                md:h-[54vh]
                md:w-[80vw]

                lg:h-[57vh]
                lg:w-[72vw]

                xl:w-[68vw]

                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
              "
              style={{
                zIndex: index + 1,
              }}
            >
              {/* ==================================================
                  IMAGE
              =================================================== */}

              <img
                src={card.image}
                alt={`Selected work ${card.id}`}
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  select-none
                  object-cover

                  transition-transform
                  duration-700
                  ease-out

                  group-hover:scale-[1.035]
                "
              />

              {/* ==================================================
                  IMAGE OVERLAY
              =================================================== */}

              <div
                className="
                  absolute
                  inset-0

                  bg-black/[0.03]

                  transition-all
                  duration-500

                  group-hover:bg-black/[0.14]
                "
              />

              {/* ==================================================
                  DATE STRIP
              =================================================== */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  z-10

                  h-full
                  w-[44px]

                  bg-[#050505]

                  sm:w-[58px]

                  md:w-[72px]

                  lg:w-[86px]
                "
              >
                <span
                  className="
                    absolute
                    left-1/2
                    top-3

                    -translate-x-1/2

                    whitespace-pre-line

                    text-center
                    text-[9px]
                    leading-[0.95]

                    text-white

                    [writing-mode:vertical-rl]
                    rotate-180

                    sm:top-5
                    sm:text-[11px]

                    md:top-6
                    md:text-[13px]
                  "
                >
                  {card.date}
                </span>
              </div>

              {/* ==================================================
                  CARD NUMBER
              =================================================== */}

              <span
                className="
                  absolute
                  bottom-3
                  left-3
                  z-20

                  font-mono
                  text-[9px]

                  text-white

                  mix-blend-difference

                  sm:bottom-4
                  sm:left-4
                  sm:text-[11px]
                "
              >
                [{card.id}]
              </span>

              {/* ==================================================
                  PLAY / PAUSE
              =================================================== */}

              {index === 0 && (
                <button
                  type="button"
                  aria-label="Pause"
                  className="
                    absolute
                    right-3
                    top-3
                    z-30

                    flex
                    h-9
                    w-9

                    items-center
                    justify-center

                    rounded-full

                    bg-black/80

                    backdrop-blur-md

                    transition-transform
                    duration-300

                    hover:scale-105

                    sm:right-4
                    sm:top-4
                    sm:h-10
                    sm:w-10

                    md:right-5
                    md:top-5
                    md:h-12
                    md:w-12
                  "
                >
                  <span className="flex gap-[3px] sm:gap-[4px]">
                    <span
                      className="
                        h-3.5
                        w-[3px]
                        rounded-full
                        bg-white

                        sm:h-4
                        sm:w-[4px]

                        md:h-5
                        md:w-[5px]
                      "
                    />

                    <span
                      className="
                        h-3.5
                        w-[3px]
                        rounded-full
                        bg-white

                        sm:h-4
                        sm:w-[4px]

                        md:h-5
                        md:w-[5px]
                      "
                    />
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          BOTTOM SPACE
      ======================================================= */}

      <div className="h-[1vh]" />
    </section>
  );
}