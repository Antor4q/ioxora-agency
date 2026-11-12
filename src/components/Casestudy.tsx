"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CaseStudyData } from "./CaseStudies";
import DitherSmoke from "./Dithersmoke";

gsap.registerPlugin(ScrollTrigger);

const Label = ({ children, light }: { children: ReactNode; light?: boolean }) => (
  <p className={`text-sm font-medium tracking-tight sm:text-base ${light ? "text-white/50" : "text-black/55"}`}>
    [{children}]
  </p>
);

const pad = "px-4 sm:px-6 lg:px-8";
// minmax(0, ...) diye rakhchi jate lomba text mobile/tablet e overflow na kore
const split = "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-3";
const bigText =
  "max-w-[34ch] text-balance text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.025em]";
const h2 = "mt-5 max-w-[12ch] text-[clamp(2rem,5vw,3.8rem)] font-medium leading-[1] tracking-[-0.035em]";
const ratios = ["aspect-[4/5]", "aspect-square", "aspect-[5/4]"];

// Page bg white, tai card/panel gulo soft off-white
const soft = "bg-[#f4f3ef]";

// Process card er 3 ta tone (soft, sand, black), repeat hobe
const tones = [
  { card: `${soft} text-black border-black/10`, muted: "text-black/60", num: "text-black/20" },
  { card: "bg-[#e6e3da] text-black border-black/10", muted: "text-black/60", num: "text-black/20" },
  { card: "bg-black text-white border-black", muted: "text-white/60", num: "text-white/25" },
];

