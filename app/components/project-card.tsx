"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Project } from "app/util/content";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function ProjectCard({
  title,
  description,
  link,
  icon,
  year,
}: Project) {
  const row = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const hasLink = /^https?:\/\//.test(link);

  useEffect(() => {
    const element = row.current;
    const iconElement = mark.current;
    if (!element || !iconElement) return;

    const media = gsap.matchMedia();
    media.add(
      {
        reveal: "(min-width: 768px) and (hover: hover) and (pointer: fine)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (!context.conditions?.reveal) {
          gsap.set(iconElement, { opacity: 1, x: 0, rotation: 0, scale: 1 });
          return;
        }

        const reducedMotion = context.conditions.reducedMotion;
        gsap.set(iconElement, {
          opacity: 0,
          x: 14,
          rotation: -12,
          scale: 0.82,
        });
        const animation = gsap.to(iconElement, {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.38,
          ease: "back.out(1.5)",
          paused: true,
        });
        const reveal = () => {
          if (reducedMotion) animation.progress(1).pause();
          else animation.timeScale(1).play();
        };
        const conceal = () => {
          if (
            !element.matches(":hover") &&
            !element.contains(document.activeElement)
          ) {
            if (reducedMotion) animation.progress(0).pause();
            else animation.timeScale(1.5).reverse();
          }
        };
        element.addEventListener("mouseenter", reveal);
        element.addEventListener("mouseleave", conceal);
        element.addEventListener("focusin", reveal);
        element.addEventListener("focusout", conceal);
        if (
          element.matches(":hover") ||
          element.contains(document.activeElement)
        )
          reveal();

        return () => {
          element.removeEventListener("mouseenter", reveal);
          element.removeEventListener("mouseleave", conceal);
          element.removeEventListener("focusin", reveal);
          element.removeEventListener("focusout", conceal);
        };
      },
    );
    return () => media.revert();
  }, []);

  const content = (
    <>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-3">
          <span className="text-sm">{title}</span>
          {/* <span className="text-xs text-neutral-500 tabular-nums">{year}</span> */}
        </span>
        <span className="mt-1 block text-sm text-neutral-500 truncate">
          {description}
        </span>
      </span>
      {hasLink ? (
        <ArrowUpRight
          size={16}
          className="mt-1 shrink-0 text-neutral-400 transition-colors group-hover/project:text-neutral-700 group-focus-within/project:text-neutral-700 motion-reduce:transition-none"
          aria-hidden="true"
        />
      ) : (
        <span className="mt-1 text-xs text-neutral-500">Shelved</span>
      )}
    </>
  );

  return (
    <div
      ref={row}
      className="group/project relative flex items-start gap-3 py-2"
    >
      <span
        ref={mark}
        aria-hidden="true"
        className="pointer-events-none mt-0.5 flex size-15 shrink-0 items-center justify-centertext-sm font-medium text-neutral-500 shadow-[0_2px_6px_#00000008] md:absolute md:-left-12 md:top-0 md:mt-0 md:opacity-0 [@media(hover:none)]:opacity-100 [@media(pointer:coarse)]:opacity-100"
      >
        {icon && icon !== "/box.png" ? (
          <Image src={icon} alt="" width={34} height={34} />
        ) : (
          title[0].toUpperCase()
        )}
      </span>
      {hasLink ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 min-w-0 flex-1 items-start gap-4 rounded-sm text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-600"
        >
          {content}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <div className="flex min-h-11 min-w-0 flex-1 items-start gap-4 text-sm">
          {content}
        </div>
      )}
    </div>
  );
}
