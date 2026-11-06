"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type IconName = "terminal" | "frame" | "rows" | "blocks" | "drag" | "bag";

// Icons are handed out in this order when an item has no `icon` of its own.
const ICON_ORDER: IconName[] = ["terminal", "frame", "rows", "blocks", "drag", "bag"];

type Platform = {
  name: string;
  points: string[]; // 4 to 6 short lines
  icon?: IconName; // optional: leave it out and one is picked automatically
};

/* ------------------------------------------------------------------
   ADD MORE PLATFORMS HERE
   Copy one block, change the name and the lines. That is all:
   the scroll distance adjusts to any number of cards.
------------------------------------------------------------------ */
const DEFAULT_PLATFORMS: Platform[] = [
  {
    name: "Custom code",
    points: [
      "Next.js and TypeScript",
      "3D and WebGL",
      "AI agents",
      "Custom animation",
      "Full source ownership",
    ],
    icon: "terminal",
  },
  {
    name: "Framer",
    points: [
      "Fast launch",
      "Easy self-editing",
      "Marketing sites",
      "Portfolios",
      "Built-in hosting",
    ],
    icon: "frame",
  },
  {
    name: "Webflow",
    points: [
      "Built-in CMS",
      "Blogs and content",
      "Client-friendly editor",
      "Landing pages",
      "SEO control",
    ],
    icon: "rows",
  },
  {
    name: "WordPress",
    points: [
      "Custom themes",
      "WooCommerce stores",
      "Large content sites",
      "Plugins and integrations",
      "Familiar editor",
    ],
    icon: "blocks",
  },
  {
    name: "Wix",
    points: [
      "Low budget",
      "Small business sites",
      "Drag and drop editing",
      "Bookings and forms",
      "Quick launch",
    ],
    icon: "drag",
  },
  {
    name: "Shopify",
    points: [
      "Online stores",
      "Checkout and payments",
      "Inventory",
      "Theme customization",
      "App integrations",
    ],
    icon: "bag",
  },
];

// Every class is written out in full so Tailwind can see it.
// Hover style shudhu hover-capable device e: touch e tap korle atke thake na.
const THEMES = {
  dark: {
    section: "bg-black text-[#f5f5f0]",
    card: "border-white/15 [@media(hover:hover)]:hover:bg-[#f5f5f0] [@media(hover:hover)]:hover:text-black",
    list: "text-white/60 [@media(hover:hover)]:group-hover:text-black/60",
    label: "text-white/50",
  },
  light: {
    section: "bg-white text-black",
    card: "border-black/15 [@media(hover:hover)]:hover:bg-black [@media(hover:hover)]:hover:text-[#f5f5f0]",
    list: "text-black/60 [@media(hover:hover)]:group-hover:text-[#f5f5f0]/60",
    label: "text-black/50",
  },
} as const;

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: "0 0 64 64",
    className: "h-14 w-14 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20",
    fill: "currentColor",
    "aria-hidden": true,
    "data-icon": name,
  } as const;

  switch (name) {
    case "terminal": // prompt chevron + blinking cursor
      return (
        <svg {...common}>
          <polygon points="8,14 30,32 8,50 8,41 20,32 8,23" />
          <rect data-cursor x="34" y="42" width="22" height="7" />
        </svg>
      );
    case "frame": // selection box that tightens around its content
      return (
        <svg {...common}>
          <rect
            data-outline
            x="14"
            y="14"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <rect data-handle data-hx="5" data-hy="5" x="8" y="8" width="12" height="12" />
          <rect data-handle data-hx="-5" data-hy="5" x="44" y="8" width="12" height="12" />
          <rect data-handle data-hx="5" data-hy="-5" x="8" y="44" width="12" height="12" />
          <rect data-handle data-hx="-5" data-hy="-5" x="44" y="44" width="12" height="12" />
        </svg>
      );
    case "rows": // content rows resizing like CMS entries
      return (
        <svg {...common}>
          <rect data-row x="6" y="12" width="52" height="10" />
          <rect data-row x="6" y="27" width="52" height="10" />
          <rect data-row x="6" y="42" width="52" height="10" />
        </svg>
      );
    case "blocks": // editor blocks that pulse one after another
      return (
        <svg {...common}>
          <rect data-blk x="6" y="6" width="24" height="24" />
          <rect data-blk x="34" y="6" width="24" height="24" />
          <rect data-blk x="34" y="34" width="24" height="24" />
          <rect data-blk x="6" y="34" width="24" height="24" />
        </svg>
      );
    case "drag": // block dragged between two slots
      return (
        <svg {...common}>
          <rect
            x="7.5"
            y="23.5"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="4 3"
          />
          <rect
            x="39.5"
            y="23.5"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="4 3"
          />
          <rect data-block x="6" y="22" width="20" height="20" />
        </svg>
      );
    case "bag": // item drops into a bag
      return (
        <svg {...common}>
          <circle data-item cx="32" cy="7" r="5" />
          <rect data-body x="10" y="30" width="44" height="28" />
          <path
            d="M22 30 V26 a10 10 0 0 1 20 0 V30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      );
  }
}

