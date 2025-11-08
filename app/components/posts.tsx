import Link from "next/link";
import { getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="w-full my-6">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="hover:italic hover:underline"
          >
            <div className="flex items-center justify-between">
              <h3 className="link text-base">{post.metadata.title}</h3>
              <span className="text-xs text-secondary">
                {post.metadata.publishedAt}
              </span>
            </div>
          </Link>
        ))}
    </div>
  );
}
