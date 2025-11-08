import { baseUrl } from "app/sitemap";
import { getBlogPosts } from "app/blog/utils";

export async function GET() {
  let allBlogs = await getBlogPosts();

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <description>${post.metadata.summary || ""}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Blog | Rohan Kiratsata - Full Stack Engineer and Indie Hacker</title>
        <link>${baseUrl}/blog</link>
        <description>Articles and thoughts on engineering, tech, products, and indie hacking by Rohan Kiratsata.</description>
        <language>en-US</language>
        <managingEditor>rohan@kriyavatlabs.xyz (Rohan Kiratsata)</managingEditor>
        <webMaster>rohan@kriyavatlabs.xyz (Rohan Kiratsata)</webMaster>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
