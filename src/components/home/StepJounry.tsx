"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CARD_WIDTH = 680;
const CARD_HEIGHT = 640;
const CARD_GAP = 32;

type BaseProject = {
  id: string;
  index: string;
  title: string;
  year: string;
};

type ImageProject = BaseProject & {
  type: "image";
  src: string;
};

type VideoProject = BaseProject & {
  type: "video";
  poster: string;
  video: string;
};

type SpineProject = BaseProject & {
  type: "spine";
  color: string;
  textColor: string;
  date: string;
  inset: string;
};

type Project = ImageProject | VideoProject | SpineProject;

const PROJECTS: Project[] = [
  {
    id: "p1",
    index: "01",
    title: "Line Study",
    year: "2024",
    type: "image",
    src: "/images/projects/line-study.jpg",
  },
  {
    id: "p2",
    index: "02",
    title: "Imprint of Silence",
    year: "2024",
    type: "video",
    poster: "/images/projects/cafe-poster.jpg",
    video: "/videos/projects/cafe.mp4",
  },
  {
    id: "p3",
    index: "03",
    title: "Wood Form",
    year: "2023",
    type: "spine",
    color: "#C1502E",
    textColor: "#F4E9DD",
    date: "DECEMBER 12—25.2025",
    inset: "/images/projects/wood-form.jpg",
  },
  {
    id: "p4",
    index: "04",
    title: "Glass Portrait",
    year: "2023",
    type: "image",
    src: "/images/projects/glass-portrait.jpg",
  },
  {
    id: "p5",
    index: "05",
    title: "Magnolia",
    year: "2022",
    type: "spine",
    color: "#F0C7CE",
    textColor: "#5A2430",
    date: "DECEMBER 12—25.2025",
    inset: "/images/projects/magnolia.jpg",
  },
  {
    id: "p6",
    index: "06",
    title: "Evening Walk",
    year: "2022",
    type: "video",
    poster: "/images/projects/walk-poster.jpg",
    video: "/videos/projects/walk.mp4",
  },
];

function Thumbnail({ label }: { label: string }) {
  // Shown automatically if the real image/video file at the given path is
  // missing (404) so a card never renders blank while assets are wired up.
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      style={{
        background:
          "linear-gradient(135deg, #d8d5c7 0%, #c7c3b0 50%, #b8b4a0 100%)",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect
          x="2.5"
          y="4.5"
          width="19"
          height="15"
          rx="2"
          stroke="#726f5f"
          strokeWidth="1.5"
        />
        <path
          d="M2.5 15.5L8 10l4.5 4.5L16 11l5.5 5.5"
          stroke="#726f5f"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8.5" r="1.5" fill="#726f5f" />
      </svg>
      <span className="text-xs font-medium tracking-wide text-[#5c5947]">
        {label}
      </span>
    </div>
  );
}

function CardFrame({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-[#e9e7de]"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {children}
      <span className="absolute bottom-6 left-6 z-10 text-sm font-medium text-white/90 mix-blend-difference">
        [{project.index}]
      </span>
      <span className="absolute bottom-6 right-6 z-10 text-sm font-medium text-white/90 mix-blend-difference">
        {project.title}, {project.year}
      </span>
    </div>
  );
}

function ImageCard({ project }: { project: ImageProject }) {
  const [broken, setBroken] = useState(false);
  return (
    <CardFrame project={project}>
      {broken ? (
        <Thumbnail label={project.title} />
      ) : (
        <img
          src={project.src}
          alt={project.title}
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </CardFrame>
  );
}

function VideoCard({ project }: { project: VideoProject }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [posterBroken, setPosterBroken] = useState(false);

  return (
    <CardFrame project={project}>
      <div
        className="absolute inset-0"
        onMouseEnter={() => {
          setHovered(true);
          videoRef.current?.play().catch(() => {});
        }}
        onMouseLeave={() => {
          setHovered(false);
          const v = videoRef.current;
          if (!v) return;
          v.pause();
          v.currentTime = 0;
        }}
      >
        {posterBroken && <Thumbnail label={project.title} />}
        <video
          ref={videoRef}
          src={project.video}
          poster={project.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setPosterBroken(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M4 2.5L15 9L4 15.5V2.5Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

function SpineCard({ project }: { project: SpineProject }) {
  const [broken, setBroken] = useState(false);
  return (
    <CardFrame project={project}>
      <div
        className="absolute inset-0 flex items-center justify-center p-10"
        style={{ backgroundColor: project.color }}
      >
        <span
          className="absolute left-8 top-10 select-none whitespace-nowrap text-xs font-semibold tracking-[0.2em]"
          style={{ writingMode: "vertical-rl", color: project.textColor }}
        >
          {project.date}
        </span>
        <div className="relative ml-8 h-full w-full max-w-[360px] self-center overflow-hidden bg-white/90">
          {broken ? (
            <Thumbnail label={project.title} />
          ) : (
            <img
              src={project.inset}
              alt={project.title}
              onError={() => setBroken(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </CardFrame>
  );
}

function renderCard(project: Project) {
  if (project.type === "video") return <VideoCard project={project} />;
  if (project.type === "spine") return <SpineCard project={project} />;
  return <ImageCard project={project} />;
}

export default function StepJourney() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setXRef = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    setXRef.current = gsap.quickTo(track, "x", {
      duration: 0.5,
      ease: "power3.out",
    });

    const recalc = () => {
      const trackWidth = track.scrollWidth;
      const viewport = window.innerWidth;
      const distance = Math.max(trackWidth - viewport, 0);
      // extra scroll room = however far the row needs to travel
      wrapper.style.height = `${window.innerHeight + distance}px`;
    };

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const distance = Math.max(track.scrollWidth - window.innerWidth, 0);
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / (rect.height - window.innerHeight), 0), 1);
      setXRef.current?.(-progress * distance);
    };

    recalc();
    onScroll();

    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative isolate z-10 w-full bg-[#f3f1e9]"
    >
      <div className="sticky top-0 z-10 flex h-screen w-full flex-col justify-center overflow-hidden bg-[#f3f1e9] px-20">
        <div className="flex flex-wrap items-start justify-between gap-6 pb-12">
          <h2 className="font-serif text-[7rem] font-medium leading-none tracking-tight text-[#151511] md:text-[9rem]">
            Projects
          </h2>
          <div className="flex flex-col items-start gap-6 pt-3 md:items-end">
            <p className="max-w-[220px] text-sm leading-relaxed text-[#57574f]">
              Small fragments of everyday work woven into one evolving
              portfolio.
            </p>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex items-stretch will-change-transform"
          style={{ gap: CARD_GAP }}
        >
          {PROJECTS.map((project) => (
            <div key={project.id} className="shrink-0">
              {renderCard(project)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}