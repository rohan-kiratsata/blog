import React from "react";
import { NavLink } from "./link";

export default function Sidenav() {
  return (
    <div className="border-r w-1/4 h-screen p-5 fixed top-0 left-0 z-10">
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
