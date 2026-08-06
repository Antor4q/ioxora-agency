import Image from "next/image";
import logo from "../../../public/banner.png";
import HologramLogo from "../shared/logoShader/HologramLogo";
import LiquidHover from "../shared/LiquidHover";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <div
      className="bg-cover bg-center relative"
      style={{ backgroundImage: "url('/agency.avif')" }}
    >
      {/* subtle overlay to clean up the texture without killing it */}
      {/* <div className="absolute inset-0 bg-white/40 pointer-events-none" /> */}

      <div className="h-[850px] grid grid-cols-5 pb-16 pt-40 px-20 relative">
        <div className="flex flex-col gap-6 col-span-3 justify-center h-full">
          <p className="text-[#3d4247] text-lg max-w-[600px] font-medium leading-relaxed">
            ioXora is a global UX and Web product development agency. We
            handle logo design, brand identity, packaging, and social media
            content — helping brands redefine experiences and empower
            business growth.
          </p>

          <LiquidHover
            intensity={2.2}
            radius={0.13}
            className="w-max overflow-visible"
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
              We Build <br />
              Web Products
            </h1>
          </LiquidHover>

          {/* CTA row: rating badge + primary action */}
          <div className="flex items-center gap-4 mt-2">
            <button className="group flex items-center gap-3 h-[52px] bg-[#181a1c] text-white pl-6 pr-2 rounded-full font-semibold text-[14px] hover:scale-[1.02] transition-transform">
              Start a Project
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#d5f139] text-black group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </button>

            <div className="w-[220px] flex items-center px-3 rounded-full h-[52px] relative bg-white/60 border border-[#d5f139]/10 bg-clip-padding backdrop-filter backdrop-blur-sm">
              <Image
                alt="logo"
                src={logo}
                width={50}
                height={50}
                className="rounded-full w-[30px] h-[30px] border-2 border-white"
              />
              <Image
                alt="logo"
                src={logo}
                width={50}
                height={50}
                className="rounded-full absolute left-8 w-[30px] h-[30px] border-2 border-white"
              />
              <Image
                alt="logo"
                src={logo}
                width={50}
                height={50}
                className="absolute left-14 rounded-full w-[30px] h-[30px] border-2 border-white"
              />
              <p className="text-[#222628] absolute right-5 font-semibold text-[13px] text-right">
                4.9 Rating
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