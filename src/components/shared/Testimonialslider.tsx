'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Testimonial {
  id: string;
  index: string; // "01", "02" ...
  reviewTitle: string;
  reviewBody: string;
  clientName: string;
  clientPosition: string;
  clientImage: string;
  // swap this for a real <img> logo per client/company when you have assets
  logoLabel: string;
}

// Replace with real client data — images, names, positions, and reviews.
const testimonials: Testimonial[] = [
  {
    id: 'marco',
    index: '01',
    reviewTitle: 'Trusted by serious players',
    reviewBody:
      "Every session is built around match footage, not guesswork. I finally train the things that actually cost me points.",
    clientName: 'Marco Vight',
    clientPosition: 'ATP Challenger Tour',
    clientImage: 'https://picsum.photos/seed/marco-tennis/900/1200',
    logoLabel: 'VIGHT',
  },
  {
    id: 'elena',
    index: '02',
    reviewTitle: 'Cut two seconds off my serve return',
    reviewBody:
      'Six months of structured video review rebuilt my footwork from the ground up. I stopped guessing and started training with a plan.',
    clientName: 'Elena Torres',
    clientPosition: 'NCAA Division I, Singles',
    clientImage: 'https://picsum.photos/seed/elena-tennis/900/1200',
    logoLabel: 'TORRES',
  },
  {
    id: 'kenji',
    index: '03',
    reviewTitle: 'Coaching that actually adapts',
    reviewBody:
      "My program changed the moment my shoulder injury did. No other academy re-planned around recovery this fast.",
    clientName: 'Kenji Watanabe',
    clientPosition: 'ITF Junior Circuit',
    clientImage: 'https://picsum.photos/seed/kenji-tennis/900/1200',
    logoLabel: 'WATANABE',
  },
  {
    id: 'priya',
    index: '04',
    reviewTitle: 'Numbers instead of opinions',
    reviewBody:
      'Every drill ties back to a stat from my last match. It made practice feel like preparation, not repetition.',
    clientName: 'Priya Nair',
    clientPosition: 'WTA 125 Series',
    clientImage: 'https://picsum.photos/seed/priya-tennis/900/1200',
    logoLabel: 'NAIR',
  },
];

// Edit this freely — it's the big split heading behind the card.
// "light" renders faint/thin, "bold" renders solid black.
const heading = {
  left: { light: 'EXPERT', bold: 'DRIVEN' },
  right: { light: 'RESULT-', bold: 'COACHING' },
};

const AUTO_LOOP_MS = 5000;

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  // auto-loop, paused on hover/focus within the section
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, AUTO_LOOP_MS);
    return () => clearInterval(id);
  }, [paused]);

  // crossfade the logo/review badges, and tilt the center card in on every change —
  // alternating left/right based on slide parity.
  useEffect(() => {
    const fadeTargets = [reviewRef.current, logoRef.current].filter(
      Boolean
    ) as HTMLDivElement[];

    if (prefersReducedMotion.current) {
      gsap.set(fadeTargets, { opacity: 1, y: 0 });
      gsap.set(cardRef.current, { opacity: 1, rotate: 0, scale: 1 });
      return;
    }

    if (fadeTargets.length > 0) {
      gsap.killTweensOf(fadeTargets);
      gsap.fromTo(
        fadeTargets,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }
      );
    }

    if (cardRef.current) {
      const tiltFrom = active % 2 === 0 ? -7 : 7;
      gsap.killTweensOf(cardRef.current);
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, rotate: tiltFrom, scale: 0.96 },
        { opacity: 1, rotate: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
      );
    }
  }, [active]);

  const goTo = (index: number) => {
    setActive(((index % testimonials.length) + testimonials.length) % testimonials.length);
  };

  const current = testimonials[active];

  return (
    <section
      className="relative w-full bg-[#fbfaf8] px-6 py-16 md:px-12 md:py-20 lg:px-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* outer composition box — badges live at its natural top (top: 0,
          never negative), so this box's height is fully predictable and
          nothing here can ever push into the space above the section.
          pt-* reserves real room for the badges above the heading — using
          padding (not margin) here is what prevents the collapse bug. */}
      <div className="relative w-full">
       <div className='flex justify-between items-center'>
              {/* logo badge — top-left, flush with the section's own left edge */}
        <div
          ref={logoRef}
          className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white text-center shadow-lg md:h-24 md:w-24"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/70 md:text-[10px]">
            {current.logoLabel}
          </span>
        </div>

        {/* review badge — top-right, flush with the section's own right edge */}
        <div
          ref={reviewRef}
          className="w-[220px] rounded-2xl bg-white p-5 text-left shadow-lg md:w-[300px] md:p-6"
        >
          <span className="text-xs font-semibold tracking-wide text-black/40">
            #{current.index}
          </span>
          <p className="mt-1 text-sm font-semibold leading-snug text-black">
            {current.reviewTitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-black/50">
            {current.reviewBody}
          </p>
        </div>
       </div>
      

        {/* heading block — the gap above it comes from padding-top on the
            OUTER container (see below), not margin-top here. A margin-top
            on this element would collapse straight through its parent
            (since the parent has no padding/border of its own), wiping out
            the gap entirely — that was the overlap bug. */}
        <div className="relative flex w-full items-center justify-between">
          <h2 className="select-none leading-[0.9] tracking-tight">
            <span className="block text-[11vw] font-medium text-black/10 md:text-[5.5vw]">
              {heading.left.light}
            </span>
            <span className="block text-[11vw] font-black text-black md:text-[5.5vw]">
              {heading.left.bold}
            </span>
          </h2>
          <h2 className="select-none text-right leading-[0.9] tracking-tight">
            <span className="block text-[11vw] font-medium text-black/10 md:text-[5.5vw]">
              {heading.right.light}
            </span>
            <span className="block text-[11vw] font-black text-black/20 md:text-[5.5vw]">
              {heading.right.bold}
            </span>
          </h2>

          {/* center card — centered on this heading block specifically,
              independent of the badges above it */}
          <div
            ref={cardRef}
            className="absolute left-1/2 top-1/2 aspect-[3/4] w-[38vw] max-w-[260px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.clientImage}
              alt={`${current.clientName}, ${current.clientPosition}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent px-5 pb-5 pt-16">
              <p className="text-sm font-semibold text-white">{current.clientName}</p>
              <p className="text-xs text-white/70">{current.clientPosition}</p>
            </div>
          </div>
        </div>
      </div>

      {/* controls — left arrow, dot pagination, right arrow spread across
          the full width, matching the reference */}
      <div className="relative z-10 mt-14 flex w-full items-center justify-between">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => goTo(active - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-black' : 'w-1.5 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => goTo(active + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}