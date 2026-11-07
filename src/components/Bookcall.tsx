"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// 👉 WhatsApp number (country code shoho, + ba space charao). Eg: Bangladesh = 8801XXXXXXXXX
const WHATSAPP_NUMBER = "8801XXXXXXXXX";
const WHATSAPP_TEXT = "Hi ioXora! I'd like to talk about my project.";
const CAL_URL = "https://cal.com/io-xora-tech-mtpk5q/30min";

export default function BookCall() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-fade]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  return (
    <main
      ref={root}
      className="min-h-screen w-full bg-[#FAFAFA] px-8 pt-16 sm:pt-24 text-[#0a0a0a] md:pt-32 lg:pt-40"
    >
      <div className="w-full gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* Left */}
        <div className="flex flex-col items-center">
          <p data-fade className="text-[15px]">
            [ Free intro call ]
          </p>

          <h1
            data-fade
            className="mt-5 text-[clamp(44px,7vw,120px)] font-semibold leading-[0.95] tracking-[-0.045em]"
          >
            Book a 30 min call
          </h1>

          <p data-fade className="mt-6 max-w-xl text-center text-[17px] leading-snug text-black/70 md:text-[20px]">
            Pick a time that suits you and talk directly with the founders who design and build your
            website.
          </p>

          <a
            data-fade
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex w-full items-center justify-center gap-3 bg-[#0a0a0a] px-6 py-4 text-[15px] font-medium text-[#f2f2f2] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            <span>[</span> Message us on WhatsApp <span>]</span>
          </a>
        </div>

        {/* Right */}
        <div data-fade className="w-full lg:mt-10 md:mt-8 mt-6">
          <iframe
            src={`${CAL_URL}?embed=true&theme=light&layout=month_view`}
            title="Book a 30 min call"
            loading="lazy"
            className="block h-[760px] w-full border-0 sm:h-[720px] lg:h-[780px]"
          />
        </div>
      </div>
    </main>
  );
}