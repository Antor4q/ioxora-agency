"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Play, ArrowUpRight } from "lucide-react";

/**
 * CustomCursor
 * -------------------------------------------------------------------
 * Ekhon behavior:
 * - Native browser cursor (arrow/pointer) SHOW thakbe always — hide
 *   kora hoy na.
 * - Native cursor-er shathe shathe ekta chotto brand-color dot
 *   (#D5F139) always follow kore, jokhon kono hover-target-e mouse
 *   nai.
 * - Jokhon mouse `data-cursor-text` / `data-cursor-icon` thaka
 *   element-er upor jay, dot ta grow kore dark (#1A3A23) rounded
 *   pill hoye text/icon show kore.
 * - Target element-er baire gele pill ekdom shrink hoye abar
 *   choto dot-e ferot ashe — pill kokhonoi target-er baire show
 *   hoy na.
 * - Dot/pill shomoy `rounded-full` — kono obosthatei square/
 *   half-rounded hoy na.
 *
 * Mount (root layout.tsx e, ekbar-i):
 *
 *   import CustomCursor from "@/components/CustomCursor";
 *
 *   <body>
 *     <CustomCursor />
 *     {children}
 *   </body>
 *
 * Usage (jekono element-e):
 *
 *   <Link href="/work/fleiss" data-cursor-text="View Case Study">...</Link>
 *   <div data-cursor-icon="play"><video ... /></div>
 *   <a href="mailto:hi@ioxoraa.com" data-cursor-text="Say Hello" data-cursor-icon="arrow">...</a>
 *
 * NOTE: globals.css e age `cursor: none` / `.custom-cursor-active`
 * rule add korle thako, oita REMOVE kore dio — ekhon native cursor
 * hide kora hoy na.
 *
 * Install (na thakle):
 *   npm install gsap lucide-react
 */

type CursorIcon = "play" | "arrow" | null;

const DOT_COLOR = "#D5F139";
const PILL_COLOR = "#1A3A23";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState<string | null>(null);
  const [icon, setIcon] = useState<CursorIcon>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // shudhu fine-pointer (mouse/trackpad) device-e cursor enable
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    xTo.current = gsap.quickTo(cursor, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(cursor, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    function handleMove(e: MouseEvent) {
      if (!isVisible) setIsVisible(true);
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    }

    // event delegation — dynamically render howa element-eo kaj korbe
    function handleOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor-text], [data-cursor-icon]"
      ) as HTMLElement | null;
      if (!target) return;

      setIsHovering(true);
      setText(target.getAttribute("data-cursor-text"));
      setIcon((target.getAttribute("data-cursor-icon") as CursorIcon) || null);
    }

    function handleOut(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor-text], [data-cursor-icon]"
      );
      if (!target) return;
      setIsHovering(false);
      setText(null);
      setIcon(null);
    }

    function handleLeaveWindow() {
      setIsVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", handleLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hover state change hole dot <-> pill morph animation
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (isHovering) {
      gsap.to(cursor, {
        width:  64,
        height: 64,
        paddingLeft: text ? 24 : 0,
        paddingRight: text ? 24 : 0,
        backgroundColor: PILL_COLOR,
        duration: 0.5,
        ease: "elastic.out(1, 0.6)", // liquid/squishy morph feel
      });
      gsap.to(contentRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.08,
        ease: "back.out(2)",
      });
    } else {
      gsap.to(cursor, {
        width: 14,
        height: 14,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: DOT_COLOR,
        duration: 0.45,
        ease: "elastic.out(1, 0.6)",
      });
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.6,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, [isHovering, text]);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: 14,
        height: 14,
        borderRadius: 9999,
        backgroundColor: DOT_COLOR,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        ref={contentRef}
        className="flex scale-[0.6] items-center gap-1.5 whitespace-nowrap text-sm font-medium text-white opacity-0"
      >
        {icon === "play" && <Play size={16} fill="white" />}
        {text && <span>{text}</span>}
        {icon === "arrow" && <ArrowUpRight size={16} />}
      </div>
    </div>
  );
}