import "./global.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { baseUrl } from "./sitemap";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "./util/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Home | @sudorohan",
    template: "%s | @sudorohan",
  },
  description: "Full Stack Engineer",
  openGraph: {
    title: "Home | @sudorohan",
    description: "Full Stack Engineer",
    url: baseUrl,
    siteName: "Home | @sudorohan",
    locale: "en_US",
    type: "website",
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
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx("text-primary bg-primary", jetbrainsMono.variable)}
    >
      <GoogleTagManager gtmId={process.env.G_TAG_ID || ""} />

      <body className="antialiased font-jetbrains-mono tracking-tight">
        <ThemeProvider>
          <main className="max-w-3xl mx-auto my-10">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
