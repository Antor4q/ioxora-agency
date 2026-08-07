import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { BiRightArrow } from 'react-icons/bi';

const HoverButton = () => {
  return (
    <button 
      className="
        group relative
        h-[50px]
       
        outline-none border-0
        rounded-full
        overflow-hidden
       
        transition-shadow duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]
        active:scale-95
        cursor-pointer
      "
      style={{
        transition: 'box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 第一块 - 蓝色 */}
      <div 
        className="
          w-full h-[50px] bg-[#222628]
          flex items-center justify-center
          transition-transform duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-y-[-50px]
        "
      >
        <span className="
          flex items-center justify-between 
          w-full h-[50px] px-[1.125em] py-[0.75em]
        ">
          <p className="text-[16px] font-medium text-white m-0">Start a Project</p>
          <p className="text-[16px] font-medium text-white m-0"><ArrowUpRight/></p>
        </span>
      </div>

      {/* 第二块 - 绿色 */}
      <div 
        className="
          w-full h-[50px] bg-[#D5F139]
          flex items-center justify-center
          transition-transform duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-y-[-50px]
        "
      >
        <span className="
          flex items-center gap-5
          w-full h-[50px] px-[1.125em] py-[0.75em]
        ">
          <p className="text-[16px] font-medium text-[#222628] m-0">Start a Project</p>
          <p className="text-[16px] font-medium text-[#222628] m-0"><ArrowUpRight/></p>
        </span>
      </div>
    </button>
  );
};

export default HoverButton;