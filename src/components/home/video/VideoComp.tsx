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

      /* =================================================
         INITIAL FRAME
      ================================================= */

      gsap.set(frame, {
        width: `${initialWidthPercent}%`,
        padding: 20,
        borderRadius: 32,
      });

      gsap.set(inner, {
        borderRadius: 20,
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
         FRAME 55% → 100%
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

    return () => {
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
          max-w-[500px]
          flex-col
          items-center
          px-6
          pb-16
          pt-20
        "
      >
        <h4
          className="
            mb-5
            text-2xl
            font-bold
            text-[#797B7C]
          "
        >
          Our Approach
        </h4>
     <h2 className="
            whitespace-nowrap
            text-center
            text-[112px]
            font-bold
            leading-[1]
            tracking-[-0.06em]
            text-[#222628]
          ">
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
                      px-6
                      text-[9vw]
                      font-bold
                      leading-none
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
            cursor-pointer
            overflow-hidden
            bg-slate-600
            will-change-[width,padding,border-radius]
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
              rounded-[20px]
              bg-black
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