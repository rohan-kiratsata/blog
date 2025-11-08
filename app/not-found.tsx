import { Metadata } from "next";
import { baseUrl } from "./sitemap";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/404`,
  },
};

export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        404 - Page Not Found
      </h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Return to homepage
      </Link>
    </section>
  );
}
