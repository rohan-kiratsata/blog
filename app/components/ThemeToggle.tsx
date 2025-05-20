"use client";

import { useTheme } from "../util/ThemeContext";
import { Palette } from "lucide-react";

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      type="button"
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      style={{
        backgroundColor: `var(--bg-secondary)`,
        color: `var(--accent-primary)`,
      }}
      onClick={cycleTheme}
    >
      <Palette className="w-5 h-5" />
    </button>
  );
}
