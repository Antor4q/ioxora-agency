"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ---------- Edit koro ---------- */
// 5-6 ta image (public folder theke). Nijer image path boshao.
const IMAGES = [
  "/bann/bann1.jpg",
  "/bann/bann2.jpg",
  "/bann/bann3.jpg",
  "/bann/bann4.jpg",
  "/bann/bann5.jpg",
  "/bann/bann6.jpg",
];
const DURATION = 2.4; // loading koto second cholbe (image gulo ei somoyer moddhe change hobe)
const BG = "#e8e8e5"; // loader background
const BOX_W = 220;
const BOX_H = 150;

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Loading cholar somoy scroll bondho
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = IMAGES.length;

    // Image gulo age theke load kore rakho, jate change howar somoy jhapsa na lage
    IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Page puro load na hole exit hobe na
    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const state = { p: 0 };
    let last = -1;

    const finish = () => {
      document.body.style.overflow = prevOverflow;
      setDone(true);
      onComplete?.();
    };

    const exit = () => {
      if (!root.current) return finish();
      gsap.to(root.current, {
        yPercent: -100,
        duration: reduce ? 0.01 : 0.9,
        ease: "power4.inOut",
        onComplete: finish,
      });
    };

    const tween = gsap.to(state, {
      p: 1,
      duration: reduce ? 0.6 : DURATION,
      ease: "none", // sobgulo image soman somoy pabe
      onUpdate: () => {
        const i = Math.min(n - 1, Math.floor(state.p * n));
        if (i !== last) {
          last = i;
          setIndex(i);
        }
      },
      onComplete: () => {
        pageReady.then(exit);
      },
    });

    return () => {
      tween.kill();
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: BG }}
    >
      <div className="relative overflow-hidden bg-[#0A0A0A]" style={{ width: BOX_W, height: BOX_H }}>
        {IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}