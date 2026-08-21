"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Play,
  ArrowUpRight,
  Volume2,
  VolumeX,
} from "lucide-react";

type CursorIcon =
  | "play"
  | "arrow"
  | "volume-on"
  | "volume-off"
  | null;

const DOT_COLOR = "#D5F139";
const PILL_COLOR = "#D5F139";
const TEXT_COLOR = "#000";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [text, setText] = useState<string | null>(null);
  const [icon, setIcon] = useState<CursorIcon>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  /* -------------------------------------------------------
   * CURRENTLY HOVERED TARGET + OBSERVER
   *
   * *** NEW ***
   * We keep a reference to whichever element is currently
   * hovered, plus a MutationObserver watching its
   * data-cursor-text / data-cursor-icon attributes. This
   * lets the cursor react INSTANTLY when those attributes
   * change (e.g. after a click toggles state), without
   * requiring the mouse to leave and re-enter the element.
   * ----------------------------------------------------- */

  const currentTargetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  /* -------------------------------------------------------
   * MOUSE POSITION
   * ----------------------------------------------------- */

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    // Enable only for mouse / trackpad
    const isFinePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

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
      setIsVisible(true);

      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    }

    /* -------------------------------------------------------
     * READ ATTRIBUTES FROM A TARGET
     *
     * *** NEW ***
     * Shared helper — reads the current state of
     * data-cursor-text / data-cursor-icon off a target and
     * syncs React state. Called both on initial hover AND
     * whenever the MutationObserver detects a change.
     * ----------------------------------------------------- */

    function syncFromTarget(target: HTMLElement) {
      const hasCursorAttrs =
        target.hasAttribute("data-cursor-text") ||
        target.hasAttribute("data-cursor-icon");

      if (!hasCursorAttrs) {
        // Attributes were removed (e.g. sound turned on) ->
        // fall back to the default small dot, even though
        // the mouse never left the element.
        setIsHovering(false);
        setText(null);
        setIcon(null);
        return;
      }

      const cursorText = target.getAttribute(
        "data-cursor-text"
      );

      const cursorIcon = target.getAttribute(
        "data-cursor-icon"
      ) as CursorIcon;

      setIsHovering(true);
      setText(cursorText || null);
      setIcon(cursorIcon || null);
    }

    /* -------------------------------------------------------
     * HOVER ENTER
     * ----------------------------------------------------- */

    function handleOver(e: MouseEvent) {
      const target = (
        e.target as HTMLElement
      )?.closest(
        "[data-cursor-text], [data-cursor-icon]"
      ) as HTMLElement | null;

      if (!target) return;

      currentTargetRef.current = target;

      syncFromTarget(target);

      // *** NEW ***
      // Watch this exact target for attribute changes while
      // the mouse stays inside it.
      observerRef.current?.disconnect();

      observerRef.current = new MutationObserver(() => {
        if (currentTargetRef.current === target) {
          syncFromTarget(target);
        }
      });

      observerRef.current.observe(target, {
        attributes: true,
        attributeFilter: [
          "data-cursor-text",
          "data-cursor-icon",
        ],
      });
    }

    /* -------------------------------------------------------
     * HOVER LEAVE
     * ----------------------------------------------------- */

    function handleOut(e: MouseEvent) {
      const target = (
        e.target as HTMLElement
      )?.closest(
        "[data-cursor-text], [data-cursor-icon]"
      ) as HTMLElement | null;

      if (!target) return;

      const relatedTarget =
        e.relatedTarget as Node | null;

      // Prevent flicker when moving between children
      if (
        relatedTarget &&
        target.contains(relatedTarget)
      ) {
        return;
      }

      // *** NEW ***
      // Stop watching this target once the mouse actually
      // leaves it.
      observerRef.current?.disconnect();
      observerRef.current = null;
      currentTargetRef.current = null;

      setIsHovering(false);
      setText(null);
      setIcon(null);
    }

    /* -------------------------------------------------------
     * LEAVE WINDOW
     * ----------------------------------------------------- */

    function handleLeaveWindow() {
      observerRef.current?.disconnect();
      observerRef.current = null;
      currentTargetRef.current = null;

      setIsVisible(false);
      setIsHovering(false);
      setText(null);
      setIcon(null);
    }

    window.addEventListener(
      "mousemove",
      handleMove
    );

    document.addEventListener(
      "mouseover",
      handleOver
    );

    document.addEventListener(
      "mouseout",
      handleOut
    );

    document.addEventListener(
      "mouseleave",
      handleLeaveWindow
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      document.removeEventListener(
        "mouseover",
        handleOver
      );

      document.removeEventListener(
        "mouseout",
        handleOut
      );

      document.removeEventListener(
        "mouseleave",
        handleLeaveWindow
      );

      // *** NEW ***
      observerRef.current?.disconnect();
      observerRef.current = null;
      currentTargetRef.current = null;
    };
  }, []);

  /* -------------------------------------------------------
   * CURSOR ANIMATION
   * ----------------------------------------------------- */

  useEffect(() => {
    const cursor = cursorRef.current;
    const content = contentRef.current;

    if (!cursor || !content) return;

    if (isHovering) {
      /* -----------------------------
       * EXPAND CURSOR
       * --------------------------- */

      gsap.to(cursor, {
        width: 92,
        height: 92,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: PILL_COLOR,
        duration: 0.45,
        ease: "elastic.out(1, 0.65)",
      });

      /* -----------------------------
       * SHOW CONTENT
       * --------------------------- */

      gsap.to(content, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.05,
        ease: "back.out(2)",
      });
    } else {
      /* -----------------------------
       * SHRINK CURSOR
       * --------------------------- */

      gsap.to(cursor, {
        width: 12,
        height: 12,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: DOT_COLOR,
        duration: 0.4,
        ease: "elastic.out(1, 0.65)",
      });

      /* -----------------------------
       * HIDE CONTENT
       * --------------------------- */

      gsap.to(content, {
        opacity: 0,
        scale: 0.5,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, [isHovering, text, icon]);

  return (
    <div
      ref={cursorRef}
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
        flex
        -translate-x-1/2
        -translate-y-1/2
        items-center
        justify-center
        overflow-hidden
        rounded-full
      "
      style={{
        width: 12,
        height: 12,
        borderRadius: 9999,
        backgroundColor: DOT_COLOR,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* 
        The content takes the full cursor area.
        Therefore dynamic text/icon stays
        exactly in the center of the circle.
      */}
      <div
        ref={contentRef}
        className="
          pointer-events-none
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
          text-center
          leading-none
          scale-[0.5]
        "
        style={{
          color: TEXT_COLOR,
        }}
      >
        {/* PLAY ICON */}
        {icon === "play" && (
          <Play
            size={18}
            fill="currentColor"
            strokeWidth={1.5}
          />
        )}

        {/* VOLUME ON */}
        {icon === "volume-on" && (
          <Volume2
            size={18}
            strokeWidth={1.8}
          />
        )}

        {/* VOLUME OFF */}
        {icon === "volume-off" && (
          <VolumeX
            size={18}
            strokeWidth={1.8}
          />
        )}

        {/* ARROW */}
        {icon === "arrow" && (
          <ArrowUpRight
            size={22}
            strokeWidth={1.8}
          />
        )}

        {/* 
          DYNAMIC TEXT
          Comes from data-cursor-text
        */}
        {text && (
          <span
            className="
              mt-1
              max-w-[72px]
              text-center
              text-[13px]
              font-medium
              leading-[1.05]
            "
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
}