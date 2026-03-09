import ProjectCard from "app/components/project-card";
import { Tabs } from "app/components/tabs";
import { projects } from "app/util/content";
import { baseUrl } from "app/sitemap";

export const metadata = {
  title: "Experiments",
  description:
    "Projects and experiments by Rohan Kiratsata - micro SaaS products, tools, and indie hacks. | sudorohan",
  alternates: {
    canonical: `${baseUrl}/experiments`,
  },
};

export default function ExperimentsPage() {
  const activeProjects = projects.filter(
    (project) => project.is_active === true,
  );
  const graveyardProjects = projects.filter(
    (project) => project.is_active === false,
  );

  const tabs = [
    {
      id: "active",
      label: "active",
      content: (
        <div className="grid grid-cols-1 gap-4">
          {activeProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      ),
    },
    {
      id: "graveyard",
      label: "graveyard",
      content: (
        <div className="grid grid-cols-1 gap-4">
          {graveyardProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <section>
      <h2 className="text-base text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
        experiments
      </h2>
      <Tabs tabs={tabs} defaultTab="active" />
    </section>
  );
}
