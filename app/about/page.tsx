import Link from "next/link";
import { baseUrl } from "app/sitemap";
import { experience, socials } from "app/util/content";

export const metadata = {
  title: "About",
  description:
    "About Rohan Kiratsata - full stack engineer, AI engineering, and the things I build. | sudorohan",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-neutral-900 dark:hover:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 transition-colors"
    >
      {children}
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-neutral-200 dark:border-neutral-800 pt-10 mt-10">
      <h2 className="text-base text-neutral-400 dark:text-neutral-500 mb-5 font-medium">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg font-medium">
      <section>
        <h1 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Hi, I am Rohan.
        </h1>
        <div className="space-y-4">
          <p>
            I go by <A href={socials.x}>sudorohan</A> on X. I am a full stack
            engineer and right now the founding engineer at a startup, which
            mostly means I get handed a blank repo and a deadline.
          </p>
          <p>
            Before that I freelanced for three years and shipped dozens of apps
            and landing pages. That taught me writing the code is the easy part.
            Getting people to keep using the thing is the hard part. So I keep{" "}
            <A href="/projects">running experiments</A> until one hits.
          </p>
          <p>
            Most of my attention these days goes to AI engineering. Agents, RAG,
            MCP, all of it. The stack changes every few months and I have made
            peace with that.
          </p>
          <p>
            I write here and on X, mostly about what I am building and what
            broke while I built it. If something is interesting or useful I post
            it. Find me on <A href={socials.x}>X</A>,{" "}
            <A href={socials.linkedin}>LinkedIn</A>, or go through the{" "}
            <A href="/projects">projects</A>.
          </p>
        </div>
      </section>

      <Section title="what i work with">
        <div className="space-y-4">
          <p>
            On the frontend I mostly live in Next.js and React with Tailwind. On
            the backend it depends on the problem. FastAPI when there is Python
            and ML involved, NestJS when the project needs structure, plain Node
            and Express when it does not.
          </p>
          <p>
            Almost everything I touch now has an LLM in it. Cloud models,
            LangChain, RAG pipelines, MCP servers, agents that do actual work.
          </p>
          <p>
            Infra is GCP and AWS with Docker in between, plus the unglamorous
            parts. System design, queues, caching, the stuff that decides
            whether any of it stays up.
          </p>
        </div>
      </Section>

      <Section title="past work">
        <div className="space-y-8">
          {experience.map((job) => (
            <div key={job.company}>
              <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <h3 className="text-base text-neutral-900 dark:text-neutral-100 font-medium">
                  {job.role}{" "}
                  <span className="text-neutral-400 dark:text-neutral-500">
                    · {job.company}
                  </span>
                </h3>
                <span className="text-sm text-neutral-400 dark:text-neutral-500 shrink-0">
                  {job.period}
                </span>
              </div>
              <p className="text-base">{job.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="elsewhere">
        <div className="flex gap-5 text-base">
          <A href={socials.x}>x</A>
          <A href={socials.linkedin}>linkedin</A>
          <A href={socials.github}>github</A>
          <A href="/projects">projects</A>
        </div>
      </Section>
    </div>
  );
}
