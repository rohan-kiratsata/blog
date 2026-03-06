import { BlogPosts } from "app/components/posts";
import { baseUrl } from "app/sitemap";

export const metadata = {
  title: "Blog",
  description:
    "Articles and thoughts on engineering, tech, products, and indie hacking by Rohan Kiratsata.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

export default function Page() {
  return (
    <section>
      <h2 className="text-base text-neutral-400 dark:text-neutral-500 font-medium">writings</h2>
      <BlogPosts />
    </section>
  );
}
