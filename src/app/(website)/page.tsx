"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/home/Hero";
import SelectedWorks from "@/components/home/SelectedWorks";
import VideoComp from "@/components/home/video/VideoComp";
import Process from "@/components/shared/process/Process";
import ServicesSection from "@/components/shared/services/Servicessection";
import TechStack from "@/components/shared/Techstack";
import Comparison from "@/components/shared/Comparison";
import InNumber from "@/components/shared/Innumber";
import Testimonials from "@/components/shared/Testimonialslider";
import HowWeUseAI from "@/components/shared/HowWeUseAI";
import WhyIoxora from "@/components/shared/WhyIoxora";
import FaqCta from "@/components/shared/Faqcta";
import TrustedBrands from "@/components/shared/TrustedBrands";
import ScrollReveal3D from "@/components/shared/scroll3d/Scrollreveal3d";

import { ArrowUp } from "lucide-react";
import HeroN from "@/components/home/Banner";
import ProjectsN from "@/components/home/ProjectsN";
import Intro from "@/components/home/Intro";
import WhyUsSection from "@/components/home/Whyussection";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div>
      {/* <Hero /> */}
       <HeroN/>
       <Intro/>
     

      <SelectedWorks />

      {/* <VideoComp
        videoSrc="/video.mp4"
        marqueeWords={[
          "Creative",
          "Direction",
          "Long-term",
          "Growth",
          "and",
          "Ideas",
          "Strategy",
        ]}
      />

      <Process /> */}

      
        <ServicesSection />
      <WhyUsSection/>
 
      <TechStack />

      <Comparison />

      <InNumber />

      <Testimonials />

      <HowWeUseAI />

      <WhyIoxora />

      <FaqCta />

      {/* Scroll to top */}
      {/* <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-8 cursor-pointer right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white transition-all duration-500 hover:scale-105 ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp size={20} />
      </button> */}
    </div>
  );
}