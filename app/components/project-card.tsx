import { Project } from "app/util/content";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function ProjectCard({
  title,
  description,
  link,
  icon,
}: Project) {
  return (
    <div className="flex gap-2 items-center">
      {icon && (
        <div className="mb-2">
          <Image src={icon} alt={title} width={32} height={32} />
        </div>
      )}
      <a href={link} className="flex flex-col">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-secondary">{description}</p>
      </a>
    </div>
  );
}
