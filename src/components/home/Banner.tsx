import { ArrowUpRight, Play } from "lucide-react";
import bg from "../../../public/banner.png"
import WorkSlider from "../shared/WorkSlider";
const Banner = () => {
    return (
        <div
  className=" bg-cover bg-center pt-40"
  style={{ backgroundImage: "url('/banner.png')" }}
>
 <section className="relative text-white">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#d5f139]/5 blur-[140px]" />

      {/* Side dot pattern */}
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-[24%] opacity-50">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(213,241,57,0.65) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "linear-gradient(to right, black, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, black, rgba(0,0,0,0.5), transparent)",
          }}
        />
      </div> */}

      {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-[24%] opacity-50">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(213,241,57,0.65) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "linear-gradient(to left, black, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage:
              "linear-gradient(to left, black, rgba(0,0,0,0.5), transparent)",
          }}
        />
      </div> */}

      {/* Main content */}
      <div className="relative z-10 mx-auto flex  max-w-[1400px] flex-col items-center px-6 pt-8 text-center">
        {/* Trust badge */}
        <div className="mb-7 flex items-center gap-2 rounded-full border border-[#d5f139]/25 bg-white/[0.02] px-4 py-2 backdrop-blur-md">
          <div className="flex -space-x-2">
            {["A", "M", "K", "R"].map((letter, index) => (
              <div
                key={index}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-zinc-700 text-[10px] font-semibold"
              >
                {letter}
              </div>
            ))}
          </div>

          <span className="text-[12px] text-white/80">
            Trusted by 100+ Businesses Worldwide
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-[1000px] text-[54px] font-medium leading-[0.98] tracking-[-0.045em] sm:text-[68px] lg:text-[76px]">
          We Build{" "}
          <span className="font-serif italic font-medium text-[#d5f139]">
            Modern Web
          </span>
          <br />
          Products That Drive{" "}
          <span className="font-serif italic font-medium text-[#d5f139]">
            Growth
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-[720px] text-[15px] leading-6 text-white/65 sm:text-[16px]">
          A results-driven web development agency focused on building fast,
          <br className="hidden sm:block" />
          scalable and high-performing websites & web applications.
        </p>

        {/* CTA */}
        <div className="mt-8 flex items-center gap-3">
          <button className="group flex h-[48px] items-center gap-3 rounded-full bg-[#d5f139] px-7 text-[13px] font-semibold text-black shadow-[0_0_35px_rgba(213,241,57,0.2)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(213,241,57,0.35)]">
            Start a Project

            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <button className="group flex h-[48px] items-center gap-3 rounded-full border border-white/20 bg-white/[0.02] px-7 text-[13px] font-medium text-white transition-all duration-300 hover:border-[#d5f139]/50 hover:bg-white/[0.05]">
            View Our Work

            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-[#d5f139]/50">
              <Play
                size={10}
                fill="currentColor"
                className="ml-0.5"
              />
            </span>
          </button>
        </div>

        {/* Handwritten note */}
        <div className="absolute right-[4%] top-[250px] hidden rotate-[-8deg] lg:block">
          <div className="font-[cursive] text-[20px] leading-[1.15] text-[#d5f139]">
            Turning
            <br />
            Ideas Into
            <br />
            Powerful Web
            <br />
            Experiences
          </div>

          <div className="mt-2 ml-2 h-[2px] w-[125px] rotate-[-3deg] bg-[#d5f139]" />
        </div>
      </div>
    </section>
    <WorkSlider/>
</div>
    );
};

export default Banner;