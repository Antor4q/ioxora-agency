"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Industry = {
  id: string;
  title: string;
  category: string;
  description: string;
  x: string;
  y: string;
};

const industries: Industry[] = [
  {
    id: "01",
    title: "SaaS + AI",
    category: "DIGITAL PRODUCTS",
    description:
      "AI-powered websites and digital experiences for ambitious software companies.",
    x: "50%",
    y: "20%",
  },
  {
    id: "02",
    title: "Fintech",
    category: "FINANCIAL",
    description:
      "Clear and high-trust digital experiences for modern financial brands.",
    x: "76%",
    y: "34%",
  },
  {
    id: "03",
    title: "Real Estate",
    category: "PROPERTY",
    description:
      "Premium digital experiences for property brands, platforms and marketplaces.",
    x: "25%",
    y: "36%",
  },
  {
    id: "04",
    title: "Healthcare",
    category: "HEALTH",
    description:
      "Simple, accessible and intuitive digital experiences for healthcare.",
    x: "35%",
    y: "67%",
  },
  {
    id: "05",
    title: "Education",
    category: "LEARNING",
    description:
      "Engaging websites and platforms designed for modern education.",
    x: "68%",
    y: "66%",
  },
  {
    id: "06",
    title: "E-commerce",
    category: "COMMERCE",
    description:
      "Conversion-focused digital experiences for ambitious online brands.",
    x: "17%",
    y: "77%",
  },
  {
    id: "07",
    title: "Technology",
    category: "TECH",
    description:
      "Interactive websites for technology companies and ambitious startups.",
    x: "84%",
    y: "77%",
  },
];

