import Image from "next/image";
import logo from "../../../public/logo2.png";
import Link from "next/link";
import {
  ArrowUpRight,
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

const Header = () => {
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
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>

            {/* Services with hover dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1.5 hover:text-black transition py-4">
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
              </button>

              {/* Pointer / notch connecting button to dropdown */}
              <div
                className="
                  invisible opacity-0
                  group-hover:visible group-hover:opacity-100
                  transition-opacity duration-300 delay-100
                  absolute left-1/2 -translate-x-1/2 top-[54px]
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
                  absolute left-1/2 -translate-x-1/2 top-[64px]
                  w-[1240px] bg-white rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]
                  border border-black/5 p-12
                  grid grid-cols-[1fr_1fr_0.9fr] gap-14
                  z-[999]
                "
              >
                {/* Design Services */}
                <div>
                  <div className="bg-[#f2f0ff] rounded-2xl px-6 py-3.5 mb-7">
                    <h4 className="font-bold text-black text-[20px]">Design Services</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    {designServices.map(({ title, desc, icon: Icon }) => (
                      <Link
                        key={title}
                        href="/services"
                        className="group/item flex items-start gap-4 rounded-2xl p-3.5 -mx-3.5 hover:bg-[#f7f7f8] transition-colors"
                      >
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#181a1c] text-white shrink-0 group-hover/item:bg-[#d5f139] group-hover/item:text-black transition-colors">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <div className="pt-1">
                          <p className="font-semibold text-black text-[17px]">{title}</p>
                          <p className="text-gray-500 text-[14px] mt-1">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Development Services */}
                <div className="border-l border-black/5 pl-14">
                  <div className="bg-[#fdeee0] rounded-2xl px-6 py-3.5 mb-7">
                    <h4 className="font-bold text-black text-[20px]">Development Services</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    {devServices.map(({ title, desc, icon: Icon }) => (
                      <Link
                        key={title}
                        href="/services"
                        className="group/item flex items-start gap-4 rounded-2xl p-3.5 -mx-3.5 hover:bg-[#f7f7f8] transition-colors"
                      >
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#181a1c] text-white shrink-0 group-hover/item:bg-[#d5f139] group-hover/item:text-black transition-colors">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <div className="pt-1">
                          <p className="font-semibold text-black text-[17px]">{title}</p>
                          <p className="text-gray-500 text-[14px] mt-1">{desc}</p>
                        </div>
                      </Link>
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

            <Link href="/contact" className="hover:text-black transition">
              Work
            </Link>

            <Link href="/signIn" className="hover:text-black transition">
              About
            </Link>

            <Link href="/signUp" className="hover:text-black transition">
              Contact
            </Link>
          </nav>

          <HoverButton text="Get Start" link="/contact"/>
        </div>
      </div>
    </div>
  );
};

export default Header;