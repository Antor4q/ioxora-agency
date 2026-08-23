"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
  id: string;
  project: string;
  category: string;
  year: string;
  projectMark: string;
  quote: string;
  client: string;
  role: string;
  company: string;
  image: string;
  video: string;
  poster: string;
};

const testimonials: Testimonial[] = [
  {
    id: "01",
    project: "Axiom",
    category: "AI SaaS Platform",
    year: "2026",
    projectMark: "AX",
    quote:
      "ioXora understood what we were trying to build before we even knew how to explain it. The final product felt sharper, faster and much more intentional.",
    client: "Daniel Morgan",
    role: "Founder",
    company: "Axiom",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85",
    video: "/video.mp4",
    poster:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: "02",
    project: "Nova",
    category: "Digital Product",
    year: "2026",
    projectMark: "N",
    quote:
      "The attention to detail was honestly unexpected. Every interaction felt considered, and the team was incredibly easy to work with.",
    client: "Sarah Chen",
    role: "CEO",
    company: "Nova",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85",
    video: "/video.mp4",
    poster:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: "03",
    project: "Forma",
    category: "Web Application",
    year: "2025",
    projectMark: "F",
    quote:
      "They didn't just execute the brief. They challenged our assumptions, improved the idea and delivered something that felt genuinely different.",
    client: "Michael Carter",
    role: "Product Lead",
    company: "Forma",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85",
    video: "/video.mp4",
    poster:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85",
  },
  {
    id: "04",
    project: "Orbit",
    category: "SaaS Experience",
    year: "2025",
    projectMark: "O",
    quote:
      "From the first conversation to launch, everything felt focused. They brought design and development together in a way we hadn't experienced before.",
    client: "Emma Wilson",
    role: "Co-Founder",
    company: "Orbit",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85",
    video: "video.mp4",
    poster:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85",
  },
];

const AUTOPLAY_DURATION = 5500;

/* ============================================================
   CLIENT VIDEO PREVIEW
   - Desktop: hover to play with sound.
   - Touch devices: tap toggles play/pause (hover doesn't exist
     on touch, so we detect a tap and treat it the same as an
     enter/leave pair).
============================================================ */

