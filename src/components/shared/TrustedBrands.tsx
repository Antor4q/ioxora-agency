
"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const row1 = [
  "/brands/bran1.png",
  "/brands/bran2.png",
  "/brands/bran3.png",
  "/brands/bran4.png",
  "/brands/bran5.png",
  "/brands/bran6.png",
  "/brands/bran7.png",
  "/brands/bran8.png",
  "/brands/bran9.png",
  "/brands/bran10.png",
  "/brands/bran11.png",
  "/brands/bran12.png",
  "/brands/bran13.png",
  "/brands/brand1.png",
];

const SPEED_MOBILE = 40;
const SPEED_DESKTOP = 60;

function LogoRow({
  logos,
  reverse = false,
}: {
  logos: string[];
  reverse?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const [distance, setDistance] = useState(0);
  const [copies, setCopies] = useState(3);
  const [speed, setSpeed] = useState(SPEED_MOBILE);

  useEffect(() => {
    const container = containerRef.current;
    const firstSet = firstSetRef.current;

    if (!container || !firstSet) return;

    let frame = 0;

    const measure = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const setWidth = firstSet.getBoundingClientRect().width;
        const containerWidth = container.getBoundingClientRect().width;

        if (!setWidth || !containerWidth) return;

        // Exact width of one complete logo set, including trailing gap.
        setDistance(setWidth);

        // Enough repeated sets to cover the viewport during animation.
        const requiredCopies = Math.max(
          2,
          Math.ceil(containerWidth / setWidth) + 2
        );

        setCopies(requiredCopies);

        setSpeed(
          window.innerWidth >= 768
            ? SPEED_DESKTOP
            : SPEED_MOBILE
        );
      });
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(container);
    observer.observe(firstSet);

    window.addEventListener("resize", measure);

    const images = firstSet.querySelectorAll("img");

    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", measure);
        img.addEventListener("error", measure);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);

      images.forEach((img) => {
        img.removeEventListener("load", measure);
        img.removeEventListener("error", measure);
      });
    };
  }, [logos]);

  const marqueeStyle = {
    "--marquee-distance": `${distance}px`,
    animationDuration: distance
      ? `${distance / speed}s`
      : undefined,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
    >
      <div
        className={`brands-marquee-track flex w-max ${
          distance
            ? reverse
              ? "brands-marquee-reverse"
              : "brands-marquee"
            : ""
        }`}
        style={marqueeStyle}
      >
        {Array.from({ length: copies }, (_, copyIndex) => (
          <div
            key={copyIndex}
            ref={copyIndex === 0 ? firstSetRef : null}
            aria-hidden={copyIndex > 0}
            className="flex shrink-0 gap-3 pr-3 sm:gap-6 sm:pr-6 md:gap-8 md:pr-8"
          >
            {logos.map((logo, index) => (
              <div
                key={`${copyIndex}-${index}`}
                className="flex h-12 w-28 shrink-0 items-center justify-center sm:h-14 sm:w-40 md:h-20 md:w-52 lg:w-56"
              >
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
      <div className="mb-8 px-5 text-center sm:mb-12 sm:px-6 md:mb-16">
        <p className="mb-3 text-sm font-medium tracking-tight text-neutral-900 sm:mb-4 sm:text-base">
          [Brands]
        </p>

        <p className="mx-auto max-w-[40ch] text-balance text-xl font-medium leading-[1.25] tracking-[-0.02em] text-neutral-900 sm:text-2xl md:text-3xl lg:text-4xl">
          We have built websites and tools for 105+ founders, startups and agencies
          worldwide, turning hard-to-explain products into sites people
          understand at first glance.
        </p>
      </div>

      <LogoRow logos={row1} />

      {/* Edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(1.5rem,10vw,10rem)] bg-gradient-to-r from-white to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(1.5rem,10vw,10rem)] bg-gradient-to-l from-white to-transparent" />
    </section>
  );
}
