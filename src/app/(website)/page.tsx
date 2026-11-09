"use client";

import { useEffect, useState } from "react";


import SelectedWorks from "@/components/home/SelectedWorks";

import ServicesSection from "@/components/shared/services/Servicessection";

import HeroN from "@/components/home/Banner";

import Intro from "@/components/home/Intro";
import WhyUs from "@/components/home/Whyussection";
import Stats from "@/components/Stats";
import TestimonialsN from "@/components/TestimonialsN";
import Platforms from "@/components/Platforms";
import FAQ from "@/components/Faq";


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
  <Platforms theme="light"/>
      <WhyUs/>
  <Stats/>
  <TestimonialsN/>
  <FAQ/>
  

    
    </div>
  );
}