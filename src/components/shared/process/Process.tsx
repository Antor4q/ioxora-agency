"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Route,
  LayoutTemplate,
  Palette,
  MousePointerClick,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import TextReveal from "../textreveal/TextReveal";

interface Step {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discovery",
    subtitle: "Research & Domain Analysis",
    description:
      "We dig into the problem first. Understanding the target audience, studying the domain, and gathering the data that will shape every decision after this.",
    icon: Search,
    image: "/work1.png",
  },
  {
    number: "02",
    title: "Flows",
    subtitle: "User Journey & Sitemap",
    description:
      "We map how people move through the product — the journeys, the goals, and the decisions — so the structure feels obvious before a single screen is drawn.",
    icon: Route,
    image: "/work2.png",
  },
  {
    number: "03",
    title: "Wireframes",
    subtitle: "Low-Fidelity Design",
    description:
      "Content and layout come first, styling comes later. We sketch the skeleton, gather feedback early, and refine it before any visual design begins.",
    icon: LayoutTemplate,
    image: "/work3.png",
  },
  {
    number: "04",
    title: "Mockups",
    subtitle: "High-Fidelity Design",
    description:
      "Every screen gets a real visual identity — color, type, imagery. Each mockup is reviewed with stakeholders and refined against real user expectations.",
    icon: Palette,
    image: "/work4.png",
  },
  {
    number: "05",
    title: "Prototyping",
    subtitle: "Interaction Design",
    description:
      "We wire the screens together into a clickable prototype, so the flow can be tested and felt before a single line of production code is written.",
    icon: MousePointerClick,
    image: "/work5.png",
  },
  {
    number: "06",
    title: "Testing",
    subtitle: "Usability Testing",
    description:
      "Real users, real tasks. We run usability sessions, watch where people struggle, and fix it — until the experience feels effortless.",
    icon: CheckCircle2,
    image: "/work6.png",
  },
];

export default function Process() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-white px-20 py-20 sm:py-28">
      <div className="">
        {/* Eyebrow + heading */}
        <div className="">
            <h4 className="text-2xl font-bold text-[#797B7C] mb-5">{"Work's"}</h4>
                     <TextReveal
                      start="top 85%"
            end="top 55%"
            scrub={0.3}
                      as="h2" 
                     className="
                    
               text-[112px] 
                text-[#222628]
                font-bold
                leading-[1.0]
                tracking-[-0.06em]
                whitespace-nowrap">
                      A Glimpse Into The Work 
                     </TextReveal>
        </div>

        {/* Timeline + sticky image */}
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: scrolling timeline */}
          <div className="relative">
            {/* base rail */}
            <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-slate-200" />
            {/* progress rail */}
            <div
              className="absolute left-0 top-1 w-[3px] rounded-full bg-[#222628] transition-all duration-500 ease-out"
              style={{
                height: `calc(${(activeIndex / (steps.length - 1)) * 100}% )`,
              }}
            />

            {steps.map((step, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="relative py-10 pl-9 first:pt-1"
                >
                  <span
                    className={`mb-1 block text-xl font-black tracking-wider transition-colors duration-300 ${
                      isActive ? "text-[#222628]" : "text-slate-300"
                    }`}
                  >
                    {step.number}
                  </span>
                  <h3
                    className={`text-6xl font-extrabold transition-colors duration-300 ${
                      isActive ? "text-[#222628]" : "text-slate-300"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-1 text-xl font-bold transition-colors duration-300 ${
                      isActive ? "text-[#222628]" : "text-slate-300"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                  <p
                    className={`mt-3 text-lg font-medium leading-relaxed transition-colors duration-300 ${
                      isActive ? "text-slate-500" : "text-slate-300"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: fixed/sticky image panel */}
          <div className="hidden lg:block">
            <div className="sticky top-56 h-[500px] w-[600px] overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    i === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={600}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}