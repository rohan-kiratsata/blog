import "./global.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { baseUrl } from "./sitemap";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { NavLink } from "./components/link";

const authorName = "Rohan Kiratsata | sudorohan";
const authorTitle = "Full Stack Engineer";
const authorDescription =
  "Full Stack Engineer building micro saas products and indie hacking.";
const authorEmail = "rohan@kriyavatlabs.xyz";
const twitterHandle = "@sudorohan";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${authorName} | ${authorTitle}`,
    template: `%s | ${authorName}`,
  },
  description: authorDescription,
  keywords: [
    "Full Stack Engineer",
    "Indie Hacker",
    "Web Developer",
    "Rohan Kiratsata",
    "Micro SaaS",
    "Products",
    "Tech",
    "Engineering",
    "sudorohan",
    "rohan kiratsata",
    "full stack developer",
  ],
  authors: [{ name: authorName, url: baseUrl }],
  creator: authorName,
  publisher: authorName,
  openGraph: {
    title: `${authorName} | ${authorTitle}`,
    description: authorDescription,
    url: baseUrl,
    siteName: authorName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og?title=${encodeURIComponent(authorName)}`,
        width: 1200,
        height: 630,
        alt: `${authorName} - ${authorTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${authorName} | ${authorTitle}`,
    description: authorDescription,
    creator: twitterHandle,
    images: [`${baseUrl}/og?title=${encodeURIComponent(authorName)}`],
  },
  alternates: {
    canonical: baseUrl,
    types: {
      "application/rss+xml": `${baseUrl}/rss`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  other: {
    "theme-color": "#000000",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    jobTitle: authorTitle,
    description: authorDescription,
    email: authorEmail,
    url: baseUrl,
    sameAs: [
      `https://twitter.com/${twitterHandle.replace("@", "")}`,
      `https://github.com/rohan-kiratsata`,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: authorName,
    description: authorDescription,
    url: baseUrl,
    author: {
      "@type": "Person",
      name: authorName,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <GoogleTagManager gtmId={process.env.G_TAG_ID || ""} />
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema]),
          }}
        />
        <main className="max-w-xl mx-auto px-6 py-12">
          <nav className="flex gap-4 mb-12">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/blog">Blog</NavLink>
          </nav>
          {children}
        </main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
