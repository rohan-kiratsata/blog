import { baseUrl } from "app/sitemap";
import { claudeSkills } from "app/util/content";

export const metadata = {
  title: "Claude Skills",
  description:
    "Claude Code skills I built for my own workflow. Free to grab. | sudorohan",
  alternates: {
    canonical: `${baseUrl}/skills`,
  },
};

export default function SkillsPage() {
  return (
    <section>
      <h2 className="text-base text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
        claude skills
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg font-medium mb-10">
        Skills I wrote for Claude Code because I kept doing the same thing by
        hand. Download one and drop it into{" "}
        <code className="text-base text-neutral-900 dark:text-neutral-100">
          ~/.claude/skills/
        </code>
        , or open it in Claude and it installs itself. Free, take what you want.
      </p>

      <div className="flex flex-col">
        {claudeSkills.map((skill) => (
          <a
            key={skill.name}
            href={skill.file}
            download
            className="group border-t border-neutral-200 dark:border-neutral-800 py-5 last:border-b"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                {skill.name}
              </h3>
              <span className="text-sm text-neutral-400 dark:text-neutral-500 shrink-0 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                download ↓
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base font-medium mt-1">
              {skill.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