// Builds the looping animation for one icon. Returns the timeline so hover can speed it up.
function buildIconTimeline(svg: SVGElement): gsap.core.Timeline | null {
  const name = svg.dataset.icon;
  const q = <T extends Element>(sel: string) => svg.querySelectorAll<T>(sel);

  switch (name) {
    case "terminal": {
      const tl = gsap.timeline({ repeat: -1 });
      tl.set(q("[data-cursor]"), { opacity: 0 }, 0.5).set(
        q("[data-cursor]"),
        { opacity: 1 },
        1
      );
      return tl;
    }
    case "frame": {
      const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.5 });
      tl.to(
        q("[data-outline]"),
        { scale: 0.7, transformOrigin: "50% 50%", duration: 1.1, ease: "power2.inOut" },
        0
      ).to(
        q<SVGElement>("[data-handle]"),
        {
          x: (_i: number, el: SVGElement) => Number(el.dataset.hx),
          y: (_i: number, el: SVGElement) => Number(el.dataset.hy),
          duration: 1.1,
          ease: "power2.inOut",
        },
        0
      );
      return tl;
    }
    case "rows": {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      const scales = [0.35, 0.65, 0.5];
      tl.to(
        q<SVGElement>("[data-row]"),
        {
          scaleX: (i: number) => scales[i],
          transformOrigin: "0% 50%",
          duration: 1,
          ease: "sine.inOut",
          stagger: 0.2,
        },
        0
      );
      return tl;
    }
    case "blocks": {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(q("[data-blk]"), {
        scale: 0.5,
        transformOrigin: "50% 50%",
        duration: 0.35,
        ease: "power2.inOut",
        stagger: 0.15,
        yoyo: true,
        repeat: 1,
      }).to({}, { duration: 0.6 });
      return tl;
    }
    case "drag": {
      const block = q("[data-block]");
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(block, { x: 32, duration: 0.9, ease: "power3.inOut" })
        .to(block, {
          scale: 1.15,
          transformOrigin: "50% 50%",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
        })
        .to(block, { x: 0, duration: 0.9, ease: "power3.inOut" }, "+=0.5")
        .to(block, {
          scale: 1.15,
          transformOrigin: "50% 50%",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
        })
        .to({}, { duration: 0.4 });
      return tl;
    }
    case "bag": {
      const item = q("[data-item]");
      const body = q("[data-body]");
      const tl = gsap.timeline({ repeat: -1 });
      tl.set(item, { y: 0 })
        .to(item, { y: 32, duration: 0.7, ease: "power2.in" })
        .to(body, {
          scaleY: 0.92,
          transformOrigin: "50% 100%",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
        })
        .to({}, { duration: 0.6 });
      return tl;
    }
    default:
      return null;
  }
}

type Props = {
  platforms?: Platform[];
  theme?: keyof typeof THEMES;
};

