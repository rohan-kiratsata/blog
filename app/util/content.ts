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
    title: "Proxi",
    description:
      "skip boring meeetings. your personal agent joins the calls, responds to teammates, talks, replies, and takes notes.",
    link: "#",
    year: "2026",
    tags: ["micro"],
    is_active: true,
  },
  {
    title: "Vesper",
    description:
      "long-distance relationship app for couples. create shared memories and stay connected.",
    link: "#",
    year: "2026",
    tags: ["micro"],
    is_active: true,
  },
  {
    title: "Korse",
    description:
      "course creation platform for educators and creators. create, market, and sell online courses with ease.",
    link: "#",
    year: "2026",
    tags: ["micro"],
    is_active: true,
  },
  {
    title: "check-site-meta",
    description:
      "Instantly check metatags, get previews, og tags, SEO tags and much more from any URL.",
    link: "https://www.checksitemeta.com",
    year: "2025",
    tags: ["micro"],
    is_active: true,
  },
  {
    title: "Ditto",
    description:
      "Ultimate clipboard manager for macOS. Copy and paste multiple items.",
    link: "https://github.com/kriyavat/ditto",
    year: "2025",
    tags: ["macOS", "productivity"],
    is_active: false,
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
