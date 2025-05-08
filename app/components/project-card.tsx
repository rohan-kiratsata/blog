import { Project } from "app/util/content";
import Link from "next/link";
import React from "react";

export default function ProjectCard({
  title,
  description,
  link,
  year,
}: Project) {
  return (
    <Link
      href={link}
      className="relative hover:border-neutral-800 border-transparent border p-2 cursor-pointer block group"
    >
      <div className="flex items-center justify-between">
        <h3 className="link text-sm">{title}</h3>
        <span>{year}</span>
      </div>
      <div className="w-full mt-1">
        <p className="text-xs">{description}</p>
      </div>

      {/* Overlay */}
      <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>

      <div className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>

      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>

      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 right-0 w-3 h-[1px] bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 right-0 w-[1px] h-3 bg-neutral-600 dark:bg-neutral-800 group-hover:bg-neutral-600 dark:group-hover:bg-neutral-600 transition-colors"></div>
    </Link>
  );
}
