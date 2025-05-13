import Link from "next/link";
import React from "react";

export default function Contact() {
  return (
    <div className="mt-10">
      <h2 className="font-medium text-white">contact</h2>
      <div className="flex gap-4 mt-2">
        <Link href="https://github.com/rohan-kiratsata" className="link">
          GitHub
        </Link>
        <Link href="https://x.com/sudorohan" className="link">
          X
        </Link>
        <Link href="mailto:sudosurohan@gmail.com" className="link">
          Email
        </Link>
      </div>
    </div>
  );
}
