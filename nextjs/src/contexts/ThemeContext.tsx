"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  ThemeMode,
  ThemePreset,
  applyTheme,
  getEffectiveMode,
  getStoredMode,
  getStoredTheme,
  setStoredMode,
  setStoredTheme,
  themeModes,
  themePresets,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemePreset;
  mode: ThemeMode;
  effectiveMode: "light" | "dark";
  setTheme: (theme: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  themePresets: typeof themePresets;
  themeModes: typeof themeModes;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreset>("midnight");
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [effectiveMode, setEffectiveMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme = getStoredTheme();
    const storedMode = getStoredMode();
    setThemeState(storedTheme);
    setModeState(storedMode);
    const nextEffective = getEffectiveMode(storedMode);
    setEffectiveMode(nextEffective);
    applyTheme(storedTheme, storedMode);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (mode === "system") {
        const newEffective = getEffectiveMode("system");
        setEffectiveMode(newEffective);
        applyTheme(theme, mode);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, theme]);

  const setTheme = useCallback(
    (newTheme: ThemePreset) => {
      setThemeState(newTheme);
      setStoredTheme(newTheme);
      applyTheme(newTheme, mode);
    },
    [mode],
  );

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      setStoredMode(newMode);
      const nextEffective = getEffectiveMode(newMode);
      setEffectiveMode(nextEffective);
      applyTheme(theme, newMode);
    },
    [theme],
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        effectiveMode,
        setTheme,
        setMode,
        themePresets,
        themeModes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
