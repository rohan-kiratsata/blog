export interface Project {
  title: string;
  description: string;
  link: string;
  year: string;
  tags?: string[];
  icon?: string;
}

export const projects: Project[] = [
  {
    title: "Check Site Meta",
    description:
      "Instantly check metatags, get previews, og tags, SEO tags and much more from any URL.",
    link: "https://www.checksitemeta.com",
    year: "2025",
    tags: ["micro"],
    // icon: "/icons/checksitemeta.com.png",
  },
  {
    title: "Beaconite",
    description: "Your digital brain, connect your notes, ideas, and more.",
    link: "https://www.beaconite.xyz",
    year: "2025",
    tags: ["productivity"],
  },
  {
    title: "Ditto",
    description:
      "Ultimate clipboard manager for macOS. Copy and paste multiple items.",
    link: "https://www.kriyavatlabs.xyz/ditto",
    year: "2025",
    tags: ["macOS", "productivity"],
  },
  {
    title: "FoodieVVN",
    description: "Find food lounges and tiffin services near your location.",
    link: "https://www.foodie-vvn.netlify.app/",
    year: "2022",
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
