"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeadingReveal
 * -------------
 * Scroll er shathe directly bound (scrub) animation:
 * - Nicer dike scroll korle: heading niche dim/low-opacity obostha theke
 *   smoothly upore uthe exact position e ashe r color/opacity full hoye jay.
 * - Upor dike scroll korle: same animation reverse hoy (blur kono kicu nai,
 *   shudhu translateY + opacity, scroll position er shathe scrub kore bound).
 *
 * Install koro (na thakle):
 *   npm install gsap
 *
 * Usage:
 *   <HeadingReveal as="h2" className="text-4xl md:text-6xl font-bold">
 *     We build products that matter.
 *   </HeadingReveal>
 */

interface HeadingRevealProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  /** ScrollTrigger start position — kokhon theke animation bind hobe */
  start?: string;
  /** ScrollTrigger end position — kokhon animation complete hobe */
  end?: string;
  /** px — koto dur niche theke upore uthe asbe */
  yOffset?: number;
  /** shuru te koto opacity thakbe (0 to 1) */
  startOpacity?: number;
  /** scrub value — true dile scroll er shathe 1:1, number dile ektu smooth lag/delay */
  scrub?: boolean | number;
}

export default function TextReveal({
  children,
  className = "",
  as = "h2",
  start = "top 90%",
  end = "top 40%",
  yOffset = 60,
  startOpacity = 0.25,
  scrub = 0.6,
}: HeadingRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: startOpacity,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [start, end, yOffset, startOpacity, scrub]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}