"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const row1 = [
  "/brands/brand1.png",
  "/brands/brand2.png",
  "/brands/brand3.jpg",
  "/brands/brand4.png",
  "/brands/brand5.png",
  "/brands/brand6.png",
];

const row2 = [
  "/brands/brand1.png",
  "/brands/brand2.png",
  "/brands/brand3.jpg",
  "/brands/brand4.png",
  "/brands/brand5.png",
  "/brands/brand6.png",
];

// How many times to repeat the logo set side by side.
// Needs to be wide enough that the total track width comfortably
// exceeds the widest screen you support — otherwise, on very wide
// viewports, the track runs out of content mid-loop and a blank gap
// shows before it wraps back to the start. Bumped up from 4 to 6
// since logos now render smaller on mobile, meaning a single set is
// narrower and needs more copies to cover ultra-wide desktop screens.
const COPIES = 6;

function LogoRow({
  logos,
  reverse = false,
}: {
  logos: string[];
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);

  // Measure the actual rendered width of ONE set of logos (plus the
  // gap connecting it to the next set). This replaces any hardcoded
  // percentage/pixel math — it stays correct no matter how many logos
  // there are, what size the images render at, or what the gap is
  // (which now changes across breakpoints).
  useEffect(() => {
    const trackEl = trackRef.current;
    const setEl = firstSetRef.current;
    if (!trackEl || !setEl) return;

    const measure = () => {
      const trackGap =
        parseFloat(getComputedStyle(trackEl).columnGap) ||
        parseFloat(getComputedStyle(trackEl).gap) ||
        0;
      setDistance(setEl.getBoundingClientRect().width + trackGap);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(setEl);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [logos]);

  return (
    <div className="relative overflow-hidden">
      <div
        ref={trackRef}
        className={`flex w-max gap-4 sm:gap-5 md:gap-6 ${
          distance
            ? reverse
              ? "animate-marquee-reverse"
              : "animate-marquee"
            : ""
        }`}
        style={
          {
            "--marquee-distance": `${distance}px`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: COPIES }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            ref={copyIndex === 0 ? firstSetRef : undefined}
            className="flex shrink-0 gap-4 sm:gap-5 md:gap-6"
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="
                  flex
                  h-10
                  w-28
                  shrink-0
                  items-center
                  justify-center

                  sm:h-12
                  sm:w-36

                  md:h-14
                  md:w-44
                "
              >
                <Image
                  src={logo}
                  alt=""
                  width={160}
                  height={50}
                  className="
                    h-auto
                    w-auto
                    max-h-7
                    object-contain
                    opacity-70
                    grayscale
                    transition-all
                    duration-300
                    hover:opacity-100
                    hover:grayscale-0

                    sm:max-h-8

                    md:max-h-10
                  "
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustedBrands() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 md:py-14">
      <div className="">
        <p
          className="
            mb-8
            px-4
            text-center
            text-[10px]
            font-bold
            uppercase
            tracking-[0.25em]
            text-neutral-900

            sm:mb-10
            sm:text-xs
            sm:tracking-[0.3em]

            md:mb-14
            md:tracking-[0.35em]
          "
        >
          Trusted by 32+ Global Brands
        </p>

        <LogoRow logos={row1} />

        <div className="mt-8 sm:mt-10 md:mt-12">
          <LogoRow logos={row2} reverse />
        </div>
      </div>

      {/* Fade Left */}
      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-10
          h-full
          w-10
          bg-gradient-to-r
          from-[#fafaf8]
          to-transparent

          sm:w-20

          md:w-32

          lg:w-40
        "
      />

      {/* Fade Right */}
      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          z-10
          h-full
          w-10
          bg-gradient-to-l
          from-[#fafaf8]
          to-transparent

          sm:w-20

          md:w-32

          lg:w-40
        "
      />
    </section>
  );
}