export interface Project {
  title: string;
  description: string;
  link: string;
  year: string;
}

export const projects: Project[] = [
  {
    title: "Ditto",
    description:
      "Ultimate clipboard manager for macOS. Copy and paste multiple items. Supports LIFO & FIFO.",
    link: "https://kriyavatlabs.xyz/ditto",
    year: "2025",
  },
  {
    title: "Grantly.ai",
    description:
      "Find the best scholarship for you using AI based matchmaking.",
    link: "https://grantly-ai.vercel.app",
    year: "2025",
  },
  // {
  //   title: "Packet Tracer",
  //   description:
  //     "Packet Tracer clone built from scratch using NodeJS to understand its internal workings.",
  //   link: "https://github.com/rohan-kiratsata/packet-tracer-node",
  //   year: "2024",
  // },
  // {
  //   title: "Gigaresources",
  //   description:
  //     "Manually curated collection of resources for developers, designers, and creatives. (Archived, needs revamp)",
  //   link: "https://giga-resources.vercel.app/",
  //   year: "2021",
  // },
  // {
  //   title: "Saviour's Adventure",
  //   description: "A 2D adventure game made with Unity using C#.",
  //   link: "https://github.com/rohan-kiratsata/saviours-adventure-unity",
  //   year: "2021",
  // },
  // {
  //   title: "Minecraft Terrain Generation",
  //   description:
  //     "Implemented infinite voxel terrain generation in Unity using Perlin Noise.",
  //   link: "https://github.com/rohan-kiratsata/minecraft-terrain-generation",
  //   year: "2022",
  // },
  {
    title: "FoodieVVN",
    description:
      "A tool that helps you find food lounges and tiffin services near your location.",
    link: "https://foodie-vvn.netlify.app/",
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
