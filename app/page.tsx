import { metaData } from "./util/content";
import { baseUrl } from "./sitemap";
import Link from "next/dist/client/link";

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
          dozens of landing pages and webapps, then realized tech skill is table
          stakes. Now I'm racing to find the app that hits, running parallel{" "}
          <Link
            href="/experiments"
            className="hover:underline dark:text-white text-black"
          >
            experiments
          </Link>{" "}
          with AI.
        </p>
      </section>
    </div>
  );
}
