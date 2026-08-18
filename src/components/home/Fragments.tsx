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
    id: "03",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "05",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "07",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "09",
    date: "DECEMBER\n12 — 25.2025",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function Fragments() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let resizeObserver: ResizeObserver | null = null;
    let loadHandler: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const cardElements = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null
      );

      /*
       * =====================================================
       * INITIAL STATE
       * =====================================================
       */

      gsap.set(cardElements, {
        xPercent: 110,
        force3D: true,
      });

      /*
       * =====================================================
       * CARD SLIDE
       * =====================================================
       */

      cardElements.forEach((card, index) => {
        const wrapper = card.parentElement;

        if (!wrapper) return;

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
         * =================================================
         * PREVIOUS CARD SCALE
         * =================================================
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
     * =====================================================
     * SAFE REFRESH
     * =====================================================
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
     * =====================================================
     * IMAGE LOAD
     * =====================================================
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
     * =====================================================
     * WINDOW LOAD
     * =====================================================
     */

    loadHandler = () => {
      safeRefresh();
    };

    window.addEventListener("load", loadHandler);

    /*
     * =====================================================
     * RESIZE OBSERVER
     * =====================================================
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
     * =====================================================
     * INITIAL REFRESH
     * =====================================================
     */

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    /*
     * =====================================================
     * CLEANUP
     * =====================================================
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

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-x-hidden
      
        text-black
        pt-20
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          px-5
          md:px-8
        "
      >
        <div>
          <h4
            className="
              mb-4
              text-xl
              font-bold
              text-[#797B7C]
              md:text-2xl
            "
          >
            {"Work's"}
          </h4>

          <h1
            data-cursor-text=" "
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
            Selected Works
          </h1>
        </div>
      </div>

      {/* =====================================================
          CARD STACK
      ====================================================== */}

      <div className="relative mt-[2vh]">
        {cards.map((card, index) => (
          /*
           * Reduced card-to-card scroll distance.
           */
          <div
            key={card.id}
            className="
              relative
              h-[68vh]
            "
          >
            {/* =================================================
                STICKY CARD
            ================================================== */}

            <div
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="
                sticky
                top-[12vh]

                mx-auto

                h-[54vh]
                w-[88vw]

                overflow-hidden

                border
                border-black/10

                bg-neutral-200

                shadow-[0_20px_60px_rgba(0,0,0,0.08)]

                will-change-transform

                md:h-[57vh]
                md:w-[72vw]
              "
              style={{
                zIndex: index + 1,
              }}
            >
              {/* =================================================
                  IMAGE
              ================================================== */}

              <img
                src={card.image}
                alt=""
                draggable={false}
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  select-none
                  object-cover
                "
              />

              {/* =================================================
                  IMAGE OVERLAY
              ================================================== */}

              <div
                className="
                  absolute
                  inset-0
                  bg-black/[0.03]
                "
              />

              {/* =================================================
                  DATE STRIP
              ================================================== */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  z-10

                  h-full
                  w-[72px]

                  bg-[#d94a2d]

                  md:w-[86px]
                "
              >
                <span
                  className="
                    absolute
                    left-1/2
                    top-6

                    -translate-x-1/2

                    whitespace-pre-line

                    text-center
                    text-[13px]
                    leading-[0.95]

                    text-white

                    [writing-mode:vertical-rl]
                    rotate-180
                  "
                >
                  {card.date}
                </span>
              </div>

              {/* =================================================
                  CARD NUMBER
              ================================================== */}

              <span
                className="
                  absolute
                  bottom-4
                  left-4
                  z-20

                  font-mono
                  text-[11px]

                  text-white
                  mix-blend-difference
                "
              >
                [{card.id}]
              </span>

              {/* =================================================
                  PLAY / PAUSE
              ================================================== */}

              {index === 0 && (
                <button
                  type="button"
                  aria-label="Pause"
                  className="
                    absolute
                    right-5
                    top-5
                    z-20

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-full

                    bg-black/80

                    backdrop-blur-md
                  "
                >
                  <span className="flex gap-[4px]">
                    <span className="h-5 w-[5px] rounded-full bg-white" />
                    <span className="h-5 w-[5px] rounded-full bg-white" />
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          BOTTOM SPACE
      ====================================================== */}

      <div className="h-[1vh]" />
    </section>
  );
}