import React from "react";
import { NavLink } from "./link";

export default function Sidenav() {
  return (
    <div className="border-r md:w-1/4 md:h-screen p-5 md:max-h-screen">
      <nav className="mb-3 space-x-3">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/blog">Blog</NavLink>
      </nav>
      <h1 className="text-lg font-medium">
        Hi, I'm Rohan Kiratsata. <br />
        Full Stack Engineer at Inagiffy,
        <br />
        and a indie hacker.
      </h1>
      <div className="mt-3">
        <p>
          Email :{" "}
          <NavLink href="mailto:rohan@kriyavatlabs.xyz">
            rohan@kriyavatlabs.xyz
          </NavLink>
        </p>
      </div>
    </div>
  );
}
