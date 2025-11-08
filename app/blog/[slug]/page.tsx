import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { Undo } from "lucide-react";
import Link from "next/link";

const authorName = "Rohan Kiratsata";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  let ogImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    authors: [{ name: authorName }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: postUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

type Props = {
  params: {
    slug: string;
  };
};

export default async function Blog({ params }: any) {
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    description: post.metadata.summary,
    image: post.metadata.image
      ? `${baseUrl}${post.metadata.image}`
      : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${baseUrl}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: authorName,
      url: baseUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.metadata.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostSchema, breadcrumbSchema]),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="">
        <Link href="/" className="inline-flex text-neutral-500 text-sm">
          &larr; back
        </Link>
      </div>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <div className="flex items-center gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
          <span className="text-neutral-400">•</span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            By{" "}
            <Link
              href="/"
              className="font-medium hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {authorName}
            </Link>
          </p>
        </div>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
