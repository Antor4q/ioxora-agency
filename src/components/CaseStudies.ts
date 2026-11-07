// Single source of truth: home page (SelectedWorks), /work page ar /work/[slug] case study, shob ekhan theke data nay.
// Notun project add korte shudhu `make({...})` ekta add koro.

// /work page er filter tab gula. Notun category lagle ekhane add koro.
export const WORK_CATEGORIES = ["Websites", "3D / WebGL", "AI SaaS", "E-commerce"] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type CaseStudyData = {
  // List/card er jonno
  id: string; // "01", "02"...
  slug: string; // URL: /work/<slug>
  name: string; // card ar "Next case study" e dekhay
  desc: string; // card er short description
  thumb: string; // card thumbnail
  video: string; // card hover video
  // /work page er filter + list er jonno
  category: WorkCategory; // filter tab
  industry: string; // list e "Industry" hishebe dekhay
  url: string; // "View website" button er live link
  // Case study page er jonno
  title: string[]; // hero heading, line by line
  result: string; // hero er short line
  cover: string;
  meta: [string, string][]; // Details section: [label, value]  (list er "Year" ekhan theke ashe)
  overview: string; // Details section er boro text
  problem: string; // Problem section er main statement
  problemPoints: [string, string][]; // Problem er details: [title, description]
  solution: string; // Solution section er main statement
  solutionPoints: [string, string][]; // Solution er details: [title, description]
  styleGuide: {
    colors: [name: string, hex: string][];
    fonts: [role: string, family: string][];
  };
  gallery: { src: string }[]; // /work list e prothom 3 ta dekhay
  process: [string, string][];
  results: { value: number; decimals: number; suffix: string; label: string }[];
  stack: string[]; // Solution section e chip hishebe dekhay
  quote: string; // Feedback section (khali "" dile section dekhabe na)
  person: [string, string]; // [name, role/company]
  avatar: string; // client er pic, e.g. "/clients/name.jpg" (khali "" dile initials dekhabe)
};

type Card = Pick<CaseStudyData, "id" | "slug" | "name" | "desc" | "thumb" | "video">;

// PLACEHOLDER body: prottek project e real content diye override koro (make() er 2nd argument e).
// Real client er page e fake number/quote live kore dio na.
const base = {
  category: "Websites" as WorkCategory,
  industry: "Industry name",
  url: "https://example.com", // PLACEHOLDER: real live website link boshao
  result: "Placeholder: add the real result for this project.",
  meta: [
    ["Client", "Client name"],
    ["Services", "3D motion website"],
    ["Year", "2026"],
    ["Timeline", "6 weeks"],
    ["Stack", "Next.js, GSAP, Three.js"],
  ] as [string, string][],
  problem: "Placeholder: describe what was wrong or missing before this project started.",
  problemPoints: [
    ["Pain point one", "Placeholder: explain the first thing that was not working and why it mattered."],
    ["Pain point two", "Placeholder: explain the second issue and how it affected visitors or the business."],
    ["Pain point three", "Placeholder: explain the third issue, or what the client was risking by waiting."],
  ] as [string, string][],
  solution: "Placeholder: describe what we built to fix it, in one or two sentences.",
  solutionPoints: [
    ["Approach one", "Placeholder: explain how we solved the first pain point."],
    ["Approach two", "Placeholder: explain how we solved the second pain point."],
    ["Approach three", "Placeholder: explain the finishing touch, like speed, motion or mobile polish."],
  ] as [string, string][],
  styleGuide: {
    colors: [
      ["Ink", "#0a0a0a"],
      ["Paper", "#f6f5f1"],
      ["Stone", "#9a9a94"],
      ["Sand", "#e3dfd3"],
    ],
    fonts: [
      ["Display", "Inter Tight"],
      ["Body", "Inter"],
    ],
  } as CaseStudyData["styleGuide"],
  gallery: [
    { src: "/work1.png" },
    { src: "/work1.png" },
    { src: "/work1.png" },
    { src: "/work1.png" },
    { src: "/work1.png" },
    { src: "/work1.png" },
  ],
  process: [
    ["Discover", "A short call, then a written brief. We map what visitors must understand in the first scroll."],
    ["Design", "Motion and layout are designed together, so every animation explains something."],
    ["Build", "Next.js, GSAP and Three.js, tested on real phones before launch."],
  ] as [string, string][],
  results: [
    { value: 2, decimals: 0, suffix: "x", label: "Placeholder metric" },
    { value: 40, decimals: 0, suffix: "%", label: "Placeholder metric" },
    { value: 1.2, decimals: 1, suffix: "s", label: "Placeholder metric" },
  ],
  stack: ["Next.js", "GSAP ScrollTrigger", "Canvas 2D effects"],
  quote: "Placeholder: add a real client quote, or set quote to an empty string to hide this section.",
  person: ["Client name", "Role, Company"] as [string, string],
  avatar: "",
};

const make = (c: Card, extra: Partial<CaseStudyData> = {}): CaseStudyData => ({
  ...base,
  ...c,
  title: [c.name],
  cover: c.thumb,
  overview: c.desc,
  ...extra,
});

