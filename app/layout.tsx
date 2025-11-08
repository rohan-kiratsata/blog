import "./global.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { baseUrl } from "./sitemap";
import { GoogleTagManager } from "@next/third-parties/google";
import { Geist } from "next/font/google";
import Sidenav from "./components/nav";

const authorName = "Rohan Kiratsata";
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

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const appleGaramond = localFont({
  src: [
    {
      path: "../fonts/AppleGaramond-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/AppleGaramond-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/AppleGaramond.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AppleGaramond-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/AppleGaramond-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/AppleGaramond-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-apple-garamond",
});

const cx = (...classes) => classes.filter(Boolean).join(" ");

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
    <html
      lang="en"
      className={cx("font-geist", geist.variable, appleGaramond.variable)}
    >
      <GoogleTagManager gtmId={process.env.G_TAG_ID || ""} />
      <body className="antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema]),
          }}
        />
        <main className="flex w-full md:min-h-screen md:flex-row flex-col">
          <Sidenav />
          <section className="flex-1 w-full p-5 md:max-h-screen md:overflow-y-auto">
            {children}
          </section>
        </main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
