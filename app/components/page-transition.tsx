"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function PageTransition() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "enter" | "exit">("idle");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleTransitionStart = () => {
      setIsActive(true);
      setPhase("enter");
    };

    window.addEventListener("zen-transition-start", handleTransitionStart);
    return () =>
      window.removeEventListener("zen-transition-start", handleTransitionStart);
  }, []);

  useEffect(() => {
    if (phase === "enter") {
      const timer = setTimeout(() => setPhase("exit"), 500);
      return () => clearTimeout(timer);
    }
    if (phase === "exit") {
      const timer = setTimeout(() => {
        setIsActive(false);
        setPhase("idle");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (!isActive) return null;

  const isEntering = phase === "enter";
  const isDark = resolvedTheme === "dark";
  const overlayColor = isDark ? "10, 10, 10" : "250, 250, 250";

  return (
    <>
      {/* Blur overlay on content */}
      <div
        className="fixed inset-0 z-[99] pointer-events-none"
        style={{
          backdropFilter: isEntering ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: isEntering ? "blur(20px)" : "blur(0px)",
          transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Main overlay */}
      <div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          backgroundColor: isEntering
            ? `rgba(${overlayColor}, 0.95)`
            : `rgba(${overlayColor}, 0)`,
          transition: "background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </>
  );
}
