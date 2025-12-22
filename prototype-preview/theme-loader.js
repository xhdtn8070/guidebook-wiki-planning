import { prototypeThemes } from "./theme-data.js";

const themeSelect = document.getElementById("theme-select");
const themeList = document.getElementById("theme-list");
const previewSurface = document.getElementById("preview-surface");
const previewTitle = document.getElementById("preview-title");
const previewDescription = document.getElementById("preview-description");

function applyTheme(themeId) {
  const theme = prototypeThemes.find(({ id }) => id === themeId);
  if (!theme) return;

  document.documentElement.style.setProperty("--bg", theme.background);
  document.documentElement.style.setProperty("--surface", theme.surface);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--text", theme.text);

  previewSurface.textContent = theme.name;
  previewDescription.textContent = theme.description;
  previewTitle.textContent = `${theme.name} prototype preview`;
}

function renderSelect() {
  prototypeThemes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme.id;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
  });
}

function renderList() {
  prototypeThemes.forEach((theme) => {
    const item = document.createElement("article");
    item.className = "theme-card";
    item.innerHTML = `
      <div class="theme-chip" style="background:${theme.accent};"></div>
      <div>
        <h3>${theme.name}</h3>
        <p>${theme.description}</p>
        <code>?theme=${theme.id}</code>
      </div>
    `;
    item.addEventListener("click", () => {
      themeSelect.value = theme.id;
      updateUrl(theme.id);
      applyTheme(theme.id);
    });
    themeList.appendChild(item);
  });
}

function updateUrl(themeId) {
  const url = new URL(window.location.href);
  url.searchParams.set("theme", themeId);
  window.history.replaceState({}, "", url.toString());
}

function initFromQuery() {
  const url = new URL(window.location.href);
  const requestedTheme = url.searchParams.get("theme") || prototypeThemes[0]?.id;
  if (requestedTheme) {
    themeSelect.value = requestedTheme;
    applyTheme(requestedTheme);
  }
}

function wireEvents() {
  themeSelect.addEventListener("change", (event) => {
    const themeId = event.target.value;
    updateUrl(themeId);
    applyTheme(themeId);
  });
}

function bootstrap() {
  renderSelect();
  renderList();
  initFromQuery();
  wireEvents();
}

bootstrap();
