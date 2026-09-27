import { projects } from "app/util/content";
import ProjectCard from "./project-card";

export default function ProjectSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const active = projects.filter((project) => project.is_active);
  const Heading = standalone ? "h1" : "h2";
  return (
    <section aria-labelledby="projects-heading">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <Heading
          id="projects-heading"
          className="text-base text-neutral-500 inline-flex gap-1 items-center"
        >
          <svg
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 3C2.44772 3 2 3.44772 2 4V7H9.58579L12 4.58579L10.4142 3H3ZM14.4142 5L10.4142 9H2V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V6C22 5.44772 21.5523 5 21 5H14.4142Z"></path>
          </svg>
          Projects
        </Heading>
      </div>
      <div className="divide-y divide-neutral-100">
        {active.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
