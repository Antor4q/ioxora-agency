"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Is ioXora the right fit for my business?",
    answer:
      "If you need a small, senior team that moves fast and cares about the details, most likely yes. We work best with founders and teams who want a real design + development partner, not just an execution vendor.",
  },
  {
    question: "What types of companies do you work with?",
    answer:
      "Mostly startups and small-to-mid size teams building AI-powered products, LMS platforms, or brands that need a premium, interactive web presence.",
  },
  {
    question: "Can you work with our existing team?",
    answer:
      "Yes. We regularly plug into existing product, design, or engineering teams and adapt to your workflow, tools, and cadence.",
  },
  {
    question: "Do you handle both design and development?",
    answer:
      "Yes — end to end. Strategy and UI/UX design, through to production-ready frontend and backend development.",
  },
  {
    question: "What makes ioXora different from other agencies?",
    answer:
      "We're a small, hands-on team — no account managers or hand-offs. The people who design your product are the same people who build it.",
  },
  {
    question: "How do projects usually start?",
    answer:
      "With a short intro call to understand your goals and timeline, followed by a scoped proposal so you know exactly what you're getting before we start.",
  },
  {
    question: "Who will work on my project?",
    answer:
      "You'll work directly with the two of us — no junior hand-offs, no rotating account managers.",
  },
  {
    question: "Can you work with tight deadlines?",
    answer:
      "Often, yes. Tell us your timeline on the intro call and we'll be upfront about what's realistic.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Yes — early-stage and pre-launch startups are a big part of what we do, especially AI-powered products.",
  },
  {
    question: "Can you support us after launch?",
    answer:
      "Yes, we offer ongoing support and iteration after launch — we'd rather build a long-term relationship than disappear after handoff.",
  },
];

