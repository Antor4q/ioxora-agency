
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import logo from "../../../public/logo2.png";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import {
//   Palette,
//   Globe,
//   Smartphone,
//   Rocket,
//   Code2,
//   Layers,
//   ShoppingBag,
//   Zap,
// } from "lucide-react";

// import HoverButton from "./HoverButton";

// /* =========================================================
//    SERVICES
// ========================================================= */

// const designServices = [
//   {
//     title: "UI/UX Design",
//     desc: "Web & Mobile app design",
//     icon: Palette,
//   },
//   {
//     title: "Web Design",
//     desc: "Modern websites that convert.",
//     icon: Globe,
//   },
//   {
//     title: "Mobile App Design",
//     desc: "Seamless iOS & Android design.",
//     icon: Smartphone,
//   },
//   {
//     title: "Branding",
//     desc: "Identity that stands out.",
//     icon: Rocket,
//   },
// ];

// const devServices = [
//   {
//     title: "Web Development",
//     desc: "Built for speed & growth.",
//     icon: Code2,
//   },
//   {
//     title: "WordPress Development",
//     desc: "Easy to manage & scale.",
//     icon: Layers,
//   },
//   {
//     title: "Shopify Development",
//     desc: "Sell more with Shopify.",
//     icon: ShoppingBag,
//   },
//   {
//     title: "Webflow Development",
//     desc: "Custom sites, no compromises.",
//     icon: Zap,
//   },
// ];

// /* =========================================================
//    NAV LINKS
// ========================================================= */

// const NAV_LINKS = [
//   {
//     label: "Home",
//     href: "/",
//     type: "route" as const,
//   },
//   {
//     label: "Work",
//     href: "/#work",
//     type: "anchor" as const,
//     id: "work",
//   },
//   {
//     label: "About",
//     href: "/#about",
//     type: "anchor" as const,
//     id: "about",
//   },
// ];

// /* =========================================================
//    FLIP NAV LINK
// ========================================================= */

// const NavLink = ({
//   href,
//   active,
//   children,
// }: {
//   href: string;
//   active: boolean;
//   children: React.ReactNode;
// }) => {
//   return (
//     <Link
//       href={href}
//       className="group relative block h-[20px] overflow-hidden"
//     >
//       <span
//         className={`
//           flex flex-col
//           text-[14px]
//           font-semibold
//           leading-[20px]
//           tracking-[-0.02em]
//           transition-transform
//           duration-500
//           ease-[cubic-bezier(0.16,1,0.3,1)]
//           group-hover:-translate-y-1/2
//           ${
//             active
//               ? "text-black"
//               : "text-neutral-700"
//           }
//         `}
//       >
//         {/* Default */}
//         <span className="flex h-[20px] items-center">
//           {children}
//         </span>

//         {/* Hover */}
//         <span className="flex h-[20px] items-center text-black">
//           {children}
//         </span>
//       </span>

//       {/* Active indicator */}
//       <span
//         className={`
//           absolute
//           -bottom-[5px]
//           left-1/2
//           h-[3px]
//           -translate-x-1/2
//           rounded-full
//           bg-black
//           transition-all
//           duration-300
//           ${
//             active
//               ? "w-1.5 opacity-100"
//               : "w-0 opacity-0"
//           }
//         `}
//       />
//     </Link>
//   );
// };

// /* =========================================================
//    HEADER
// ========================================================= */

// const Header = () => {
//   const pathname = usePathname();

//   const [activeSection, setActiveSection] =
//     useState<string>("");

//   const [servicesOpen, setServicesOpen] =
//     useState(false);

//   /* =======================================================
//      SCROLL SPY
//   ======================================================= */

//   useEffect(() => {
//     const sectionIds = [
//       "work",
//       "about",
//       "services",
//     ];

//     const sections = sectionIds
//       .map((id) =>
//         document.getElementById(id)
//       )
//       .filter(
//         (el): el is HTMLElement =>
//           el !== null
//       );

//     if (!sections.length) return;

//     const observer =
//       new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//               setActiveSection(
//                 entry.target.id
//               );
//             }
//           });
//         },
//         {
//           rootMargin:
//             "-40% 0px -50% 0px",
//           threshold: 0,
//         }
//       );

//     sections.forEach((section) =>
//       observer.observe(section)
//     );

//     return () => observer.disconnect();
//   }, []);

//   /* =======================================================
//      ACTIVE STATES
//   ======================================================= */

//   const isActive = (
//     link: (typeof NAV_LINKS)[number]
//   ) => {
//     if (link.type === "route") {
//       return pathname === link.href;
//     }

//     return (
//       pathname === "/" &&
//       activeSection === link.id
//     );
//   };

//   const isServicesActive =
//     pathname === "/" &&
//     activeSection === "services";

//   const isContactActive =
//     pathname === "/contact";

//   return (
//     <header className="relative z-[999]">

//       {/* ===================================================
//           NAVBAR
//       =================================================== */}

//       <div
//         className="
//           fixed
//           left-0
//           right-0
//           top-0
//           z-[999]
//           w-full
//           px-20
//           pt-5
//         "
//       >
//         <div
//           className="
//             flex
//             h-[68px]
//             w-full
//             items-center
//             justify-between
//             rounded-full
//             border
//             border-black/[0.06]
//             bg-white/65
//             px-6
//             backdrop-blur-xl
//             supports-[backdrop-filter]:bg-white/45
//           "
//         >

//           {/* =================================================
//               LOGO
//           ================================================= */}

//           <Link
//             href="/"
//             className="group flex items-center gap-2"
//           >
//             <Image
//               src={logo}
//               alt="ioXora"
//               width={35}
//               height={35}
//               className="transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105"
//             />

//             <h3
//               className="
//                 text-[28px]
//                 font-bold
//                 tracking-[-0.06em]
//                 text-black
//               "
//             >
//               ioXora
//             </h3>
//           </Link>

//           {/* =================================================
//               RIGHT SIDE
//           ================================================= */}

//           <div className="flex items-center gap-10">

//             {/* =================================================
//                 DESKTOP MENU
//             ================================================= */}

//             <nav className="hidden items-center gap-8 lg:flex">

//               {/* HOME */}
//               <NavLink
//                 href="/"
//                 active={isActive(
//                   NAV_LINKS[0]
//                 )}
//               >
//                 Home
//               </NavLink>

//               {/* WORK */}
//               <NavLink
//                 href="/#work"
//                 active={isActive(
//                   NAV_LINKS[1]
//                 )}
//               >
//                 Work
//               </NavLink>

//               {/* =================================================
//                   SERVICES
//               ================================================= */}

//               <div
//                 className="group relative"
//                 onMouseEnter={() =>
//                   setServicesOpen(true)
//                 }
//                 onMouseLeave={() =>
//                   setServicesOpen(false)
//                 }
//               >

//                 {/* Service Trigger */}

//                 <button
//                   type="button"
//                   className="
//                     flex
//                     h-[20px]
//                     items-center
//                     gap-2
//                     overflow-hidden
//                     text-[14px]
//                     font-semibold
//                     leading-[20px]
//                     tracking-[-0.02em]
//                     text-neutral-700
//                   "
//                 >
//                   {/* Flip Text */}

//                   <span
//                     className={`
//                       flex
//                       flex-col
//                       transition-transform
//                       duration-500
//                       ease-[cubic-bezier(0.16,1,0.3,1)]
//                       group-hover:-translate-y-1/2
//                       ${
//                         isServicesActive
//                           ? "text-black"
//                           : ""
//                       }
//                     `}
//                   >
//                     <span className="flex h-[20px] items-center">
//                       Services
//                     </span>

//                     <span className="flex h-[20px] items-center text-black">
//                       Services
//                     </span>
//                   </span>

//                   {/* Arrow */}

//                   <svg
//                     className={`
//                       h-3
//                       w-3
//                       transition-transform
//                       duration-500
//                       ease-[cubic-bezier(0.16,1,0.3,1)]
//                       ${
//                         servicesOpen
//                           ? "rotate-180"
//                           : "rotate-0"
//                       }
//                     `}
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01-1.06-.02z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>

//                 {/* =================================================
//                     DROPDOWN
//                 ================================================= */}

//                 <div
//                   className={`
//                     invisible
//                     absolute
//                     left-1/2
//                     top-full
//                     mt-5
//                     w-[1100px]
//                     -translate-x-1/2
//                     origin-top
//                     rounded-[28px]
//                     border
//                     border-black/5
//                     bg-white
//                     p-10
//                     opacity-0
//                     shadow-[0_30px_80px_-25px_rgba(0,0,0,0.25)]
//                     transition-all
//                     duration-500
//                     ease-[cubic-bezier(0.16,1,0.3,1)]
//                     ${
//                       servicesOpen
//                         ? "visible translate-y-0 scale-100 opacity-100"
//                         : "translate-y-3 scale-[0.97]"
//                     }
//                   `}
//                 >

//                   <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-10">

//                     {/* DESIGN */}

//                     <div>
//                       <div className="mb-6 rounded-2xl bg-[#f2f0ff] px-5 py-3">
//                         <h4 className="text-[18px] font-bold text-black">
//                           Design Services
//                         </h4>
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         {designServices.map(
//                           ({
//                             title,
//                             desc,
//                             icon: Icon,
//                           }) => (
//                             <div
//                               key={title}
//                               className="
//                                 group/item
//                                 flex
//                                 items-center
//                                 gap-4
//                                 rounded-2xl
//                                 p-3
//                                 transition-colors
//                                 duration-300
//                                 hover:bg-black/[0.035]
//                               "
//                             >
//                               <span
//                                 className="
//                                   flex
//                                   h-11
//                                   w-11
//                                   shrink-0
//                                   items-center
//                                   justify-center
//                                   rounded-full
//                                   bg-[#181a1c]
//                                   text-white
//                                 "
//                               >
//                                 <Icon
//                                   size={18}
//                                   strokeWidth={2}
//                                 />
//                               </span>

//                               <div>
//                                 <p className="text-[15px] font-bold text-black">
//                                   {title}
//                                 </p>

//                                 <p className="mt-1 text-[12px] text-gray-500">
//                                   {desc}
//                                 </p>
//                               </div>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </div>

//                     {/* DEVELOPMENT */}

//                     <div className="border-l border-black/5 pl-10">
//                       <div className="mb-6 rounded-2xl bg-[#fdeee0] px-5 py-3">
//                         <h4 className="text-[18px] font-bold text-black">
//                           Development Services
//                         </h4>
//                       </div>

//                       <div className="flex flex-col gap-1">
//                         {devServices.map(
//                           ({
//                             title,
//                             desc,
//                             icon: Icon,
//                           }) => (
//                             <div
//                               key={title}
//                               className="
//                                 group/item
//                                 flex
//                                 items-center
//                                 gap-4
//                                 rounded-2xl
//                                 p-3
//                                 transition-colors
//                                 duration-300
//                                 hover:bg-black/[0.035]
//                               "
//                             >
//                               <span
//                                 className="
//                                   flex
//                                   h-11
//                                   w-11
//                                   shrink-0
//                                   items-center
//                                   justify-center
//                                   rounded-full
//                                   bg-[#181a1c]
//                                   text-white
//                                 "
//                               >
//                                 <Icon
//                                   size={18}
//                                   strokeWidth={2}
//                                 />
//                               </span>

//                               <div>
//                                 <p className="text-[15px] font-bold text-black">
//                                   {title}
//                                 </p>

//                                 <p className="mt-1 text-[12px] text-gray-500">
//                                   {desc}
//                                 </p>
//                               </div>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </div>

//                     {/* PRODUCT */}

//                     <div className="border-l border-black/5 pl-10">

//                       <span className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[11px] font-medium text-white">
//                         <span className="h-1.5 w-1.5 rounded-full bg-white" />
//                         Our Product
//                       </span>

//                       <div className="mt-5 rounded-3xl bg-[#f5f5f5] p-5">
//                         <p className="text-[17px] font-bold text-black">
//                           Webpagehealth
//                         </p>

//                         <p className="mb-4 mt-1 text-[12px] text-gray-500">
//                           AI-Powered Website Analysis
//                         </p>

//                         <video
//                           className="h-[130px] w-full rounded-2xl border border-black/5 object-cover"
//                           src="/videos/webpagehealth-preview.mp4"
//                           autoPlay
//                           loop
//                           muted
//                           playsInline
//                         />
//                       </div>

//                       <button
//                         type="button"
//                         className="
//                           mt-4
//                           w-full
//                           rounded-full
//                           bg-[#181a1c]
//                           py-3
//                           text-[13px]
//                           font-semibold
//                           text-white
//                           transition-transform
//                           duration-300
//                           hover:scale-[1.02]
//                         "
//                       >
//                         Explore
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ABOUT */}

//               <NavLink
//                 href="/#about"
//                 active={isActive(
//                   NAV_LINKS[2]
//                 )}
//               >
//                 About
//               </NavLink>

//               {/* CONTACT */}

//               <NavLink
//                 href="/contact"
//                 active={isContactActive}
//               >
//                 Contact
//               </NavLink>
//             </nav>

//             {/* =================================================
//                 CTA
//             ================================================= */}

//             <div className="hidden lg:block">
//               <HoverButton
//                 text="Get Start"
//                 link="/contact"
//               />
//             </div>

//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;