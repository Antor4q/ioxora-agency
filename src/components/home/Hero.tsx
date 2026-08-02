import Image from "next/image";
import logo from "../../../public/banner.png"
import HologramLogo from "../shared/logoShader/HologramLogo";
import LiquidHover from "../shared/LiquidHover";



const Hero = () => {
    return (
      
<div className="bg-cover bg-center"
style={{ backgroundImage: "url('/agency.avif')" }}
>
    <div className="h-[850px] grid grid-cols-5 pb-16 pt-40 px-20">
  <div className="flex flex-col gap-6 col-span-3 justify-end h-full">

    <p className="text-[#222628] text-lg max-w-[600px] font-medium">
      ioXora is a global UX and Web product development agency.logo design, brand identity, packaging, and social media content.  Helping brands redefine experiences and empower business growth.
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
   

    <div className="w-[280px] flex items-center px-3 rounded-full h-[50px] relative bg-white/50 border border-[#d5f139]/10 bg-clip-padding backdrop-filter backdrop-blur-sm">

      <Image
        alt="logo"
        src={logo}
        width={50}
        height={50}
        className="rounded-full w-[30px] h-[30px]"
      />

      <Image
        alt="logo"
        src={logo}
        width={50}
        height={50}
        className="rounded-full absolute left-8 w-[30px] h-[30px]"
      />

      <Image
        alt="logo"
        src={logo}
        width={50}
        height={50}
        className="absolute left-14 rounded-full w-[30px] h-[30px]"
      />

      <p className="text-[#222628] absolute right-5 font-s text-right">
        4.9 Rating world wide
      </p>
    </div>
  </div>

  <div className="col-span-2 flex justify-end">
    <HologramLogo />
  </div>
</div>
</div>
    )}

export default Hero