const FaqCta = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(introRef.current, {
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(itemRefs.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    answerRefs.current.forEach((el, index) => {
      if (!el) return;

      const isOpen = openIndex === index;

      if (isOpen) {
        gsap.set(el, {
          height: "auto",
        });

        const fullHeight = el.offsetHeight;

        gsap.fromTo(
          el,
          {
            height: 0,
            opacity: 0,
            y: -8,
          },
          {
            height: fullHeight,
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
            onComplete: () => {
              gsap.set(el, {
                height: "auto",
              });
            },
          }
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          y: -8,
          duration: 0.25,
          ease: "power2.inOut",
        });
      }
    });
  }, [openIndex]);

  const handleCtaEnter = () => {
    if (!ctaRef.current) return;

    gsap.to(ctaRef.current.querySelector(".cta-image"), {
      scale: 1.06,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(ctaRef.current.querySelector(".cta-arrow"), {
      x: 8,
      y: -8,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(ctaRef.current.querySelector(".cta-line"), {
      scaleX: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleCtaLeave = () => {
    if (!ctaRef.current) return;

    gsap.to(ctaRef.current.querySelector(".cta-image"), {
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(ctaRef.current.querySelector(".cta-arrow"), {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(ctaRef.current.querySelector(".cta-line"), {
      scaleX: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#e8e8e5] px-5 py-24 text-[#373c3b] md:px-10 md:py-32 lg:px-[4.5vw]"
    >
      <div className="mx-auto max-w-[1800px]">
        {/* Top */}
        <div className="mb-16 flex items-center justify-between border-b border-[#373c3b]/15 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em]">
            06 — FAQ
          </p>

          <p className="hidden text-[10px] uppercase tracking-[0.3em] text-[#373c3b]/40 md:block">
            Everything you need to know
          </p>
        </div>

        {/* Intro */}
        <div
          ref={introRef}
          className="grid grid-cols-1 gap-10 pb-20 md:grid-cols-[1.1fr_0.9fr] md:items-end lg:pb-28"
        >
          <h2 className="text-[clamp(4rem,9vw,10rem)] font-semibold leading-[0.8] tracking-[-0.085em]">
            GOT
            <br />
            QUESTIONS?
          </h2>

          <div className="max-w-[470px] md:pb-2">
            <p className="text-[clamp(1.4rem,2vw,2rem)] font-medium leading-[1.05] tracking-[-0.045em]">
              GOOD QUESTIONS DESERVE
              <br />
              CLEAR ANSWERS.
            </p>

            <p className="mt-6 max-w-[400px] text-base leading-[1.7] text-[#373c3b]/60">
              If you are wondering how we work, who we work with, or whether
              ioXora is the right fit, start here.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div
          ref={faqRef}
          className="border-t border-[#373c3b]/20"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(isOpen ? null : index);
                  }
                }}
                className={`group cursor-pointer border-b border-[#373c3b]/20 py-6 transition-colors duration-300 md:py-8 ${
                  isOpen ? "bg-[#373c3b]/[0.025]" : ""
                }`}
              >
                <div className="grid grid-cols-[45px_1fr_40px] gap-3 md:grid-cols-[90px_1fr_60px] md:gap-6">
                  {/* Number */}
                  <span className="pt-1 text-[10px] font-semibold tracking-[0.2em] text-[#373c3b]/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question + Answer */}
                  <div>
                    <h3
                      className={`max-w-[900px] text-[clamp(1.35rem,2.2vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.055em] transition-all duration-300 ${
                        isOpen
                          ? "translate-x-2"
                          : "group-hover:translate-x-2"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    <div
                      ref={(el) => {
                        answerRefs.current[index] = el;
                      }}
                      className="overflow-hidden"
                      style={{
                        height: 0,
                        opacity: 0,
                      }}
                    >
                      <p className="max-w-[650px] pt-6 text-base leading-[1.7] text-[#373c3b]/60 md:text-[17px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Plus */}
                  <div className="flex justify-end">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#373c3b]/20 text-[22px] font-light transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 bg-[#373c3b] text-[#e8e8e5]"
                          : "group-hover:border-[#373c3b]"
                      }`}
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-24 md:mt-32">
          <a
            ref={ctaRef}
            href="#contact"
            onMouseEnter={handleCtaEnter}
            onMouseLeave={handleCtaLeave}
            className="group relative block min-h-[600px] overflow-hidden bg-[#292d2c] md:min-h-[700px]"
          >
            {/* Background image */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="cta-image relative h-full w-full">
                <Image
                  src="/images/faq-cta.jpg"
                  alt="Let's build something together"
                  fill
                  className="object-cover opacity-60"
                />
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Top */}
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-white md:left-10 md:right-10 md:top-10 lg:left-14 lg:right-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/65">
                Still have questions?
              </p>

              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                Get in touch ↗
              </span>
            </div>

            {/* Main CTA */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 lg:bottom-14 lg:left-14 lg:right-14">
              <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                <div>
                  <h3 className="max-w-[1100px] text-[clamp(3.5rem,8vw,9rem)] font-semibold leading-[0.8] tracking-[-0.085em] text-white">
                    LET&apos;S MAKE
                    <br />
                    SOMETHING
                    <br />
                    <span className="text-white/55">MATTER.</span>
                  </h3>

                  <p className="mt-7 max-w-[420px] text-base leading-[1.7] text-white/65 md:text-lg">
                    Have a project in mind? Tell us where you want to go, and
                    let&apos;s figure out how to get there together.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-start gap-5 lg:items-end">
                  <span className="cta-arrow text-[5rem] font-light leading-none text-white md:text-[7rem]">
                    ↗
                  </span>

                  <div className="relative h-px w-[180px] overflow-hidden bg-white/30">
                    <span className="cta-line absolute inset-0 origin-left scale-x-0 bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Footer contact */}
        <div className="mt-8 flex flex-col justify-between gap-5 border-t border-[#373c3b]/15 pt-6 md:flex-row md:items-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#373c3b]/40">
            Or email us directly
          </p>

          <a
            href="mailto:hello@ioxoraa.com"
            className="text-[clamp(1.4rem,2vw,2.2rem)] font-medium tracking-[-0.045em] transition-opacity hover:opacity-50"
          >
            hello@ioxoraa.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqCta;