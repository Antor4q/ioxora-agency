"use client";

import { useEffect, useRef, useState } from "react";

function smoothstep(t: number) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

/**
 * Scroll-linked "slide up + overlap the previous section" entrance.
 *
 * Usage:
 *   const { ref, style } = useSectionEntrance();
 *   <section ref={ref} style={style} className="relative z-10 -mt-16 rounded-t-[2.5rem] bg-black">
 *     ...
 *   </section>
 *
 * Attach `ref` to the outermost element of the section (the one that
 * already has the -mt-/rounded-t-/overlap styling), spread/merge `style`
 * onto it. That element will start pushed down below its normal spot and
 * slide up into place (with a growing shadow) as it enters the viewport.
 */
export function useSectionEntrance(options?: {
  travelPx?: number; // how far below its normal position it starts (default 120)
  finishAtVh?: number; // fraction of viewport height it takes to finish (default 0.9)
  lerp?: number; // smoothing speed, lower = smoother/heavier (default 0.12)
  shadow?: boolean; // animate a drop shadow alongside the slide (default true)
}) {
  const { travelPx = 120, finishAtVh = 0.9, lerp = 0.12, shadow = true } = options ?? {};

  const ref = useRef<HTMLElement>(null);
  const rawEntrance = useRef(0);
  const smoothEntrance = useRef(0);
  const [entrance, setEntrance] = useState(0);

  useEffect(() => {
    let frame = 0;

    function measure() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = 1 - rect.top / (vh * finishAtVh);
      rawEntrance.current = Math.min(Math.max(raw, 0), 1);
    }

    function loop() {
      measure();
      smoothEntrance.current += (rawEntrance.current - smoothEntrance.current) * lerp;
      setEntrance(smoothEntrance.current);
      frame = requestAnimationFrame(loop);
    }

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [finishAtVh, lerp]);

  const eased = smoothstep(entrance);

  const style: React.CSSProperties = {
    transform: `translateY(${(1 - eased) * travelPx}px)`,
    ...(shadow
      ? { boxShadow: `0 -40px 80px -30px rgba(0,0,0,${0.7 * eased})` }
      : {}),
  };

  return { ref, style, progress: eased };
}