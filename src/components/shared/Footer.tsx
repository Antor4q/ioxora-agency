"use client";

import Image from "next/image";
import LiquidHover from "./LiquidHover";
import footerElement from "../../../public/footerElement.png";

const Footer = () => {
    return (
        <footer className="relative bg-[#0A0A0A] overflow-hidden">
         <div className="footer-element-loop absolute bottom-0 left-0 right-0 mx-auto w-1/2 z-0 bg-[#0A0A0A]">
  <Image
    src={footerElement}
    alt="Footer Element"
    className="w-full mix-blend-screen opacity-10"
  />
</div>

            {/* ===== TOP: link columns, glassy + animated cube backdrop ===== */}
            
            <div className="relative overflow-hidden border-b border-white/[0.09] rounded-t-3xl px-20 pt-24 pb-14 backdrop-blur-md bg-gradient-to-b from-[#D5F139]/[0.035] via-white/[0.012] to-transparent">

               

                <div className="relative z-10 grid grid-cols-2 items-start gap-x-10 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-12">

                    <div>
                        <h4 className="mb-5 text-[15px] font-semibold text-[#F3F3F0]">Important Links</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Contact Us</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">About Us</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Portfolio</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Process</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 text-[15px] font-semibold text-[#F3F3F0]">Services</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">AI-Powered Products</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">AI-Integrated LMS</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Web Design &amp; Development</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">3D &amp; Interactive Sites</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Branding &amp; Identity</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 text-[15px] font-semibold text-[#F3F3F0]">Specialized Industry</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Fintech Industry</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Healthcare &amp; Fitness Industry</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Edtech Industry</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">AI / SaaS Startups</a></li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">
                                    Company Deck
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D5F139]/[0.14]">
                                        <svg viewBox="0 0 10 10" fill="none" className="h-2 w-2">
                                            <path d="M5 1v6M2 5l3 3 3-3M1.5 9h7" stroke="#D5F139" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 text-[15px] font-semibold text-[#F3F3F0]">Compare</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Vs Agencies</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Vs Freelancers</a></li>
                            <li><a href="#" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">Vs In-house</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 text-[15px] font-semibold text-[#F3F3F0]">Headquarters</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="text-[14.5px] text-[#8C8C88]">Dhaka, Bangladesh</li>
                            <li className="text-[14.5px] text-[#8C8C88]">Remote-first, working worldwide</li>
                            <li><a href="mailto:hello@ioxoraa.com" className="text-[14.5px] text-[#8C8C88] transition-colors hover:text-[#D5F139]">hello@ioxoraa.com</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* ===== PARTNER / TRUST BADGES ===== */}
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-10 border-b border-white/[0.09] px-20 py-10">

                <div className="flex min-w-[140px] flex-col gap-2.5">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#F3F3F0]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 4h16v6H10v4h8v6H4z" fill="#D5F139" /></svg>
                        Framer
                    </span>
                    <span className="text-[12.5px] text-[#5A5A57]">Professional Partner</span>
                </div>

                <div className="flex min-w-[140px] flex-col gap-2.5">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#F3F3F0]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M2 6l5 12 5-8 5 8 5-12h-4l-3 8-2-6h-2l-2 6-3-8z" fill="#F3F3F0" /></svg>
                        Webflow
                    </span>
                    <span className="text-[12.5px] text-[#5A5A57]">Professional Partner</span>
                </div>

                <div className="flex min-w-[140px] flex-col gap-2.5">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#F3F3F0]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="#F3F3F0" strokeWidth="1.6" /><path d="M8 12h8M12 8v8" stroke="#F3F3F0" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        Behance
                    </span>
                    <span className="text-[12.5px] text-[#5A5A57]">Top Team on Behance</span>
                </div>

                <div className="flex min-w-[140px] flex-col gap-2.5">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#F3F3F0]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="#F3F3F0" strokeWidth="1.6" /><path d="M3 9c5 2 13 2 18 0M3 15c5-2 13-2 18 0" stroke="#F3F3F0" strokeWidth="1.2" /></svg>
                        Dribbble
                    </span>
                    <span className="text-[12.5px] text-[#5A5A57]">Top Team on Dribbble</span>
                </div>

                <div className="flex min-w-[140px] flex-col gap-2.5">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#F3F3F0]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#F3F3F0" strokeWidth="1.6" /><path d="M8 12h8" stroke="#F3F3F0" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        Clutch
                    </span>
                    <span className="flex items-center gap-1.5 text-[12.5px] text-[#5A5A57]">Reviewed On <span className="tracking-[1px] text-[#D5F139]">★★★★★</span></span>
                </div>

                <div className="flex min-w-[140px] flex-col gap-2.5">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#F3F3F0]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="#F3F3F0" strokeWidth="1.6" /><path d="M12 8v4l3 2" stroke="#F3F3F0" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        Google
                    </span>
                    <span className="flex items-center gap-1.5 text-[12.5px] text-[#5A5A57]">Reviewed On <span className="tracking-[1px] text-[#D5F139]">★★★★★</span></span>
                </div>

            </div>

            {/* ===== BOTTOM BAR ===== */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-20 py-6 text-[13.5px] text-[#5A5A57]">
                <a href="#" className="transition-colors hover:text-[#D5F139]">Terms &amp; Conditions</a>
                <span>© 2026, ioXora, All Rights Reserved.</span>
                <a href="#" className="transition-colors hover:text-[#D5F139]">Privacy Policy</a>
            </div>

            {/* ===== LOGO + GIANT WORDMARK — pinned flush to the very bottom edge ===== */}
            <div className="relative -bottom-8 flex items-end justify-between overflow-hidden px-20 md:-bottom-12">
                <LiquidHover intensity={2.2} radius={0.13} className="w-max overflow-visible">
                    <Image src={"/logo2.png"} alt="logo" width={400} height={300} />
                </LiquidHover>
                <LiquidHover intensity={2.2} radius={0.13} className="w-max overflow-visible">
                    <h1 className="relative bottom-0 -mb-8 whitespace-nowrap text-[470px] font-bold leading-[0.88] tracking-[-0.06em] text-white md:-mb-12">
                        ioXora
                    </h1>
                </LiquidHover>
            </div>

            <style jsx>{`
                .footer-element-loop {
                    animation: footerElementFloat 5s ease-in-out infinite;
                }
                @keyframes footerElementFloat {
                    0%, 100% {
                        opacity: 0.7;
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-14px) scale(1.015);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .footer-element-loop {
                        animation: none;
                    }
                }
            `}</style>

        </footer>
    );
};

export default Footer;