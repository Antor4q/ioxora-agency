"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

const links = ["Work", "Services", "About", "Contact"];

export default function NavbarN() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    gsap.to(menu.current, {
      clipPath: next ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      duration: 0.7, ease: "power4.inOut",
    });
  };

  return (
    <>
      {/* mix-blend-difference keeps logo + burger visible on light and dark sections */}
      <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-6 py-5 text-white mix-blend-difference md:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">ioX</Link>
        <button
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-8 w-8 flex-col items-end justify-center gap-[7px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
        >
          <span className={`h-px w-6 bg-white transition-all duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
          <span className={`h-px bg-white transition-all duration-300 ${open ? "w-6 -translate-y-[4px] -rotate-45" : "w-4"}`} />
        </button>
      </header>

      <div
        ref={menu}
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        className="fixed inset-0 z-50 flex flex-col justify-center bg-black px-6 text-white md:px-8"
      >
        <ul>
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                onClick={toggle}
                tabIndex={open ? 0 : -1}
                className="block py-2 text-[clamp(2.5rem,8vw,6rem)] font-light leading-none tracking-tight hover:italic"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}