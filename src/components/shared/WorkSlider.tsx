"use client";

const projects = [
  {
    name: "Finova",
    image: "work1.png",
  },
  {
    name: "Horizon",
    image: "work2.png",
  },
  {
    name: "NutriPlus",
    image: "work3.png",
  },
  {
    name: "Taskly",
    image: "work4.png",
  },
  {
    name: "TripGo",
    image: "work5.png",
  },
];

export default function WorkSlider() {
  // Duplicate the cards for seamless infinite scrolling
  const sliderItems = [...projects, ...projects];

  return (
    <section className="relative w-full overflow-hidden py-20">
      <div className="slider-track flex w-max gap-5">
        {sliderItems.map((project, index) => (
          <div
            key={`${project.name}-${index}`}
            className="h-[320px] w-[430px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
          >
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}