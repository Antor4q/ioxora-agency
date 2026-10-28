"use client";
import { useEffect, useRef } from "react";

type P = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };

export default function ParticleX({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, dpr = 1, raf = 0, ps: P[] = [];

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.floor(r.width); h = Math.floor(r.height);
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;

      // draw an X offscreen, then sample it into particle home positions
      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const o = off.getContext("2d")!;
      const s = Math.min(w, h) * 0.78;
      o.strokeStyle = "#fff"; o.lineWidth = s * 0.2; o.lineCap = "round";
      o.beginPath();
      o.moveTo(w / 2 - s / 2, h / 2 - s / 2); o.lineTo(w / 2 + s / 2, h / 2 + s / 2);
      o.moveTo(w / 2 + s / 2, h / 2 - s / 2); o.lineTo(w / 2 - s / 2, h / 2 + s / 2);
      o.stroke();
      const d = o.getImageData(0, 0, w, h).data;
      const gap = w < 500 ? 6 : 8;
      ps = [];
      for (let y = 0; y < h; y += gap)
        for (let x = 0; x < w; x += gap)
          if (d[(y * w + x) * 4 + 3] > 128)
            ps.push({
              x: reduce ? x : Math.random() * w,
              y: reduce ? y : Math.random() * h,
              hx: x, hy: y, vx: 0, vy: 0,
            });
    };

    const tick = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#D0E50E";
      const breathe = Math.sin(t / 900) * 1.5;
      for (const p of ps) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 130) {
          const f = (1 - dist / 130) * 5;
          p.vx -= (dx / dist) * f; p.vy -= (dy / dist) * f;
        }
        p.vx += (p.hx - p.x) * 0.035; p.vy += (p.hy - p.y + breathe) * 0.035;
        p.vx *= 0.88; p.vy *= 0.88;
        p.x += p.vx; p.y += p.vy;
        ctx.fillRect(p.x - 1, p.y - 1, 2.2, 2.2);
      }
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const leave = () => { mouse.x = mouse.y = -9999; };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    if (reduce) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#D0E50E";
      ps.forEach((p) => ctx.fillRect(p.x - 1, p.y - 1, 2.2, 2.2));
    } else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}