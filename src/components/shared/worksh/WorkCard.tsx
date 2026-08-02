"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WorkCardProps {
  title: string;
  category: string;
  image: string;
  href?: string;
  className?: string;
}

/**
 * WorkCard (GSAP version)
 * -----------------------
 * Age framer-motion diye jeta hoyechilo (3D tilt on mouse move, spotlight
 * follow, hover e image zoom, content reveal, shine sweep) — shobgula ekhon
 * GSAP diye kora, framer-motion dependency lagbe na.
 *
 * Install koro (na thakle):
 *   npm install gsap
 */
export default function WorkCard({
  title,
  category,
  image,
  href = "#",
  className = "",
}: WorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const spot = useRef({ x: 50, y: 50 });
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const quickRotX = useRef<gsap.QuickToFunc | null>(null);
  const quickRotY = useRef<gsap.QuickToFunc | null>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const updateSpotlight = () => {
      spotlightRef.current?.style.setProperty("--x", `${spot.current.x}%`);
      spotlightRef.current?.style.setProperty("--y", `${spot.current.y}%`);
    };

    // continuous mouse-follow setters — spring-er moto smooth feel
    quickX.current = gsap.quickTo(spot.current, "x", {
      duration: 0.6,
      ease: "power3",
      onUpdate: updateSpotlight,
    });
    quickY.current = gsap.quickTo(spot.current, "y", {
      duration: 0.6,
      ease: "power3",
      onUpdate: updateSpotlight,
    });
    quickRotX.current = gsap.quickTo(cardRef.current, "rotationX", {
      duration: 0.6,
      ease: "power3",
    });
    quickRotY.current = gsap.quickTo(cardRef.current, "rotationY", {
      duration: 0.6,
      ease: "power3",
    });

    // shuru te shob element-er rest state gsap diye set kore newa —
    // eta na korle "y"/"opacity" er jonno inline style diye hack korte hoto
    gsap.set(borderGlowRef.current, { opacity: 0 });
    gsap.set(overlayRef.current, { opacity: 0.4 });
    gsap.set(categoryRef.current, { y: -20, opacity: 0 });
    gsap.set(bottomRef.current, { y: 18 });
    gsap.set(arrowRef.current, { x: 0, rotate: 0 });
    gsap.set(shineRef.current, { xPercent: -150, skewX: -20 });

    // rest -> hover timeline (paused, play/reverse হয় mouseenter/leave e)
    const tl = gsap.timeline({ paused: true });

    tl.to(borderGlowRef.current, { opacity: 1, duration: 0.4 }, 0)
      .to(
        imageWrapRef.current,
        { scale: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as unknown as string },
        0
      )
      .to(overlayRef.current, { opacity: 0.75, duration: 0.4 }, 0)
      .to(
        categoryRef.current,
        { y: 0, opacity: 1, duration: 0.45 },
        0
      )
      .to(bottomRef.current, { y: 0, duration: 0.45 }, 0)
      .to(
        arrowRef.current,
        { x: 6, rotate: 45, duration: 0.4, ease: "power3.out" },
        0
      );

    hoverTl.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    quickRotX.current?.(gsap.utils.interpolate(10, -10, y + 0.5));
    quickRotY.current?.(gsap.utils.interpolate(-10, 10, x + 0.5));
    quickX.current?.(gsap.utils.interpolate(20, 80, x + 0.5));
    quickY.current?.(gsap.utils.interpolate(20, 80, y + 0.5));
  }

  function handleEnter() {
    hoverTl.current?.play();

    // shine sweep — proti hover e notun kore chole (skewX age theke set kora)
    gsap.fromTo(
      shineRef.current,
      { xPercent: -150 },
      { xPercent: 150, duration: 1, ease: "power2.inOut", overwrite: true }
    );
  }

  function handleLeave() {
    hoverTl.current?.reverse();

    quickRotX.current?.(0);
    quickRotY.current?.(0);
  }

  return (
    <Link href={href} className={`block ${className}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
        className="group relative aspect-video overflow-hidden rounded-[32px] bg-[#0b0b0b]"
      >
        {/* Border Glow */}
        <div
          ref={borderGlowRef}
          className="absolute inset-0 rounded-[32px] p-[1px]"
        >
          <div className="h-full w-full rounded-[32px] bg-gradient-to-br from-white/40 via-transparent to-white/10" />
        </div>

        {/* Image */}
        <div ref={imageWrapRef} className="absolute inset-0">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        {/* Spotlight */}
        <div
          ref={spotlightRef}
          style={
            {
              "--x": "50%",
              "--y": "50%",
              background:
                "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,.20), transparent 45%)",
            } as React.CSSProperties
          }
          className="absolute inset-0"
        />

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
        />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />

        {/* Category */}
        <div ref={categoryRef} className="absolute left-6 top-6">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-white backdrop-blur-xl">
            {category}
          </span>
        </div>

        {/* Bottom Content */}
        <div ref={bottomRef} className="absolute bottom-0 left-0 right-0 p-7">
          <div className="flex items-end justify-between gap-5">
            <div>
              <h3 className="text-3xl font-semibold leading-tight text-white opacity-95">
                {title}
              </h3>
            </div>

            <div
              ref={arrowRef}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl"
            >
              <ArrowUpRight size={24} />
            </div>
          </div>
        </div>

        {/* Shine */}
        <div
          ref={shineRef}
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl"
        />
      </div>
    </Link>
  );
}