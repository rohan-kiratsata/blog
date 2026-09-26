import type { Project } from "app/util/content";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function ProjectCard({
  title,
  description,
  link,
  icon,
}: Project) {
  const hasLink = /^https?:\/\//.test(link);

  const content = (
    <>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-3">
          <span className="text-sm">{title}</span>
        </span>
        <span className="mt-1 block text-sm text-neutral-500 truncate">
          {description}
        </span>
      </span>
      {hasLink ? (
        <ArrowUpRight
          size={16}
          className="mt-1 shrink-0 text-neutral-400"
          aria-hidden="true"
        />
      ) : (
        <span className="mt-1 text-xs text-neutral-500">Shelved</span>
      )}
    </>
  );

  return (
    <div data-reveal className="flex items-start gap-3 py-2">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-10 shrink-0 items-center justify-center text-sm font-medium text-neutral-500"
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
