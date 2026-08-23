"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactCTA from "./ContactCTA";

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
    question: "Can you work with tight deadlines?",
    answer:
      "Often, yes. Tell us your timeline on the intro call and we'll be upfront about what's realistic.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Yes — early-stage and pre-launch startups are a big part of what we do, especially AI-powered products.",
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
    id="faq"
      ref={sectionRef}
      className="overflow-hidden bg-[#e8e8e5] p-6 pt-0 text-[#373c3b] sm:p-10 md:p-14 lg:p-20 lg:pt-0"
    >
      <div className="">
        <div className="mb-8 sm:mb-10">
          <h4
            className="
              mb-3
              text-lg
              font-bold
              text-[#797B7C]
              sm:text-xl
              md:mb-4
              md:text-2xl
            "
          >
            {"FAQ"}
          </h4>

          <h2
            className="
              mb-10
              text-[13vw]
              font-bold
              leading-[0.9]
              tracking-[-0.05em]
              text-[#222628]
              sm:whitespace-nowrap
              sm:text-[15vw]
              sm:leading-[0.88]
              sm:tracking-[-0.06em]
              md:mb-14
              lg:mb-20
              lg:text-[clamp(4rem,10vw,160px)]
            "
          >
            Get Questions?
          </h2>
        </div>

        {/* FAQ */}
        <div ref={faqRef} className="border-t border-[#373c3b]/20">
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
                className={`group cursor-pointer border-b border-[#373c3b]/20 py-5 transition-colors duration-300 sm:py-6 md:py-8 ${
                  isOpen ? "bg-[#373c3b]/[0.025]" : ""
                }`}
              >
                <div className="grid grid-cols-[24px_1fr_32px] gap-2 sm:grid-cols-[45px_1fr_40px] sm:gap-3 md:grid-cols-[90px_1fr_60px] md:gap-6">
                  {/* Number */}
                  <span className="pt-1 text-[9px] font-semibold tracking-[0.15em] text-[#373c3b]/45 sm:text-[10px] sm:tracking-[0.2em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question + Answer */}
                  <div>
                    <h3
                      className={`max-w-[900px] text-[clamp(1.1rem,4.5vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.03em] transition-all duration-300 sm:text-[clamp(1.35rem,2.2vw,2.6rem)] sm:leading-[1.02] sm:tracking-[-0.055em] ${
                        isOpen ? "translate-x-2" : "group-hover:translate-x-2"
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
                      <p className="max-w-[650px] pt-4 text-sm leading-[1.65] text-[#373c3b]/60 sm:pt-6 sm:text-base md:text-[17px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Plus */}
                  <div className="flex justify-end">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#373c3b]/20 text-base font-light transition-all duration-300 sm:h-9 sm:w-9 sm:text-[22px] ${
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

     <div id="contact">

        <ContactCTA />
     </div>

        {/* Footer contact */}
        <div className="mt-8 flex flex-col justify-between gap-5 border-t border-[#373c3b]/15 pt-6 md:flex-row md:items-center">
          <h2
            className="
              mb-0
              text-lg
              font-bold
              text-[#797B7C]
              sm:text-xl
              md:text-2xl
            "
          >
            or Email Us Directly
          </h2>
           <a
          
            href="mailto:ioxoratech@gmail.com"
            className="text-[clamp(1.2rem,6vw,2.2rem)] font-medium tracking-[-0.04em] transition-opacity hover:opacity-50 sm:text-[clamp(1.4rem,2vw,2.2rem)] sm:tracking-[-0.045em]"
          >
            ioxoratech@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqCta;