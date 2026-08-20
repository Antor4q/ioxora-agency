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

      <div className="h-[850px] grid grid-cols-5 pb-16 pt-40 px-20 relative">
        <div className="flex flex-col gap-6 col-span-3 justify-end h-full">
          <p className="text-[#3d4247] text-lg max-w-[600px] font-medium leading-relaxed">
            ioXora builds UX-driven websites, AI-powered experiences, interactive web experiences, and custom AI SaaS for ambitious brands.
          </p>

          <LiquidHover
            intensity={2.2}
            radius={0.13}
            className="w-max overflow-visible z-50" 
          >
            <h1
              data-cursor-text=" "
              className="
                text-[180px]
                text-[#222628]
                font-bold
                leading-[0.88]
                tracking-[-0.06em]
                whitespace-nowrap
          
              "
            >
              We Built For <br />
              The AI Era
            </h1>
          </LiquidHover>

          {/* CTA row: rating badge + primary action */}
          <div className="flex items-center gap-4 mt-2">
           <HoverButton text="Start A Project" link="/contact"/>

            <div className="w-[230px] flex items-center px-3 rounded-full h-[52px] relative bg-white/60 border border-[#d5f139]/10 bg-clip-padding backdrop-filter backdrop-blur-sm">
              <Image
                alt="logo"
                src={logo}
                width={50}
                height={50}
                className="rounded-full w-[30px] h-[30px] border-2 border-white"
              />
              <Image
                alt="logo"
                src={logo2}
                width={50}
                height={50}
                className="rounded-full absolute left-8 w-[30px] h-[30px] border-2 border-white"
              />
              {/* <Image
                alt="logo"
                src={logo3}
                width={50}
                height={50}
                className="absolute left-14 rounded-full w-[30px] h-[30px] border-2 border-white"
              /> */}
              <p className="text-[#222628] absolute right-5 font-semibold text-[13px] text-right">
                4.9 Rating World Wide
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-center h-full">
  <HologramLogo />
</div>
      </div>
    </div>
  );
};

export default Hero;