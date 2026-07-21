import { projects, metaData } from "./util/content";
import { baseUrl } from "./sitemap";
import Link from "next/dist/client/link";
import Image from "next/image";
import NewAppBanner from "./components/new-app-banner";

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
      <section className="py-12">
        <div className="text-3xl mb-4">༼ つ ◕_◕ ༽つ</div>
        <h1 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-1">
          Rohan Kiratsata
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4 font-medium">
          Full Stack Engineer
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg font-medium">
          I build apps and run experiments. I spent 3 years freelancing, shipped
          dozens of apps and landing pages, realized tech skill is table stakes.
          Now I'm racing to find the app that hits, running parallel{" "}
          <Link
            href="/projects"
            className="hover:underline dark:text-white text-black"
          >
            projects
          </Link>{" "}
          with AI agents.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg font-medium mt-4">
          Day job is founding engineer work, building AI products from a blank
          repo. Most of what I touch has an LLM in it these days. More on the{" "}
          <Link
            href="/about"
            className="hover:underline dark:text-white text-black"
          >
            about
          </Link>{" "}
          page.
        </p>

        {/* <NewAppBanner /> */}

        {projects.filter((p) => p.is_active).length > 0 && (
          <>
            <div className="py-10">
              <h2 className="text-base text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
                current projects
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {projects
                  .filter((p) => p.is_active)
                  .map((project) => (
                    <Link
                      key={project.title}
                      href={project.link}
                      className="flex items-center gap-4 mb-2"
                    >
                      <Image
                        src={`${project.icon}`}
                        alt={project.title}
                        width={42}
                        height={42}
                        className="w-10 h-10"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                          {project.title}
                        </h3>

                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base font-medium">
                          {project.description}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
