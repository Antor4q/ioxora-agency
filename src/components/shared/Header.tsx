"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo2.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Palette,
  Globe,
  Smartphone,
  Rocket,
  Code2,
  Layers,
  ShoppingBag,
  Zap,
} from "lucide-react";
import HoverButton from "./HoverButton";

const designServices = [
  { title: "UI/UX Design", desc: "Web & Mobile app design", icon: Palette },
  { title: "Web Design", desc: "Modern websites that convert.", icon: Globe },
  { title: "Mobile App Design", desc: "Seamless iOS & Android design.", icon: Smartphone },
  { title: "Branding", desc: "Identity that stands out.", icon: Rocket },
];

const devServices = [
  { title: "Web Development", desc: "Built for speed & growth.", icon: Code2 },
  { title: "WordPress Development", desc: "Easy to manage & scale.", icon: Layers },
  { title: "Shopify Development", desc: "Sell more with Shopify.", icon: ShoppingBag },
  { title: "Webflow Development", desc: "Custom sites, no compromises.", icon: Zap },
];

// Section-anchor links live on the homepage ("/#id").
// Contact is the only separate route.
// NOTE: make sure your homepage sections actually have these ids,
// e.g. <section id="work"> ... </section>
const NAV_LINKS = [
  { label: "Home", href: "/", type: "route" as const },
  { label: "Work", href: "/#work", type: "anchor" as const, id: "work" },
  { label: "About", href: "/#about", type: "anchor" as const, id: "about" },
];

// Reusable nav link: text + an animated underline beneath it.
// Underline is hidden (scale-x-0) by default, grows in from the left
// on hover, and stays fully shown (scale-x-100) when `active` is true.
const NavLink = ({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <Link href={href} className="group relative inline-flex flex-col items-center py-1">
    <span
      className={`transition-colors duration-300 ${
        active ? "text-black" : "text-neutral-700 group-hover:text-black"
      }`}
    >
      {children}
    </span>
    <span
      className={`
        absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#d5f139]
        origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
      `}
    />
  </Link>
);

const Header = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  // Scroll-spy: highlight whichever section is currently in view,
  // so anchor nav links (Work / About / Services) reflect scroll position.
  useEffect(() => {
    const sectionIds = ["work", "about", "services"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

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

  const isActive = (link: (typeof NAV_LINKS)[number]) => {
    if (link.type === "route") return pathname === link.href;
    return pathname === "/" && activeSection === link.id;
  };

  const isServicesActive = pathname === "/" && activeSection === "services";
  const isContactActive = pathname === "/contact";

  return (
    <div className="flex justify-center relative z-[999] px-20">
      <div className="fixed top-5 w-[1060px] h-[68px] bg-white/40 flex items-center mx-auto rounded-full border border-[#d5f139]/10 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 z-[999]">
        <div className="px-3 flex justify-between items-center w-full">
          {/* logo */}
          <div className="flex items-center gap-2">
            <Image src={logo} alt="logo" width={35} height={35} />
            <h3 className="text-[30px] font-bold">ioXora</h3>
          </div>

          {/* Desktop Menu */}
          <nav className="flex items-center text-sm transition-all duration-500 gap-8">
            <NavLink href="/" active={isActive(NAV_LINKS[0])}>
              Home
            </NavLink>

            {/* Services with hover dropdown (static — no links yet) */}
            <div className="group relative">
              <button className="relative flex flex-col items-center gap-1.5 py-4">
                <span
                  className={`flex items-center gap-1.5 transition-colors duration-300 ${
                    isServicesActive ? "text-black" : "text-neutral-700 group-hover:text-black"
                  }`}
                >
                  Services
                  <svg
                    className="w-3 h-3 mt-[1px] transition-transform duration-300 group-hover:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span
                  className={`
                    absolute left-0 bottom-2 h-[2px] w-full bg-[#d5f139]
                    origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isServicesActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                />
              </button>

              {/* Pointer / notch connecting button to dropdown.
                  top-full (relative to the button) instead of hardcoded
                  pixel values, so it stays aligned if button size changes. */}
              <div
                className="
                  invisible opacity-0
                  group-hover:visible group-hover:opacity-100
                  transition-opacity duration-300 delay-100
                  absolute left-1/2 -translate-x-1/2 top-full mt-[6px]
                  w-4 h-4 bg-white rotate-45 rounded-sm
                  shadow-[0_4px_10px_-4px_rgba(0,0,0,0.15)]
                  z-[998]
                "
              />

              {/* Dropdown panel */}
              <div
                className="
                  invisible opacity-0 translate-y-3 scale-[0.98]
                  group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                  transition-all duration-300 ease-out origin-top
                  absolute left-1/2 -translate-x-1/2 top-full mt-2
                  w-[1240px] bg-white rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]
                  border border-black/5 p-12
                  grid grid-cols-[1fr_1fr_0.9fr] gap-14
                  z-[999]
                "
              >
                {/* Design Services (static for now — no links) */}
                <div>
                  <div className="bg-[#f2f0ff] rounded-2xl px-6 py-3.5 mb-7">
                    <h4 className="font-bold text-black text-[20px]">Design Services</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    {designServices.map(({ title, desc, icon: Icon }) => (
                      <div
                        key={title}
                        className="group/item flex items-start gap-4 rounded-2xl p-3.5 -mx-3.5"
                      >
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#181a1c] text-white shrink-0">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <div className="pt-1">
                          <p className="font-semibold text-black text-[17px]">{title}</p>
                          <p className="text-gray-500 text-[14px] mt-1">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Development Services (static for now — no links) */}
                <div className="border-l border-black/5 pl-14">
                  <div className="bg-[#fdeee0] rounded-2xl px-6 py-3.5 mb-7">
                    <h4 className="font-bold text-black text-[20px]">Development Services</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    {devServices.map(({ title, desc, icon: Icon }) => (
                      <div
                        key={title}
                        className="group/item flex items-start gap-4 rounded-2xl p-3.5 -mx-3.5"
                      >
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#181a1c] text-white shrink-0">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <div className="pt-1">
                          <p className="font-semibold text-black text-[17px]">{title}</p>
                          <p className="text-gray-500 text-[14px] mt-1">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product showcase */}
                <div className="border-l border-black/5 pl-14">
                  <span className="inline-flex items-center gap-1.5 bg-black text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#d5f139] rounded-full" />
                    Our Product
                  </span>

                  <div className="bg-gradient-to-b from-[#eafff0] to-[#e6f7ff] rounded-3xl mt-5 p-5">
                    <p className="font-bold text-black text-[18px]">Webpagehealth</p>
                    <p className="text-gray-500 text-[14px] mb-4">AI-Powered Website Analysis</p>

                    <video
                      className="w-full h-[150px] object-cover rounded-2xl border border-black/5"
                      src="/videos/webpagehealth-preview.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>

                  <button className="w-full mt-5 bg-[#181a1c] text-white text-[14px] font-semibold py-3.5 rounded-full hover:scale-[1.02] transition-transform">
                    Explore
                  </button>
                </div>
              </div>
            </div>

            <NavLink href="/#work" active={isActive(NAV_LINKS[1])}>
              Work
            </NavLink>

            <NavLink href="/#about" active={isActive(NAV_LINKS[2])}>
              About
            </NavLink>

            <NavLink href="/contact" active={isContactActive}>
              Contact
            </NavLink>
          </nav>

          <HoverButton text="Get Start" link="/contact" />
        </div>
      </div>
    </div>
  );
};

export default Header;