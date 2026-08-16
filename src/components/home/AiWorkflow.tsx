import TextReveal from "../shared/textreveal/TextReveal";

const AiWorkflow = () => {
  return (
    <div className="px-20 py-10">
       <h4 className="text-2xl font-bold text-[#212122] mb-5">{"Work's"}</h4>
                       <TextReveal
                        start="top 85%"
              end="top 55%"
              scrub={0.3}
                        as="h2" 
                       className="
                 text-[112px] 
                  text-[#171616]
                  font-bold
                  leading-[1.0]
                  tracking-[-0.06em]
                  whitespace-nowrap">
                        A Glimpse Into The Work 
                       </TextReveal>
          <div>
            
          </div>
    </div>
  );
};

export default AiWorkflow;