"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import TextReveal from "@/components/shared/textreveal/TextReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * VideoMarqueeSection (pin-at-center, then grow to full screen)
 * ----------------------------------------------------------------
 * Behavior:
 * - Section-e scroll kore dhoke shurute frame ta normal document flow-e
 *   move kore (fixed choto size, screenshot-er moto).
 * - Jokhon frame-tar center ekdom viewport-er center-e pouche jay,
 *   tokhon oita "pin" (lock) hoye jay — ei point porjonto ja dekhecho,
 *   shetai thake, kono change hoy na.
 * - Er por aro scroll korle (pin obostha-e thakakalin) frame ta
 *   gradually grow kore FULL SCREEN hoye jay (width 100%, padding 0,
 *   radius 0).
 * - Full screen howar por pin release hoy, r normal scroll continue kore.
 * - Marquee background pinned na — tai ota pinned frame-er niche diye
 *   normally scroll hote thake (jeta visually "video-r piche marquee
 *   move korche" effect create kore).
 *
 * Install koro (na thakle):
 *   npm install gsap lucide-react
 *
 * Usage:
 *   <VideoMarqueeSection
 *     videoSrc="/hero.mp4"
 *     marqueeWords={["Creative","Direction","Long-term","Growth","and","Ideas","Strategy"]}
 *   />
 */

interface VideoMarqueeSectionProps {
  videoSrc: string;
  posterSrc?: string;
  marqueeWords: string[];
  /** cycle-er jonno tailwind text color class-gula, order onujayi repeat hobe */
  wordColors?: string[];
  /** pin howar age frame koto % width e thakbe */
  initialWidthPercent?: number;
  /** base marquee speed (second) — beshi mane slower */
  baseDuration?: number;
  /** pin obosthay grow-korar shomoy marquee koto guun fast hobe */
  fastSpeedMultiplier?: number;
  /** pin obosthay grow-animation koto scroll-distance niye hobe (vh) */
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  const marqueeTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinWrapper = pinWrapperRef.current;
    const frame = frameRef.current;
    const inner = innerRef.current;
    const track = marqueeTrackRef.current;
    if (!section || !pinWrapper || !frame || !inner || !track) return;

    const ctx = gsap.context(() => {
      // infinite seamless marquee (track e content duibar render kora)
      marqueeTween.current = gsap.to(track, {
        xPercent: -50,
        duration: baseDuration,
        ease: "none",
        repeat: -1,
      });

      // fixed start state — choto card
      gsap.set(frame, {
        width: `${initialWidthPercent}%`,
        padding: 20,
        borderRadius: 32,
      });
      gsap.set(inner, { borderRadius: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: "center center", // frame-tar center viewport center-e pouchale pin shuru
          end: `+=${growDistanceVh}%`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            const target = gsap.utils.interpolate(
              1,
              fastSpeedMultiplier,
              self.progress
            );
            marqueeTween.current?.timeScale(target);
          },
          onLeave: () => marqueeTween.current?.timeScale(1),
          onLeaveBack: () => marqueeTween.current?.timeScale(1),
        },
      });

      tl.to(frame, { width: "100%", padding: 0, borderRadius: 0, ease: "none" }, 0);
      tl.to(inner, { borderRadius: 0, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, [baseDuration, initialWidthPercent, fastSpeedMultiplier, growDistanceVh]);

 
  return (
    <section
      ref={sectionRef}
      data-cursor-icon="play"
      className="relative w-full overflow-hidden bg-[#ffff]"
    >
     <div className="flex flex-col items-center max-w-[500px] mx-auto">
        <h4 className="text-2xl font-bold text-[#797B7C] mb-5">{"Why Us"}</h4>
                 <TextReveal
                  start="top 85%"
        end="top 55%"
        scrub={0.3}
                  as="h2" 
                 className="
                 text-center
           text-[112px] 
            text-[#222628]
            font-bold
            leading-[1.0]
            tracking-[-0.06em]
            whitespace-nowrap">
                  We Create Experiences <br/> That  Inspire, Engage.
                 </TextReveal>
     </div>
      {/* Pin wrapper — eta pin hoy, ete ekta full-viewport-height slot.
          Marquee ekhon eirI bhitore, tai video frame-er shathe SAME
          h-screen + items-center reference share kore — mane dujon
          shomoy always exact center-e alligned thakbe. */}
      <div
        ref={pinWrapperRef}
        className="relative flex h-screen w-full items-center justify-center"
      >
        {/* Background marquee text — frame-er thik piche, always vertically centered */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden">
          <div
            ref={marqueeTrackRef}
            className="flex items-center whitespace-nowrap will-change-transform"
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {marqueeWords.map((word, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className={`px-6 text-[9vw] font-bold leading-none ${
                      wordColors[i % wordColors.length]
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={frameRef}
          className="relative z-10 aspect-video overflow-hidden bg-slate-600 will-change-[width,padding,border-radius]"
        >
          <div ref={innerRef} className="relative h-full w-full overflow-hidden bg-white">
            <video
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

      
      </div>
    </section>
  );
}