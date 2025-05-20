import Link from "next/link";
import Freelance from "./components/freelance";
import Work from "./components/work";
import { BlogPosts } from "./components/posts";
import Contact from "./components/contact";
export default function Page() {
  return (
    <section>
      <h1 className="text-base font-medium">Rohan Kiratsata</h1>
      <div className="text-sm text-neutral-500">
        <p className="text-xs">Bangalore, In</p>
        <div className="mt-5">
          Full Stack Engineer and part-time Freelancer. In fact I've been
          freelancing for almost for 4 years now. Currently working as Frontend
          Engineer. I spend most of my time building scalable apps. I also like
          to build micro utility tools and apps in my free time.
          <br />
          Side quest{" "}
          <Link href="https://kriyavatlabs.xyz" className="link">
            Kriyavat Labs
          </Link>
        </div>
        <Work />

        {/* <Freelance /> */}
        {/* <div className="mt-10">
          <div>
            <h2 className="font-medium text-white">blogs</h2>
            <BlogPosts />
          </div>
        </div> */}
        <Contact />
      </div>
    </section>
  );
}
