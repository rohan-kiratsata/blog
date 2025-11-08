import ProjectCard from "./components/project-card";
import { metaData, projects } from "./util/content";
import { baseUrl } from "./sitemap";

export const metadata = {
  title: "Home | Rohan Kiratsata - Full Stack Engineer",
  description:
    "Portfolio of Rohan Kiratsata - Full Stack Engineer building micro SaaS products and indie hacking.",
  keywords: metaData.keywords,
  alternates: {
    canonical: baseUrl,
  },
};

export default function Page() {
  return (
    <div className="">
      <div className="flex-1 w-full gap-4 grid grid-cols-1 ">
        <h2 className="font-mono">[projects]</h2>
        {projects.map((project) => (
          <div key={project.title}>
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </div>
  );
}
