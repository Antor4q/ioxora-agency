"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// placeholder data: replace with your real files and text.
// Put files in /public/work/ -> thumb: jpg/webp (16:10), video: short mp4 (muted loop, ~5-8s, compressed)
const projects = [
  {
    id: "01",
    name: "Heaven Furniture Mart",
    desc: "A furniture e-commerce experience with a Shop the Look lookbook, where hotspots on a room photo lead straight to the products.",
    thumb: "/work1.png",
    video: "/pro/rooooo.mp4",
    href: "#",
  },
  {
    id: "02",
    name: "Oran Studio",
    desc: "A portfolio website for an interior design studio, with a smooth preloader, a bold CTA and a curtain-reveal footer.",
    thumb: "/work1.png",
    video: "/pro/rooooo.mp4",
    href: "#",
  },
  {
    id: "03",
    name: "Upto",
    desc: "A freight and logistics website built around a clear service story, a global network map and a quick quote flow.",
    thumb: "/work1.png",
    video: "/pro/rooooo.mp4",
    href: "#",
  },
  {
    id: "04",
    name: "Lumen",
    desc: "Placeholder: write 1-2 lines about this project here.",
    thumb: "/work1.png",
    video: "/pro/rooooo.mp4",
    href: "#",
  },
  {
    id: "05",
    name: "Nexa AI",
    desc: "Placeholder: write 1-2 lines about this project here.",
    thumb: "/work1.png",
    video: "/pro/rooooo.mp4",
    href: "#",
  },
];

export default function SelectedWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let resizeObserver: ResizeObserver | null = null;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);

      /* ---------- which project is active (drives left panel) ---------- */
      cards.forEach((card, index) => {
        const wrapper = card.parentElement;
        if (!wrapper) return;

        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      if (reduce) {
        gsap.set(cards, { xPercent: 0, force3D: true });
        return;
      }

      /* ---------- cards: slide in from right, settle, then stack ---------- */
      const startX = window.innerWidth < 768 ? 60 : 110;
      gsap.set(cards, { xPercent: startX, force3D: true });

      cards.forEach((card, index) => {
        const wrapper = card.parentElement;
        if (!wrapper) return;

        gsap.to(card, {
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
        });

        // previous card scales down slightly as the next one arrives
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
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
      refreshTimeout.current = setTimeout(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 50);
    };

    const images = Array.from(section.querySelectorAll<HTMLImageElement>("img"));
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", safeRefresh, { once: true });
    });

    window.addEventListener("load", safeRefresh);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(safeRefresh);
      resizeObserver.observe(section);
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
      window.removeEventListener("load", safeRefresh);
      images.forEach((img) => img.removeEventListener("load", safeRefresh));
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  /* ---------- hover video ---------- */
  const playVideo = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = e.currentTarget.querySelector("video");
    v?.play().catch(() => {});
  };

  const stopVideo = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = e.currentTarget.querySelector("video");
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 overflow-x-clip bg-[#0a0a0a] pb-24 pt-16 text-white sm:pt-20 md:pb-32 md:pt-28"
    >
      {/* header */}
      <div className="px-6 md:px-8">
        <p className="mb-4 text-sm text-white/50">[02 / Selected work]</p>
        <h2 className="mb-12 text-[clamp(3rem,11vw,12rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] sm:mb-16 md:mb-20">
          Selected work
        </h2>
      </div>

      <div className="px-4 md:grid md:grid-cols-[30fr_70fr] md:gap-6 md:px-8">
        {/* ---------- LEFT: details (desktop only), one visible at a time ---------- */}
        <div className="relative hidden self-start md:sticky md:top-[12vh] md:block md:h-[58vh] lg:h-[62vh]">
          {projects.map((p, i) => {
            const state =
              i === active
                ? "visible translate-y-0 opacity-100 delay-300" // new one waits for the old one to leave
                : `invisible opacity-0 ${i < active ? "-translate-y-5" : "translate-y-5"}`;

            return (
              <div
                key={p.id}
                aria-hidden={i !== active}
                className={`absolute inset-0 flex flex-col justify-center pr-6 transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none ${state}`}
              >
                <h3 className="text-[clamp(2rem,3.4vw,3.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
                  {p.name}
                </h3>
                <p className="mt-6 max-w-sm text-base leading-snug text-white/70">{p.desc}</p>
                <a
                  href={p.href}
                  className="mt-8 inline-block w-fit border-b border-white pb-0.5 text-sm font-medium focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                >
                  View case study →
                </a>
              </div>
            );
          })}
        </div>

        {/* ---------- RIGHT: stacked cards ---------- */}
        <div className="relative">
          {projects.map((p, index) => (
            <div key={p.id} className="relative h-[52vh] sm:h-[64vh] md:h-[74vh]">
              <div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onPointerEnter={playVideo}
                onPointerLeave={stopVideo}
                data-cursor-text="View Case Study"
                data-cursor-icon="arrow"
                className="group sticky top-[8vh] h-[42vh] w-full cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)] will-change-transform sm:top-[10vh] sm:h-[50vh] md:top-[12vh] md:h-[58vh] lg:h-[62vh]"
                style={{ zIndex: index + 1 }}
              >
                {/* hover video (muted, no controls) */}
                <video
                  src={p.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* thumbnail, fades out on hover */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  alt={p.name}
                  draggable={false}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
                />

                {/* number  that is not co*/}
                <span className="absolute right-4 top-4 z-20 font-mono text-[10px] text-white mix-blend-difference sm:text-[11px]">
                  [{p.id}]
                </span>

                {/* mobile: name overlay (details panel is desktop only) */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
                  <h3 className="text-xl font-semibold leading-none tracking-[-0.02em]">{p.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}