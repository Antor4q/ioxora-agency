"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";

const industries = [
  {
    id: "startups",
    name: "STARTUPS",
    number: "01",
    image: "/images/industries/startups.jpg",
    description:
      "Digital experiences for ambitious teams moving fast and building what comes next.",
    position: "top-[2%] right-[2%] md:right-[5%]",
  },
  {
    id: "saas",
    name: "SAAS",
    number: "02",
    image: "/images/industries/saas.jpg",
    description:
      "Clear, scalable experiences that make complex products feel simple and intuitive.",
    position: "top-[42%] left-[1%] md:left-[4%]",
  },
  {
    id: "ai-tech",
    name: "AI & TECH",
    number: "03",
    image: "/images/industries/ai-tech.jpg",
    description:
      "Thoughtful digital products that help powerful technology feel human and useful.",
    position: "bottom-[24%] right-[1%] md:right-[4%]",
  },
  {
    id: "ecommerce",
    name: "E-COMMERCE",
    number: "04",
    image: "/images/industries/ecommerce.jpg",
    description:
      "High-performing commerce experiences designed to turn attention into action.",
    position: "bottom-[4%] right-[22%] md:right-[24%]",
  },
];

export default function IndustriesWeServe() {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = industries[activeIndex];

  const handleIndustryChange = (index: number) => {
    if (index === activeIndex) return;

    const imageEl = imageRef.current;
    const contentEl = contentRef.current;

    if (!imageEl || !contentEl) {
      setActiveIndex(index);
      return;
    }

    const others = itemRefs.current.filter(
      (_, itemIndex) => itemIndex !== index
    );

    const tl = gsap.timeline();

    tl.to(
      others,
      {
        opacity: 0.3,
        duration: 0.2,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      imageEl,
      {
        opacity: 0,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
      },
      0
    );

    tl.to(
      contentEl,
      {
        opacity: 0,
        y: 10,
        duration: 0.18,
        ease: "power2.in",
      },
      0
    );

    tl.add(() => {
      setActiveIndex(index);
    });

    tl.to(
      itemRefs.current[index],
      {
        opacity: 1,
        duration: 0.1,
      },
      0.25
    );

    tl.fromTo(
      imageEl,
      {
        opacity: 0,
        scale: 1.04,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
      },
      0.28
    );

    tl.fromTo(
      contentEl,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      },
      0.4
    );
  };

  const handleLeave = () => {
    gsap.to(itemRefs.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <section className="overflow-hidden bg-[#171918] px-5 py-20 text-[#ecece7] md:px-10 md:py-24 lg:px-[4.5vw]">
      <div className="mx-auto max-w-[1800px]">
        {/* Section label */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
            07 — INDUSTRIES WE SERVE
          </p>

          <p className="hidden text-[10px] uppercase tracking-[0.3em] text-white/30 md:block">
            HOVER TO EXPLORE
          </p>
        </div>

        {/* HEADING - completely separate */}
        <div className="mt-12 max-w-[520px] md:mt-16">
          <h2 className="text-[clamp(2.8rem,4.8vw,5.8rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
            BUILT FOR
            <br />
            AMBITIOUS
            <br />
            BUSINESSES.
          </h2>
        </div>

        {/* GAP + INTERACTIVE AREA */}
        <div
          className="relative mt-20 h-[460px] md:mt-24 md:h-[500px]"
          onMouseLeave={handleLeave}
        >
          {/* Main Image */}
          <div className="absolute left-1/2 top-[44%] h-[280px] w-[48%] min-w-[380px] -translate-x-1/2 -translate-y-1/2 overflow-hidden md:h-[340px] md:min-w-[460px] lg:h-[370px]">
            <div
              ref={imageRef}
              className="relative h-full w-full overflow-hidden"
            >
              <Image
                key={active.image}
                src={active.image}
                alt={active.name}
                fill
                priority
                className="object-cover grayscale-[20%]"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute left-5 top-5 md:left-7 md:top-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  ioXora / {active.name}
                </p>
              </div>

              <span className="absolute bottom-5 right-5 text-[clamp(3.5rem,6vw,6.5rem)] font-medium leading-none tracking-[-0.09em] text-white/70">
                {active.number}
              </span>
            </div>
          </div>

          {/* Floating Industry Names */}
          {industries.map((industry, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={industry.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onMouseEnter={() => handleIndustryChange(index)}
                onFocus={() => handleIndustryChange(index)}
                onClick={() => handleIndustryChange(index)}
                className={`absolute z-20 whitespace-nowrap text-left font-medium leading-none tracking-[-0.055em] transition-all duration-300 ${
                  industry.position
                } ${
                  isActive
                    ? "scale-105 text-[clamp(1.5rem,2.6vw,3.2rem)] text-white"
                    : "text-[clamp(1rem,1.6vw,1.9rem)] text-white/60 hover:scale-105 hover:text-white"
                }`}
              >
                {industry.name}

                <span
                  className={`mt-3 block h-px bg-white transition-all duration-500 ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}

          {/* Description */}
          <div
            ref={contentRef}
            className="absolute bottom-0 left-0 max-w-[360px] border-t border-white/15 pt-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">
              {active.number} / {active.name}
            </p>

            <p className="mt-4 text-[14px] leading-[1.7] text-white/60 md:text-[15px]">
              {active.description}
            </p>
          </div>

          <p className="absolute bottom-1 right-0 hidden max-w-[220px] text-right text-[10px] uppercase leading-[1.8] tracking-[0.25em] text-white/25 md:block">
            DIFFERENT INDUSTRIES.
            <br />
            ONE THOUGHTFUL APPROACH.
          </p>
        </div>
      </div>
    </section>
  );
}