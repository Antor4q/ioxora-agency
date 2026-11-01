'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Point {
  title: string;
  text: string;
}

// Edit the copy to match what ioXora really promises.
const points: Point[] = [
  {
    title: 'Small team, direct line',
    text: 'You talk to the people who design and build your website. No account managers, no hand-offs, no lost context.',
  },
  {
    title: 'Motion, 3D and AI built in',
    text: 'Not an add-on at the end. We design them into the idea from day one, so everything feels like one product.',
  },
  {
    title: 'Fast by default',
    text: 'Clean code, optimised assets and performance budgets. Pages that load quickly, feel smooth and rank well.',
  },
  {
    title: 'Built to convert',
    text: 'Every section has a job. We shape the story, the layout and the calls to action around what you want visitors to do.',
  },
  {
    title: 'Clear process, no surprises',
    text: 'Fixed scope, weekly updates and a timeline agreed up front, so you always know where the project stands.',
  },
];

const DIM = 0.22; // opacity of points that are not in focus

export default function WhyUsSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.w-item');

      if (reduce) {
        gsap.set(items, { opacity: 1 });
        return;
      }

      // heading words rise in once
      gsap.from('.w-head', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.w-left',
          start: 'top 80%',
          once: true,
        },
      });

      items.forEach((item) => {
        // slide up the first time it scrolls into view
        gsap.from(item, {
          y: 36,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            once: true,
          },
        });

        // bright while it sits in the middle band of the screen, dim otherwise
        gsap.set(item, { opacity: DIM });

        ScrollTrigger.create({
          trigger: item,
          start: 'top 62%',
          end: 'bottom 38%',
          onToggle: (self) => {
            gsap.to(item, {
              opacity: self.isActive ? 1 : DIM,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },
        });
      });
    }, root);

    // fonts / images can shift the layout after first paint
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="why-us"
      className="relative z-10 bg-white px-6 pb-28 pt-24 text-[#0a0a0a] md:px-8 md:pb-48 md:pt-40"
    >
      {/* LABEL */}

      <div className="flex items-center justify-between text-sm">
        <p>[03 / Why us]</p>
        <p className="hidden md:block">(Why work with us)</p>
      </div>

      <div className="mt-16 grid gap-16 md:mt-28 md:grid-cols-12 md:gap-x-8">
        {/* LEFT: sticky heading */}

        <div className="w-left md:sticky md:top-[18svh] md:col-span-5 md:self-start">
          <h2 className="text-[clamp(2.4rem,6vw,6.5rem)] font-medium uppercase leading-[1.02] tracking-[-0.03em] text-black">
            <span className="w-head block">Why work</span>
            <span className="w-head block">with us</span>
          </h2>

          <p className="w-head mt-8 max-w-[28vw] min-w-[260px] text-[clamp(15px,0.95vw,19px)] leading-[1.35]">
            A small studio that cares about the details, and a direct line to
            the people doing the work.
          </p>

          <a
            href="#contact"
            className="w-head group/link mt-7 inline-flex items-center gap-2 border border-black/15 bg-white px-6 py-3 text-[clamp(13px,0.8vw,15px)] transition-colors duration-300 hover:border-black hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Start a project
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </div>

        {/* RIGHT: points */}

        <div className="md:col-span-6 md:col-start-7">
          {points.map((point, i) => (
            <div
              key={point.title}
              className="w-item border-t border-black/15 py-10 last:border-b md:py-16"
            >
              <p className="text-sm text-black/50">
                ({String(i + 1).padStart(2, '0')})
              </p>

              <h3 className="mt-5 text-[clamp(1.6rem,2.8vw,3rem)] font-medium uppercase leading-[1.05] tracking-[-0.03em] text-black">
                {point.title}
              </h3>

              <p className="mt-5 max-w-[46ch] text-[clamp(15px,1.05vw,19px)] leading-[1.4] text-black/70">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}