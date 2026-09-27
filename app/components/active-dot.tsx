"use client";

import { Dot } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { gsap } from "gsap";

type Props =
  | {
      isLink: true;
      href: string;
      active: boolean;
      children: React.ReactNode;
    }
  | {
      isLink?: false;
      href?: string;
      active: boolean;
      children: React.ReactNode;
    };

export default function ActiveListItem(props: Props) {
  const { active, children, isLink = false, href } = props;
  const rowRef = useRef<HTMLLIElement | null>(null);

  const onMouseEnter = () => {
    if (!rowRef.current) return;
    gsap.to(rowRef.current, {
      x: 8,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const onMouseLeave = () => {
    if (!rowRef.current) return;
    gsap.to(rowRef.current, {
      x: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const content =
    isLink && href ? (
      <div className="inline-flex items-start gap-1 text-neutral-500 underline">
        <Dot
          className={
            active
              ? "fill-current size-5 shrink-0 mt-0.5"
              : "text-[#ccc] size-5 shrink-0 mt-0.5"
          }
        />
        <span className="inline leading-relaxed">
          <Link href={href}>{children}</Link>
        </span>
      </div>
    ) : (
      <div className="inline-flex items-start gap-1">
        <Dot
          className={
            active
              ? "fill-current size-5 shrink-0 mt-0.5"
              : "text-[#ccc] size-5 shrink-0 mt-0.5"
          }
        />
        <span className="inline leading-relaxed">{children}</span>
      </div>
    );

  return (
    <li
      ref={rowRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="list-none w-fit"
    >
      {content}
    </li>
  );
}
