"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import TextReveal from "../textreveal/TextReveal";

/**
 * ServicesSection (dark + noise + velocity-tilt preview)
 * -------------------------------------------------------
 * - Section ekhon dark (#0a0a0a) bg-e, upore ekta subtle noise/grain texture
 *   overlay kora (mix-blend-soft-light diye — WorkCard-e joita kora hoyechilo
 *   shei-i technique).
 * - Title-er jonno "text swap" hover effect: dim gray text upore slide kore
 *   sore jay, niche theke ekta full-white copy slide kore uthe ashe
 *   (overflow-hidden mask diye — clean line-reveal).
 * - Floating image preview cursor follow kore, r mouse koto druto move
 *   korche (velocity) tar upor base kore ekta halka skew/tilt hoy — jokhon
 *   cursor theme jay, tilt aste aste 0-te settle hoye jay. Ei "liquid tilt"
 *   effect ta age-r plain follow theke onek beshi unique/premium lage.
 *
 * Install koro (na thakle):
 *   npm install gsap
 */

interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    id: "1",
    number: "01",
    title: "Brand Identity",
    description:
      "Logo, color, typography, and a visual system that makes you unmistakably you.",
    image: "/work1.png",
  },
  {
    id: "2",
    number: "02",
    title: "Web Design",
    description:
      "Interfaces that feel effortless — clean, fast, and built around your users.",
    image: "/work2.png",
  },
  {
    id: "3",
    number: "03",
    title: "Development",
    description:
      "Production-grade front-end and back-end engineering that scales with you.",
    image: "/work3.png",
  },
  {
    id: "4",
    number: "04",
    title: "Motion & Animation",
    description:
      "Micro-interactions and scroll-driven motion that bring products to life.",
    image: "/work4.png",
  },
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const quickSkew = useRef<gsap.QuickToFunc | null>(null);

  const lastX = useRef(0);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    quickX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    });
    quickSkew.current = gsap.quickTo(previewRef.current, "skewX", {
      duration: 0.5,
      ease: "power3",
    });
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // velocity theke halka skew — druto move korle beshi tilt, slow hole kom
    const velocity = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const skew = gsap.utils.clamp(-18, 18, velocity * 0.6);

    quickX.current?.(x);
    quickY.current?.(y);
    quickSkew.current?.(skew);

    // move thamle skew smoothly 0-te firiye ana
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(() => {
      quickSkew.current?.(0);
    }, 120);
  }

  function handleEnterRow(image: string) {
    setActiveImage(image);
    gsap.to(previewRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }

  function handleLeaveRow() {
    gsap.to(previewRef.current, {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
    });
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMove}
      className="relative mx-auto max-w-[1920px] overflow-hidden bg-[#0a0a0a] px-6 py-24 md:px-20"
    >
      {/* Noise / grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

       <h4 className="text-2xl font-bold text-[#797B7C] mb-5">{"Work's"}</h4>
                 <TextReveal
                  start="top 85%"
        end="top 55%"
        scrub={0.3}
                  as="h2" 
                 className="
           text-[112px] 
            text-[#c8c8c8]
            font-bold
            leading-[1.0]
            tracking-[-0.06em]
            whitespace-nowrap">
                  A Glimpse Into The Work 
                 </TextReveal>
                 <TextReveal
                  start="top 85%"
        end="top 55%"
        scrub={0.3}
                  as="h2" 
                 className="
           text-[112px] 
            text-[#c8c8c8]
            font-bold
            leading-[1.0]
            tracking-[-0.06em]
            whitespace-nowrap">
                   That Defines Who We Are.
                 </TextReveal>

      <div className="relative mt-16 divide-y divide-white/10">
        {services.map((service) => (
          <div
            key={service.id}
            onMouseEnter={() => handleEnterRow(service.image)}
            onMouseLeave={handleLeaveRow}
            className="group flex cursor-pointer flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between md:gap-6"
          >
            <div className="flex items-center gap-6">
              <span className="text-base text-neutral-600 transition-colors duration-300 group-hover:text-neutral-300">
                {service.number}
              </span>

              {/* Text swap reveal */}
              <div className="relative h-[1em] overflow-hidden text-3xl font-semibold leading-none md:text-5xl">
                <span className="block leading-none text-neutral-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                  {service.title}
                </span>
                <span className="absolute inset-0 block translate-y-full leading-none text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                  {service.title}
                </span>
              </div>
            </div>

            <p className="max-w-xs text-sm text-neutral-600 transition-colors duration-300 group-hover:text-neutral-400 md:text-base">
              {service.description}
            </p>

            <div className="hidden shrink-0 rounded-full border border-white/10 p-3 text-neutral-500 transition-all duration-300 group-hover:rotate-45 group-hover:border-white/30 group-hover:text-white md:block">
              <ArrowUpRight size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Cursor-following image preview with velocity tilt */}
      <div
        ref={previewRef}
        style={{ opacity: 0, transform: "scale(0.7)" }}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden h-56 w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 md:block"
      >
        {activeImage && (
          <Image src={activeImage} alt="" fill className="object-cover" />
        )}
      </div>
    </section>
  );
}