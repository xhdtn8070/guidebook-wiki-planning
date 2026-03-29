"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  applyTheme,
  getStoredMode,
  getStoredTheme,
  persistTheme,
  themeModes,
  themePresets,
  type ThemeMode,
  type ThemePreset,
} from "@/shared/theme/theme";

type ThemeContextValue = {
  theme: ThemePreset;
  mode: ThemeMode;
  themePresets: typeof themePresets;
  themeModes: typeof themeModes;
  setTheme: (theme: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreset>(DEFAULT_THEME);
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    const storedMode = getStoredMode();
    setThemeState(storedTheme);
    setModeState(storedMode);
    applyTheme(storedTheme, storedMode);
  }, []);

  useEffect(() => {
    applyTheme(theme, mode);
    persistTheme(theme, mode);
  }, [mode, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      themePresets,
      themeModes,
      setTheme: setThemeState,
      setMode: setModeState,
      toggleMode: () => setModeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
