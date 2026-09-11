import { projects, metaData } from "./util/content";
import { baseUrl } from "./sitemap";
import Link from "next/link";
import Image from "next/image";
import { Dot, Mail } from "lucide-react";
import ActiveListItem from "./components/active-dot";
import { PrimaryLink } from "./components/link";

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
      <section className="py-8">
        {/* <div className="text-3xl mb-4">༼ つ ◕_◕ ༽つ</div> */}
        <h1 className="font-medium text-base">Rohan Kiratsata</h1>
        <p className="text-neutral-500 mb-3 text-sm">
          Full Stack Engineer. Products.{" "}
        </p>
        <div className="text-sm">
          <ul className="list-inside text-neutral-800 space-y-3 mt-10">
            <ActiveListItem active={true}>
              i build apps and run experiments.
            </ActiveListItem>
            <ActiveListItem active={false}>
              i spent 3 years freelancing, shipped dozens of apps and landing
              pages. I realised tech skill is table stakes, so now I'm racing to
              build something people want badly enough to pay for.
            </ActiveListItem>
            <ActiveListItem active={false}>
              i work at{" "}
              <PrimaryLink href="https://inagiffy.news">Inagiffy</PrimaryLink>
            </ActiveListItem>

            <ActiveListItem active={true}>
              more <PrimaryLink href="/about">about me</PrimaryLink> or contact
              me at{" "}
              <PrimaryLink
                href="mailto:heyarohan@icloud.com"
                className="inline-flex items-center gap-1 align-middle"
              >
                <svg
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#000"
                >
                  <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path>
                </svg>
                email
              </PrimaryLink>
            </ActiveListItem>
          </ul>
        </div>

        {projects.filter((p) => p.is_active).length > 0 && (
          <>
            <div className="py-10 text-sm">
              <h2 className="">Projects</h2>
              <div className="grid grid-cols-1 gap-2">
                {projects
                  .filter((p) => p.is_active)
                  .map((project) => (
                    <Link key={project.title} href={project.link} className="">
                      <Image
                        src={`${project.icon}`}
                        alt={project.title}
                        width={42}
                        height={42}
                        className="w-10 h-10"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900">
                          {project.title}
                        </h3>

                        <p className="text-neutral-600 leading-relaxed text-base font-medium">
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
