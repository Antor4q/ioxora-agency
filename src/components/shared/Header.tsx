"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "../../../public/logo2.png";
import HoverButton from "./HoverButton";

/* =========================================================
   NAV ITEMS
========================================================= */

const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/* =========================================================
   FLIP NAV LINK (desktop — light bg)
========================================================= */

const FlipNavLink = ({
  label,
  href,
  active = false,
}: {
  label: string;
  href: string;
  active?: boolean;
}) => {
  return (
    <Link
      href={href}
      className="group relative block h-[24px] overflow-hidden"
    >
      <span
        className={`
          flex
          flex-col
          text-[20px]
          font-bold
          leading-[24px]
          tracking-[-0.035em]
          transition-transform
          duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:-translate-y-1/2
          ${active ? "text-black" : "text-black/70"}
        `}
      >
        <span className="flex h-[24px] items-center">{label}</span>
        <span className="flex h-[24px] items-center text-black">
          {label}
        </span>
      </span>
    </Link>
  );
};

/* =========================================================
   FULLSCREEN MENU NAV LINK (dark bg, numbered, big)
========================================================= */

const FullscreenNavLink = ({
  index,
  label,
  href,
  active = false,
  onClick,
}: {
  index: number;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group/fs relative flex items-baseline gap-3 overflow-hidden sm:gap-4"
    >
      <span className="text-[13px] font-semibold text-white/40 sm:text-[14px]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="relative block h-[46px] overflow-hidden sm:h-[60px]">
        <span
          className={`
            flex
            flex-col
            text-[42px]
            font-bold
            uppercase
            leading-[46px]
            tracking-[-0.02em]
            transition-transform
            duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)]
            group-hover/fs:-translate-y-1/2
            sm:text-[56px]
            sm:leading-[60px]
            ${active ? "text-[#D5F139]" : "text-white"}
          `}
        >
          <span className="flex h-[46px] items-center sm:h-[60px]">
            {label}
          </span>
          <span className="flex h-[46px] items-center text-[#D5F139] sm:h-[60px]">
            {label}
          </span>
        </span>
      </span>
    </Link>
  );
};

/* =========================================================
   HEADER
========================================================= */

