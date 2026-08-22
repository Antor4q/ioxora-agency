"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import LiquidHover from "./LiquidHover";
import footerElement from "../../../public/footerElement.png";

/* =========================================================
   FOOTER LINK
========================================================= */

const FooterLink = ({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) => {
  const linkContent = (
    <span
      className="
        flex
        flex-col
        text-[20px]
        font-bold
        leading-[34px]
        tracking-[-0.045em]
        text-white/55
        transition-transform
        duration-500
        ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:-translate-y-1/2
        md:text-[25px]
        lg:text-[28px]
      "
    >
      {/* DEFAULT TEXT */}
      <span className="flex h-[34px] items-center">
        {children}
      </span>

      {/* HOVER TEXT */}
      <span className="flex h-[34px] items-center text-white">
        {children}
      </span>
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-[34px] w-fit overflow-hidden"
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="group block h-[34px] w-fit overflow-hidden"
    >
      {linkContent}
    </Link>
  );
};

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#10110D] text-white">
      {/* =====================================================
          BACKGROUND ELEMENT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          z-0
          w-[65%]
          -translate-x-1/2
          opacity-[0.025]
          md:w-[50%]
        "
      >
        <Image
          src={footerElement}
          alt=""
          className="h-auto w-full"
        />
      </div>

      {/* =====================================================
          MAIN FOOTER CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          px-6
          pb-20
          pt-20
          md:px-12
          md:pb-24
          md:pt-24
          lg:px-20
          lg:pb-28
          lg:pt-28
        "
      >
        {/* ===================================================
   

        {/* ===================================================
            LINK GRID
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-x-10
            gap-y-16
            sm:grid-cols-2
            lg:grid-cols-5
            lg:gap-x-8
          "
        >
          {/* =================================================
              COMPANY
          ================================================= */}

          <div>
            <p
              className="
                mb-7
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/30
              "
            >
              Company
            </p>

            <div className="flex flex-col gap-5">
              <FooterLink href="/#about">
                About
              </FooterLink>

              <FooterLink href="/#work">
                Work
              </FooterLink>

              <FooterLink href="/#services">
                Services
              </FooterLink>

              <FooterLink href="/#process">
                Process
              </FooterLink>

              <FooterLink href="/contact">
                Contact
              </FooterLink>
            </div>
          </div>

          {/* =================================================
              SERVICES
          ================================================= */}

          <div>
            <p
              className="
                mb-7
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/30
              "
            >
              Services
            </p>

            <div className="flex flex-col gap-5">
              <FooterLink href="/#services">
                AI Websites
              </FooterLink>

              <FooterLink href="/#services">
                AI SaaS
              </FooterLink>

              <FooterLink href="/#services">
                Web Development
              </FooterLink>

              <FooterLink href="/#services">
                Interactive Websites
              </FooterLink>

              <FooterLink href="/#services">
                AI Integration
              </FooterLink>
            </div>
          </div>

          {/* =================================================
              EXPLORE
          ================================================= */}

          <div>
            <p
              className="
                mb-7
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/30
              "
            >
              Explore
            </p>

            <div className="flex flex-col gap-5">
              <FooterLink href="/#approach">
                Our Approach
              </FooterLink>

              <FooterLink href="/#tech">
                Tech Stack
              </FooterLink>

              <FooterLink href="/#ai">
                How We Use AI
              </FooterLink>

              <FooterLink href="/#why-ioxora">
                Why ioXora
              </FooterLink>

              <FooterLink href="/#faq">
                FAQ
              </FooterLink>
            </div>
          </div>

          {/* =================================================
              CONNECT
          ================================================= */}

          <div>
            <p
              className="
                mb-7
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/30
              "
            >
              Connect
            </p>

            <div className="flex flex-col gap-5">
              <FooterLink
                href="https://www.linkedin.com"
                external
              >
                LinkedIn ↗
              </FooterLink>

              <FooterLink
                href="https://www.facebook.com"
                external
              >
                Facebook ↗
              </FooterLink>

              <FooterLink
                href="https://www.instagram.com"
                external
              >
                Instagram ↗
              </FooterLink>

              <FooterLink
                href="https://github.com"
                external
              >
                GitHub ↗
              </FooterLink>

              <FooterLink href="mailto:hello@ioxoraa.com">
                Email ↗
              </FooterLink>
            </div>
          </div>

          {/* =================================================
              LOCATION
          ================================================= */}

          <div>
            <p
              className="
                mb-7
                text-[10px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/30
              "
            >
              Based in
            </p>

            <div className="flex flex-col gap-6">
              <p
                className="
                  text-[25px]
                  font-bold
                  leading-[0.95]
                  tracking-[-0.05em]
                  text-white
                  md:text-[28px]
                "
              >
                Dhaka,
                <br />
                Bangladesh
              </p>

              <p
                className="
                  max-w-[240px]
                  text-sm
                  leading-[1.7]
                  text-white/30
                "
              >
                Remote-first, working with ambitious
                teams worldwide.
              </p>

              <FooterLink href="mailto:hello@ioxoraa.com">
                +880 1830048613
              </FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-4
          border-y
          border-white/[0.08]
          px-6
          py-6
          text-[10px]
          font-medium
          uppercase
          tracking-[0.18em]
          text-white/30
          md:flex-row
          md:items-center
          md:justify-between
          md:px-20
        "
      >
        <Link
          href="#"
          className="
            transition-colors
            duration-300
            hover:text-white
          "
        >
          Terms &amp; Conditions
        </Link>

        <span>
          © 2026, ioXora, All Rights Reserved.
        </span>

        <Link
          href="#"
          className="
            transition-colors
            duration-300
            hover:text-white
          "
        >
          Privacy Policy
        </Link>
      </div>

      {/* =====================================================
          GIANT LOGO / WORDMARK
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          items-end
          justify-between
          overflow-hidden
          px-6
          pt-8
          md:px-12
          lg:px-20
        "
      >
        {/* SMALL LOGO */}

        <LiquidHover
          intensity={2.2}
          radius={0.13}
          className="w-max overflow-visible"
        >
          <Image
            src="/logo2.png"
            alt="ioXora"
            width={400}
            height={300}
            className="
              w-[80px]
              md:w-[140px]
              lg:w-[190px]
            "
          />
        </LiquidHover>

        {/* GIANT WORDMARK */}

        <LiquidHover
          intensity={2.2}
          radius={0.13}
          className="w-max overflow-visible"
        >
          <h1
            className="
              -mb-4
              whitespace-nowrap
              text-[29vw]
              font-bold
              leading-[0.78]
              tracking-[-0.075em]
              text-white
              md:-mb-7
              md:text-[26vw]
              lg:-mb-10
              lg:text-[25vw]
            "
          >
            ioXora
          </h1>
        </LiquidHover>
      </div>
    </footer>
  );
};

export default Footer;