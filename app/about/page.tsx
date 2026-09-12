import { baseUrl } from "app/sitemap";
import { experience, socials } from "app/util/content";
import ActiveListItem from "app/components/active-dot";
import { PrimaryLink } from "app/components/link";

export const metadata = {
  title: "About",
  description:
    "Rohan Kiratsata on building apps, running experiments, and his work as a full stack engineer. | sudorohan",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

const workNotes: Record<string, string> = {
  Inagiffy:
    "i build AI products from a blank repo. reddit tools for brands, a linkedin content platform, and a whatsapp career bot. architecture through to the interface.",
  "Nadcab Labs":
    "i built web3 apps, connected wallets, and worked on the frontend systems behind them. a lot of Next.js, shared components, and making things work on mobile.",
  "Freelance & early career":
    "three years of apps and landing pages for startups and agencies. dashboards, CMSes, real-time features. building, deploying, and finding out what breaks with real users.",
};

export default function AboutPage() {
  return (
    <div className="py-8 text-sm text-neutral-800 [&_a:focus-visible]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-neutral-600">
      <header>
        <h1 className="text-base font-medium text-neutral-900">About me</h1>
        <p className="text-sm text-neutral-500">
          <PrimaryLink href="/">home</PrimaryLink> / about
        </p>
      </header>

      <ul className="mt-10 space-y-3">
        <ActiveListItem active={true}>
          i'm a full stack engineer. i like to build micro utility tools, saas,
          and anything that i find interesting.
        </ActiveListItem>
        <ActiveListItem active={false}>
          building at{" "}
          <PrimaryLink href="https://inagiffy.news">Inagiffy</PrimaryLink>.
          mostly working on reddit, newsletters, and internal tools.
        </ActiveListItem>
        <ActiveListItem active={false}>
          i write about what i'm building and my thoughts on{" "}
          <PrimaryLink href="/blog">writing</PrimaryLink> and on{" "}
          <PrimaryLink href={socials.x}>X</PrimaryLink>.
        </ActiveListItem>
      </ul>

      <section className="pt-12" aria-labelledby="about-work">
        <h2 id="about-work" className="mb-6 text-base text-neutral-500">
          Previously
        </h2>
        <ol className="space-y-6">
          {experience.map((job) => (
            <li key={job.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium text-neutral-900">{job.company}</h3>
                <span className="text-xs tabular-nums text-neutral-500">
                  {job.period}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">{job.role}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
                {workNotes[job.company] ?? job.summary}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pt-12" aria-labelledby="about-tools">
        <h2 id="about-tools" className="mb-6 text-base text-neutral-500">
          What i work with
        </h2>
        <div className="space-y-3 leading-relaxed">
          <p>
            mostly Next.js, React, and Tailwind on the frontend. FastAPI or
            NestJS on the backend, depending on the problem.
          </p>
          <p>
            lately, a lot of agents, RAG pipelines, and MCP servers. underneath
            that: Docker, GCP, AWS, queues, and caching. the parts that keep it
            running.
          </p>
        </div>
      </section>

      <section className="pt-12" aria-labelledby="about-contact">
        <h2 id="about-contact" className="mb-6 text-base text-neutral-500">
          Say hello
        </h2>
        <p className="leading-relaxed">
          if something here caught your eye, write to me at{" "}
          <PrimaryLink href="mailto:heyarohan@icloud.com">
            heyarohan@icloud.com
          </PrimaryLink>
          .
        </p>
        <nav
          aria-label="Find me elsewhere"
          className="mt-3 flex flex-wrap gap-x-5 gap-y-1"
        >
          <PrimaryLink
            href={socials.x}
            className="inline-flex min-h-11 items-center"
          >
            x
          </PrimaryLink>
          <PrimaryLink
            href={socials.linkedin}
            className="inline-flex min-h-11 items-center"
          >
            linkedin
          </PrimaryLink>
          <PrimaryLink
            href={socials.github}
            className="inline-flex min-h-11 items-center"
          >
            github
          </PrimaryLink>
          <PrimaryLink href="/" className="inline-flex min-h-11 items-center">
            back home
          </PrimaryLink>
        </nav>
      </section>
    </div>
  );
}
