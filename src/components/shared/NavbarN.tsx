"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const links = [
  { label: "Work", href: "#work", hint: "Selected projects" },
  { label: "Services", href: "#services", hint: "What we build" },
  { label: "About", href: "#about", hint: "Who we are" },
  { label: "Contact", href: "#contact", hint: "Start a project" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
  { label: "GitHub", href: "#" },
];

/* Reusable: hover/focus e [ ] slide kore ashe, layout shift hoy na */
function BracketLink({
  href,
  children,
  tabbable,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  tabbable: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const bracket =
    "pointer-events-none absolute top-0 opacity-0 transition-all duration-300 ease-out";
  return (
    <a
      href={href}
      onClick={onClick}
      tabIndex={tabbable ? 0 : -1}
      className={`group/b relative inline-block outline-none ${className}`}
    >
      <span
        aria-hidden
        className={`${bracket} -left-[0.9em] -translate-x-2 group-hover/b:translate-x-0 group-hover/b:opacity-100 group-focus-visible/b:translate-x-0 group-focus-visible/b:opacity-100`}
      >
        [
      </span>
      {children}
      <span
        aria-hidden
        className={`${bracket} -right-[0.9em] translate-x-2 group-hover/b:translate-x-0 group-hover/b:opacity-100 group-focus-visible/b:translate-x-0 group-focus-visible/b:opacity-100`}
      >
        ]
      </span>
    </a>
  );
}

export default function NavbarN() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Build timeline once
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menu.current, { clipPath: "circle(0% at 94% 4%)", visibility: "hidden" });
      gsap.set(".menu-line", { yPercent: 115 });
      gsap.set(".menu-fade", { autoAlpha: 0, y: 24 });

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      tl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            gsap.set(menu.current, { visibility: "hidden" });
          },
        })
        .set(menu.current, { visibility: "visible" })
        .to(menu.current, {
          clipPath: "circle(150% at 94% 4%)",
          duration: reduce ? 0.01 : 1.1,
          ease: "power3.inOut",
        })
        .to(
          ".menu-line",
          { yPercent: 0, duration: reduce ? 0.01 : 0.9, stagger: 0.08, ease: "power4.out" },
          "-=0.55"
        )
        .to(
          ".menu-fade",
          { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.7, stagger: 0.07, ease: "power3.out" },
          "-=0.6"
        );
    }, root);
    return () => ctx.revert();
  }, []);

  // Play / reverse
  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
    } else {
      tl.current.timeScale(1.6).reverse();
    }
  }, [open]);

  // Esc to close + menu open thakle keyboard diye page scroll block
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (open && [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) {
        const t = e.target as HTMLElement;
        if (t.tagName !== "BUTTON" && t.tagName !== "A") e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={root} className={syne.className}>
      <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-4 text-white mix-blend-difference sm:px-6 sm:py-5 md:px-10">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-xl font-bold tracking-tight sm:text-2xl"
        >
          ioXora
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] sm:block">
            {open ? "Close" : "Menu"}
          </span>
          <span className="flex h-8 w-8 shrink-0 flex-col items-end justify-center gap-[7px]">
            <span
              className={`h-[2px] bg-white transition-all duration-300 ${
                open ? "w-6 translate-y-[4.5px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-[2px] bg-white transition-all duration-300 ${
                open ? "w-6 -translate-y-[4.5px] -rotate-45" : "w-4 group-hover:w-6"
              }`}
            />
          </span>
        </button>
      </header>

      <div
        ref={menu}
        id="site-menu"
        aria-hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black text-white"
      >
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col justify-between gap-10 px-5 pb-8 pt-24 sm:px-6 md:px-10 md:pb-10 md:pt-28">
          <div className="grid flex-1 content-center gap-10 md:grid-cols-12 md:gap-6">
            {/* Main links */}
            <nav className="md:col-span-8" aria-label="Main">
              <ul className="group/list flex flex-col gap-1 md:gap-2">
                {links.map((l, i) => (
                  <li key={l.label} className="overflow-hidden">
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      className="menu-line group/item flex items-baseline gap-4 py-2 opacity-100 transition-opacity duration-300 group-hover/list:opacity-30 hover:!opacity-100 sm:gap-6 md:py-3"
                    >
                      <span className="w-6 text-xs font-medium tabular-nums text-white/50 sm:w-8 sm:text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="flex items-center text-[clamp(2.5rem,9vw,6.5rem)] font-semibold leading-[1.05] tracking-tight">
                        <span className="inline-block -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover/item:translate-x-0 group-hover/item:opacity-100">
                          [
                        </span>
                        <span className="px-0 transition-all duration-300 group-hover/item:px-2 md:group-hover/item:px-3">
                          {l.label}
                        </span>
                        <span className="inline-block translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover/item:translate-x-0 group-hover/item:opacity-100">
                          ]
                        </span>
                      </span>

                      <span className="ml-auto hidden text-xs uppercase tracking-[0.18em] text-white/50 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 lg:block">
                        {l.hint}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Side details */}
            <aside className="flex flex-col gap-8 md:col-span-4 md:justify-center md:pl-8">
              <div className="menu-fade">
                <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">Say hello</p>
                <BracketLink
                  href="mailto:hello@ioxoraa.com"
                  tabbable={open}
                  className="text-lg sm:text-xl"
                >
                  hello@ioxoraa.com
                </BracketLink>
              </div>

              <div className="menu-fade">
                <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">Based in</p>
                <p className="text-lg sm:text-xl">Bangladesh · Working worldwide</p>
              </div>

              <div className="menu-fade">
                <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/40">Follow</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <BracketLink
                        href={s.href}
                        tabbable={open}
                        className="text-sm text-white/80 transition-colors duration-300 hover:text-white"
                      >
                        {s.label}
                      </BracketLink>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* Footer row */}
          <div className="menu-fade flex flex-col gap-3 pt-2 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new projects
            </span>
            <span>© {new Date().getFullYear()} ioXora. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}