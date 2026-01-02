export type ThemeMode = "light" | "dark" | "system";
export type ThemePreset = "midnight" | "solarized" | "paper";

const THEME_STORAGE_KEY = "guidebook_theme";
const MODE_STORAGE_KEY = "guidebook_mode";

export const themePresets: Record<ThemePreset, { name: string; description: string }> = {
  midnight: {
    name: "Midnight Console",
    description: "진한 남색과 시안 액센트의 개발자 친화적 다크 테마",
  },
  solarized: {
    name: "Solarized Playbook",
    description: "따뜻한 색감과 앰버 액센트의 편안한 테마",
  },
  paper: {
    name: "Paper Notebook",
    description: "밝은 크림과 인디고 액센트의 클래식 테마",
  },
};

export const themeModes: Record<ThemeMode, string> = {
  system: "시스템",
  light: "라이트",
  dark: "다크",
};

export function getStoredTheme(): ThemePreset {
  if (typeof window === "undefined") return "midnight";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return (stored as ThemePreset) || "midnight";
}

export function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  return (stored as ThemeMode) || "dark";
}

export function setStoredTheme(theme: ThemePreset): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function setStoredMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_STORAGE_KEY, mode);
}

export function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getEffectiveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return getSystemMode();
  }
  return mode;
}

export function applyTheme(theme: ThemePreset, mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.removeAttribute("data-theme");
  root.classList.remove("light", "dark");

  if (theme !== "midnight") {
    root.setAttribute("data-theme", theme);
  }

  const effectiveMode = getEffectiveMode(mode);
  root.classList.add(effectiveMode);
  root.setAttribute("data-mode", effectiveMode);
}

export function getThemeInitScript() {
  return `(function(){try{var themeKey='${THEME_STORAGE_KEY}';var modeKey='${MODE_STORAGE_KEY}';var root=document.documentElement;var storedTheme=localStorage.getItem(themeKey)||'midnight';var storedMode=localStorage.getItem(modeKey)||'dark';var effectiveMode=storedMode==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):storedMode;root.removeAttribute('data-theme');root.classList.remove('light','dark');if(storedTheme!=='midnight'){root.setAttribute('data-theme',storedTheme);}root.classList.add(effectiveMode);root.setAttribute('data-mode',effectiveMode);}catch(e){}})();`;
}
