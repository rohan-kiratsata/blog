import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="w-full">
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
            href={`/blog/${post.slug}`}
            className="relative hover:border-neutral-800 border-transparent border p-2 cursor-pointer block group"
          >
            <div className="flex items-center justify-between">
              <h3 className="link text-sm">{post.metadata.title}</h3>
              <span>{post.metadata.publishedAt}</span>
            </div>
            {/* Overlay */}
            <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
            <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>

            <div className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
            <div className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>

            <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
            <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>

            <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 right-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
            <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 right-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
          </Link>
        ))}
    </div>
  );
}
