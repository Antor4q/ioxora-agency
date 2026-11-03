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

// How many times to repeat the logo set side by side.
// Logos are bigger now, so one set is wider and fewer copies would
// already cover most screens, but 6 keeps ultra-wide desktops safe
// (no blank gap before the loop wraps).
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

  // Measure the real rendered width of ONE set (plus the gap to the
  // next set) so the marquee loop stays seamless at any breakpoint.
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
        className={`flex w-max gap-4 sm:gap-6 md:gap-8 ${
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
            className="flex shrink-0 gap-4 sm:gap-6 md:gap-8"
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="
                  flex
                  h-14
                  w-36
                  shrink-0
                  items-center
                  justify-center

                  sm:h-16
                  sm:w-44

                  md:h-20
                  md:w-56
                "
              >
                {/* Always black & white: hover e kono color change nei */}
                <Image
                  src={logo}
                  alt=""
                  width={220}
                  height={70}
                  className="
                    h-auto
                    w-auto
                    max-h-9
                    max-w-full
                    object-contain
                    opacity-80
                    grayscale

                    sm:max-h-11

                    md:max-h-14
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
    <section className="relative overflow-hidden pb-10 pt-24 sm:pb-12 sm:pt-32 md:py-40">
      <div>
        {/* Label + description */}
        <div className="mb-10 px-4 text-center sm:mb-14 md:mb-16">
          <p className="mb-4 text-sm font-medium tracking-tight text-neutral-900 sm:text-base">
            [Brands]
          </p>
          <p className="mx-auto max-w-[40ch] text-balance text-xl font-medium leading-[1.25] tracking-[-0.02em] text-neutral-900 sm:text-2xl md:text-3xl">
            We have built websites for 32+ founders, startups and agencies
            worldwide, turning hard-to-explain products into sites people
            understand at first glance.
          </p>
        </div>

        <LogoRow logos={row1} />
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
          from-white
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
          from-white
          to-transparent

          sm:w-20

          md:w-32

          lg:w-40
        "
      />
    </section>
  );
}