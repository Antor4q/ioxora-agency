"use client";

import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Layout numbers
   NAV  = fixed navbar height (tomar header er height onujayi change koro)
   HEAD = collapsed row er strip height
   ------------------------------------------------------------------ */
const NAV = 80;
const HEAD = 88;

type Visual = "chat" | "motion" | "code" | "bars";

type Row = {
  tag: string;
  title: string;
  heading: string;
  body: string;
  visual: Visual;
  /** optional: image dile visual er bodole image dekhabe */
  image?: string;
  bg: string;
  fg: string;
  accent: string;
};

// dark -> white: lime kono bg te nai, shudhu chhoto accent (code, bar)
const rows: Row[] = [
  {
    tag: "[Founders]",
    title: "Direct access to the people building it",
    heading: "No filter, no salesperson.",
    body: "You talk directly with the two founders who design and code your site. Faster answers, fewer handoffs, and your ideas don't get lost along the way.",
    visual: "chat",
    bg: "#0a0a0a",
    fg: "#f3f3f3",
    accent: "#D0E50E",
  },
  {
    tag: "[Motion]",
    title: "Interaction is part of the design",
    heading: "Sites people remember.",
    body: "GSAP, Canvas and WebGL are our core, not an add-on. Scroll, cursor and hover behavior is planned together with the layout, so it feels built in.",
    visual: "motion",
    bg: "#161616",
    fg: "#f3f3f3",
    accent: "#D0E50E",
  },
  {
    tag: "[Custom]",
    title: "Built from scratch, never a template",
    heading: "Every site starts from a blank file.",
    body: "Next.js and TypeScript, written around your brand and content. No theme limits, no plugin bloat, and clean code your team can extend later.",
    visual: "code",
    bg: "#262626",
    fg: "#f3f3f3",
    accent: "#D0E50E",
  },
  {
    tag: "[Performance]",
    title: "Fast and findable from day one",
    heading: "Beautiful, and built to rank.",
    body: "Speed, SEO and accessibility are part of the build, not a cleanup phase after launch.",
    visual: "bars",
    bg: "#ffffff",
    fg: "#0a0a0a",
    accent: "#0a0a0a",
  },
];

const border = (c = "currentColor") =>
  `color-mix(in srgb, ${c} 28%, transparent)`;

/* ------------------------------------------------------------------
   Visuals (pure CSS, kono asset lage na)
   ------------------------------------------------------------------ */

function ChatVisual({ row }: { row: Row }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4 text-sm sm:p-5 lg:text-[15px]">
      <p
        className="max-w-[85%] self-start border border-dotted px-3 py-2 sm:max-w-[78%]"
        style={{ borderColor: border() }}
      >
        Can the hero react to the cursor?
      </p>
      <p
        className="max-w-[85%] self-end px-3 py-2 font-medium sm:max-w-[78%]"
        style={{ background: row.fg, color: row.bg }}
      >
        Yes. Sending you a live preview today.
      </p>
      <p
        className="max-w-[85%] self-start border border-dotted px-3 py-2 sm:max-w-[78%]"
        style={{ borderColor: border() }}
      >
        Great, let&apos;s try a bolder headline too.
      </p>
    </div>
  );
}

function MotionVisual({ row }: { row: Row }) {
  const dot = { borderColor: border() };
  return (
    <div className="relative h-full w-full">
      <div className="why-anim why-x absolute inset-y-0 w-0 border-l border-dotted" style={dot} />
      <div className="why-anim why-y absolute inset-x-0 h-0 border-t border-dotted" style={dot} />
      <div className="why-anim why-xy absolute">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="h-14 w-20 sm:h-16 sm:w-24 lg:h-20 lg:w-32" style={{ background: row.fg }} />
          <p className="mt-2 whitespace-nowrap text-center text-xs sm:text-[13px]">[Interactive web]</p>
        </div>
      </div>
    </div>
  );
}

function CodeVisual({ accent }: { accent: string }) {
  return (
    <pre className="overflow-x-auto p-4 text-[11px] leading-relaxed sm:p-5 sm:text-[12px] lg:text-[13px]">
      <code>
        <span style={{ color: accent }}>const</span> project = {"{"}
        {"\n  "}stack: [<span style={{ color: accent }}>&quot;Next.js&quot;</span>,{" "}
        <span style={{ color: accent }}>&quot;GSAP&quot;</span>],
        {"\n  "}template: <span style={{ color: accent }}>false</span>,
        {"\n  "}designedFor: <span style={{ color: accent }}>&quot;your brand&quot;</span>,
        {"\n"}
        {"}"};
      </code>
    </pre>
  );
}

