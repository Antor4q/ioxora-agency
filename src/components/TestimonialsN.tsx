import Image from "next/image";

type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: string; // client portrait, e.g. "/clients/rahim.jpg" (portrait photos work best)
  result?: string; // e.g. "Demo requests doubled"
};

/* ------------------------------------------------------------------
   ADD MORE CLIENTS HERE
   Copy one block and change the details. Use an even number (4, 6, 8)
   so both columns end at the same height.
------------------------------------------------------------------ */
const DEFAULT_ITEMS: Testimonial[] = [
  {
    name: "Rahim Chowdhury",
    role: "Founder",
    company: "Lumen",
    image: "/clients/rahim.jpg",
    quote:
      "They shipped our 3D product page in five weeks. Visitors now stay long enough to understand what we sell.",
    result: "Demo requests doubled after launch",
  },
  {
    name: "Nadia Rahman",
    role: "Head of Marketing",
    company: "Oran Studio",
    image: "/clients/nadia.jpg",
    quote:
      "Nothing felt like a template. Every interaction was built around how our work is meant to be seen.",
    result: "Average session time up 3x",
  },
  {
    name: "Arif Hossain",
    role: "Operations Lead",
    company: "Upto Logistics",
    image: "/clients/arif.jpg",
    quote:
      "We talked to the people writing the code every week. Changes that normally take a sprint took a day.",
    result: "Quote requests up 60%",
  },
  {
    name: "Sara Ahmed",
    role: "Co-founder",
    company: "Heaven Furniture Mart",
    image: "/clients/sara.jpg",
    quote:
      "The store finally looks like our showroom. Customers tell us they feel the quality before they visit.",
    result: "Online orders up 45%",
  },
];

type Props = {
  items?: Testimonial[];
  ctaLabel?: string;
  ctaHref?: string;
};

// Checkerboard of tall and square cards, so the two columns interlock like bricks
// and still end at exactly the same height.
const ratioFor = (index: number) =>
  (Math.floor(index / 2) + (index % 2)) % 2 === 0 ? "aspect-[4/5]" : "aspect-square";

function Card({ c, ratio }: { c: Testimonial; ratio: string }) {
  return (
    <article
      tabIndex={0}
      className="group relative flex flex-col overflow-hidden rounded-md bg-white text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {/* Photo */}
      <div className={`relative w-full overflow-hidden bg-neutral-200 ${ratio}`}>
        {c.image ? (
          <Image
            src={c.image}
            alt={`Portrait of ${c.name}`}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-full w-full items-center justify-center text-7xl font-medium text-black/30"
          >
            {c.name.charAt(0)}
          </span>
        )}

        {/* Name + role, top left */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-4 pb-10 text-[15px] leading-tight text-white">
          <p className="font-medium">{c.name}</p>
          <p className="text-white/75">
            {c.role}, {c.company}
          </p>
        </div>
      </div>

      {/* Quote: under the photo on phones, slides up over the photo on hover / focus elsewhere */}
      <div
        className={[
          "bg-white p-5 text-black",
          "sm:absolute sm:inset-x-0 sm:bottom-0 sm:translate-y-full sm:transition-transform sm:duration-500 sm:ease-out",
          "sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0",
          "motion-reduce:transition-none",
        ].join(" ")}
      >
        <p className="text-[17px] leading-snug tracking-[-0.01em]">{c.quote}</p>
        {c.result && (
          <p className="mt-4 border-t border-black/10 pt-3 text-sm text-black/50">
            {c.result}
          </p>
        )}
      </div>
    </article>
  );
}

export default function TestimonialsN({
  items = DEFAULT_ITEMS,
  ctaLabel = "Book a 30 min call",
  ctaHref = "#contact",
}: Props) {
  const colA = items.map((c, i) => ({ c, i })).filter(({ i }) => i % 2 === 0);
  const colB = items.map((c, i) => ({ c, i })).filter(({ i }) => i % 2 === 1);

  return (
    <section
      className="relative grid w-full grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      aria-labelledby="testimonials-heading"
    >
      {/* Left: dark statement panel, runs edge to edge */}
      <div className="flex flex-col justify-between gap-16 bg-black px-6 py-16 text-[#f5f5f0] md:px-10 lg:py-24">
        <div className="flex flex-col gap-8">
          <h2 id="testimonials-heading" className="text-sm font-normal text-white/50">
            [Clients]
          </h2>
          <div className="flex max-w-[34ch] flex-col gap-6 text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[1.25] tracking-[-0.015em]">
            <p>
              We work with <strong className="font-semibold">founders</strong> and{" "}
              <strong className="font-semibold">product teams</strong> who build complex
              things and need a website that makes them obvious.
            </p>
            <p>
              Most of our projects are <strong className="font-semibold">3D</strong>,{" "}
              <strong className="font-semibold">interactive</strong> and{" "}
              <strong className="font-semibold">AI-powered</strong>, because that is where
              a site can show what a screenshot cannot.
            </p>
            <p className="text-white/50">
              These are the people we built for, and what they said after launch.
            </p>
          </div>
        </div>

        <a
          href={ctaHref}
          className="w-fit rounded-full bg-[#f5f5f0] px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5f5f0]"
        >
          [ {ctaLabel} ]
        </a>
      </div>

      {/* Right: portrait cards */}
      <div className="bg-[#f5f5f0] p-3">
        {/* Phones: one column, in the original order */}
        <ul className="flex flex-col gap-3 sm:hidden" aria-label="Client testimonials">
          {items.map((c, i) => (
            <li key={c.name}>
              <Card c={c} ratio={ratioFor(i)} />
            </li>
          ))}
        </ul>

        {/* Tablet and up: two interlocking columns */}
        <div className="hidden items-start gap-3 sm:grid sm:grid-cols-2">
          <ul className="flex flex-col gap-3">
            {colA.map(({ c, i }) => (
              <li key={c.name}>
                <Card c={c} ratio={ratioFor(i)} />
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-3">
            {colB.map(({ c, i }) => (
              <li key={c.name}>
                <Card c={c} ratio={ratioFor(i)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}