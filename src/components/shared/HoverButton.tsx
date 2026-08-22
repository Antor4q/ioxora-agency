import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type HoverButtonProps = {
  text: string;
  link: string;
};

// This button works two ways at once, and they don't conflict:
// 1. Standalone — hovering the button itself triggers the slide
//    (its own named group: `group/btn`).
// 2. Nested — wrap it in a parent with a plain `group` class
//    (e.g. a row/card) and hovering that parent triggers the slide too.
//    <div className="group ..."> ... <HoverButton /> </div>
//
// Height scales at the `sm` breakpoint (44px -> 50px). The hover
// translate distance is written per-breakpoint so it always matches
// the block height exactly — mismatched values would leave a gap
// or overshoot the slide.
const HoverButton = ({ text, link }: HoverButtonProps) => {
  return (
    <Link
      href={link}
      className="
        group/btn relative
        inline-flex flex-col
        w-fit
        h-[44px]
        outline-none border-0
        rounded-full
        overflow-hidden
        active:scale-95
        cursor-pointer

        sm:h-[50px]
      "
      style={{
        transition:
          'box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* dark block */}
      <div
        className="
          hoverbtn-slide
          shrink-0
          w-full h-[44px] bg-[#222628]
          flex items-center justify-center
          transition-transform duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-y-[-44px] group-hover/btn:translate-y-[-44px]

          sm:h-[50px]
          sm:group-hover:translate-y-[-50px] sm:group-hover/btn:translate-y-[-50px]
        "
      >
        <span className="
          flex items-center justify-between
          w-full h-[44px] px-[1em] py-[0.7em]

          sm:h-[50px] sm:px-[1.125em] sm:py-[0.75em]
        ">
          <p className="text-[14px] font-medium text-white m-0 whitespace-nowrap sm:text-[16px]">{text}</p>
          <p className="text-[14px] font-medium text-white m-0 sm:text-[16px]">
            <ArrowUpRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          </p>
        </span>
      </div>

      {/* accent block */}
      <div
        className="
          hoverbtn-slide
          shrink-0
          w-full h-[44px] bg-[#D5F139]
          flex items-center justify-center
          transition-transform duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-y-[-44px] group-hover/btn:translate-y-[-44px]

          sm:h-[50px]
          sm:group-hover:translate-y-[-50px] sm:group-hover/btn:translate-y-[-50px]
        "
      >
        <span className="
          flex items-center gap-3
          w-full h-[44px] px-[1em] py-[0.7em]

          sm:gap-5 sm:h-[50px] sm:px-[1.125em] sm:py-[0.75em]
        ">
          <p className="text-[14px] font-medium text-[#222628] m-0 whitespace-nowrap sm:text-[16px]">{text}</p>
          <p className="text-[14px] font-medium text-[#222628] m-0 sm:text-[16px]">
            <ArrowUpRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          </p>
        </span>
      </div>
    </Link>
  );
};

export default HoverButton;