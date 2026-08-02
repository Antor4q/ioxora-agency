"use client"
import { useSectionEntrance } from "../scroll3d/Usesectionentrance";
import TextReveal from "../textreveal/TextReveal";
import WorkCard from "./WorkCard";



const Work = () => {
  const { ref: sectionRef, style: entranceStyle } = useSectionEntrance();
     
interface Work {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
}
 
const works: Work[] = [
  {
    id: "1",
    title: "Nova Finance",
    category: "Web App",
    image: "/work1.png",
    href: "/work/nova-finance",
  },
  {
    id: "2",
    title: "Orbit Studio",
    category: "Branding",
    image: "/work2.png",
    href: "/work/orbit-studio",
  },
  {
    id: "3",
    title: "Pulse Health",
    category: "Mobile App",
    image: "/work3.png",
    href: "/work/pulse-health",
  },
  {
    id: "4",
    title: "Fable Commerce",
    category: "E-commerce",
    image: "/work4.png",
    href: "/work/fable-commerce",
  },
];

    return (
        <div 
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        style={entranceStyle}
        className="px-20 py-32 z-10 -mt-16 rounded-t-[2.5rem] sm:-mt-24 ">
            <h4 className="text-2xl font-bold text-[#797B7C] mb-5">{"Work's"}</h4>
           <TextReveal
            start="top 85%"
  end="top 55%"
  scrub={0.3}
            as="h2" 
           className="
     text-[112px] 
      text-[#222628]
      font-bold
      leading-[1.0]
      tracking-[-0.06em]
      whitespace-nowrap">
            A Glimpse Into The Work 
           </TextReveal>
           <TextReveal
            start="top 85%"
  end="top 55%"
  scrub={0.3}
            as="h2" 
           className="
     text-[112px] 
      text-[#222628]
      font-bold
      leading-[1.0]
      tracking-[-0.06em]
      whitespace-nowrap">
             That Defines Who We Are.
           </TextReveal>
      {/* works */}
        <div className="grid grid-cols-2 gap-10 mt-20">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              title={work.title}
              category={work.category}
              image={work.image}
              href={work.href}
            />
          ))}
          </div>
        </div>
    );
};

export default Work;