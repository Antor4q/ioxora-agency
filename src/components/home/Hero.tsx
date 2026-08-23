import Image from "next/image";
import logo from "../../../public/clutch.jpeg";
import logo2 from "../../../public/google.png";
import logo3 from "../../../public/upwork.png";
import HologramLogo from "../shared/logoShader/HologramLogo";
import LiquidHover from "../shared/LiquidHover";
import { ArrowUpRight } from "lucide-react";
import HoverButton from "../shared/HoverButton";

const Hero = () => {
  return (
    <div
      className="bg-cover bg-center relative"
      style={{ backgroundImage: "url('/agency.png')" }}
    >
      {/* subtle overlay to clean up the texture without killing it */}
      {/* <div className="absolute inset-0 bg-white/40 pointer-events-none" /> */}

      <div
        className="
          relative
          flex
          flex-col
          gap-10
          px-4
          pt-28
          pb-12

          sm:px-6
          sm:pt-32
          sm:pb-14

          md:px-10
          md:pt-36
         
          lg:grid
          lg:h-[800px]
          lg:grid-cols-5
          lg:gap-0
          lg:px-16
          lg:pt-40
          lg:pb-16

          xl:px-20
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            justify-center

            sm:gap-6

            lg:col-span-3
            lg:justify-end
            lg:h-full
          "
        >
          <p
            className="
              text-[#3d4247]
              text-base
              max-w-[520px]
              font-medium
              leading-relaxed

              sm:text-lg
              sm:max-w-[600px]
            "
          >
            ioXora builds UX-driven websites, AI-powered experiences,
            interactive web experiences, and custom AI SaaS for ambitious
            brands.
          </p>

          <LiquidHover
            intensity={2.2}
            radius={0.13}
            className="w-max max-w-full overflow-visible z-50"
          >
            <h1
              className="
                text-[#222628]
                font-bold
                leading-[0.95]
                tracking-[-0.02em]

                text-[60px]

                sm:text-[77px]
                sm:leading-[0.92]
                sm:tracking-[-0.03em]

                md:text-[88px]

                lg:text-[110px]
                lg:leading-[0.9]
                lg:tracking-[-0.05em]
                lg:whitespace-nowrap

                xl:text-[150px]

                2xl:text-[180px]
                2xl:leading-[0.88]
                2xl:tracking-[-0.06em]
              "
            >
              We Built For <br />
              The AI Era
            </h1>
          </LiquidHover>

          {/* CTA row: rating badge + primary action */}
          <div
            className="
              flex
              flex-col
              items-start
              gap-3
              mt-2

              sm:flex-row
              sm:items-center
              sm:flex-wrap
              sm:gap-4
            "
          >
            <HoverButton text="Start A Project" link="/contact" />

            <div
              className="
                w-full
                md:max-w-[230px]
                max-w-[200px]
                flex
                items-center
                px-3
                rounded-full
                h-[48px]
                relative
                bg-white/60
                border
                border-[#d5f139]/10
                bg-clip-padding
                backdrop-filter
                backdrop-blur-sm

                sm:h-[52px]
              "
            >
              <Image
                alt="logo"
                src={logo}
                width={50}
                height={50}
                className="rounded-full w-[26px] h-[26px] border-2 border-white sm:w-[30px] sm:h-[30px]"
              />
              <Image
                alt="logo"
                src={logo2}
                width={50}
                height={50}
                className="rounded-full absolute left-7 w-[26px] h-[26px] border-2 border-white sm:left-8 sm:w-[30px] sm:h-[30px]"
              />
              {/* <Image
                alt="logo"
                src={logo3}
                width={50}
                height={50}
                className="absolute left-14 rounded-full w-[30px] h-[30px] border-2 border-white"
              /> */}
              <p
                className="
                  text-[#222628]
                  absolute
                  right-4
                  font-semibold
                  text-[11px]
                  text-right

                  sm:right-5
                  sm:text-[13px]
                "
              >
                4.9 Rating World Wide
              </p>
            </div>
          </div>
        </div>

        {/*
          Single source of truth for the logo's box size —
          HologramLogo itself just fills this (h-full), so
          there's no mismatch between two different height
          scales fighting each other and overflowing into
          the next section.
        */}
        <div
          className="
            flex
            items-center
            justify-center
            h-[380px]
            w-full

            sm:h-[460px]

            md:h-[540px]

            lg:col-span-2
            lg:h-full

            xl:h-full
          "
        >
          <HologramLogo />
        </div>
      </div>
    </div>
  );
};

export default Hero;