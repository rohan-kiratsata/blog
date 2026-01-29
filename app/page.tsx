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
    <div>
      {/* Intro section */}
      <section className="py-12">
        <div className="text-2xl mb-4">༼ つ ◕_◕ ༽つ</div>
        <h1 className="text-xl font-medium text-neutral-900 mb-1">
          Rohan Kiratsata
        </h1>
        <p className="text-neutral-500 mb-4">Full Stack Engineer</p>
        <p className="text-neutral-600 leading-relaxed">
          Full stack engineer at Inagiffy. I build apps and run experiments. I
          spent 3 years freelancing, shipped dozens of landing pages and
          webapps, then realized tech skill is table stakes. Now I'm racing to
          find the app that hits, running parallel experiments with AI.
        </p>
      </section>

      {/* Projects section */}
      <section className="mt-8">
        <h2 className="text-sm text-neutral-400 mb-4">[projects]</h2>
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </div>
  );
}
