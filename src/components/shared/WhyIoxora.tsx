"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";

const reasons = [
  {
    id: "strategy",
    label: "STRATEGY",
    title: "EVERYTHING STARTS WITH",
    description:
      "Before we design or develop, we take time to understand your business, your audience and where you want to go.",
    image: "/work1.png",
  },
  {
    id: "design",
    label: "DESIGN",
    title: "MADE TO BE REMEMBERED.",
    description:
      "We create visual experiences that do more than look good. Every detail is shaped to create clarity, trust and impact.",
    image: "/wor2.png",
  },
  {
    id: "technology",
    label: "TECHNOLOGY",
    title: "BUILT FOR WHAT'S NEXT.",
    description:
      "Clean, scalable technology gives your business room to move forward without rebuilding everything tomorrow.",
    image: "/work3.png",
  },
];

export default function WhyIoxora() {
  const [activeReason, setActiveReason] = useState(0);

  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleReasonChange = (index: number) => {
    if (index === activeReason) return;

    const image = imageWrapRef.current;
    const content = contentRef.current;

    if (!image || !content) {
      setActiveReason(index);
      return;
    }

    const tl = gsap.timeline();

    tl.to(image, {
      opacity: 0,
      scale: 0.96,
      duration: 0.25,
      ease: "power2.in",
    });

    tl.to(
      content,
      {
        opacity: 0,
        y: 18,
        duration: 0.2,
        ease: "power2.in",
      },
      "<"
    );

    tl.add(() => {
      setActiveReason(index);
    });

    tl.fromTo(
      image,
      {
        opacity: 0,
        scale: 1.05,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
      }
    );

    tl.fromTo(
      content,
      {
        opacity: 0,
        y: 18,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.35"
    );
  };

  const active = reasons[activeReason];

  return (
    <section className="overflow-hidden bg-[#e9e9e6] p-6 text-[#393e3d] sm:p-10 md:p-14 lg:p-20">
      <div className="mx-auto max-w-[1800px]">
        {/* Main */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* LEFT */}
          <div className="relative flex flex-col justify-between lg:min-h-[650px]">
            {/* Big heading */}
            <div className="mb-8 sm:mb-10">
              <h4
                className="
                  mb-3
                  text-lg
                  font-bold
                  text-[#797B7C]
                  sm:text-xl
                  md:mb-4
                  md:text-2xl
                "
              >
                {"Why ioXora"}
              </h4>

              <h2
                className="
                  mb-10
                  text-[13vw]
                  font-bold
                  leading-[0.9]
                  tracking-[-0.05em]
                  text-[#222628]
                  sm:whitespace-nowrap
                  sm:text-[15vw]
                  sm:leading-[0.88]
                  sm:tracking-[-0.06em]
                  md:mb-14
                  lg:mb-20
                  lg:text-[clamp(4rem,10vw,160px)]
                "
              >
                Why Work
                <br /> With Us?
              </h2>
            </div>

            {/* Floating interactive words */}
            <div className="relative mt-2 flex min-h-0 flex-wrap items-center gap-x-5 gap-y-4 sm:mt-8 sm:gap-x-6 sm:gap-y-5 lg:mt-0 lg:min-h-[230px]">
              {reasons.map((reason, index) => (
                <button
                  key={reason.id}
                  type="button"
                  onMouseEnter={() => handleReasonChange(index)}
                  onClick={() => handleReasonChange(index)}
                  className={`group relative text-left text-[clamp(1.2rem,5vw,2.6rem)] font-semibold leading-none tracking-[-0.05em] transition-opacity duration-300 sm:text-[clamp(1.4rem,2.2vw,2.6rem)] sm:tracking-[-0.06em] ${
                    activeReason === index
                      ? "opacity-100"
                      : "opacity-35 hover:opacity-70"
                  }`}
                >
                  {reason.label}

                  <span
                    className={`absolute -bottom-3 left-0 h-px bg-[#393e3d] transition-all duration-500 ${
                      activeReason === index ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex flex-col">
            {/* Main image */}
            <div
              ref={imageWrapRef}
              className="relative h-[300px] w-full overflow-hidden rounded-2xl sm:h-[420px] md:h-[520px] lg:h-[420px]"
            >
              <Image
                key={active.image}
                src={active.image}
                alt={active.label}
                fill
                priority
                className="object-cover"
              />

              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-black/10" />

              {/* Large number */}
              <div className="absolute bottom-4 right-5 text-[clamp(3.5rem,14vw,10rem)] font-bold leading-none tracking-[-0.1em] text-white/90 sm:bottom-5 sm:right-6 md:bottom-8 md:right-8">
                0{activeReason + 1}
              </div>
            </div>

            {/* Dynamic content */}
            <div
              ref={contentRef}
              className="relative -mt-2 ml-auto w-full rounded-tl-xl bg-[#e9e9e6] px-0 pt-6 sm:pt-8 md:-mt-24 md:w-[82%] md:px-10 md:pt-10 lg:w-[76%]"
            >
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#393e3d]/45 sm:mb-5 sm:tracking-[0.35em]">
                {active.label}
              </p>

              <h3 className="max-w-[620px] text-[clamp(2rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.06em] sm:text-[clamp(2.5rem,4.3vw,5.5rem)] sm:leading-[0.9] sm:tracking-[-0.075em]">
                {active.title}
              </h3>

              <p className="mt-5 max-w-[500px] text-[15px] leading-[1.65] text-[#393e3d]/65 sm:mt-7 sm:text-base sm:leading-[1.7] md:text-lg">
                {active.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}