export default function Platforms({
  platforms = DEFAULT_PLATFORMS,
  theme = "dark",
}: Props) {
  const t = THEMES[theme];
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!root || !pin || !viewport || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // Icons: loop gently, speed up while the card is hovered or focused
      if (!reduce) {
        root.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
          const svg = card.querySelector<SVGElement>("[data-icon]");
          if (!svg) return;
          const tl = buildIconTimeline(svg);
          if (!tl) return;
          tl.timeScale(0.7);

          const fast = () => gsap.to(tl, { timeScale: 2.4, duration: 0.4, overwrite: true });
          const slow = () => gsap.to(tl, { timeScale: 0.7, duration: 0.6, overwrite: true });
          card.addEventListener("mouseenter", fast);
          card.addEventListener("mouseleave", slow);
          card.addEventListener("focusin", fast);
          card.addEventListener("focusout", slow);
          cleanups.push(() => {
            card.removeEventListener("mouseenter", fast);
            card.removeEventListener("mouseleave", slow);
            card.removeEventListener("focusin", fast);
            card.removeEventListener("focusout", slow);
          });
        });
      }

      // Desktop (lg+, motion on): block locks at the CENTER of the screen, cards slide sideways.
      // Mobile / tablet / reduced motion: native swipe with snap.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(1, track.scrollWidth - viewport.clientWidth);

        viewport.style.overflowX = "hidden";

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            // centered when it fits the screen, otherwise lock at the top
            start: () =>
              pin.offsetHeight >= window.innerHeight ? "top top" : "center center",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance() }, 0);

        // Hidden viewport kokhono nijer scrollLeft e jete dibo na (keyboard focus e browser eta kore)
        const lockScroll = () => {
          if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
        };
        viewport.addEventListener("scroll", lockScroll);

        // Tab diye off-screen card e gele page scroll oi card porjonto jay
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
          const st = tl.scrollTrigger;
          const first = track.querySelector<HTMLElement>("[data-card]");
          if (!card || !st || !first) return;

          const trackLeft = track.getBoundingClientRect().left;
          const rel = card.getBoundingClientRect().left - trackLeft;
          const start = first.getBoundingClientRect().left - trackLeft;
          const progress = Math.min(1, Math.max(0, (rel - start) / distance()));
          window.scrollTo({ top: st.start + progress * (st.end - st.start) });
        };
        track.addEventListener("focusin", onFocus);

        return () => {
          viewport.removeEventListener("scroll", lockScroll);
          track.removeEventListener("focusin", onFocus);
          viewport.style.overflowX = "";
        };
      });
      cleanups.push(() => mm.revert());
    }, root);

    // Re-measure once fonts / images / other sections have settled,
    // so the pin start and the scroll distance are not stale.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    const timer = window.setTimeout(refresh, 400);
    cleanups.push(() => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timer);
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [platforms]);

  return (
    <section
      ref={rootRef}
      // z-10 + isolate: stays solid above any sticky/fixed section behind it
      className={`relative isolate z-10 w-full ${t.section}`}
      aria-labelledby="platforms-heading"
    >
      {/* Breathing room lives on the section, so the pinned block can sit dead center */}
      <div className="pb-16 sm:pb-24 md:pb-32 lg:pb-40">
        {/* The pinned layer also carries the background, so it is never see-through while pinned */}
        <div ref={pinRef} className={`flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-12 ${t.section}`}>
          {/* Sub heading + title */}
          <div className="px-5 sm:px-6 md:px-8">
            <span className={`text-sm ${t.label}`}>[Tools]</span>
            <h2
              id="platforms-heading"
              className="mt-5 max-w-[30ch] text-pretty break-words text-[clamp(1.75rem,3.8vw,3.9rem)] font-medium leading-[1.05] tracking-[-0.035em] sm:mt-6"
            >
              The right tool for each project. We pick the platform that fits your
              goal, budget and team, not the one we like most.
            </h2>
          </div>

          {/* Cards */}
          <div>
            <div
              ref={viewportRef}
              // snap shudhu native swipe e (lg er niche), scroll-px = padding er sathe align
              className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-5 [scrollbar-width:none] sm:scroll-px-6 md:scroll-px-8 lg:snap-none [&::-webkit-scrollbar]:hidden"
            >
              <div
                ref={trackRef}
                className="flex w-max px-5 will-change-transform sm:px-6 md:px-8"
              >
                {platforms.map((p, i) => (
                  <article
                    key={p.name}
                    data-card
                    tabIndex={0}
                    className={[
                      "group flex shrink-0 snap-start flex-col justify-between border-y border-l p-5 transition-colors duration-500 sm:p-6 md:p-8",
                      "h-[clamp(22rem,58svh,26.25rem)] w-[min(86vw,380px)] md:w-[min(48vw,380px)]",
                      "lg:h-[clamp(22rem,48svh,28rem)] lg:w-[clamp(20rem,28vw,27.5rem)]",
                      i === platforms.length - 1 ? "border-r" : "",
                      t.card,
                      "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current",
                    ].join(" ")}
                  >
                    <Icon name={p.icon ?? ICON_ORDER[i % ICON_ORDER.length]} />

                    <div className="flex flex-col gap-4 md:gap-5">
                      <h3 className="break-words text-[clamp(1.75rem,3.2vw,3.25rem)] font-medium leading-none tracking-[-0.035em]">
                        {p.name}
                      </h3>
                      <ul
                        className={`flex flex-col gap-1 text-sm leading-snug transition-colors duration-500 sm:text-base ${t.list}`}
                      >
                        {p.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}