function BarsVisual({ accent }: { accent: string }) {
  const items = [
    { label: "Speed", w: "92%" },
    { label: "SEO", w: "86%" },
    { label: "Accessibility", w: "78%" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4 sm:gap-5 sm:p-5">
      {items.map((it) => (
        <div key={it.label}>
          <p className="mb-2 text-sm">{it.label}</p>
          <div className="h-2 w-full" style={{ background: border() }}>
            <div
              className="why-bar h-full origin-left"
              style={{ width: it.w, background: accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function renderVisual(row: Row): ReactNode {
  if (row.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={row.image} alt="" className="h-full w-full object-cover" />;
  }
  switch (row.visual) {
    case "chat":
      return <ChatVisual row={row} />;
    case "motion":
      return <MotionVisual row={row} />;
    case "code":
      return <CodeVisual accent={row.accent} />;
    default:
      return <BarsVisual accent={row.accent} />;
  }
}

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export default function WhyUs() {
  const wrap = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // tablet + desktop: collapse hoye gele right content fade out
    mm.add("(min-width: 768px)", () => {
      rowRefs.current.forEach((row, i) => {
        const next = rowRefs.current[i + 1];
        const content = row?.querySelector<HTMLElement>("[data-content]");
        if (!row || !next || !content) return;

        gsap.to(content, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 78%",
            end: "top 40%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    // ekta-i orchestrated moment: visual clip reveal + bar fill
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      rowRefs.current.forEach((row) => {
        if (!row) return;
        const vis = row.querySelector<HTMLElement>("[data-visual]");
        const bars = row.querySelectorAll<HTMLElement>(".why-bar");

        if (vis) {
          gsap.fromTo(
            vis,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.1,
              ease: "power4.out",
              scrollTrigger: { trigger: row, start: "top 70%", once: true },
            }
          );
        }

        if (bars.length) {
          gsap.fromTo(
            bars,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              stagger: 0.12,
              delay: 0.3,
              ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 70%", once: true },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, []);

  // collapsed header click korle oi row te scroll (md+ only, CSS --h er sathe same formula)
  const goTo = (i: number) => {
    const c = wrap.current;
    if (!c || window.innerWidth < 768) return;
    const h = Math.max(460, window.innerHeight - NAV - (rows.length - 1) * HEAD);
    const top =
      c.getBoundingClientRect().top + window.scrollY + i * h - (NAV + i * HEAD);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="why-us"
      className="relative z-10 bg-[#f3f3f3] text-[#0a0a0a]"
      style={
        {
          ["--nav" as string]: `${NAV}px`,
          ["--head" as string]: `${HEAD}px`,
          ["--h" as string]: `max(460px, calc(100svh - var(--nav) - ${(rows.length - 1) * HEAD}px))`,
        } as CSSProperties
      }
    >
      {/* keyframes: motion visual */}
      <style>{`
        @keyframes whyX { 0%,100%{left:22%} 35%{left:70%} 70%{left:45%} }
        @keyframes whyY { 0%,100%{top:30%} 35%{top:40%} 70%{top:72%} }
        .why-anim { animation-duration: 8s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .why-x { animation-name: whyX; }
        .why-y { animation-name: whyY; }
        .why-xy { animation-name: whyX, whyY; }
        @media (prefers-reduced-motion: reduce) { .why-anim { animation: none; } .why-xy{left:50%;top:50%} }
      `}</style>

      {/* intro */}
      <div className="mb-8 px-5 pt-20 text-sm sm:mb-10 sm:px-6 sm:pt-28 md:px-8 md:pt-32 lg:pt-40">
        <p>[Why Us]</p>

        <h2 className="mt-5 max-w-[1400px] break-words text-left text-[clamp(2.5rem,10vw,8.125rem)] font-medium leading-[1.02] tracking-[-0.03em] text-black sm:mt-6 md:mt-10">
          Why Work With Us?
        </h2>
      </div>

      {/* stacked rows */}
      <div ref={wrap}>
        {rows.map((row, i) => (
          <article
            key={row.tag}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="relative px-5 py-12 sm:px-6 sm:py-14 md:sticky md:top-[var(--top)] md:h-[var(--h)] md:px-8 md:py-7 lg:px-10 lg:py-8"
            style={
              {
                background: row.bg,
                color: row.fg,
                zIndex: i + 1,
                ["--top" as string]: `calc(var(--nav) + ${i} * var(--head))`,
                borderTop: `1px dotted ${border(row.fg)}`,
              } as CSSProperties
            }
          >
            <div className="grid h-full gap-6 sm:gap-8 md:grid-cols-12 md:gap-x-6 lg:gap-x-8">
              {/* header strip (collapsed hole sheta-i dekha jay) */}
              <button
                type="button"
                onClick={() => goTo(i)}
                className="flex items-baseline gap-3 self-start text-left sm:gap-4 md:col-span-6"
                aria-label={row.title}
              >
                <span className="w-24 shrink-0 text-sm opacity-70 sm:w-28">{row.tag}</span>
                <span className="text-lg leading-tight md:text-base lg:text-xl xl:text-2xl">
                  {row.title}
                </span>
              </button>

              {/* content */}
              <div
                data-content
                className="flex min-h-0 flex-col md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8"
              >
                <h3 className="text-xl font-semibold leading-tight lg:text-2xl 2xl:text-3xl">
                  {row.heading}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-snug opacity-80 lg:text-base 2xl:max-w-lg 2xl:text-lg">
                  {row.body}
                </p>

                <div
                  data-visual
                  className="relative mt-5 min-h-[200px] flex-1 overflow-hidden border border-dotted sm:mt-6 md:min-h-[160px]"
                  style={{ borderColor: border(row.fg) }}
                >
                  {renderVisual(row)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}