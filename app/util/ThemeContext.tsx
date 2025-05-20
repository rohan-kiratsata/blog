"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { ThemeName, themes, DEFAULT_THEME, themesList } from "./themes";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Make available themes list from our themes configuration
  const availableThemes = useMemo(() => Object.keys(themes) as ThemeName[], []);

  // Apply theme function that sets CSS variables
  const applyTheme = (themeName: ThemeName) => {
    const root = document.documentElement;
    const currentTheme = themes[themeName];

    if (!currentTheme) return;

    // Create CSS variable object to apply in batch
    const cssVars = {};
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      cssVars[`--${cssKey}`] = value;
    });

    // Apply all CSS variables in one batch to reduce repaints
    requestAnimationFrame(() => {
      // Set the data-theme attribute
      root.setAttribute("data-theme", themeName);
      root.style.colorScheme = currentTheme.colorScheme;

      // Apply all CSS variables at once
      Object.entries(cssVars).forEach(([prop, value]) => {
        root.style.setProperty(prop, value as string);
      });
    });
  };

  // Only run client-side
  useEffect(() => {
    setMounted(true);

    // Load theme from localStorage on client-side
    const savedTheme = localStorage.getItem("theme") as ThemeName;
    if (savedTheme && availableThemes.includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(DEFAULT_THEME);
    }
  }, [availableThemes]);

  // Update document and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Function to cycle through themes
  const cycleTheme = () => {
    setTheme((current) => {
      const currentIndex = availableThemes.indexOf(current);
      const nextIndex = (currentIndex + 1) % availableThemes.length;
      return availableThemes[nextIndex];
    });
  };

  // Provide a stable value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ theme, setTheme, cycleTheme, availableThemes }),
    [theme, availableThemes]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