export const CASE_STUDIES: CaseStudyData[] = [
  make(
    {
      id: "01",
      slug: "heaven-furniture-mart",
      name: "Heaven Furniture Mart",
      desc: "A furniture e-commerce experience with a Shop the Look lookbook, where hotspots on a room photo lead straight to the products.",
      thumb: "/work1.png",
      video: "/pro/rooooo.mp4",
    },
    {
      category: "E-commerce",
      industry: "Furniture & Interiors",
      // Draft copy: nijer moto kore edit koro
      problem:
        "Shoppers saw furniture one product at a time and couldn't picture how pieces worked together in a real room.",
      problemPoints: [
        [
          "Products in isolation",
          "Every item sat alone on a plain background, so nothing showed how a sofa, table and lamp look side by side.",
        ],
        [
          "Hard to browse",
          "Customers had to jump between categories to find pieces that matched, which made building a full room slow.",
        ],
        [
          "Browsing without buying",
          "Without a room to react to, visitors admired single items but rarely added a complete set to the cart.",
        ],
      ],
      solution:
        "A Shop the Look lookbook: hotspots on a styled room photo open each product, so the whole room can be browsed and bought in one flow.",
      solutionPoints: [
        [
          "Shop the Look",
          "Hotspots on a styled room photo open each product in place, so people see the piece in context first.",
        ],
        [
          "One flow, whole room",
          "Visitors add several pieces from the same photo without leaving the page or losing their place.",
        ],
        [
          "Built for thumbs",
          "Hotspots are sized for touch and the images are tuned to load quickly on phones.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Walnut", "#3b2a20"],
          ["Linen", "#f1ebe2"],
          ["Sage", "#8a9a7b"],
          ["Brass", "#b8914f"],
        ],
        fonts: [
          ["Display", "Playfair Display"],
          ["Body", "Inter"],
        ],
      },
    }
  ),
  make(
    {
      id: "02",
      slug: "oran-studio",
      name: "Oran Studio",
      desc: "A portfolio website for an interior design studio, with a smooth preloader, a bold CTA and a curtain-reveal footer.",
      thumb: "/work1.png",
      video: "/pro/rooooo.mp4",
    },
    {
      category: "Websites",
      industry: "Interior Design",
      // Draft copy: nijer moto kore edit koro
      problem:
        "The studio's work was strong, but the old site felt generic and didn't carry the calm, premium feel of their interiors.",
      problemPoints: [
        [
          "A generic first impression",
          "The old site looked like a template, so it didn't match the quality of the spaces the studio designs.",
        ],
        [
          "Work not given room",
          "Projects were squeezed into small grids, so visitors never really felt the detail behind each space.",
        ],
        [
          "No clear next step",
          "Pages ended without a strong call to action, so interested visitors had no obvious way to get in touch.",
        ],
      ],
      solution:
        "A portfolio built around slow, deliberate motion: a preloader that sets the tone, a bold CTA, and a curtain-reveal footer that ends the page with a moment.",
      solutionPoints: [
        [
          "A calm opening",
          "A smooth preloader sets the tone before the first project appears, so the site feels considered from the start.",
        ],
        [
          "Space for the work",
          "Large imagery and generous spacing let each interior breathe, the way it does in real life.",
        ],
        [
          "A confident ending",
          "A bold CTA and a curtain-reveal footer close every page with a clear invitation to start a project.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Charcoal", "#1c1b19"],
          ["Bone", "#efeae0"],
          ["Clay", "#b5755a"],
          ["Stone", "#a8a39a"],
        ],
        fonts: [
          ["Display", "Cormorant Garamond"],
          ["Body", "Inter"],
        ],
      },
    }
  ),
  make(
    {
      id: "03",
      slug: "upto",
      name: "Upto",
      desc: "A freight and logistics website built around a clear service story, a global network map and a quick quote flow.",
      thumb: "/work1.png",
      video: "/pro/rooooo.mp4",
    },
    {
      category: "Websites",
      industry: "Freight & Logistics",
      // Draft copy: nijer moto kore edit koro
      problem:
        "Logistics sites tend to bury what they offer. Visitors couldn't quickly see the services, the reach, or how to ask for a price.",
      problemPoints: [
        [
          "Services were buried",
          "Freight, air and warehousing were mixed together, so visitors had to dig to find what applied to them.",
        ],
        [
          "Reach was invisible",
          "A global network is a big selling point, but the old site only described it in text.",
        ],
        [
          "Quotes took too long",
          "Asking for a price meant a long form or an email, so many enquiries never got sent.",
        ],
      ],
      solution:
        "A clear service story, a global network map that shows the reach at a glance, and a short quote flow that gets a request in within a minute.",
      solutionPoints: [
        [
          "A clear service story",
          "Each service gets its own focused block, so visitors find the right one in a single scroll.",
        ],
        [
          "A network you can see",
          "An interactive global map shows routes and coverage at a glance instead of listing countries.",
        ],
        [
          "A quote in a minute",
          "A short, guided quote flow asks only what is needed and works comfortably on a phone.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Navy", "#0b1b3a"],
          ["Cloud", "#f3f6fb"],
          ["Signal", "#ff6a2b"],
          ["Slate", "#6b7a90"],
        ],
        fonts: [
          ["Display", "Space Grotesk"],
          ["Body", "Inter"],
        ],
      },
    }
  ),
  make(
    {
      id: "04",
      slug: "lumen",
      name: "Lumen",
      desc: "Placeholder: write 1-2 lines about this project here.",
      thumb: "/work1.png",
      video: "/pro/rooooo.mp4",
    },
    { category: "Websites", industry: "Industry name" }
  ),
  make(
    {
      id: "05",
      slug: "nexa-ai",
      name: "Nexa AI",
      desc: "Placeholder: write 1-2 lines about this project here.",
      thumb: "/work1.png",
      video: "/pro/rooooo.mp4",
    },
    { category: "AI SaaS", industry: "AI / SaaS" }
  ),
];