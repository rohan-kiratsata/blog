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
  // {
  //   title: "Grantly.ai",
  //   description:
  //     "Find the best scholarship for you using AI based matchmaking.",
  //   link: "www.grantly-ai.vercel.app",
  //   year: "2025",
  //   tags: ["productivity"],
  // },
  {
    title: "Learnn",
    description: "Manually curated collection of resources for developers.",
    link: "https://www.learnn.cc",
    year: "2024",
    tags: ["productivity"],
  },
  {
    title: "FoodieVVN",
    description: "Find food lounges and tiffin services near your location.",
    link: "https://www.foodie-vvn.netlify.app/",
    year: "2022",
  },
] as Project[];

export const freelance: Project[] = [
  {
    title: "Freelance",
    description: "Freelance projects",
    link: "https://github.com/rohan-kiratsata/freelance",
  },
] as Project[];

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
