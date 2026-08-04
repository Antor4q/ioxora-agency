"use client";

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

const stats = [
    { value: "2", label: "Founders on every call" },
    { value: "10+", label: "Products shipped" },
    { value: "0", label: "Account managers" },
];

const FaqCta = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const leftRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
    const answerRefs = useRef<Array<HTMLParagraphElement | null>>([]);

    // scroll-triggered entrance: left column + staggered FAQ rows
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(leftRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            });

            gsap.from(itemRefs.current, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.08,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 78%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // gsap-driven accordion open/close (measures real height instead of relying on CSS grid-rows)
    useLayoutEffect(() => {
        answerRefs.current.forEach((el, index) => {
            if (!el) return;
            const isOpen = openIndex === index;

            if (isOpen) {
                gsap.set(el, { height: "auto" });
                const fullHeight = el.offsetHeight;
                gsap.fromTo(
                    el,
                    { height: 0, opacity: 0 },
                    { height: fullHeight, opacity: 1, duration: 0.15, ease: "power2.out", onComplete: () => gsap.set(el, { height: "auto" }) }
                );
            } else {
                gsap.to(el, { height: 0, opacity: 0, duration: 0.12, ease: "power2.in" });
            }
        });
    }, [openIndex]);

    return (
        <section ref={sectionRef} className="bg-[#F2F3F1] px-6 py-24 md:px-20">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.15fr_1fr] md:gap-10">

                {/* ===== LEFT: headline + intro call card + stat strip ===== */}
                <div ref={leftRef} className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-[48px] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0A0A0A] md:text-[68px]">
                                Got Questions?
                            </h2>
                            <p className="mt-1 font-serif text-[48px] italic leading-[1.02] text-[#0A0A0A] md:text-[68px]">
                                We&apos;ve Got Answers
                            </p>
                        </div>

                        <span className="mt-3 hidden shrink-0 rounded-full border border-[#0A0A0A]/15 px-4 py-1.5 text-[12.5px] font-medium tracking-wide text-[#5A5A57] md:inline-block">
                            2-person studio
                        </span>
                    </div>

                    <p className="mt-6 max-w-[560px] text-[16.5px] leading-relaxed text-[#5A5A57]">
                        If you&apos;re unsure where to start or want to see how we can help,
                        reach out, and we&apos;ll walk you through it.
                    </p>

                    <div className="relative mt-10 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-[#D5F139]/25 p-8">

                        {/* subtle grain over the gradient, like the reference */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                                backgroundRepeat: "repeat",
                            }}
                        />

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A]">
                            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                                <circle cx="12" cy="8" r="3.4" stroke="#F2F3F1" strokeWidth="1.6" />
                                <path d="M5 20c1.4-4 4.2-6 7-6s5.6 2 7 6" stroke="#F2F3F1" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>

                        <h3 className="mt-6 text-[27px] font-bold text-[#0A0A0A]">Book an Intro Call</h3>
                        <p className="mt-2 max-w-[380px] text-[15px] leading-relaxed text-[#4B4B7A]">
                            Let&apos;s talk through your goals, your timeline, and how ioXora
                            can support your team.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-4">
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 rounded-full bg-[#0A0A0A] py-3.5 pl-7 pr-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
                            >
                                Book a free call
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                        <path d="M7 17L17 7M9 7h8v8" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </a>

                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
                                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#0A0A0A" strokeWidth="1.6" />
                                        <path d="M3 6l9 7 9-7" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <div className="leading-tight">
                                    <p className="text-[13px] text-[#7A7A76]">Prefer Email Instead?</p>
                                    <a href="mailto:hello@ioxoraa.com" className="text-[15.5px] font-semibold text-[#0A0A0A]">
                                        hello@ioxoraa.com
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* stat strip — fills the remaining width/height under the card so the
                        left column reads as a full block instead of trailing off into empty space */}
                    <div className="mt-6 grid grid-cols-3 divide-x divide-[#0A0A0A]/10 rounded-2xl border border-[#0A0A0A]/10 bg-white/60">
                        {stats.map((stat) => (
                            <div key={stat.label} className="px-4 py-5 text-center">
                                <p className="text-[26px] font-extrabold leading-none text-[#0A0A0A]">{stat.value}</p>
                                <p className="mt-2 text-[12px] leading-tight text-[#7A7A76]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT: FAQ accordion (GSAP-driven) ===== */}
                <div className="divide-y divide-[#0A0A0A]/10">
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setOpenIndex(isOpen ? null : index);
                                    }
                                }}
                                aria-expanded={isOpen}
                                className="cursor-pointer py-6 select-none"
                            >
                                <div className="flex w-full items-center justify-between gap-6 text-left">
                                    <span className="text-[18.5px] font-medium text-[#0A0A0A] md:text-[21px]">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center text-[20px] font-light text-[#0A0A0A] transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"
                                            }`}
                                    >
                                        +
                                    </span>
                                </div>
                                <p
                                    ref={(el) => {
                                        answerRefs.current[index] = el;
                                    }}
                                    className="overflow-hidden pr-10 text-[16px] leading-relaxed text-[#5A5A57]"
                                    style={{ height: 0, opacity: 0 }}
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FaqCta;