function ClientVideoPreview({
  video,
  poster,
  label,
}: {
  video: string;
  poster: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;

    setIsHovering(true);
    el.muted = false;

    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  };

  const stop = () => {
    const el = videoRef.current;
    if (!el) return;

    setIsHovering(false);
    el.pause();
    el.currentTime = 0;
    el.muted = true;
  };

  const handleTap = () => {
    // touch devices: tap to toggle instead of hover
    if (isHovering) {
      stop();
    } else {
      play();
    }
  };

  return (
    <div
      onMouseEnter={play}
      onMouseLeave={stop}
      onClick={handleTap}
      className="
        group
        relative
        aspect-[4/3]
        w-full
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-[#C8CBC5]
        bg-[#F2F3EE]
      "
    >
      <video
        ref={videoRef}
        src={video}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="
          rounded-2xl
          h-full
          w-full
          object-cover
          transition-transform
          duration-700
          ease-out
          group-hover:scale-105
        "
      />

      <img
        src={poster}
        alt={label}
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-opacity
          duration-300
          ease-out
        "
        style={{
          opacity: isHovering ? 0 : 1,
        }}
      />
    </div>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideRef = useRef<HTMLDivElement>(null);

  const current = testimonials[activeIndex];

  const changeSlide = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;

    const slide = slideRef.current;

    if (!slide) {
      setActiveIndex(nextIndex);
      return;
    }

    const direction = nextIndex > activeIndex ? 1 : -1;

    gsap.killTweensOf(slide);

    gsap.to(slide, {
      y: direction * -45,
      opacity: 0,
      duration: 0.45,
      ease: "power3.in",

      onComplete: () => {
        setActiveIndex(nextIndex);

        requestAnimationFrame(() => {
          gsap.fromTo(
            slide,
            { y: 45, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power4.out" }
          );
        });
      },
    });
  };

  const nextSlide = () => {
    const next = (activeIndex + 1) % testimonials.length;
    changeSlide(next);
  };

  const previousSlide = () => {
    const previous =
      (activeIndex - 1 + testimonials.length) % testimonials.length;
    changeSlide(previous);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DURATION);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeIndex, isPaused]);

  useEffect(() => {
    const section = document.querySelector(".testimonial-section");

    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".testimonial-eyebrow", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testimonial-section",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".testimonial-heading-line", {
        yPercent: 110,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".testimonial-section",
          start: "top 72%",
          once: true,
        },
      });

      gsap.from(".testimonial-stage", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".testimonial-stage",
          start: "top 82%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="
        testimonial-section
        relative
        w-full
        overflow-hidden
        bg-[#F2F3EE]
        text-[#222628]
      "
    >
      <div
        className="
          p-6
          sm:p-10
          md:p-14
          lg:p-20
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 sm:mb-8 md:mb-10">
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
            {"Testimonials"}
          </h4>

          <h2
            className="
              mb-10
              whitespace-nowrap
              text-[13vw]
              font-bold
              leading-[0.88]
              tracking-[-0.06em]
              text-[#222628]
              sm:text-[15vw]
              md:mb-14
              lg:mb-20
              lg:text-[clamp(4rem,10vw,160px)]
            "
          >
            What People Say
          </h2>
        </div>

        {/* ==================================================
            TESTIMONIAL SLIDER
        ================================================== */}

        <div
          className="
            testimonial-stage
            relative
            w-full
          "
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-[#E8EAE4]
            "
          >
            <div
              ref={slideRef}
              className="
                relative
                grid
                grid-cols-1
                lg:min-h-[620px]
                lg:grid-cols-[0.75fr_1.25fr]
              "
            >
              {/* =================================================
                  PROJECT INFORMATION
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  justify-between
                  border-b
                  border-[#D1D4CE]
                  p-5
                  sm:p-8
                  md:p-10
                  lg:border-b-0
                  lg:border-r
                  lg:p-14
                "
              >
                <div>
                  <p
                    className="
                      mb-6
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#747873]
                      sm:mb-8
                      md:mb-10
                    "
                  >
                    Project
                  </p>

                  <ClientVideoPreview
                    key={current.id}
                    video={current.video}
                    poster={current.poster}
                    label={current.company}
                  />

                  <h3
                    className="
                      mt-6
                      text-[clamp(2rem,8vw,4.5rem)]
                      font-bold
                      leading-[0.85]
                      tracking-[-0.07em]
                      text-[#3B403D]
                      sm:mt-8
                    "
                  >
                    {current.project}
                  </h3>
                </div>

                <div className="mt-10 sm:mt-12 lg:mt-16">
                  <div className="mb-5 h-px w-full bg-[#D1D4CE] sm:mb-6" />

                  <div className="grid grid-cols-2 gap-4 sm:gap-8">
                    <div>
                      <p
                        className="
                          mb-2
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.2em]
                          text-[#858A84]
                        "
                      >
                        Type
                      </p>

                      <p
                        className="
                          text-sm
                          font-semibold
                          tracking-[-0.02em]
                          text-[#4C514D]
                        "
                      >
                        {current.category}
                      </p>
                    </div>

                    <div>
                      <p
                        className="
                          mb-2
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.2em]
                          text-[#858A84]
                        "
                      >
                        Year
                      </p>

                      <p
                        className="
                          text-sm
                          font-semibold
                          tracking-[-0.02em]
                          text-[#4C514D]
                        "
                      >
                        {current.year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  TESTIMONIAL CONTENT
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  justify-between
                  p-5
                  sm:p-8
                  md:p-10
                  lg:p-14
                "
              >
                <div>
                  <span
                    className="
                      block
                      text-[3rem]
                      font-bold
                      leading-[0.5]
                      tracking-[-0.1em]
                      text-[#D5F139]
                      sm:text-[4rem]
                      lg:text-[5rem]
                    "
                  >
                    “
                  </span>

                  <blockquote
                    className="
                      mt-5
                      max-w-[950px]
                      text-[clamp(1.5rem,5.5vw,5rem)]
                      font-semibold
                      leading-[1.05]
                      tracking-[-0.05em]
                      text-[#3B403D]
                      sm:mt-8
                      sm:leading-[0.98]
                      sm:tracking-[-0.065em]
                    "
                  >
                    {current.quote}
                  </blockquote>
                </div>

                <div
                  className="
                    mt-10
                    flex
                    items-center
                    justify-between
                    gap-6
                    sm:mt-16
                    sm:gap-8
                  "
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div
                      className="
                        h-[64px]
                        w-[52px]
                        shrink-0
                        overflow-hidden
                        rounded-[2px]
                        bg-[#D7D9D3]
                        sm:h-[76px]
                        sm:w-[62px]
                      "
                    >
                      <img
                        src={current.image}
                        alt={current.client}
                        className="
                          h-full
                          w-full
                          rounded-xl
                          object-cover
                          grayscale
                        "
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-bold
                          tracking-[-0.035em]
                          text-[#3B403D]
                          sm:text-base
                        "
                      >
                        {current.client}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-medium
                          text-[#747873]
                          sm:text-sm
                        "
                      >
                        {current.role}, {current.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              ARROWS ONLY
          ================================================== */}

          <div className="mt-5 flex justify-end sm:mt-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous testimonial"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C8CBC5]
                  text-lg
                  text-[#4C514D]
                  transition-all
                  duration-300
                  hover:border-[#3B403D]
                  hover:bg-[#3B403D]
                  hover:text-[#F2F3EE]
                  sm:h-12
                  sm:w-12
                  sm:text-xl
                "
              >
                ←
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C8CBC5]
                  text-lg
                  text-[#4C514D]
                  transition-all
                  duration-300
                  hover:border-[#3B403D]
                  hover:bg-[#3B403D]
                  hover:text-[#F2F3EE]
                  sm:h-12
                  sm:w-12
                  sm:text-xl
                "
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}