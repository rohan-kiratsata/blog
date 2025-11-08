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
    <section className="">
      <h2 className="font-mono">[blog]</h2>
      <BlogPosts />
    </section>
  );
}
