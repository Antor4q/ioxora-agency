"use client"
import Banner from "@/components/home/Banner";
import Hero from "@/components/home/Hero";
import VideoComp from "@/components/home/video/VideoComp";
import FaqCta from "@/components/shared/Faqcta";
import InNumber from "@/components/shared/Innumber";
import HowWork from "@/components/shared/process/HowWork";
import ScrollReveal3D from "@/components/shared/scroll3d/Scrollreveal3d";
import ServicesSection from "@/components/shared/services/Servicessection";
import TrustedBrands from "@/components/shared/TrustedBrands";
import Work from "@/components/shared/worksh/Work";
import { ArrowUp } from "lucide-react";

export default function Home() {
   function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
  <div>
    {/* <Banner/> */}
    <Hero/>
    <TrustedBrands/>
    <ScrollReveal3D/>
    <Work/>
    <VideoComp videoSrc="/video.mp4" marqueeWords={["Creative", "Direction", "Long-term", "Growth", "and", "Ideas", "Strategy"]}/>
    <HowWork/>
    <ServicesSection/>
    <InNumber/>
    <FaqCta/>
      {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform hover:scale-105"
        >
          <ArrowUp size={20} />
        </button>
  </div>
  );
}
