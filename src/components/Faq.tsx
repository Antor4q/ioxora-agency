"use client";

import { useState } from "react";
import Link from "next/link";

// Brand lime: exact hex ta find-replace kore nijer brand color boshao (#D4FF3A)

type Faq = { q: string; a: string };

// Dummy content: nijer real answer diye replace koro
const FAQS: Faq[] = [
  {
    q: "What kind of websites do you build?",
    a: "Custom websites built with Next.js for startups, product teams and agencies. Our focus is premium frontend work: smooth motion, canvas animation and interactive UI that makes a product easy to understand.",
  },
  {
    q: "How long does a project take?",
    a: "A focused marketing site usually takes a few weeks. Larger builds with a CMS, dashboard or heavy animation take longer. After the first call we give you a clear timeline before any work starts.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on the number of pages, the level of motion and any backend work. We send a fixed quote after understanding your brief, so there are no surprise invoices later.",
  },
  {
    q: "Can you work with our agency or studio?",
    a: "Yes. We keep part of our time for agencies and creative studios, and we are comfortable building on top of your design files or working alongside your team.",
  },
  {
    q: "Do you also handle the backend and CMS?",
    a: "Yes. We work with Node.js, Express, MongoDB and PostgreSQL, and can connect a CMS so your team can update content without touching code.",
  },
  {
    q: "What do you need from us to get started?",
    a: "A short brief, your brand assets and a few references you like. If you do not have copy or design ready yet, tell us and we will help shape it with you.",
  },
];

function Item({
  faq,
  open,
  onToggle,
  id,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <li className="border-t border-black/10 last:border-b">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex min-h-[44px] w-full items-center justify-between gap-4 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-black sm:gap-6 sm:py-6 lg:py-8"
        >
          <span className="min-w-0 text-balance text-[1.1rem] font-medium leading-snug tracking-[-0.015em] sm:text-xl lg:text-2xl">
            {faq.q}
          </span>

          {/* Plus -> minus */}
          <span aria-hidden className="relative h-4 w-4 shrink-0 sm:h-5 sm:w-5">
            <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-black" />
            <span
              className={`absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-black transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] motion-reduce:transition-none ${
                open ? "scale-y-0" : "scale-y-100"
              }`}
            />
          </span>
        </button>
      </h3>

      {/* Smooth height: grid-rows 0fr -> 1fr */}
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[60ch] pb-6 pr-8 text-base leading-relaxed text-black/65 sm:pb-8 sm:pr-10 sm:text-lg">
            {faq.a}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      style={{ backgroundColor: "#ffffff" }}
      className="relative overflow-x-clip bg-white px-4 py-16 text-black sm:px-6 sm:py-24 md:py-32 md:px-8 lg:py-40"
    >
      {/* mobile/tablet e stacked, tai gap boro; lg e side by side */}
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1fr_1.45fr] lg:items-start lg:gap-3">
        {/* Left: intro panel + contact button */}
        <div className="px-0 text-black sm:px-1 lg:sticky lg:top-24 lg:pr-10">
          <p className="mb-4 text-sm font-medium tracking-tight text-black/60 sm:mb-5 sm:text-base">
            [FAQ]
          </p>
          <h2 className="max-w-[16ch] text-balance text-[clamp(2rem,8vw,3.25rem)] font-semibold leading-[1] tracking-[-0.035em] sm:max-w-[18ch] lg:max-w-[14ch] lg:text-[clamp(2.2rem,4.2vw,3.8rem)] lg:leading-[0.98]">
            Questions founders ask before they start.
          </h2>
          <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-black/65 sm:mt-6 sm:text-lg">
            Cannot find your answer here? Tell us about your project and we will reply with a clear plan
            and timeline.
          </p>

      
        </div>

        {/* Right: accordion */}
        <ul className="px-0 sm:px-1 lg:px-6">
          {FAQS.map((faq, i) => (
            <Item
              key={faq.q}
              id={`faq-${i}`}
              faq={faq}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}