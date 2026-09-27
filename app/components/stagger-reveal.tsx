"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

const revealSelector = "[data-reveal], h1, h2, h3, p, li, article";
const groupSelector = "[data-reveal], li, article";

export default function StaggerReveal({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = container.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(revealSelector))
      .filter((element) => {
        const group = element.parentElement?.closest(groupSelector);
        return !group || !root.contains(group);
      });

    const animations = targets.map((element, index) =>
      element.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 480,
          delay: Math.min(index * 65, 650),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      ),
    );

    return () => animations.forEach((animation) => animation.cancel());
  }, [pathname]);

  return <div ref={container}>{children}</div>;
}
