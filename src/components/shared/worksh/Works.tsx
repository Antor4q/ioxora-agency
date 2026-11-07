"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
// Path ta tomar folder structure onujayi thik kore nio
import { CASE_STUDIES, WORK_CATEGORIES, type CaseStudyData } from "@/components/CaseStudies";

type Filter = "All" | (typeof WORK_CATEGORIES)[number];
type View = "list" | "grid";

const FILTERS: Filter[] = ["All", ...WORK_CATEGORIES];
const yearOf = (p: CaseStudyData) => p.meta.find(([k]) => k === "Year")?.[1] ?? "";

// Grid er prottek item er alada width, height ar position. Pattern ta repeat hoy.
const GRID_PATTERN = [
  { place: "md:col-span-4 md:col-start-1", aspect: "aspect-[4/5]", offset: "" },
  { place: "md:col-span-3 md:col-start-6", aspect: "aspect-square", offset: "md:mt-24" },
  { place: "md:col-span-3 md:col-start-10", aspect: "aspect-[3/4]", offset: "md:mt-10" },
  { place: "md:col-span-3 md:col-start-2", aspect: "aspect-[4/3]", offset: "" },
  { place: "md:col-span-4 md:col-start-7", aspect: "aspect-[4/5]", offset: "md:mt-20" },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const root = useRef<HTMLElement>(null);

  // One orchestrated moment: the headline lines rise in, the rest fades up behind them.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".wh-line", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12 });
      gsap.from(".wh-fade", { opacity: 0, duration: 0.8, delay: 0.6, stagger: 0.1, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-white text-black">
      <div className="relative px-8 pb-10 pt-28 md:pb-14 md:pt-36">
        <p className="wh-fade mb-4 text-base md:mb-6">[Work]</p>

        <h1 className="text-balance text-[clamp(2.75rem,11vw,11rem)] font-medium leading-[0.92] tracking-[-0.05em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="wh-line block">Work that</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="wh-line block">people remember.</span>
          </span>
        </h1>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Filter (left) + List / Grid toggle (right)                          */
/* ------------------------------------------------------------------ */
function FilterBar({
  active,
  counts,
  onChange,
  view,
  onViewChange,
}: {
  active: Filter;
  counts: Record<Filter, number>;
  onChange: (f: Filter) => void;
  view: View;
  onViewChange: (v: View) => void;
}) {
  // Hide categories that have no projects yet.
  const visible = FILTERS.filter((f) => counts[f] > 0);

  return (
    <nav
      aria-label="Filter projects"
      className="flex flex-wrap items-center justify-between gap-x-8 border-y border-black/15 bg-white px-8 text-base text-black"
    >
      <div className="flex flex-wrap gap-x-6 md:gap-x-8">
        {visible.map((f) => {
          const on = active === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => onChange(f)}
              aria-pressed={on}
              className={`flex items-start gap-1 py-4 outline-offset-4 md:py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${
                on ? "underline underline-offset-4" : "opacity-50 transition-opacity hover:opacity-100"
              }`}
            >
              <span>[{f}]</span>
              <sup className="text-xs">{counts[f]}</sup>
            </button>
          );
        })}
      </div>

      <div role="group" aria-label="Layout" className="ml-auto flex gap-6">
        {(["list", "grid"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            aria-pressed={view === v}
            className={`py-4 outline-offset-4 md:py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${
              view === v ? "underline underline-offset-4" : "opacity-50 transition-opacity hover:opacity-100"
            }`}
          >
            [{v === "list" ? "List" : "Grid"}]
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Index: static list (details left, 3 images right) + grid            */
/* ------------------------------------------------------------------ */
function Index({ projects, view }: { projects: CaseStudyData[]; view: View }) {
  const wrap = useRef<HTMLElement>(null);

  // Re-enter the items when the person changes the filter or the view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".wi-item", { y: 28, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
    }, wrap);
    return () => ctx.revert();
  }, [projects, view]);

  return (
    <section ref={wrap} className="bg-white text-black">
      {projects.length === 0 && <p className="px-8 py-16 text-base">No projects in this category yet.</p>}

      {view === "list" ? (
        <ul>
          {projects.map((p) => (
            <li key={p.slug} className="wi-item border-b border-black/15">
              <article className="grid gap-6 px-8 py-8 lg:grid-cols-[minmax(260px,0.8fr)_auto_minmax(0,2fr)] lg:gap-10">
                <div>
                    <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em]">{p.name}</h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed opacity-70">{p.desc}</p>
                    <dl className="mt-6 space-y-1 text-base">
                      <div className="flex gap-3">
                        <dt className="w-20 opacity-50">Industry</dt>
                        <dd>{p.industry}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="w-20 opacity-50">Year</dt>
                        <dd>{yearOf(p)}</dd>
                      </div>
                    </dl>
                </div>

                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start justify-self-start border border-black px-5 py-3 text-base transition-colors hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white"
                >
                  [ View website ]
                </a>

                <div className="grid w-full grid-cols-3 gap-2 md:gap-4 lg:max-w-[960px] lg:justify-self-end">
                  {p.gallery.slice(0, 3).map((g, n) => (
                    <div key={`${g.src}-${n}`} className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                      <Image
                        src={g.src}
                        alt={`${p.name} screenshot ${n + 1}`}
                        fill
                        sizes="(min-width: 1024px) 320px, 30vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-16 px-8 pb-24 pt-12 sm:grid-cols-2 md:grid-cols-12 md:gap-x-10 md:gap-y-28 md:pb-32 md:pt-16">
          {projects.map((p, i) => {
            const s = GRID_PATTERN[i % GRID_PATTERN.length];
            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                data-cursor-text="View case study"
                className={`wi-item group block ${s.place} ${s.offset}`}
              >
                <div className={`relative overflow-hidden bg-neutral-200 ${s.aspect}`}>
                  <Image
                    src={p.thumb}
                    alt={`${p.name} website`}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em]">{p.name}</h3>
                  <span className="text-base opacity-60">
                    {p.category}, {yearOf(p)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Works() {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<View>("list");

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((f) => [f, f === "All" ? CASE_STUDIES.length : CASE_STUDIES.filter((p) => p.category === f).length])
      ) as Record<Filter, number>,
    []
  );

  // useMemo keeps the array stable, so the entrance animation only replays when the filter changes.
  const list = useMemo(
    () => (filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div className="lg:pb-40 md:pb-32 sm:pb-24 pb-16">
      <Hero />
      <FilterBar active={filter} counts={counts} onChange={setFilter} view={view} onViewChange={setView} />
      <Index projects={list} view={view} />
    </div>
  );
}