// swatch-er upor text black naki white hobe
const isLight = (hex: string) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function CaseStudy({
  data,
  next,
}: {
  data: CaseStudyData;
  next: { name: string; href: string };
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;

      // Hero
      gsap.from(".h-line", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.09 });
      gsap.from(".hero-fade", { y: 16, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.5, stagger: 0.1 });
      gsap.fromTo(
        ".cover",
        { scale: 0.92 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".cover", start: "top 92%", end: "top 30%", scrub: true },
        }
      );

      // Generic reveal (meta cards, points, swatches, fonts, result cards)
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      // Gallery batch reveal
      gsap.set(".g-item", { opacity: 0, y: 50 });
      ScrollTrigger.batch(".g-item", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12 }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Gallery 2 column staggered
  const colA = data.gallery.filter((_, i) => i % 2 === 0);
  const colB = data.gallery.filter((_, i) => i % 2 === 1);

  const renderImg = (g: { src: string }, i: number, offset: number) => (
    <figure key={`${offset}-${i}`} className="g-item group relative overflow-hidden rounded-xl bg-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={g.src}
        alt=""
        loading="lazy"
        className={`${ratios[(i + offset) % ratios.length]} w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105`}
      />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
        {String(i * 2 + offset + 1).padStart(2, "0")}
      </figcaption>
    </figure>
  );

  return (
    <main ref={root} className="relative bg-white text-black">
      {/* Hero */}
      <header className={`${pad} pt-28 sm:pt-32 lg:pt-36`}>
        <div className="hero-fade flex items-center justify-between text-sm sm:text-base">
          <p className="font-medium text-black/55">[Case Study {data.id}]</p>
          <Link href="/work" className="group/b relative inline-block py-1 outline-none focus-visible:underline">
            <span className="relative">
              <span
                aria-hidden
                className="absolute right-full mr-1 translate-x-2 opacity-0 transition-all duration-300 group-hover/b:translate-x-0 group-hover/b:opacity-100"
              >
                [
              </span>
              Back to work
              <span
                aria-hidden
                className="absolute left-full ml-1 -translate-x-2 opacity-0 transition-all duration-300 group-hover/b:translate-x-0 group-hover/b:opacity-100"
              >
                ]
              </span>
            </span>
          </Link>
        </div>

        <div className="mt-8 grid items-end gap-8 sm:mt-12 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <h1 className="break-words text-[clamp(2.5rem,8vw,7.5rem)] font-medium leading-[1] tracking-[-0.04em]">
            {data.title.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="h-line block">{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade max-w-[34ch] text-lg text-black/65 sm:text-xl lg:justify-self-end lg:pb-3">
            {data.result}
          </p>
        </div>
      </header>

      {/* Cover video */}
      <div className={`${pad} mt-10 sm:mt-14`}>
        <div className="cover overflow-hidden rounded-2xl bg-black">
          <video
            src={data.video}
            poster={data.thumb}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/8]"
          />
        </div>
      </div>

      {/* 1. Details */}
      <section className={`${pad} ${split} py-16 sm:py-24 lg:py-36`}>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Label>Details</Label>
        </div>
        <div>
          <p className={bigText}>{data.overview}</p>
          <dl className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3">
            {data.meta.map(([k, v]) => (
              <div key={k} className={`reveal rounded-xl border border-black/10 p-4 sm:p-5 ${soft}`}>
                <dt className="mb-6 text-sm font-medium text-black/45 sm:mb-10 sm:text-base">[{k}]</dt>
                <dd className="break-words text-base font-medium sm:text-lg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Problem */}
      <section className="px-3 pb-3">
        <div className={`${split} rounded-2xl p-5 sm:p-8 lg:p-12 ${soft}`}>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Label>Problem</Label>
            <h2 className={h2}>What was broken.</h2>
          </div>
          <div>
            <p className={bigText}>{data.problem}</p>
            <ul className="mt-10 sm:mt-14">
              {data.problemPoints.map(([t, d], i) => (
                <li
                  key={t}
                  className="reveal grid gap-2 border-t border-black/10 py-6 last:border-b sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6 sm:py-8"
                >
                  <h3 className="flex items-baseline gap-3 text-xl font-medium tracking-[-0.02em] sm:text-2xl">
                    <span className="text-sm text-black/40 sm:text-base">0{i + 1}</span>
                    {t}
                  </h3>
                  <p className="text-base leading-relaxed text-black/65 sm:text-lg">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Solution */}
      <section className="px-3 pb-3">
        <div className={`${split} rounded-2xl bg-black p-5 text-white sm:p-8 lg:p-12`}>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Label light>Solution</Label>
            <h2 className={h2}>What we built.</h2>
          </div>
          <div>
            <p className={bigText}>{data.solution}</p>
            <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {data.solutionPoints.map(([t, d], i) => (
                <li
                  key={t}
                  className="reveal rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
                >
                  <span className="text-sm text-white/40 sm:text-base">0{i + 1}</span>
                  <h3 className="mt-6 text-xl font-medium tracking-[-0.02em] sm:mt-10 sm:text-2xl">{t}</h3>
                  <p className="mt-3 text-base leading-relaxed text-white/60">{d}</p>
                </li>
              ))}
            </ul>
            {data.stack.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {data.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 sm:text-base"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* 4. Style guide */}
      <section className={`${pad} ${split} py-16 sm:py-24 lg:py-36`}>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Label>Style guide</Label>
          <h2 className={h2}>Colour & type.</h2>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.styleGuide.colors.map(([name, hex]) => (
              <div
                key={hex}
                className={`reveal flex aspect-[4/5] flex-col justify-between rounded-xl border border-black/10 p-4 sm:aspect-[3/4] ${
                  isLight(hex) ? "text-black" : "text-white"
                }`}
                style={{ backgroundColor: hex }}
              >
                <span className="text-sm font-medium sm:text-base">{name}</span>
                <span className="text-sm uppercase opacity-70">{hex}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.styleGuide.fonts.map(([role, family]) => (
              <div key={role} className={`reveal rounded-xl border border-black/10 p-5 sm:p-6 ${soft}`}>
                <p className="text-sm font-medium text-black/45 sm:text-base">[{role}]</p>
                <p
                  className="mt-8 text-[clamp(4rem,8vw,6.5rem)] font-medium leading-none tracking-[-0.04em]"
                  style={{ fontFamily: `"${family}", sans-serif` }}
                >
                  Aa
                </p>
                <p className="mt-6 text-lg font-medium">{family}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gallery: left text, right chhoto staggered images */}
      <section className={`${pad} ${split} pb-16 sm:pb-24 lg:pb-36`}>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Label>Gallery</Label>
          <h2 className={h2}>Selected frames.</h2>
          <p className="mt-6 max-w-[32ch] text-base leading-relaxed text-black/65 sm:text-lg">
            A closer look at the interface, details and moments from the project.
          </p>
          <p className="mt-8 text-sm font-medium text-black/45 sm:text-base">
            [{String(data.gallery.length).padStart(2, "0")} images]
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">{colA.map((g, i) => renderImg(g, i, 0))}</div>
          <div className="flex flex-col gap-3 pt-8 sm:gap-4 sm:pt-16">
            {colB.map((g, i) => renderImg(g, i, 1))}
          </div>
        </div>
      </section>

      {/* 6. Process: sticky stacking cards (scroll korle ekta card er upor arekta jome) */}
      <section className={`${pad} ${split} pb-16 sm:pb-24 lg:pb-36`}>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Label>Process</Label>
          <h2 className={h2}>How we got there.</h2>
          <p className="mt-6 max-w-[32ch] text-base leading-relaxed text-black/65 sm:text-lg">
            {String(data.process.length).padStart(2, "0")} steps, from first call to launch.
          </p>
        </div>
        <ol>
          {data.process.map(([t, d], i) => {
            const tone = tones[i % tones.length];
            return (
              <li
                key={t}
                className="sticky pb-3 sm:pb-4"
                style={{ top: `calc(5.5rem + ${i * 14}px)` }}
              >
                <div
                  className={`min-h-[16rem] rounded-2xl border p-5 sm:min-h-[20rem] sm:p-8 ${tone.card}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`text-[clamp(4rem,10vw,7.5rem)] font-medium leading-none tracking-[-0.05em] ${tone.num}`}
                    >
                      0{i + 1}
                    </span>
                    <span className={`pt-2 text-sm font-medium sm:text-base ${tone.muted}`}>
                      [Step {i + 1}/{data.process.length}]
                    </span>
                  </div>
                  <h3 className="mt-10 text-3xl font-medium tracking-[-0.03em] sm:mt-14 sm:text-5xl">{t}</h3>
                  <p className={`mt-4 max-w-[46ch] text-base leading-relaxed sm:text-lg ${tone.muted}`}>{d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 7. Result: text-based cards (results khali thakle section dekhabe na) */}
      {data.results.length > 0 && (
        <section className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-black text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, #000 40%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%)",
              }}
            >
              <DitherSmoke className="h-full w-full" />
            </div>

            <div className="relative z-10 p-5 pb-16 sm:p-8 sm:pb-24 lg:p-12 lg:pb-28">
              <Label light>Result</Label>
              <div className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-3">
                {data.results.map(([title, text], i) => (
                  <div
                    key={title}
                    className="reveal flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6"
                  >
                    <span className="text-sm text-white/40 sm:text-base">0{i + 1}</span>
                    <h3 className="mt-10 text-2xl font-medium leading-[1.1] tracking-[-0.03em] sm:mt-16 sm:text-3xl">
                      {title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Feedback + client pic (quote khali thakle section dekhabe na) */}
      {data.quote && (
        <section className="px-3 pb-3">
          <div className={`${split} rounded-2xl p-5 sm:p-8 lg:p-12 ${soft}`}>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Label>Feedback</Label>
            </div>
            <div>
              <blockquote className="max-w-[24ch] text-balance text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                “{data.quote}”
              </blockquote>
              <div className="mt-8 flex items-center gap-4 border-t border-black/10 pt-6 sm:mt-10 sm:gap-5">
                {data.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.avatar}
                    alt={data.person[0]}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-black text-lg font-medium text-white sm:h-20 sm:w-20 sm:text-xl"
                  >
                    {initials(data.person[0])}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold sm:text-xl">{data.person[0]}</p>
                  <p className="text-black/60">{data.person[1]}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Space: inline style, tai Tailwind class er upor depend kore na */}
      <div aria-hidden style={{ height: "clamp(6rem, 14vw, 11rem)" }} />

      {/* 9. Next case study */}
      <section className="px-3 pb-3">
        <Link
          href={next.href}
          className="group relative block overflow-hidden rounded-2xl bg-black px-5 pt-8 text-white outline-none focus-visible:ring-2 focus-visible:ring-black sm:px-8 sm:pt-10 lg:px-12"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3f] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 motion-reduce:transition-none"
          />
          <p className="relative text-sm font-medium text-white/60 transition-colors duration-500 group-hover:text-black/70 sm:text-base">
            [Next case study]
          </p>
          <p className="relative -mb-[0.16em] mt-6 break-words text-[clamp(3rem,15vw,14rem)] font-medium leading-[0.9] tracking-[-0.05em] transition-colors duration-500 group-hover:text-black sm:mt-10">
            {next.name}
          </p>
        </Link>
      </section>
    </main>
  );
}