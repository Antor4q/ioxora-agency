import Image from "next/image";

const Footer = () => {
    return (
        <div className="bg-[#0A0A0A] px-20">
             <div className="flex items-center justify-between">
                <Image src={"/logo2.png"} alt="logo" width={400} height={300}/>
             <h1
 
    className="
      text-[470px]
      text-[#222628]
      font-bold
      leading-[0.88]
      tracking-[-0.06em]
      whitespace-nowrap
    "
  >
   ioXora
  </h1>
             </div>
        </div>
    );
};

export default Footer;