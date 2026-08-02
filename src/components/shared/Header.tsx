import Image from "next/image";
import logo from "../../../public/logo2.png"
import Link from "next/link";
import { ArrowUpRight, ArrowUpRightFromSquare } from "lucide-react";
const Header = () => {
    return (
        <div className="flex justify-center z-30 bg-white/30 px-20">
            <div className="fixed top-5 w-[1060px] h-[68px] bg-white/40  flex items-center mx-auto rounded-full border border-[#d5f139]/10 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ">
                <div className="px-3 flex justify-between items-center w-full">
                    {/* logo */}
                    <div className="flex items-center gap-2">

                    <Image src={logo} alt="logo" width={35} height={35}/>
                    <h3 className="text-[30px]  font-bold">ioXora</h3>
                    </div>
                      {/* Desktop Menu */}
          <nav
            className={`
              flex items-center text-sm 
              transition-all duration-500
            gap-8
            `}
          >
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>

            <Link href="/about" className="hover:text-black transition">
             Services
            </Link>

            <Link href="/contact" className="hover:text-black transition">
             Work
            </Link>

            <Link href="/signIn" className="hover:text-black transition">
              About
            </Link>

            <Link href="/signUp" className="hover:text-black transition">
             Contact
            </Link>
          </nav> 
             <button className="group flex h-[48px] items-center gap-3 rounded-full bg-[#222628] px-7 text-[13px] font-semibold text-white  transition-all duration-300 hover:scale-[1.03] ">
            Start a Project

            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
                </div>
          
            </div>
        </div>
    );
};

export default Header;