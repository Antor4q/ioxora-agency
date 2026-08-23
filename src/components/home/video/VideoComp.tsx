"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TextReveal from "@/components/shared/textreveal/TextReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface VideoMarqueeSectionProps {
  videoSrc: string;
  posterSrc?: string;
  marqueeWords: string[];
  wordColors?: string[];
  initialWidthPercent?: number;
  baseDuration?: number;
  fastSpeedMultiplier?: number;
  growDistanceVh?: number;
}

const DEFAULT_COLORS = [
  "text-neutral-300/50",
  "text-[#D5F139]",
  "text-neutral-300/50",
  "text-[#1A3A23]",
  "text-neutral-300/50",
];

export default function VideoComp({
  videoSrc,
  posterSrc,
  marqueeWords,
  wordColors = DEFAULT_COLORS,
  initialWidthPercent = 55,
  baseDuration = 30,
  fastSpeedMultiplier = 4,
  growDistanceVh = 100,
}: VideoMarqueeSectionProps) {
  const sectionRef =
    useRef<HTMLDivElement | null>(null);

  const pinWrapperRef =
    useRef<HTMLDivElement | null>(null);

  const frameRef =
    useRef<HTMLDivElement | null>(null);

  const innerRef =
    useRef<HTMLDivElement | null>(null);

  const marqueeTrackRef =
    useRef<HTMLDivElement | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const marqueeTween =
    useRef<gsap.core.Tween | null>(null);

  /* =====================================================
     SOUND STATE
  ===================================================== */

  const [isMuted, setIsMuted] = useState(true);

  /* =====================================================
     TOGGLE SOUND

     Video NEVER pauses.
  ===================================================== */

  const toggleSound = () => {
    const video = videoRef.current;

    if (!video) return;

    const nextMuted = !video.muted;

    video.muted = nextMuted;

    setIsMuted(nextMuted);
  };

  /* =====================================================
     VIDEO INITIAL STATE
  ===================================================== */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;

    setIsMuted(true);
  }, [videoSrc]);

  /* =====================================================
     SCROLLTRIGGER + MARQUEE
  ===================================================== */

  useEffect(() => {
    const section = sectionRef.current;
    const pinWrapper = pinWrapperRef.current;
    const frame = frameRef.current;
    const inner = innerRef.current;
    const track = marqueeTrackRef.current;

    if (
      !section ||
      !pinWrapper ||
      !frame ||
      !inner ||
      !track
    ) {
      return;
    }

    // Respect reduced-motion users: keep the frame/marquee static
    // and skip the pin/scrub animation entirely.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // On small screens the frame should start closer to full width
    // so the "grow" effect doesn't look like an awkward tiny box.
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 640;
    const isTablet =
      typeof window !== "undefined" &&
      window.innerWidth >= 640 &&
      window.innerWidth < 1024;

    const responsiveInitialWidth = isMobile
      ? 92
      : isTablet
      ? 78
      : initialWidthPercent;

    const responsivePadding = isMobile ? 8 : isTablet ? 14 : 20;
    const responsiveRadius = isMobile ? 16 : isTablet ? 24 : 32;

    const ctx = gsap.context(() => {
      /* =================================================
         INFINITE MARQUEE
      ================================================= */

      marqueeTween.current = gsap.to(track, {
        xPercent: -50,
        duration: baseDuration,
        ease: "none",
        repeat: -1,
      });

      if (prefersReducedMotion) {
        gsap.set(frame, {
          width: "100%",
          padding: 0,
          borderRadius: 0,
        });

        gsap.set(inner, {
          borderRadius: 0,
        });

        return;
      }

      /* =================================================
         INITIAL FRAME
      ================================================= */

      gsap.set(frame, {
        width: `${responsiveInitialWidth}%`,
        padding: responsivePadding,
        borderRadius: responsiveRadius,
      });

      gsap.set(inner, {
        borderRadius: Math.max(responsiveRadius - 12, 8),
      });

      /* =================================================
         PIN + FULLSCREEN
      ================================================= */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,

          start: "center center",

          end: `+=${growDistanceVh}%`,

          pin: true,

          pinSpacing: true,

          scrub: true,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const target =
              gsap.utils.interpolate(
                1,
                fastSpeedMultiplier,
                self.progress
              );

            marqueeTween.current?.timeScale(target);
          },

          onLeave: () => {
            marqueeTween.current?.timeScale(1);
          },

          onLeaveBack: () => {
            marqueeTween.current?.timeScale(1);
          },
        },
      });

      /* =================================================
         FRAME → 100%
      ================================================= */

      tl.to(
        frame,
        {
          width: "100%",
          padding: 0,
          borderRadius: 0,
          ease: "none",
        },
        0
      );

      /* =================================================
         INNER ROUNDED → SQUARE
      ================================================= */

      tl.to(
        inner,
        {
          borderRadius: 0,
          ease: "none",
        },
        0
      );
    }, section);

    // Recalculate on resize/orientation change so the frame's
    // starting width stays correct across breakpoints.
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      ctx.revert();

      marqueeTween.current?.kill();

      marqueeTween.current = null;
    };
  }, [
    baseDuration,
    initialWidthPercent,
    fastSpeedMultiplier,
    growDistanceVh,
  ]);

  return (
    <section
    id="approach"
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-white
      "
    >
      {/* =================================================
          HEADING
      ================================================== */}

      <div
        className="
          mx-auto
          flex
          max-w-[92%]
          flex-col
          items-center
          px-4
          pb-10
          pt-12

          sm:max-w-[560px]
          sm:px-6
          sm:pb-14
          sm:pt-16

          md:pb-16
          md:pt-20
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

            md:mb-5
            md:text-2xl
          "
        >
          Our Approach
        </h4>

        <h2
          className="
            whitespace-normal
            text-center
            text-[9vw]
            font-bold
            leading-[1.05]
            tracking-[-0.03em]
            text-[#222628]

            sm:text-[6.5vw]
            sm:leading-[1]
            sm:tracking-[-0.04em]

            md:text-[56px]
            md:tracking-[-0.05em]

            lg:text-[80px]

            xl:whitespace-nowrap
            xl:text-[112px]
            xl:tracking-[-0.06em]
          "
        >
          We Build Websites
          <br />
          That Do More.
        </h2>
      </div>

      {/* =================================================
          PIN WRAPPER
      ================================================== */}

      <div
        ref={pinWrapperRef}
        className="
          relative
          flex
          h-screen
          w-full
          items-center
          justify-center
        "
      >
        {/* =================================================
            MARQUEE
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            flex
            items-center
            overflow-hidden
          "
        >
          <div
            ref={marqueeTrackRef}
            className="
              flex
              items-center
              whitespace-nowrap
              will-change-transform
            "
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="
                  flex
                  items-center
                "
              >
                {marqueeWords.map((word, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className={`
                      px-3
                      text-[13vw]
                      font-bold
                      leading-none

                      sm:px-4
                      sm:text-[11vw]

                      md:px-6
                      md:text-[9vw]
                      ${
                        wordColors[
                          i % wordColors.length
                        ]
                      }
                    `}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            VIDEO FRAME

            SOUND OFF (isMuted = true):
            → cursor shows "Play Reel" text

            SOUND ON (isMuted = false):
            → "Play Reel" text hides
            → cursor becomes a simple dot

            *** CHANGE IS HERE ***
            data-cursor-text: empty string when unmuted, so
            your Cursor component hides the label.
            data-cursor-variant: new attribute — "text" when
            muted, "dot" when unmuted. Your global Cursor
            component needs to read this attribute and switch
            its render mode accordingly (small circle vs text
            pill). If your Cursor component uses a different
            attribute/prop name already, tell me its code and
            I'll match the names exactly.
        ================================================== */}

        <div
          ref={frameRef}
          data-cursor-text={isMuted ? "Play Reel" : undefined}
          data-cursor-icon={isMuted ? "play" : undefined}
          onClick={toggleSound}
          className="
            relative
            z-10
            aspect-video
            w-[92%]
            cursor-pointer
            overflow-hidden
            bg-slate-600
            will-change-[width,padding,border-radius]

            sm:w-[78%]

            lg:w-auto
          "
        >
          {/* =================================================
              VIDEO
          ================================================== */}

          <div
            ref={innerRef}
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-2xl
              bg-black

              sm:rounded-[20px]
            "
          >
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}