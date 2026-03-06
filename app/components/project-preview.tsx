"use client";

import { useState, useEffect } from "react";
import { FreelanceProject } from "app/util/content";

export function ProjectPreviewLink({ project }: { project: FreelanceProject }) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload image on mount
  useEffect(() => {
    if (project.preview) {
      const img = new Image();
      img.src = project.preview;
      img.onload = () => setIsLoaded(true);
    }
  }, [project.preview]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updatePosition(e);
  };

  const updatePosition = (e: React.MouseEvent) => {
    setPosition({
      x: e.clientX + 16,
      y: e.clientY + 16,
    });
  };

  return (
    <>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <h3 className="font-medium">{project.title}</h3>
        <p className="text-xs text-secondary">{project.description}</p>
      </a>

      {isHovered && project.preview && isLoaded && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="w-72 h-44 rounded-lg overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.preview}
              alt={`Preview of ${project.title}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      )}
    </>
  );
}
