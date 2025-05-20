export type ThemeName =
  | "dark"
  | "light"
  | "colorful"
  | "retro"
  | "windows"
  | "subtleBlue";

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  borderPrimary: string;
  borderSecondary: string;
  syntaxClass: string;
  syntaxIdentifier: string;
  syntaxKeyword: string;
  syntaxString: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
  colorScheme: "dark" | "light";
}

export const themes: Record<ThemeName, Theme> = {
  dark: {
    name: "dark",
    label: "Dark",
    colorScheme: "dark",
    colors: {
      bgPrimary: "#121212",
      bgSecondary: "#1e1e1e",
      textPrimary: "#f5f5f5",
      textSecondary: "#a0a0a0",
      accentPrimary: "#3b82f6",
      accentSecondary: "#60a5fa",
      borderPrimary: "#333333",
      borderSecondary: "#444444",
      syntaxClass: "#4c97f8",
      syntaxIdentifier: "#ffffff",
      syntaxKeyword: "#f47067",
      syntaxString: "#0fa295",
    },
  },
  light: {
    name: "light",
    label: "Light",
    colorScheme: "light",
    colors: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f5f5f5",
      textPrimary: "#1a1a1a",
      textSecondary: "#4a4a4a",
      accentPrimary: "#0048cc",
      accentSecondary: "#2563eb",
      borderPrimary: "#e0e0e0",
      borderSecondary: "#d0d0d0",
      syntaxClass: "#2d5e9d",
      syntaxIdentifier: "#354150",
      syntaxKeyword: "#e02518",
      syntaxString: "#007f7a",
    },
  },
  colorful: {
    name: "colorful",
    label: "Colorful",
    colorScheme: "dark",
    colors: {
      bgPrimary: "#1a1a2e",
      bgSecondary: "#16213e",
      textPrimary: "#e2e8f0",
      textSecondary: "#94a3b8",
      accentPrimary: "#ff6b6b",
      accentSecondary: "#4cc9f0",
      borderPrimary: "#293462",
      borderSecondary: "#216583",
      syntaxClass: "#4cc9f0",
      syntaxIdentifier: "#e2e8f0",
      syntaxKeyword: "#ff6b6b",
      syntaxString: "#67d987",
    },
  },
  retro: {
    name: "retro",
    label: "Retro",
    colorScheme: "light",
    colors: {
      bgPrimary: "#f0edd4",
      bgSecondary: "#e1d9b8",
      textPrimary: "#2b2b2b",
      textSecondary: "#4e4e41",
      accentPrimary: "#76453b",
      accentSecondary: "#a45c54",
      borderPrimary: "#c4bb85",
      borderSecondary: "#a39a73",
      syntaxClass: "#76453b",
      syntaxIdentifier: "#2b2b2b",
      syntaxKeyword: "#76453b",
      syntaxString: "#7d8052",
    },
  },
  windows: {
    name: "windows",
    label: "Windows 95",
    colorScheme: "light",
    colors: {
      bgPrimary: "#c0c0c0", // Classic Windows gray
      bgSecondary: "#ececec", // Lighter gray for secondary elements
      textPrimary: "#000000", // Black text
      textSecondary: "#333333", // Dark gray for secondary text
      accentPrimary: "#0000aa", // Classic Windows blue
      accentSecondary: "#008080", // Teal accent
      borderPrimary: "#ffffff", // White for 3D effect top/left borders
      borderSecondary: "#808080", // Gray for 3D effect bottom/right borders
      syntaxClass: "#0000aa", // Blue for class names
      syntaxIdentifier: "#000000", // Black for identifiers
      syntaxKeyword: "#aa0000", // Red for keywords
      syntaxString: "#006600", // Green for strings
    },
  },
  subtleBlue: {
    name: "subtleBlue",
    label: "Subtle Blue",
    colorScheme: "light",
    colors: {
      bgPrimary: "#1E2EDE", // Very bright blue background
      bgSecondary: "#74c0fc", // Slightly lighter blue for secondary
      textPrimary: "#FF8A80", // Dark text for contrast
      textSecondary: "#fff", // Slightly lighter text for secondary
      accentPrimary: "#FF8A80", // Deeper blue for accents
      accentSecondary: "#339af0", // Medium blue for secondary accents
      borderPrimary: "#a5d8ff", // Light blue border
      borderSecondary: "#228be6", // Medium blue border
      syntaxClass: "#1864ab", // Deep blue for class names
      syntaxIdentifier: "#212529", // Dark for identifiers
      syntaxKeyword: "#d9480f", // Subtle orange for keywords
      syntaxString: "#2b8a3e", // Subtle green for strings
    },
  },
};

export const DEFAULT_THEME: ThemeName = "dark";
export const themesList = Object.values(themes);
