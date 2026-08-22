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
  /* =====================================================
     *** NEW ***
     Client video shown in the "Project" panel.
     - video   -> the actual clip (replace with real files)
     - poster  -> thumbnail shown before hover / after leave
  ===================================================== */
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
    // *** placeholder — replace with the real client clip ***
    video:
      "/video.mp4",
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
    video:
      "/video.mp4",
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
    video:
      "/video.mp4",
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
    video:
      "video.mp4",
    poster:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85",
  },
];

const AUTOPLAY_DURATION = 5500;

/* ============================================================
   *** NEW ***
   CLIENT VIDEO PREVIEW

   - Shows the poster/thumbnail by default.
   - On hover: plays the clip with sound.
   - On leave: pauses, mutes, and resets back to frame 0 so it
     visually settles back near the thumbnail.
   - key={testimonial.id} on the parent forces this to remount
     cleanly whenever the active slide changes.
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

  const handleEnter = () => {
    const el = videoRef.current;

    if (!el) return;

    setIsHovering(true);

    el.muted = false;

    // play() can reject if the browser blocks unmuted
    // autoplay without a stronger gesture — fall back to
    // muted playback so it never throws in the console.
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  };

  const handleLeave = () => {
    const el = videoRef.current;

    if (!el) return;

    setIsHovering(false);

    el.pause();
    el.currentTime = 0;
    el.muted = true;
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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

      {/* =========================================
          *** NEW ***
          THUMBNAIL OVERLAY

          Sits on top of the video. Fully visible by
          default (shows the thumbnail), fades out on
          hover to reveal the playing video, and fades
          back in the instant the mouse leaves —
          regardless of what frame the video paused on
          (browsers don't re-show the native `poster`
          once a video has played, so we handle it
          ourselves with a real <img>).
      ========================================= */}

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

  /*
  ============================================================
  CHANGE SLIDE
  ============================================================
  */

  const changeSlide = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;

    const slide = slideRef.current;

    if (!slide) {
      setActiveIndex(nextIndex);
      return;
    }

    const direction =
      nextIndex > activeIndex ? 1 : -1;

    gsap.killTweensOf(slide);

    /*
     * Current slide exits upward
     */

    gsap.to(slide, {
      y: direction * -45,
      opacity: 0,
      duration: 0.45,
      ease: "power3.in",

      onComplete: () => {
        setActiveIndex(nextIndex);

        /*
         * New slide starts from bottom
         */

        requestAnimationFrame(() => {
          gsap.fromTo(
            slide,
            {
              y: 45,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power4.out",
            }
          );
        });
      },
    });
  };

  /*
  ============================================================
  NEXT SLIDE
  ============================================================
  */

  const nextSlide = () => {
    const next =
      (activeIndex + 1) % testimonials.length;

    changeSlide(next);
  };

  /*
  ============================================================
  PREVIOUS SLIDE
  ============================================================
  */

  const previousSlide = () => {
    const previous =
      (activeIndex - 1 + testimonials.length) %
      testimonials.length;

    changeSlide(previous);
  };

  /*
  ============================================================
  AUTO SLIDER
  ============================================================
  */

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DURATION);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeIndex, isPaused]);

  /*
  ============================================================
  INITIAL SCROLL ANIMATION
  ============================================================
  */

  useEffect(() => {
    const section = document.querySelector(
      ".testimonial-section"
    );

    if (!section) return;

    const ctx = gsap.context(() => {
      /*
      ----------------------------------------
      Eyebrow
      ----------------------------------------
      */

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

      /*
      ----------------------------------------
      Heading
      ----------------------------------------
      */

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

      /*
      ----------------------------------------
      Slider
      ----------------------------------------
      */

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
         p-20
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-10
            
          "
        >
          <h4
            className="
              mb-4
              text-xl
              font-bold
              text-[#797B7C]
              md:text-2xl
            "
          >
            {"Testimonials"}
          </h4>

          <h2

            className="
            mb-20
              whitespace-nowrap
              text-[15vw]
              font-bold
              leading-[0.88]
              tracking-[-0.06em]
              text-[#222628]

              md:text-[160px]
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
                min-h-[620px]
                grid-cols-1
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
                  p-7
                  sm:p-10
                  lg:border-b-0
                  lg:border-r
                  lg:p-14
                "
              >
                {/* TOP */}

                <div>
                  <p
                    className="
                      mb-10
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#747873]
                    "
                  >
                    Project
                  </p>

                  {/* =========================================
                      *** NEW ***
                      CLIENT VIDEO — replaces the old square
                      logo block. key={current.id} forces a
                      clean remount (and video reset) whenever
                      the active slide changes.
                  ========================================= */}

                  <ClientVideoPreview
                    key={current.id}
                    video={current.video}
                    poster={current.poster}
                    label={current.company}
                  />

                  {/* PROJECT NAME */}

                  <h3
                    className="
                      mt-8
                      text-[clamp(2.5rem,4vw,4.5rem)]
                      font-bold
                      leading-[0.85]
                      tracking-[-0.07em]
                      text-[#3B403D]
                    "
                  >
                    {current.project}
                  </h3>
                </div>

                {/* PROJECT META */}

                <div className="mt-16">
                  <div
                    className="
                      mb-6
                      h-px
                      w-full
                      bg-[#D1D4CE]
                    "
                  />

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-8
                    "
                  >
                    {/* TYPE */}

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

                    {/* YEAR */}

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
                  p-7
                  sm:p-10
                  lg:p-14
                "
              >
                {/* QUOTE */}

                <div>
                  <span
                    className="
                      block
                      text-[5rem]
                      font-bold
                      leading-[0.5]
                      tracking-[-0.1em]
                      text-[#D5F139]
                    "
                  >
                    “
                  </span>

                  <blockquote
                    className="
                      mt-8
                      max-w-[950px]
                      text-[clamp(2rem,4.3vw,5rem)]
                      font-semibold
                      leading-[0.98]
                      tracking-[-0.065em]
                      text-[#3B403D]
                    "
                  >
                    {current.quote}
                  </blockquote>
                </div>

                {/* =================================================
                    CLIENT
                ================================================= */}

                <div
                  className="
                    mt-16
                    flex
                    items-center
                    justify-between
                    gap-8
                  "
                >
                  <div className="flex items-center gap-5">
                    {/* CLIENT IMAGE */}

                    <div
                      className="
                        h-[76px]
                        w-[62px]
                        shrink-0
                        overflow-hidden
                        rounded-[2px]
                        bg-[#D7D9D3]
                      "
                    >
                      <img
                        src={current.image}
                        alt={current.client}
                        className="
                        rounded-xl
                          h-full
                          w-full
                          object-cover
                          grayscale
                        "
                      />
                    </div>

                    {/* CLIENT DETAILS */}

                    <div>
                      <p
                        className="
                          text-base
                          font-bold
                          tracking-[-0.035em]
                          text-[#3B403D]
                        "
                      >
                        {current.client}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-medium
                          text-[#747873]
                        "
                      >
                        {current.role},{" "}
                        {current.company}
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

          <div
            className="
              mt-6
              flex
              justify-end
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              {/* PREVIOUS */}

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous testimonial"
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C8CBC5]
                  text-xl
                  text-[#4C514D]
                  transition-all
                  duration-300
                  hover:border-[#3B403D]
                  hover:bg-[#3B403D]
                  hover:text-[#F2F3EE]
                "
              >
                ←
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C8CBC5]
                  text-xl
                  text-[#4C514D]
                  transition-all
                  duration-300
                  hover:border-[#3B403D]
                  hover:bg-[#3B403D]
                  hover:text-[#F2F3EE]
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