"use client";

import Image from "next/image";

const row1 = [
    "/brands/brand1.avif",
    "/brands/brand2.avif",
    "/brands/brand3.avif",
    "/brands/brand4.avif",
    "/brands/brand5.avif",
    "/brands/brand6.avif",
    
 
];

const row2 = [
 "/brands/brand7.avif",
 "/brands/brand8.avif",
 "/brands/brand9.avif",
 "/brands/brand10.avif",
 "/brands/brand11.avif",
 "/brands/brand12.avif",
];

function LogoRow({
  logos,
  reverse = false,
}: {
  logos: string[];
  reverse?: boolean;
}) {
  const items = [...logos, ...logos];

  return (
    <div className="relative ">
      <div
        className={`flex w-max gap-6 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {items.map((logo, index) => (
          <div
            key={index}
            className="flex h-14 w-44 shrink-0 items-center justify-center"
          >
            <Image
              src={logo}
              alt=""
              width={160}
              height={50}
              className="h-auto w-auto max-h-10 object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustedBrands() {
  return (
    <section className="overflow-hidden py-14">

      <div className="mx-auto max-w-7xl">

        <p className="mb-14 text-center text-xs font-bold uppercase tracking-[0.35em] text-neutral-900">
          Trusted by 300+ Global Brands
        </p>

        <LogoRow logos={row1} />

        <div className="mt-12">
          <LogoRow logos={row2} reverse />
        </div>

      </div>

      {/* Fade Left */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-[#fafaf8] to-transparent" />

      {/* Fade Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-[#fafaf8] to-transparent" />
    </section>
  );
}