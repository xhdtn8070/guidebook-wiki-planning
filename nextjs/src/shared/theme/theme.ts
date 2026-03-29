export type ThemePreset = "midnight";
export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "guidebook_theme";
export const MODE_STORAGE_KEY = "guidebook_mode";

export const themePresets: Record<ThemePreset, { label: string; description: string }> = {
  midnight: {
    label: "Midnight Console",
    description: "Lovable midnight docs shell adapted for the Next BFF.",
  },
};

export const themeModes: Record<ThemeMode, { label: string }> = {
  light: { label: "Light" },
  dark: { label: "Dark" },
};

export const DEFAULT_THEME: ThemePreset = "midnight";
export const DEFAULT_MODE: ThemeMode = "light";

export function isThemePreset(value: string | null | undefined): value is ThemePreset {
  return value === "midnight";
}

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): ThemePreset {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreset(value) ? value : DEFAULT_THEME;
}

export function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_MODE;
  }

  const value = window.localStorage.getItem(MODE_STORAGE_KEY);
  return isThemeMode(value) ? value : DEFAULT_MODE;
}

export function applyTheme(theme: ThemePreset, mode: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-mode", mode);
  root.classList.remove("light", "dark");
  root.classList.add(mode);
}

export function persistTheme(theme: ThemePreset, mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.localStorage.setItem(MODE_STORAGE_KEY, mode);
}
