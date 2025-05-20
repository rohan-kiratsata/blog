"use client";

import { useTheme } from "../util/ThemeContext";
import { Moon, Sun, Palette, Repeat, Square } from "lucide-react";
import { ThemeName } from "../util/themes";

// Map theme names to icons
const themeIcons = {
  dark: <Moon className="w-5 h-5" />,
  light: <Sun className="w-5 h-5" />,
  colorful: <Palette className="w-5 h-5" />,
  retro: <Repeat className="w-5 h-5" />,
  windows: <Square className="w-5 h-5" />,
};

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const getIcon = (themeName: ThemeName) => {
    return themeIcons[themeName] || <Moon className="w-5 h-5" />;
  };

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
      {getIcon(theme)}
    </button>
  );
}
