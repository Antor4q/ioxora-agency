"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const row1 = [
  "/brands/brand1.png",
  "/brands/brand2.png",
  "/brands/brand3.jpg",
  "/brands/brand4.png",
  "/brands/brand5.png",
  "/brands/brand6.png",
];

// px/second: shob device e same gotite chole
const SPEED_MOBILE = 40;
const SPEED_DESKTOP = 60;

function LogoRow({
  logos,
  reverse = false,
}: {
  logos: string[];
  reverse?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [copies, setCopies] = useState(3);
  const [speed, setSpeed] = useState(SPEED_MOBILE);

  // Ekta set er real width + koyta copy lagbe ta measure kori
  useEffect(() => {
    const container = containerRef.current;
    const setEl = firstSetRef.current;
    if (!container || !setEl) return;

    const measure = () => {
      const setW = setEl.getBoundingClientRect().width;
      const containerW = container.getBoundingClientRect().width;
      if (!setW) return;

      setDistance(setW);
      // container cover korte + 1 extra, jate wrap er somoy gap na thake
      setCopies(Math.max(2, Math.ceil(containerW / setW) + 1));
      setSpeed(window.innerWidth >= 768 ? SPEED_DESKTOP : SPEED_MOBILE);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(setEl);

    // logo load hole width bodlate pare
    const imgs = setEl.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", measure));

    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [logos]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div
        className={`flex w-max will-change-transform motion-reduce:animate-none ${
          distance
            ? reverse
              ? "animate-marquee-reverse"
              : "animate-marquee"
            : ""
        }`}
        style={
          {
            "--marquee-distance": `${distance}px`,
            animationDuration: distance ? `${distance / speed}s` : undefined,
          } as CSSProperties
        }
      >
        {Array.from({ length: copies }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            ref={copyIndex === 0 ? firstSetRef : undefined}
            aria-hidden={copyIndex > 0}
            // gap set er bhitore, trailing gap padding-right e: distance = exact set width
            className="flex shrink-0 gap-3 pr-3 sm:gap-6 sm:pr-6 md:gap-8 md:pr-8"
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex h-12 w-28 shrink-0 items-center justify-center sm:h-14 sm:w-40 md:h-20 md:w-52 lg:w-56"
              >
                {/* Always black & white */}
                <Image
                  src={logo}
                  alt=""
                  width={220}
                  height={70}
                  draggable={false}
                  className="h-auto max-h-8 w-auto max-w-full select-none object-contain opacity-80 grayscale sm:max-h-10 md:max-h-14"
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
    <section
      aria-label="Brands we have worked with"
      className="relative overflow-hidden py-16 sm:py-24 md:py-32 lg:py-40"
    >
      {/* Label + description */}
      <div className="mb-8 px-5 text-center sm:mb-12 sm:px-6 md:mb-16">
        <p className="mb-3 text-sm font-medium tracking-tight text-neutral-900 sm:mb-4 sm:text-base">
          [Brands]
        </p>
        <p className="mx-auto max-w-[40ch] text-balance text-xl font-medium leading-[1.25] tracking-[-0.02em] text-neutral-900 sm:text-2xl md:text-3xl lg:text-4xl">
          We have built websites for 32+ founders, startups and agencies
          worldwide, turning hard-to-explain products into sites people
          understand at first glance.
        </p>
      </div>

      <LogoRow logos={row1} />

      {/* Fade edges: clamp diye fluid width */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(1.5rem,10vw,10rem)] bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(1.5rem,10vw,10rem)] bg-gradient-to-l from-white to-transparent" />
    </section>
  );
}