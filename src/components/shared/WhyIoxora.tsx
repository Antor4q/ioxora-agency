"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";

const reasons = [
  {
    id: "strategy",
    label: "STRATEGY",
    title: "EVERYTHING STARTS WITH A WHY.",
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
    <section className="overflow-hidden bg-[#e9e9e6] px-5 py-24 text-[#393e3d] md:px-10 md:py-32 lg:px-[4vw]">
      <div className="mx-auto max-w-[1800px]">
        {/* Top */}
        <div className="mb-14 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em]">
            05 — WHY IOXORA
          </p>

          <span className="hidden h-px w-[180px] bg-[#393e3d]/20 md:block" />
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* LEFT */}
          <div className="relative flex min-h-[650px] flex-col justify-between">
            {/* Big heading */}
            <div>
              <h2 className="max-w-[800px] text-[clamp(4.5rem,9vw,10rem)] font-bold leading-[0.78] tracking-[-0.085em]">
                WHY
                <br />
                <span className="pl-[0.08em]">WORK</span>
                <br />
                WITH US?
              </h2>

              <p className="mt-12 max-w-[380px] text-lg leading-[1.65] text-[#393e3d]/65">
                We combine thinking, creativity and technology to create
                digital experiences that are built around where your business
                is going.
              </p>
            </div>

            {/* Floating interactive words */}
            <div className="relative mt-20 flex min-h-[230px] flex-wrap items-center gap-x-6 gap-y-5 lg:mt-0">
              {reasons.map((reason, index) => (
                <button
                  key={reason.id}
                  type="button"
                  onMouseEnter={() => handleReasonChange(index)}
                  onClick={() => handleReasonChange(index)}
                  className={`group relative text-left text-[clamp(1.4rem,2.2vw,2.6rem)] font-semibold leading-none tracking-[-0.06em] transition-opacity duration-300 ${
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

              <span className="absolute -bottom-2 right-0 text-[10px] uppercase tracking-[0.25em] text-[#393e3d]/40">
                Hover to explore ↗
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex flex-col">
            {/* Main image */}
            <div
              ref={imageWrapRef}
              className="relative h-[480px] w-full overflow-hidden md:h-[650px] lg:h-[720px]"
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

              {/* Image label */}
              <div className="absolute left-6 top-6 md:left-8 md:top-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
                  ioXora / 0{activeReason + 1}
                </p>
              </div>

              {/* Large number */}
              <div className="absolute bottom-5 right-6 text-[clamp(5rem,10vw,10rem)] font-bold leading-none tracking-[-0.1em] text-white/90 md:bottom-8 md:right-8">
                0{activeReason + 1}
              </div>
            </div>

            {/* Dynamic content */}
            <div
              ref={contentRef}
              className="relative ml-auto -mt-2 w-full bg-[#e9e9e6] px-0 pt-8 md:w-[82%] md:-mt-24 md:px-10 md:pt-10 lg:w-[76%]"
            >
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#393e3d]/45">
                {active.label}
              </p>

              <h3 className="max-w-[620px] text-[clamp(2.5rem,4.3vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.075em]">
                {active.title}
              </h3>

              <p className="mt-7 max-w-[500px] text-base leading-[1.7] text-[#393e3d]/65 md:text-lg">
                {active.description}
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
}