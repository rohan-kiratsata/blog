export interface Project {
  title: string;
  description: string;
  link: string;
  year: string;
  tags?: string[];
  icon?: string;
  is_active: boolean;
}

export const projects: Project[] = [
  {
    title: "Fylla",
    description:
      "autofill applications, track progress, review, and get hired quicker.",
    link: "https://fylla.app/?utm_source=sudorohan&utm_medium=referral",
    year: "2026",
    tags: ["micro"],
    is_active: true,
    icon: "/fylla.svg",
  },
  {
    title: "Proxi",
    description:
      "skip boring meeetings. your personal agent joins the calls, responds to teammates, talks, replies, and takes notes.",
    link: "#",
    year: "2026",
    tags: ["micro"],
    is_active: false,
    icon: "/box.png",
  },
  {
    title: "Vesper",
    description:
      "long-distance relationship app for couples. create shared memories and stay connected.",
    link: "#",
    year: "2026",
    tags: ["micro"],
    is_active: false,
    icon: "/box.png",
  },
  {
    title: "Korse",
    description:
      "course creation platform for educators and creators. create, market, and sell online courses with ease.",
    link: "#",
    year: "2026",
    tags: ["micro"],
    is_active: false,
    icon: "/box.png",
  },
  {
    title: "check-site-meta",
    description:
      "Instantly check metatags, get previews, og tags, SEO tags and much more from any URL.",
    link: "https://www.checksitemeta.com",
    year: "2025",
    tags: ["micro"],
    is_active: false,
    icon: "/box.png",
  },
  {
    title: "Ditto",
    description:
      "Ultimate clipboard manager for macOS. Copy and paste multiple items.",
    link: "https://github.com/kriyavat/ditto",
    year: "2025",
    tags: ["macOS", "productivity"],
    is_active: false,
    icon: "/box.png",
  },
] as Project[];

export interface FreelanceProject {
  title: string;
  description: string;
  link?: string;
  year: string;
  preview?: string;
}

export const freelanceProjects: FreelanceProject[] = [
  {
    title: "CogniPredict",
    description: "AI-powered predictive analytics platform",
    link: "https://cognipredict.com",
    year: "2024",
    preview:
      "https://api.microlink.io/?url=https://cognipredict.com&screenshot=true&meta=false&embed=screenshot.url",
  },
  {
    title: "Dirah Development",
    description: "Real estate development company website",
    link: "https://dirahdevelopment.sa",
    year: "2024",
    preview:
      "https://api.microlink.io/?url=https://dirahdevelopment.sa&screenshot=true&meta=false&embed=screenshot.url",
  },
  {
    title: "Riyadh Holding",
    description: "Investment holding company corporate site",
    link: "https://riyadhholding.sa",
    year: "2024",
    preview:
      "https://api.microlink.io/?url=https://riyadhholding.sa&screenshot=true&meta=false&embed=screenshot.url",
  },
  {
    title: "Auralam Laminates",
    description: "Laminate manufacturing company website",
    link: "https://auralamlaminates.com",
    year: "2024",
    preview:
      "https://api.microlink.io/?url=https://auralamlaminates.com&screenshot=true&meta=false&embed=screenshot.url",
  },
  {
    title: "Adex World",
    description: "Business solutions platform",
    link: "https://adexworld.com",
    year: "2024",
    preview:
      "https://api.microlink.io/?url=https://adexworld.com&screenshot=true&meta=false&embed=screenshot.url",
  },
];

export const socials = {
  x: "https://x.com/sudorohan",
  linkedin: "https://linkedin.com/in/rohankiratsata",
  github: "https://github.com/rohan-kiratsata",
};

export interface Experience {
  role: string;
  company: string;
  period: string;
  summary: string;
}

export const experience: Experience[] = [
  {
    role: "Founding Full Stack Engineer",
    company: "Inagiffy",
    period: "2025 - now",
    summary:
      "Building AI products from scratch. I own the architecture, backend, frontend and LLM work. So far: a Reddit sentiment and content tool for brands, a gamified LinkedIn content platform, and a WhatsApp career guidance bot. Mostly Next.js, NestJS, LangChain and GCP.",
  },
  {
    role: "Web3 Frontend Engineer",
    company: "Nadcab Labs",
    period: "2024 - 2025",
    summary:
      "Built and maintained 5+ dApps in Next.js and TypeScript, with wallet support across 8+ providers. Moved the monorepo onto shadcn/ui and cleaned up state with React Query and Zustand. The DeFi UIs pushed mobile conversions up around 30%.",
  },
  {
    role: "Full Stack Developer",
    company: "Freelance & early career",
    period: "2021 - 2024",
    summary:
      "20+ web apps for startups, agencies and internal teams. Dashboards, CMSes, real-time features, all of it end to end through deployment. Three years of shipping to real users and learning what breaks.",
  },
];

export interface Skill {
  name: string;
  description: string;
  file: string;
}

export const claudeSkills: Skill[] = [
  {
    name: "microsaas-idea-gen",
    description:
      "Pulls microSaaS ideas from live Reddit pain points, X complaints and web signals instead of making them up. Outputs 10+ at a time.",
    file: "/skills/microsaas-idea-gen.skill",
  },
  {
    name: "second-brain",
    description:
      "A thinking partner for raw notes, links and half-formed ideas. Surfaces connections between things you already wrote down.",
    file: "/skills/second-brain.skill",
  },
  {
    name: "x-tweet-engine",
    description:
      "Drafts tweets, replies and quote tweets in my voice, and runs autopsies on why a post died. Built from 360 real tweets and the open-sourced X algorithm.",
    file: "/skills/x-tweet-engine.skill",
  },
  {
    name: "x-algorithm-engine-reference",
    description:
      "Reference notes on the 2026 open-sourced X ranking algorithm. Plain markdown, pairs with the tweet engine.",
    file: "/skills/x-algorithm-engine-reference.md",
  },
  {
    name: "wealth-architect",
    description:
      "Asset structuring, holding companies, legal tax strategy and how compounding actually works. For when the question is money, not code.",
    file: "/skills/wealth-architect.skill",
  },
  {
    name: "osho",
    description:
      "Talk to Osho. Consciousness, ego, love, freedom, death, all of it, in his voice.",
    file: "/skills/osho.skill",
  },
];

export const metaData = {
  title: "Home | Rohan Kiratsata - Full Stack Engineer",

  keywords: [
    "@sudorohan",
    "Full Stack Engineer",
    "Indie Hacker",
    "Web Developer",
    "Rohan Kiratsata",
    "Micro SaaS",
    "Products",
    "Tech",
    "Engineering",
  ],
};