export default function IndustriesWeServe() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<string | null>(null);

  const activeIndustry =
    industries.find((industry) => industry.id === active) ?? null;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      tl.fromTo(
        ".industries-label",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        }
      )
        .fromTo(
          ".industries-heading",
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .fromTo(
          ".industry-map",
          {
            scale: 0.92,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.5"
        )
        .fromTo(
          nodesRef.current,
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "back.out(1.8)",
          },
          "-=0.8"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    gsap.to(gridRef.current, {
      x: (mouseX - rect.width / 2) * 0.015,
      y: (mouseY - rect.height / 2) * 0.015,
      duration: 1,
      ease: "power3.out",
    });
  };

  const activateIndustry = (id: string) => {
    setActive(id);

    const index = industries.findIndex((item) => item.id === id);

    nodesRef.current.forEach((node, nodeIndex) => {
      if (!node) return;

      gsap.to(node, {
        opacity: nodeIndex === index ? 1 : 0.2,
        scale: nodeIndex === index ? 1.12 : 0.92,
        duration: 0.5,
        ease: "power3.out",
      });
    });

    linesRef.current.forEach((line, lineIndex) => {
      if (!line) return;

      gsap.to(line, {
        opacity: lineIndex === index ? 0.8 : 0.08,
        strokeWidth: lineIndex === index ? 1.5 : 0.7,
        duration: 0.5,
        ease: "power3.out",
      });
    });

    gsap.to(centerRef.current, {
      scale: 1.04,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const deactivate = () => {
    setActive(null);

    nodesRef.current.forEach((node) => {
      if (!node) return;

      gsap.to(node, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    });

    linesRef.current.forEach((line) => {
      if (!line) return;

      gsap.to(line, {
        opacity: 0.18,
        strokeWidth: 0.7,
        duration: 0.5,
        ease: "power3.out",
      });
    });

    gsap.to(centerRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#060507] text-white"
    >
      {/* Background */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-[-5%] opacity-40"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "90px 90px",
            maskImage:
              "radial-gradient(circle at center, black 10%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 10%, transparent 75%)",
          }}
        />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d5f139]/[0.035] blur-[160px]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 py-8 md:px-10 md:py-10">
        {/* Header */}
        <div className="relative z-20 flex items-start justify-between">
          <div>
            <p className="industries-label mb-4 text-[10px] uppercase tracking-[0.28em] text-white/35 md:text-xs">
              04 / Industries
            </p>

            <h2 className="industries-heading max-w-[600px] text-3xl font-medium leading-[0.95] tracking-[-0.05em] opacity-0 md:text-5xl lg:text-[64px]">
              We build for
              <br />
              <span className="text-white/30">different worlds.</span>
            </h2>
          </div>

          <p className="hidden text-right text-[9px] uppercase leading-relaxed tracking-[0.22em] text-white/25 md:block">
            Move through
            <br />
            the network
          </p>
        </div>

        {/* Interactive Map */}
        <div
          ref={mapRef}
          onMouseMove={handleMouseMove}
          className="industry-map relative mt-[-30px] min-h-[620px] flex-1 opacity-0 md:min-h-[700px]"
        >
          {/* SVG connection system */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            {industries.map((industry, index) => {
              const x = parseFloat(industry.x);
              const y = parseFloat(industry.y);

              return (
                <line
                  key={industry.id}
                  ref={(el) => {
                    linesRef.current[index] = el;
                  }}
                  x1="50"
                  y1="50"
                  x2={`${x * 10}`}
                  y2={`${y * 7}`}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.7"
                  opacity="0.18"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Center */}
          <div
            ref={centerRef}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#08090a]/80 backdrop-blur-xl md:h-36 md:w-36">
              <div className="absolute inset-2 rounded-full border border-[#d5f139]/10" />

              <div className="text-center">
                <div className="text-[9px] uppercase tracking-[0.3em] text-white/35">
                  ioXora
                </div>

                <div className="mt-2 text-[8px] uppercase tracking-[0.18em] text-[#d5f139]/60">
                  Digital Studio
                </div>
              </div>

              {/* center pulse */}
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#d5f139]/60" />
              <span className="absolute h-1.5 w-1.5 rounded-full bg-[#d5f139]" />
            </div>
          </div>

          {/* Industry Nodes */}
          {industries.map((industry, index) => {
            const isActive = active === industry.id;

            return (
              <button
                key={industry.id}
                ref={(el) => {
                  nodesRef.current[index] = el;
                }}
                onMouseEnter={() => activateIndustry(industry.id)}
                onFocus={() => activateIndustry(industry.id)}
                onMouseLeave={deactivate}
                onBlur={deactivate}
                className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 text-left"
                style={{
                  left: industry.x,
                  top: industry.y,
                }}
              >
                <div className="relative">
                  {/* Node */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        relative flex h-2.5 w-2.5 items-center justify-center
                        transition-all duration-500
                        ${isActive ? "scale-125" : ""}
                      `}
                    >
                      <span
                        className={`
                          absolute inset-0 rounded-full border
                          transition-all duration-500
                          ${
                            isActive
                              ? "border-[#d5f139] scale-[2.2]"
                              : "border-white/20"
                          }
                        `}
                      />

                      <span
                        className={`
                          h-1.5 w-1.5 rounded-full transition-all duration-500
                          ${
                            isActive
                              ? "bg-[#d5f139] shadow-[0_0_20px_rgba(213,241,57,0.8)]"
                              : "bg-white/50 group-hover:bg-white"
                          }
                        `}
                      />
                    </span>

                    <span
                      className={`
                        whitespace-nowrap text-lg font-medium tracking-[-0.04em]
                        transition-all duration-500 md:text-2xl lg:text-3xl
                        ${
                          isActive
                            ? "text-[#d5f139]"
                            : "text-white/55 group-hover:text-white"
                        }
                      `}
                    >
                      {industry.title}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div
                    className={`
                      ml-5 mt-1 overflow-hidden transition-all duration-500
                      ${
                        isActive
                          ? "max-h-20 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                      {industry.id} / {industry.category}
                    </p>

                    <p className="mt-2 max-w-[230px] text-[10px] leading-relaxed text-white/45">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Active industry info */}
          <div
            className={`
              pointer-events-none absolute bottom-5 left-1/2 z-30
              w-full max-w-[420px] -translate-x-1/2 text-center
              transition-all duration-500
              ${
                activeIndustry
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }
            `}
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#d5f139]/70">
              {activeIndustry?.category}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/45">
              {activeIndustry?.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 flex items-center justify-between border-t border-white/[0.07] pt-5">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/25">
            07 industries
          </span>

          <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/25 md:block">
            Every connection starts with an idea
          </span>

          <span className="text-[9px] uppercase tracking-[0.25em] text-white/25">
            2026
          </span>
        </div>
      </div>
    </section>
  );
}