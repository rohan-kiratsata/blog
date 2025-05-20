import React from "react";
import ProjectCard from "./project-card";
import { projects } from "app/util/content";

export default function work() {
  return (
    <div className="mt-10">
      <h2 className="font-medium text-primary">work</h2>
      <div className="grid grid-cols-1 gap-1 mt-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
