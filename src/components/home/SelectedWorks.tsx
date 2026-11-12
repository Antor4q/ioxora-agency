
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CASE_STUDIES } from "@/components/CaseStudies";

gsap.registerPlugin(ScrollTrigger);

// Projects are generated from the shared CaseStudies data
const projects = CASE_STUDIES.slice(0, 4).map((project) => ({
  id: project.id,
  slug: project.slug,
  name: project.title.join(" "),
  desc: project.overview,
  thumb: project.thumb,
  video: project.video,
  href: `/work/${project.slug}`,
}));

export default function SelectedWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [touch, setTouch] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouch = window.matchMedia("(hover: none)").matches;
    setTouch(isTouch);

    let resizeObserver: ResizeObserver | null = null;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(
        (c): c is HTMLDivElement => c !== null
      );

      /* ---------- active project ---------- */
      cards.forEach((card, index) => {
        const wrapper = card.parentElement;
        if (!wrapper) return;

        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);

            if (isTouch) {
              const v = card.querySelector("video");
              if (!v) return;

              if (self.isActive) {
                v.play().catch(() => {});
              } else {
                v.pause();
                v.currentTime = 0;
              }
            }
          },
        });
      });

      if (reduce) {
        gsap.set(cards, { xPercent: 0, force3D: true });
        return;
      }

      /* ---------- card animations ---------- */
      const startX = () =>
        window.innerWidth < 768 ? 60 : 110;

      cards.forEach((card, index) => {
        const wrapper = card.parentElement;
        if (!wrapper) return;

        gsap.fromTo(
          card,
          { xPercent: startX, force3D: true },
          {
            xPercent: 0,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "top 18%",
              scrub: 1.1,
              invalidateOnRefresh: true,
              refreshPriority: -1,
            },
          }
        );

        if (index > 0) {
          gsap.to(cards[index - 1], {
            scale: 0.965,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 68%",
              end: "top 38%",
              scrub: 1.1,
              invalidateOnRefresh: true,
              refreshPriority: -1,
            },
          });
        }
      });
    }, section);

    /* ---------- safe refresh ---------- */
    const safeRefresh = () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      refreshTimeout.current = setTimeout(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 50);
    };

    const images = Array.from(
      section.querySelectorAll<HTMLImageElement>("img")
    );

    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", safeRefresh, { once: true });
      }
    });

    window.addEventListener("load", safeRefresh);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(safeRefresh);
      resizeObserver.observe(section);
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      window.removeEventListener("load", safeRefresh);

      images.forEach((img) =>
        img.removeEventListener("load", safeRefresh)
      );

      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  /* ---------- hover video ---------- */
  const playVideo = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;

    const v = e.currentTarget.querySelector("video");
    v?.play().catch(() => {});
  };

  const stopVideo = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;

    const v = e.currentTarget.querySelector("video");
    if (!v) return;

    v.pause();
    v.currentTime = 0;
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 overflow-x-clip bg-[#0a0a0a] pb-20 pt-20 text-white sm:py-24 md:px-8 md:py-32 lg:py-40"
    >
      {/* header */}
      <div className="px-5 sm:px-6 md:px-8">
        <p className="mb-3 text-sm text-white/50 sm:mb-4">
          [Selected work]
        </p>

        <h2 className="mb-10 break-words text-[clamp(2.5rem,12vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] sm:mb-14 md:mb-20">
          Selected work
        </h2>
      </div>

      <div className="px-5 sm:px-6 md:grid md:grid-cols-[34fr_66fr] md:gap-6 md:px-8 lg:grid-cols-[30fr_70fr]">
        {/* LEFT: details */}
        <div className="relative hidden self-start md:sticky md:top-[max(5rem,12svh)] md:block md:h-[max(16rem,58svh)] lg:h-[max(18rem,62svh)]">
          {projects.map((p, i) => {
            const state =
              i === active
                ? "visible translate-y-0 opacity-100 delay-300"
                : `invisible opacity-0 ${
                    i < active ? "-translate-y-5" : "translate-y-5"
                  }`;

            return (
              <div
                key={p.id}
                aria-hidden={i !== active}
                className={`absolute inset-0 flex flex-col justify-center pr-4 transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:pr-6 ${state}`}
              >
                <h3 className="break-words text-[clamp(1.75rem,3.4vw,3.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
                  {p.name}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-snug text-white/70 lg:mt-6 lg:text-base">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT: stacked cards */}
        <div className="relative">
          {projects.map((p, index) => (
            <div
              key={p.id}
              className="relative h-[max(17rem,52svh)] sm:h-[max(20rem,64svh)] md:h-[max(20rem,74svh)]"
            >
              <div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onPointerEnter={playVideo}
                onPointerLeave={stopVideo}
                data-cursor-text="View Case Study"
                data-cursor-icon="arrow"
                className="group sticky top-[max(4.5rem,8svh)] h-[max(14rem,42svh)] w-full cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)] will-change-transform sm:top-[max(5rem,10svh)] sm:h-[max(16rem,50svh)] md:top-[max(5rem,12svh)] md:h-[max(16rem,58svh)] lg:h-[max(18rem,62svh)]"
                style={{ zIndex: index + 1 }}
              >
                {/* video */}
                <video
                  src={p.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  alt={p.name}
                  draggable={false}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500 ease-out group-hover:opacity-0 ${
                    touch && index === active ? "opacity-0" : ""
                  }`}
                />

                {/* number */}
                <span className="absolute right-3 top-3 z-20 font-mono text-[10px] text-white mix-blend-difference sm:right-4 sm:top-4 sm:text-[11px]">
                  [{p.id}]
                </span>

                {/* mobile details */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 md:hidden">
                  <h3 className="text-xl font-semibold leading-none tracking-[-0.02em] sm:text-2xl">
                    {p.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 max-w-md text-xs leading-snug text-white/70 sm:text-sm">
                    {p.desc}
                  </p>
                </div>

                {/* Case study link */}
                <Link
                  href={p.href}
                  aria-label={`View ${p.name} case study`}
                  className="absolute inset-0 z-30"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
