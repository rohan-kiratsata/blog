import Link from "next/link";
import { getBlogPosts } from "app/blog/utils";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month} ${day}, ${year}`;
}

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div className="w-full my-8 flex flex-col gap-5">
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
            className="group block"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-medium group-hover:underline">
                {post.metadata.title}
              </h3>
              <span className="text-sm text-secondary shrink-0 tabular-nums">
                {formatDate(post.metadata.publishedAt)}
              </span>
            </div>
          </Link>
        ))}
    </div>
  );
}
