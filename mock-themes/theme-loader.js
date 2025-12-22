const THEME_FILES = {
  "nordic-tech": "data/nordic-tech.json",
  "solarized-playbook": "data/solarized-playbook.json",
  "midnight-console": "data/midnight-console.json",
  "paper-notebook": "data/paper-notebook.json",
  "gradient-pulse": "data/gradient-pulse.json",
};

const select = document.querySelector("#theme-select");
const params = new URLSearchParams(window.location.search);
const initial = params.get("theme");

if (initial && THEME_FILES[initial]) {
  select.value = initial;
}

select.addEventListener("change", (event) => {
  const theme = event.target.value;
  loadTheme(theme);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("theme", theme);
  window.history.replaceState({}, "", nextUrl.toString());
});

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(select.value);
});

async function loadTheme(themeName) {
  const path = THEME_FILES[themeName];
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`failed to load ${path}`);
    const theme = await res.json();
    applyTheme(theme);
  } catch (err) {
    console.error(err);
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  const { palette, font, layout, hero, components } = theme;

  root.style.setProperty("--color-background", palette.background);
  root.style.setProperty("--color-surface", palette.surface);
  root.style.setProperty("--color-border", palette.border);
  root.style.setProperty("--color-primary", palette.primary);
  root.style.setProperty("--color-secondary", palette.secondary);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-text", palette.text);
  root.style.setProperty("--color-muted", palette.muted);
  root.style.setProperty("--shadow", layout.shadow);
  root.style.setProperty("--radius", layout.radius);
  root.style.setProperty("--spacing", layout.spacing);
  root.style.setProperty("--hero-bg", hero.background);
  root.style.setProperty("--hero-overlay-opacity", hero.overlayOpacity);
  root.style.setProperty("--font-heading", font.heading);
  root.style.setProperty("--font-body", font.body);
  root.style.setProperty("--font-mono", font.monospace);

  applyComponentOverrides(components);
}

function applyComponentOverrides(components) {
  const topbar = document.querySelector(".topbar");
  topbar.style.background = components.topBar.background;
  topbar.style.borderColor = components.topBar.border;

  const sidebar = document.querySelector(".sidebar");
  sidebar.style.background = components.sidebar.background;
  sidebar.style.borderColor = components.sidebar.border;

  document.querySelectorAll(".card").forEach((card) => {
    card.style.background = components.card.background;
    card.style.borderColor = components.card.border;
  });

  document.querySelectorAll(".btn.primary").forEach((btn) => {
    btn.style.background = components.button.primaryBackground;
    btn.style.color = components.button.primaryText;
    btn.style.boxShadow = components.button.shadow;
  });

  document.querySelectorAll(".btn.ghost").forEach((btn) => {
    btn.style.borderColor = components.button.ghostBorder;
    btn.style.color = components.button.ghostText;
    btn.style.background = components.button.ghostBackground;
  });

  document.querySelectorAll(".btn.text").forEach((btn) => {
    btn.style.color = components.button.text;
  });

  document.querySelectorAll(".code-block").forEach((block) => {
    block.style.background = components.codeBlock.background;
    block.style.color = components.codeBlock.text;
    block.style.borderColor = components.codeBlock.border;
  });
}
