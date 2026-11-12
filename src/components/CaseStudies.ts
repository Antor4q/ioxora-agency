// Single source of truth for Selected Works, /work and /work/[slug].
// Add or edit projects here. Every project has its own image and video paths.

export const WORK_CATEGORIES = ["Websites", "3D / WebGL", "AI SaaS", "E-commerce"] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type CaseStudyData = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  thumb: string;
  video: string;
  category: WorkCategory;
  industry: string;
  url: string;
  title: string[];
  result: string;
  cover: string;
  meta: [string, string][];
  overview: string;
  problem: string;
  problemPoints: [string, string][];
  solution: string;
  solutionPoints: [string, string][];
  styleGuide: {
    colors: [name: string, hex: string][];
    fonts: [role: string, family: string][];
  };
  gallery: { src: string }[];
  process: [string, string][];
  // Text-based results: [title, description]. No invented metrics.
  results: [title: string, text: string][];
  stack: string[];
  quote: string;
  person: [string, string];
  avatar: string;
};

type Card = Pick<CaseStudyData, "id" | "slug" | "name" | "desc" | "thumb" | "video">;

// No invented performance metrics, client testimonials, timelines or technology claims.
// Add verified details when they are available.
const base = {
  category: "Websites" as WorkCategory,
  industry: "Not specified",
  url: "",
  result: "A focused website experience built around the brand's services and audience.",
  meta: [
    ["Client", "Not specified"],
    ["Services", "Website design & development"],
    ["Year", "Not specified"],
    ["Timeline", "Not specified"],
    ["Stack", "Not specified"],
  ] as [string, string][],
  problem: "",
  problemPoints: [] as [string, string][],
  solution: "",
  solutionPoints: [] as [string, string][],
  styleGuide: {
    // Add exact sampled brand colours and font families after checking the design files.
    colors: [] as [string, string][],
    fonts: [] as [string, string][],
  },
  gallery: [] as { src: string }[],
  process: [] as [string, string][],
  results: [] as [string, string][],
  stack: [] as string[],
  quote: "",
  person: ["", ""] as [string, string],
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
      slug: "rowe",
      name: "Rowe",
      desc: "A considered furniture e-commerce experience showcasing sculpted forms, natural materials and thoughtfully crafted pieces for modern homes.",
      thumb: "/rowe/rowe1.jpg",
      video: "/rowe/rooowePre.mp4",
    },
    {
      category: "E-commerce",
      industry: "Furniture & Home",
      url: "https://rowe-lyart.vercel.app",
      title: ["Furniture", "made to be lived in."],
      result:
        "A refined shopping experience that brings product craftsmanship, collections and home inspiration together.",
      cover: "/rowe/rowe1.jpg",
      meta: [
        ["Client", "Rowe"],
        ["Services", "E-commerce website design & development"],
        ["Year", "Not specified"],
        ["Timeline", "Not specified"],
        ["Stack", "Not specified"],
      ],
      overview:
        "Rowe presents considered furniture for modern homes, with an emphasis on solid ash, natural fabrics and quiet craftsmanship. The experience brings together product discovery, collection browsing, sustainability messaging and customer reassurance in one cohesive storefront.",
      problem:
        "Furniture is a considered purchase. Shoppers need more than a product listing: they need to understand the materials, imagine pieces in their homes and feel confident about delivery and aftercare.",
      problemPoints: [
        [
          "Make the product feel tangible",
          "Furniture shoppers want to understand the form, fabric and materials before making a decision. Product presentation needs to give those details room to speak.",
        ],
        [
          "Organise a broad collection",
          "Living, outdoor, dining, bedroom and office collections need clear entry points so visitors can find the pieces relevant to their space.",
        ],
        [
          "Build purchase confidence",
          "Delivery, returns, guarantees and material information are important parts of the buying decision and should be easy to find.",
        ],
      ],
      solution:
        "A product-led storefront with clear collection navigation, prominent product presentation and supporting content that explains the value behind each piece.",
      solutionPoints: [
        [
          "Collection-led discovery",
          "Dedicated collection categories make it easier to browse furniture by room and intended use.",
        ],
        [
          "Product storytelling",
          "Product highlights, material details and considered imagery help communicate the character of each piece.",
        ],
        [
          "Confidence beyond the product",
          "Delivery, guarantee, returns and made-to-order information help answer practical questions throughout the shopping journey.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Espresso", "#251C14"],
          ["Warm Ivory", "#F3F1EC"],
          ["White", "#FFFFFF"],
          ["Charcoal", "#222628"],
        ],
        fonts: [
          ["Display", "Cormorant Garamond"],
          ["Body", "Plus Jakarta Sans"],
        ],
      },
      gallery: [
        { src: "/rowe/rowe1.jpg" },
        { src: "/rowe/rowe2.jpg" },
        { src: "/rowe/rowe3.jpg" },
        { src: "/rowe/rowe4.jpg" },
      ],
      process: [
        ["Structure", "Organise the storefront around collections, featured pieces and the information shoppers need before buying."],
        ["Experience", "Give product imagery, materials and craftsmanship a clear role in the browsing experience."],
        ["Reassurance", "Bring delivery, returns, guarantees and FAQs into the shopping journey."],
      ],
      results: [
        [
          "Easier collection browsing",
          "Living, outdoor, dining, bedroom and office ranges now have clear entry points, so shoppers can reach the pieces for their space faster.",
        ],
        [
          "Products with presence",
          "Materials, forms and imagery take centre stage, helping each piece feel tangible before a purchase decision is made.",
        ],
        [
          "Confidence to buy",
          "Delivery, returns, guarantee and made-to-order details sit inside the journey, answering practical questions early.",
        ],
      ],
      stack: [],
    }
  ),

  make(
    {
      id: "05",
      slug: "fog-off-pest-control",
      name: "Fog Off Pest Control",
      desc: "A pest-control service website helping homeowners find local treatment services, understand guarantees and request a free estimate.",
      thumb: "/fog/fog1.jpg",
      video: "/videos/fogPre.mp4",
    },
    {
      category: "Websites",
      industry: "Pest Control",
      url: "https://www.fogofftenerife.com",
      title: ["A pest-free space", "starts with the right team."],
      result:
        "A service-led website focused on local coverage, treatment categories and clear quote enquiries.",
      cover: "/fog/fog1.jpg",
      meta: [
        ["Client", "Fog Off Pest Control"],
        ["Services", "Website design & development"],
        ["Year", "Not specified"],
        ["Timeline", "Not specified"],
        ["Stack", "Wix website (platform visible from the live site)"],
      ],
      overview:
        "Fog Off Pest Control provides pest management services across Spain and Tenerife. The website introduces treatment categories, local team coverage, customer assurances and a free-estimate enquiry path.",
      problem:
        "People looking for pest control want to identify the service they need, understand whether a team covers their area and feel confident about the treatment before making contact.",
      problemPoints: [
        [
          "Help visitors identify the issue",
          "Different pest problems require different services. Visitors need clear routes to information about mosquitoes, cockroaches, rodents, ants, wasps and other pests.",
        ],
        [
          "Make local coverage clear",
          "Visitors need to understand that the service operates across Spain and Tenerife and find a nearby team.",
        ],
        [
          "Reduce uncertainty before enquiry",
          "Guarantees, response expectations and the absence of long-term agreements help explain what customers can expect.",
        ],
      ],
      solution:
        "A conversion-focused service website with dedicated pest categories, local coverage messaging, customer assurances and a direct free-quote form.",
      solutionPoints: [
        [
          "Service-specific navigation",
          "Dedicated links help visitors move directly to information about the pest problem they are dealing with.",
        ],
        [
          "Local team discovery",
          "The site highlights coverage across Spain and Tenerife and provides a route to locate local experts.",
        ],
        [
          "Clear reasons to enquire",
          "The website communicates its satisfaction commitment, follow-up treatment policy and fast-service message alongside a free-estimate form.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Off White", "#F3F3F2"],
          ["White", "#FFFFFF"],
          ["Olive Gray", "#57584F"],
          ["Lime Green", "#98C01E"],
        ],
        fonts: [
          ["Display", "LT Superior"],
          ["Body", "LT Superior"],
        ],
      },
      gallery: [
        { src: "/fog/fog1.jpg" },
        { src: "/fog/fog2.jpg" },
        { src: "/fog/fog3.jpg" },
        { src: "/fog/fog4.jpg" },
        { src: "/fog/fog5.jpg" },
      ],
      process: [
        ["Identify", "Organise the pest categories and service information around the problems visitors are trying to solve."],
        ["Reassure", "Make local coverage, guarantees and service expectations visible before visitors enquire."],
        ["Convert", "Provide clear call and free-estimate actions so potential customers can contact the team."],
      ],
      results: [
        [
          "The right service, faster",
          "Dedicated pest categories help visitors reach the treatment information that matches the problem they are facing.",
        ],
        [
          "Local coverage in view",
          "Coverage across Spain and Tenerife and a way to find a local team are visible, so visitors know they are in the right place.",
        ],
        [
          "An easier path to enquire",
          "Guarantees, the follow-up treatment policy and a free-estimate form give visitors clear reasons and a clear way to get in touch.",
        ],
      ],
      stack: ["Wix"],
    }
  ),

  make(
    {
      id: "02",
      slug: "msi-london",
      name: "MSI London",
      desc: "A luxury furniture and interiors website connecting designers, architects and developers with curated furniture, lighting and trade services.",
      thumb: "/msi/msi.jpg",
      video: "/msi/msiPre.mp4",
    },
    {
      category: "E-commerce",
      industry: "Luxury Furniture & Interiors",
      url: "https://msi-london.vercel.app",
      title: ["Luxury furniture", "for considered spaces."],
      result:
        "A premium furniture destination that balances trade services, curated collections and product discovery.",
      cover: "/msi/msi-cover.jpg",
      meta: [
        ["Client", "MSI London"],
        ["Services", "Website design & development"],
        ["Year", "Not specified"],
        ["Timeline", "Not specified"],
        ["Stack", "Not specified"],
      ],
      overview:
        "MSI London is presented as a furniture and interiors supplier based in Barnet, London. The website speaks to interior designers, architects and contractors, bringing trade support together with furniture, lighting, kitchens, joinery and window treatments.",
      problem:
        "The business serves both professional trade customers and people browsing luxury furniture. The website needs to communicate its specialist services while still making the product collection approachable.",
      problemPoints: [
        [
          "Serve a specialist audience",
          "Interior designers, architects and developers need to quickly understand the trade support, sourcing and specification services available to them.",
        ],
        [
          "Present a broad offer clearly",
          "Furniture, lighting, kitchens, joinery, window treatments and installation each need a clear place within the overall offer.",
        ],
        [
          "Connect inspiration with products",
          "Visitors need a natural path from styled room imagery and collection browsing to individual product details.",
        ],
      ],
      solution:
        "A structured luxury interiors experience that introduces the trade offer, organises specialist services and connects room inspiration with featured products.",
      solutionPoints: [
        [
          "Trade-first communication",
          "The opening content makes the audience and trade support clear, including sourcing and specification assistance.",
        ],
        [
          "Service-led navigation",
          "Dedicated sections explain trade service, furniture, lighting, kitchens and joinery, window treatments, and delivery and installation.",
        ],
        [
          "Curated product discovery",
          "Collection browsing, featured products, brand names and a Shop the Look section give visitors several ways to explore the range.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Light Gray", "#E5E5E3"],
          ["White", "#FFFFFF"],
          ["Deep Green", "#1F2623"],
          ["Near Black", "#141413"],
        ],
        fonts: [
          ["Display", "Playfair Display"],
          ["Body", "Arial"],
        ],
      },
      gallery: [
        { src: "/msi/ms1.jpg" },
        { src: "/msi/ms2.jpg" },
        { src: "/msi/ms3.jpg" },
      ],
      process: [
        ["Position", "Establish the audience and explain the value of MSI London's trade and sourcing services."],
        ["Organise", "Structure the service categories, collections, brands and featured products for easy browsing."],
        ["Connect", "Use room inspiration and Shop the Look content to link interior ideas with individual products."],
      ],
      results: [
        [
          "A clear trade proposition",
          "Designers, architects and developers can quickly see the sourcing, specification and trade support available to them.",
        ],
        [
          "A broad range, well organised",
          "Furniture, lighting, kitchens, joinery, window treatments and installation each have a clear place in the experience.",
        ],
        [
          "From inspiration to product",
          "Room imagery and Shop the Look content give visitors a natural route from an interior idea to individual pieces.",
        ],
      ],
      stack: [],
    }
  ),

  make(
    {
      id: "03",
      slug: "oran-studio",
      name: "Oran Studio",
      desc: "An interior design studio website presenting residential, commercial and hospitality projects through warm imagery and a considered project journey.",
      thumb: "/oran/oran.jpg",
      video: "/oran/oranPre.mp4",
    },
    {
      category: "Websites",
      industry: "Interior Design",
      url: "https://oran-five.vercel.app",
      title: ["Spaces shaped", "around the way you live."],
      result:
        "A calm, editorial portfolio experience that brings the studio's work, approach and services into focus.",
      cover: "/oran/oran.jpg",
      meta: [
        ["Client", "Oran Studio"],
        ["Services", "Website design & development"],
        ["Year", "Not specified"],
        ["Timeline", "Not specified"],
        ["Stack", "Not specified"],
      ],
      overview:
        "Oran Studio is an interior design studio focused on spaces shaped around how people live. The website introduces its design philosophy, showcases residential, commercial and hospitality projects, and explains the journey from initial consultation to final handover.",
      problem:
        "Interior design is highly visual and personal. The website needs to communicate the studio's design approach while giving visitors enough project detail and process clarity to take the next step.",
      problemPoints: [
        [
          "Show the work with context",
          "A project portfolio should communicate the atmosphere and purpose of each space, not just display a collection of images.",
        ],
        [
          "Explain the design journey",
          "Potential clients need to understand what happens between the first consultation, concept development, design, execution and handover.",
        ],
        [
          "Build trust in the studio",
          "The team's expertise, experience and completed work should be easy to understand without overwhelming the visual presentation.",
        ],
      ],
      solution:
        "A visual portfolio supported by a clear studio story, project categories, a five-stage process and team profiles.",
      solutionPoints: [
        [
          "Project-led presentation",
          "Featured projects and a curated portfolio introduce residential, commercial and hospitality work across different locations.",
        ],
        [
          "A transparent process",
          "Consultation, concept, design, execution and handover are explained as clear stages with their key activities.",
        ],
        [
          "People and proof",
          "Team profiles, studio experience, project counts and design-award information add context around the studio's work.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Light Gray", "#E5E5E3"],
          ["White", "#FFFFFF"],
          ["Deep Green", "#1F2623"],
          ["Near Black", "#141413"],
        ],
        fonts: [
          ["Display", "Arial"],
          ["Body", "Arial"],
        ],
      },
      gallery: [
        { src: "/oran/oran1.jpg" },
        { src: "/oran/oran3.jpg" },
        { src: "/oran/oran4.jpg" },
        { src: "/oran/oran5.jpg" },
      ],
      process: [
        ["Discover", "Introduce the studio's philosophy and help visitors understand its approach to designing around everyday life."],
        ["Present", "Showcase selected spaces and explain the consultation-to-handover journey."],
        ["Connect", "Bring the team, studio credentials and contact path together to encourage project enquiries."],
      ],
      results: [
        [
          "Projects shown with context",
          "Residential, commercial and hospitality work is presented with atmosphere and purpose, not just as a set of images.",
        ],
        [
          "A journey made clear",
          "Consultation, concept, design, execution and handover are laid out as simple stages, so potential clients know what to expect.",
        ],
        [
          "Trust in the studio",
          "Team profiles, studio experience and project credentials add confidence without crowding the visual portfolio.",
        ],
      ],
      stack: [],
    }
  ),

  make(
    {
      id: "04",
      slug: "upto",
      name: "Upto",
      desc: "A freight and logistics website built around global shipping services, interactive network exploration and shipment tracking.",
      thumb: "/upto/uptoBa.jpg",
      video: "/upto/uptoPre.mp4",
    },
    {
      category: "Websites",
      industry: "Freight & Logistics",
      url: "https://upto-brown.vercel.app",
      title: ["Freight that moves", "at the speed of business."],
      result:
        "A service-focused logistics experience that makes shipping capabilities, network reach and tracking easier to explore.",
      cover: "/upto/uptoCover.jpg",
      meta: [
        ["Client", "Upto"],
        ["Services", "Website design & development"],
        ["Year", "Not specified"],
        ["Timeline", "Not specified"],
        ["Stack", "Not specified"],
      ],
      overview:
        "Upto presents freight services for businesses that need reliable movement and shipment visibility. The website introduces air, sea and road freight alongside warehousing, a global network map, shipment tracking and logistics insights.",
      problem:
        "Freight customers need to understand which service fits their shipment, where the network operates and how to follow cargo after booking. These important tasks should be easy to find.",
      problemPoints: [
        [
          "Explain the service options",
          "Air, sea and road freight and warehousing serve different needs, so visitors need a straightforward way to understand each option.",
        ],
        [
          "Make network reach visible",
          "A global logistics network is easier to understand when visitors can explore ports and routes rather than relying on text alone.",
        ],
        [
          "Make shipment updates accessible",
          "Customers need a direct way to check a shipment's status without searching through the site for tracking information.",
        ],
      ],
      solution:
        "A logistics website that combines clear service explanations with an interactive network map, a shipment tracking entry point and a quote call to action.",
      solutionPoints: [
        [
          "Four clear service areas",
          "Air freight, sea freight, road freight and warehousing are introduced as distinct services with concise explanations.",
        ],
        [
          "Interactive network map",
          "The map gives visitors a visual way to explore the ports, routes and shipment activity represented on the site.",
        ],
        [
          "Tracking and quote access",
          "A dedicated tracking area and repeated quote calls to action make the key customer tasks easier to reach.",
        ],
      ],
      styleGuide: {
        colors: [
          ["Midnight", "#16151A"],
          ["White", "#FFFFFF"],
          ["Vibrant Orange", "#FF4D1F"],
          ["Near Black", "#171717"],
        ],
        fonts: [
          ["Display", "Arial"],
          ["Body", "Arial"],
        ],
      },
      gallery: [
        { src: "/upto/upto1.png" },
        { src: "/upto/upto2.png" },
        { src: "/upto/upto3.jpg" },
        { src: "/upto/upto4.jpg" },
      ],
      process: [
        ["Understand", "Identify the main customer journeys: choosing a freight service, requesting a quote and tracking cargo."],
        ["Structure", "Give each service its own section and make network coverage easy to explore."],
        ["Guide", "Bring tracking and quote actions into prominent, easy-to-find parts of the experience."],
      ],
      results: [
        [
          "Services at a glance",
          "Air, sea and road freight and warehousing each have their own clear explanation, so visitors can match a service to their shipment.",
        ],
        [
          "Network reach made visible",
          "An interactive map lets visitors explore ports and routes instead of reading about coverage in plain text.",
        ],
        [
          "Key tasks within reach",
          "Shipment tracking and quote actions sit in prominent places, so the most important customer tasks are easy to find.",
        ],
      ],
      stack: [],
    }
  ),
];