"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cardElements = cardRefs.current;

      cardElements.forEach((card, index) => {
        if (!card) return;

        /*
         * =====================================================
         * INITIAL STATE
         * =====================================================
         * EVERY card starts from the right — first card included.
         */
        gsap.set(card, {
          xPercent: 110,
        });

        /*
         * =====================================================
         * CARD ENTRANCE (Right → Center)
         * =====================================================
         * Same entrance animation for every card.
         */
        gsap.to(card, {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card.parentElement,
            start: "top top+=150",
            end: "bottom top+=150",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });

        /*
         * =====================================================
         * PREVIOUS CARD SCALE
         * =====================================================
         */
        if (index < cardElements.length - 1) {
          gsap.to(card, {
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: card.parentElement,
              start: "bottom 70%",
              end: "bottom 30%",
              scrub: 1.5,
            },
          });
        }
      });

      // Image load howar age height bhul calculate hote pare,
      // tai ekbar refresh kore nichchi
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [imagesLoaded]); // image load hole re-run hoye ScrollTrigger recalculate hobe

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-x-hidden
        bg-[#f1f1eb]
        text-black

        py-24
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
        <div className="flex items-start justify-between">
          <h2
            className="
              font-serif
              text-[17vw]
              leading-[0.72]
              tracking-[-0.08em]
            "
          >
            FRAGMENTS
          </h2>

          <div
            className="
              hidden
              pt-1
              text-[13px]
              leading-[1.15]
              md:block
            "
          >
            <p>
              Small fragments of
              <br />
              everyday life woven
              <br />
              into one evolving story.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-lg">→</span>

              <span>Previous</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CARD STACK
      ====================================================== */}

      <div className="relative mt-[8vh]">
        {cards.map((card, index) => (
          /*
           * Each wrapper creates vertical
           * scrolling space for one card.
           *
           * h-[100vh] -> sticky top-[18vh] + card height (~62vh)
           * er jonno enough scroll room dorkar, nahole card
           * center e settle howar age animation snap kore jay.
           * (h-[85vh] chilo, oita eijonnoi card center e
           * thik moto visible hocchilo na.)
           */

          <div
            key={card.id}
            className="
              relative
              h-[100vh]
            "
          >
            {/*
             * =================================================
             * CARD
             *
             * Only the individual card is sticky.
             * Section is NOT sticky.
             * =================================================
             */}

            <div
              ref={(el) => {
                if (el) {
                  cardRefs.current[index] = el;
                }
              }}
              className="
                sticky
                top-[18vh]
                mx-auto

                h-[58vh]
                w-[78vw]

                overflow-hidden

                border
                border-black/10

                bg-neutral-200

                shadow-[0_20px_60px_rgba(0,0,0,0.08)]

                will-change-transform

                md:h-[62vh]
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
                onLoad={handleImageLoad}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
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
          BOTTOM INFO
          - Shudhu title thakbe, extra "[ 01 — 09 ]" bad
      ====================================================== */}

      <div
        className="
          relative
          z-30

          mx-5

          border-t
          border-black/40

          py-3

          font-mono
          text-[9px]

          uppercase

          md:mx-8
        "
      >
        <span>Fragments / 2025</span>
      </div>
    </section>
  );
}