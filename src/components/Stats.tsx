"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  label: string; // shown as [label]
  value: string; // digits only, "." allowed. e.g. "120", "4.9"
  suffix?: string; // e.g. "+", "/5", "+ yrs"
  description: string;
  progress?: number; // 0-1, fills the bottom line (used for rating)
};

// TODO: replace with your real numbers
const DEFAULT_STATS: Stat[] = [
  {
    label: "Projects",
    value: "120",
    suffix: "+",
    description: "Websites, 3D experiences and AI tools shipped for clients.",
  },
  {
    label: "Rating",
    value: "4.9",
    suffix: "/5",
    description: "Average client rating across every completed project.",
    progress: 4.9 / 5,
  },
  {
    label: "Experience",
    value: "5",
    suffix: "+ yrs",
    description: "Building interactive web and AI products.",
  },
];

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function RollingNumber({ value }: { value: string }) {
  return (
    <span className="inline-flex items-start" aria-label={value}>
      {value.split("").map((ch, i) => {
        const isDigit = /\d/.test(ch);
        if (!isDigit) {
          return (
            <span key={i} aria-hidden className="block h-[1.05em] leading-[1.05]">
              {ch}
            </span>
          );
        }
        return (
          <span
            key={i}
            aria-hidden
            className="block h-[1.05em] overflow-hidden leading-[1.05]"
          >
            <span
              data-roll
              data-digit={ch}
              className="flex flex-col will-change-transform"
            >
              {DIGITS.map((n) => (
                <span key={n} className="block h-[1.05em] leading-[1.05]">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function Stats({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>("[data-col]");

      const setFinal = () => {
        gsap.utils.toArray<HTMLElement>("[data-roll]").forEach((el) => {
          gsap.set(el, { yPercent: -Number(el.dataset.digit) * 10 });
        });
        gsap.utils.toArray<HTMLElement>("[data-fill]").forEach((el) => {
          gsap.set(el, { scaleX: Number(el.dataset.fill) });
        });
      };

      if (reduce) {
        setFinal();
        return;
      }

      gsap.set("[data-fill]", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          // mobile e section lamba, tai ektu aage trigger hoy
          start: () => (window.innerWidth < 768 ? "top 85%" : "top 65%"),
          once: true,
          invalidateOnRefresh: true,
        },
      });

      cols.forEach((col, ci) => {
        const rolls = col.querySelectorAll<HTMLElement>("[data-roll]");
        const fill = col.querySelector<HTMLElement>("[data-fill]");
        const text = col.querySelectorAll("[data-fade]");
        const at = ci * 0.14;

        rolls.forEach((el, di) => {
          tl.to(
            el,
            {
              yPercent: -Number(el.dataset.digit) * 10,
              duration: 1.8,
              ease: "power4.out",
            },
            at + di * 0.08
          );
        });

        if (fill) {
          tl.to(
            fill,
            {
              scaleX: Number(fill.dataset.fill),
              duration: 1.6,
              ease: "power3.out",
            },
            at + 0.2
          );
        }

        tl.fromTo(
          text,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.08 },
          at + 0.3
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full bg-[#0A0A0A] text-[#f5f5f0]"
      aria-label="Studio numbers"
    >
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 md:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-col
            className={[
              "flex flex-col justify-between gap-12 px-5 pb-8 pt-7 sm:gap-16 sm:px-6 sm:pb-10 sm:pt-8 md:min-h-[max(26rem,70svh)] md:px-6 md:pb-10 md:pt-10 lg:min-h-[max(28rem,78svh)] lg:px-8 lg:pb-12",
              "border-t border-white/15 first:border-t-0 md:border-t-0",
              i > 0 ? "md:border-l md:border-white/15" : "",
            ].join(" ")}
          >
            <span data-fade className="text-sm text-white/50">
              [{s.label}]
            </span>

            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="flex items-start whitespace-nowrap text-[clamp(4.5rem,22vw,8rem)] font-medium leading-none tracking-[-0.05em] [font-variant-numeric:tabular-nums] md:text-[clamp(3.5rem,8vw,6rem)] lg:text-[clamp(5rem,11vw,13rem)]">
                <RollingNumber value={s.value} />
                {s.suffix && (
                  <span
                    data-fade
                    className="ml-1 mt-[0.1em] whitespace-nowrap text-[0.26em] font-medium leading-none tracking-[-0.03em] text-white/60"
                  >
                    {s.suffix}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="relative h-px w-full bg-white/15">
                  {typeof s.progress === "number" && (
                    <span
                      data-fill={s.progress}
                      className="absolute inset-0 origin-left bg-[#f5f5f0]"
                    />
                  )}
                </div>
                <p
                  data-fade
                  className="max-w-[32ch] text-sm leading-snug text-white/60 sm:text-base lg:max-w-[28ch]"
                >
                  {s.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}