const Header = () => {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const [activeSection, setActiveSection] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
    Route change e menu close — render-time derived state
    (effect er bodhole), cascading-render warning avoid korte.
  */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
  }

  /* =======================================================
     SCROLL BEHAVIOR (paused while menu is open)
  ======================================================= */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (mobileMenuOpen) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setShowNavbar(true);
        setScrolled(false);
        lastScrollY = currentScrollY;
        return;
      }

      setScrolled(true);

      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      }

      if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  /* =======================================================
     SECTION OBSERVER
  ======================================================= */

  useEffect(() => {
    const sectionIds = ["work", "services", "about"];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* =======================================================
     LOCK BODY SCROLL WHEN MENU OPEN
  ======================================================= */

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =======================================================
     CLOSE ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideMenu =
        menuRef.current && menuRef.current.contains(target);

      const clickedToggleButton =
        toggleButtonRef.current &&
        toggleButtonRef.current.contains(target);

      if (clickedInsideMenu || clickedToggleButton) return;

      setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  /* =======================================================
     CLOSE ON ESC + AUTO-CLOSE IF RESIZED TO DESKTOP
  ======================================================= */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =======================================================
     ACTIVE STATE
  ======================================================= */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && activeSection === "";
    }
    if (href === "/contact") {
      return pathname === "/contact";
    }
    const section = href.split("#")[1];
    return activeSection === section;
  };

  return (
    <>
      {/* ===================================================
          HEADER BAR
      =================================================== */}

      <header
        className={`
          fixed
          left-0
          right-0
          top-0
          z-[999]
          w-full
          max-w-[100vw]
          overflow-x-hidden
          px-3
          pt-3

          sm:px-5
          sm:pt-4

          lg:overflow-visible
          lg:px-20
          lg:pt-5

          transition-transform
          duration-700
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${showNavbar ? "translate-y-0" : "-translate-y-[130%]"}
        `}
      >
        <div
          className={`
            flex
            h-[58px]
            w-full
            max-w-full
            min-w-0
            items-center
            justify-between
            gap-2
            px-2

            sm:h-[66px]

            lg:h-[72px]

            transition-all
            duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${
              mobileMenuOpen
                ? "rounded-[26px] border border-white/10 bg-transparent px-4"
                : scrolled
                ? `
                  rounded-[26px]
                  border
                  border-black/[0.07]
                  bg-white/80
                  px-4
                  shadow-[0_10px_40px_rgba(0,0,0,0.05)]
                  backdrop-blur-xl
                  sm:rounded-full
                `
                : `
                  border-transparent
                  bg-transparent
                  shadow-none
                  backdrop-blur-0
                `
            }
          `}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="group flex min-w-0 flex-shrink items-center gap-1.5 sm:gap-2"
          >
            <Image
              src={logo}
              alt="ioXora"
              width={56}
              height={56}
              className="h-7 w-7 flex-shrink-0 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            />

            <span
              className={`
                truncate
                text-[22px]
                font-bold
                tracking-[-0.04em]

                sm:text-[30px]

                lg:text-[49px]
                lg:tracking-[-0.065em]

                ${mobileMenuOpen ? "text-white" : "text-black"}
              `}
            >
              ioXora
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4 lg:gap-12">
            {/* DESKTOP NAV — lg and up only */}
            <nav className="hidden items-center gap-9 lg:flex">
              {navItems.map((item) => (
                <FlipNavLink
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  active={isActive(item.href)}
                />
              ))}
            </nav>

            {/* CTA — lg and up ONLY */}
            <div className="hidden lg:block">
              <HoverButton text="Get Started" link="/#contact" />
            </div>

            {/* MOBILE MENU TOGGLE — below lg ONLY */}
            <button
              ref={toggleButtonRef}
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="
                relative
                flex
                h-9
                w-9
                flex-shrink-0
                flex-col
                items-center
                justify-center
                gap-[5px]

                sm:h-10
                sm:w-10

                lg:hidden
              "
            >
              <span
                className={`
                  h-[2px]
                  w-5
                  transition-transform
                  duration-300
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  sm:w-6
                  ${mobileMenuOpen ? "translate-y-[3.5px] rotate-45 bg-white" : "bg-black"}
                `}
              />
              <span
                className={`
                  h-[2px]
                  w-5
                  transition-transform
                  duration-300
                  ease-[cubic-bezier(0.16,1,0.3,1)]
                  sm:w-6
                  ${mobileMenuOpen ? "-translate-y-[3.5px] -rotate-45 bg-white" : "bg-black"}
                `}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================
          FULLSCREEN MOBILE MENU
          Rendered as a SIBLING of <header>, NOT nested inside
          it — header has overflow-x-hidden which can clip a
          position:fixed descendant. Being a sibling guarantees
          true edge-to-edge 100vw x 100dvh coverage.
      =================================================== */}

      <div
        ref={menuRef}
        style={{ height: "100dvh" }}
        className={`
          fixed
          inset-0
          z-[997]
          flex
          h-[100dvh]
          w-screen
          flex-col
          justify-between
          overflow-y-auto
          bg-[#111214]
          px-6
          pb-8
          pt-24

          sm:px-10
          sm:pt-28

          lg:hidden

          transition-opacity
          duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${
            mobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        {/* NAV LIST */}
        <nav className="flex flex-col gap-5 sm:gap-7">
          {navItems.map((item, i) => (
            <div
              key={item.label}
              className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transitionDelay: mobileMenuOpen ? `${i * 60}ms` : "0ms",
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen
                  ? "translateY(0px)"
                  : "translateY(20px)",
              }}
            >
              <FullscreenNavLink
                index={i}
                label={item.label}
                href={item.href}
                active={isActive(item.href)}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          ))}
        </nav>

        {/* FOOTER ROW — CTA + quick links */}
        <div
          className="flex flex-col gap-6 border-t border-white/10 pt-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transitionDelay: mobileMenuOpen
              ? `${navItems.length * 60}ms`
              : "0ms",
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? "translateY(0px)" : "translateY(20px)",
          }}
        >
          <HoverButton text="Get Started" link="/#contact" />

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-white/50">
            <span>ioxoraa.com</span>
            <span>hello@ioxoraa.com</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;