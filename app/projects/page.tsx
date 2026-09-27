import ProjectSection from "app/components/project-section";
import { baseUrl } from "app/sitemap";

export const metadata = {
  title: "Projects",
  description:
    "Projects and experiments by Rohan Kiratsata - micro SaaS products, tools, and indie hacks. | sudorohan",
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
};

export default function ProjectsPage() {
  return <ProjectSection standalone />;
}
