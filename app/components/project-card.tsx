import { Project } from "app/util/content";
import Link from "next/link";
import React from "react";

export default function ProjectCard({
  title,
  description,
  link,
  year,
  tags,
}: Project) {
  return (
    <Link
      href={link}
      className="relative border border-transparent hover:border-border-primary rounded-sm p-2 cursor-pointer block group transition-all"
      style={
        {
          "--hover-border-color": "var(--border-primary)",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm accent-primary pb-[0.2px] border-b border-accent font-medium">
          {title}
        </h3>
        <span className="text-secondary">{year}</span>
      </div>
      <div className="w-full mt-1">
        <p className="text-xs text-secondary">{description}</p>
      </div>
      {/* Overlay */}
      <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-3 h-[1px] bg-border-primary transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-[1px] h-3 bg-border-primary transition-colors"></div>

      <div className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 w-3 h-[1px] bg-border-primary transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 w-[1px] h-3 bg-border-primary transition-colors"></div>

      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 w-3 h-[1px] bg-border-primary transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 left-0 w-[1px] h-3 bg-border-primary transition-colors"></div>

      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 right-0 w-3 h-[1px] bg-border-primary transition-colors"></div>
      <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 right-0 w-[1px] h-3 bg-border-primary transition-colors"></div>
    </Link>
  );
}
