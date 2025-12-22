const THEME_FILES = {
  "nordic-tech": "data/nordic-tech.json",
  "solarized-playbook": "data/solarized-playbook.json",
  "midnight-console": "data/midnight-console.json",
  "paper-notebook": "data/paper-notebook.json",
  "gradient-pulse": "data/gradient-pulse.json",
};

const DOCS = [
  {
    id: "api-console",
    title: "API 콘솔을 이용해 샘플 워크플로 실행하기",
    breadcrumb: "Docs / 플러그인 / API 콘솔 실행",
    lead: "ActionBlock 구성과 요청/응답 예시를 포함한 문서 상세 페이지 시안입니다.",
    updated: "2024-06-01",
    status: "published",
    nav: [
      { id: "prep", label: "사전 준비" },
      { id: "run", label: "실행 예시" },
      { id: "block", label: "플러그인 블록" },
      { id: "next", label: "다음 단계" },
    ],
    pluginNav: [
      { id: "api-console", label: "API 콘솔", state: "active" },
      { id: "workflow", label: "워크플로 빌더", state: "coming" },
      { id: "diagram", label: "다이어그램 뷰어", state: "draft" },
    ],
    sections: [
      {
        type: "callout",
        tone: "success",
        title: "사전 준비",
        id: "prep",
        items: ["테넌트별 API Key 발급", "Webhook URL (Slack/Discord) 등록", "액션 실행 권한 확인"],
      },
      {
        type: "code",
        id: "run",
        label: "요청 예시",
        code: `POST /api/plugins/execute\nAuthorization: Bearer {token}\n{\n  "plugin": "api-console",\n  "payload": {\n    "method": "POST",\n    "url": "https://api.guidebook.wiki/v1/demo",\n    "body": { "preview": true }\n  }\n}`,
      },
      {
        type: "plugin",
        id: "block",
      },
      {
        type: "list",
        id: "next",
        title: "결과/추가 리소스",
        items: ["실행 로그는 7일 보관", "Slack 웹훅으로 결과 전송", "워크플로 빌더 베타 안내"],
      },
    ],
    pager: { prev: "인증 설정", next: "워크플로 빌더" },
  },
  {
    id: "sdk-guide",
    title: "SDK 통합 가이드",
    breadcrumb: "Docs / SDK / 통합 가이드",
    lead: "다중 언어 SDK 설치/초기화 안내를 준비 중입니다.",
    updated: "준비 중",
    status: "coming",
    nav: [
      { id: "install", label: "설치" },
      { id: "init", label: "초기화" },
    ],
    pluginNav: [],
    pager: { prev: "API 콘솔", next: "릴리스 노트" },
  },
  {
    id: "ops-checklist",
    title: "운영 체크리스트",
    breadcrumb: "Docs / 운영 / 체크리스트",
    lead: "릴리스 전후 체크리스트와 장애 대응 템플릿을 정리 중입니다.",
    updated: "초안", 
    status: "draft",
    nav: [
      { id: "release", label: "릴리스" },
      { id: "incident", label: "장애 대응" },
    ],
    pluginNav: [],
    pager: { prev: "SDK", next: "부록" },
  },
];

const NAV_TREE = [
  { label: "API 콘솔", docId: "api-console", isUsable: true },
  { label: "SDK 통합 가이드", docId: "sdk-guide", isUsable: false },
  { label: "운영 체크리스트", docId: "ops-checklist", isUsable: false },
];

const INLINE_THEME_PRESETS = {
  "gradient-pulse": {
    "name": "Gradient Pulse",
    "palette": {
      "primary": "#f97316",
      "secondary": "#6366f1",
      "accent": "#22c55e",
      "background": "#0f172a",
      "surface": "rgba(255, 255, 255, 0.12)",
      "border": "rgba(255, 255, 255, 0.2)",
      "text": "#f8fafc",
      "muted": "#cbd5e1"
    },
    "paletteModes": {
      "light": {
        "primary": "#f97316",
        "secondary": "#6366f1",
        "accent": "#22c55e",
        "background": "#fff7ed",
        "surface": "#ffffff",
        "border": "#ffe4cc",
        "text": "#1f2937",
        "muted": "#4b5563"
      },
      "dark": {
        "primary": "#f97316",
        "secondary": "#6366f1",
        "accent": "#22c55e",
        "background": "#0f172a",
        "surface": "rgba(255, 255, 255, 0.12)",
        "border": "rgba(255, 255, 255, 0.2)",
        "text": "#f8fafc",
        "muted": "#cbd5e1"
      }
    },
    "font": {
      "heading": "'Inter', 'Pretendard', sans-serif",
      "body": "'Inter', 'Pretendard', sans-serif",
      "monospace": "'Space Mono', 'Fira Code', monospace"
    },
    "layout": {
      "radius": "18px",
      "shadow": "0 16px 48px rgba(249, 115, 22, 0.3)",
      "spacing": "18px"
    },
    "hero": {
      "background": "linear-gradient(135deg, #f97316 0%, #6366f1 50%, #22c55e 100%)",
      "overlayOpacity": 0.18
    },
    "components": {
      "topBar": {
        "background": "rgba(0, 0, 0, 0.4)",
        "border": "rgba(255, 255, 255, 0.2)"
      },
      "sidebar": {
        "background": "rgba(15, 23, 42, 0.7)",
        "border": "rgba(255, 255, 255, 0.2)"
      },
      "card": {
        "background": "rgba(255, 255, 255, 0.08)",
        "border": "rgba(255, 255, 255, 0.12)"
      },
      "button": {
        "primaryBackground": "linear-gradient(135deg, #f97316, #ef4444)",
        "primaryText": "#0f172a",
        "ghostBackground": "rgba(255, 255, 255, 0.08)",
        "ghostBorder": "rgba(255, 255, 255, 0.32)",
        "ghostText": "#f8fafc",
        "text": "#f97316",
        "shadow": "0 18px 40px rgba(249, 115, 22, 0.45)"
      },
      "codeBlock": {
        "background": "rgba(15, 23, 42, 0.9)",
        "text": "#e5e7eb",
        "border": "rgba(255, 255, 255, 0.16)"
      }
    }
  },
  "midnight-console": {
    "name": "Midnight Console",
    "palette": {
      "primary": "#7c3aed",
      "secondary": "#22d3ee",
      "accent": "#f472b6",
      "background": "#0b1220",
      "surface": "#0f172a",
      "border": "#1e293b",
      "text": "#e2e8f0",
      "muted": "#94a3b8"
    },
    "paletteModes": {
      "light": {
        "primary": "#7c3aed",
        "secondary": "#22d3ee",
        "accent": "#f472b6",
        "background": "#f5f7fb",
        "surface": "#ffffff",
        "border": "#e5e7eb",
        "text": "#0f172a",
        "muted": "#475569"
      },
      "dark": {
        "primary": "#7c3aed",
        "secondary": "#22d3ee",
        "accent": "#f472b6",
        "background": "#0b1220",
        "surface": "#0f172a",
        "border": "#1e293b",
        "text": "#e2e8f0",
        "muted": "#94a3b8"
      }
    },
    "font": {
      "heading": "'Inter', 'Pretendard', sans-serif",
      "body": "'Inter', 'Pretendard', sans-serif",
      "monospace": "'Space Mono', 'Fira Code', monospace"
    },
    "layout": {
      "radius": "16px",
      "shadow": "0 18px 40px rgba(124, 58, 237, 0.35)",
      "spacing": "18px"
    },
    "hero": {
      "background": "radial-gradient(circle at 20% 20%, #312e81 0%, #0b1220 45%, #050914 100%)",
      "overlayOpacity": 0.32
    },
    "components": {
      "topBar": {
        "background": "rgba(15, 23, 42, 0.96)",
        "border": "#1e293b"
      },
      "sidebar": {
        "background": "rgba(11, 18, 32, 0.92)",
        "border": "#1e293b"
      },
      "card": {
        "background": "#111827",
        "border": "#1e293b"
      },
      "button": {
        "primaryBackground": "linear-gradient(135deg, #7c3aed, #22d3ee)",
        "primaryText": "#0b1220",
        "ghostBackground": "rgba(124, 58, 237, 0.12)",
        "ghostBorder": "rgba(34, 211, 238, 0.6)",
        "ghostText": "#e2e8f0",
        "text": "#c084fc",
        "shadow": "0 18px 38px rgba(124, 58, 237, 0.45)"
      },
      "codeBlock": {
        "background": "#050914",
        "text": "#a5f3fc",
        "border": "#1e293b"
      }
    }
  },
  "nordic-tech": {
    "name": "Nordic Tech",
    "palette": {
      "primary": "#2a9d8f",
      "secondary": "#264653",
      "accent": "#e9c46a",
      "background": "#eef3f6",
      "surface": "#ffffff",
      "border": "#d1dee6",
      "text": "#0f172a",
      "muted": "#4b5563"
    },
    "paletteModes": {
      "light": {
        "primary": "#2a9d8f",
        "secondary": "#264653",
        "accent": "#e9c46a",
        "background": "#eef3f6",
        "surface": "#ffffff",
        "border": "#d1dee6",
        "text": "#0f172a",
        "muted": "#4b5563"
      },
      "dark": {
        "primary": "#2dd4bf",
        "secondary": "#0ea5e9",
        "accent": "#e9c46a",
        "background": "#0f172a",
        "surface": "#111827",
        "border": "#1f2937",
        "text": "#e5e7eb",
        "muted": "#94a3b8"
      }
    },
    "font": {
      "heading": "'Inter', 'Pretendard', sans-serif",
      "body": "'Inter', 'Pretendard', sans-serif",
      "monospace": "'Space Mono', 'Fira Code', monospace"
    },
    "layout": {
      "radius": "14px",
      "shadow": "0 12px 40px rgba(38, 70, 83, 0.12)",
      "spacing": "18px"
    },
    "hero": {
      "background": "linear-gradient(135deg, #c6f0ef 0%, #e8f5f5 40%, #f7fbff 100%)",
      "overlayOpacity": 0.28
    },
    "components": {
      "topBar": {
        "background": "rgba(255,255,255,0.92)",
        "border": "#d1dee6"
      },
      "sidebar": {
        "background": "rgba(255,255,255,0.96)",
        "border": "#d1dee6"
      },
      "card": {
        "background": "#ffffff",
        "border": "#d1dee6"
      },
      "button": {
        "primaryBackground": "#2a9d8f",
        "primaryText": "#f8fafc",
        "ghostBackground": "rgba(42, 157, 143, 0.12)",
        "ghostBorder": "rgba(42, 157, 143, 0.45)",
        "ghostText": "#0f172a",
        "text": "#2a9d8f",
        "shadow": "0 12px 30px rgba(42, 157, 143, 0.35)"
      },
      "codeBlock": {
        "background": "#0f172a",
        "text": "#d1e9ff",
        "border": "#19324a"
      }
    }
  },
  "paper-notebook": {
    "name": "Paper Notebook",
    "palette": {
      "primary": "#ef476f",
      "secondary": "#ffd166",
      "accent": "#06d6a0",
      "background": "#faf7f0",
      "surface": "#ffffff",
      "border": "#e8e2d2",
      "text": "#3c342c",
      "muted": "#7a6f63"
    },
    "paletteModes": {
      "light": {
        "primary": "#ef476f",
        "secondary": "#ffd166",
        "accent": "#06d6a0",
        "background": "#faf7f0",
        "surface": "#ffffff",
        "border": "#e8e2d2",
        "text": "#3c342c",
        "muted": "#7a6f63"
      },
      "dark": {
        "primary": "#f47b94",
        "secondary": "#ffd166",
        "accent": "#06d6a0",
        "background": "#2d2620",
        "surface": "#362e28",
        "border": "#4a3f36",
        "text": "#f6eee1",
        "muted": "#d6c5b5"
      }
    },
    "font": {
      "heading": "'Recoleta', 'Pretendard', serif",
      "body": "'Work Sans', 'Pretendard', sans-serif",
      "monospace": "'Space Mono', 'Fira Code', monospace"
    },
    "layout": {
      "radius": "12px",
      "shadow": "0 8px 30px rgba(60, 52, 44, 0.08)",
      "spacing": "16px"
    },
    "hero": {
      "background": "linear-gradient(135deg, #fff7e6 0%, #fbe0d9 100%)",
      "overlayOpacity": 0.14
    },
    "components": {
      "topBar": {
        "background": "rgba(255, 255, 255, 0.94)",
        "border": "#e8e2d2"
      },
      "sidebar": {
        "background": "rgba(255, 255, 255, 0.96)",
        "border": "#e8e2d2"
      },
      "card": {
        "background": "#ffffff",
        "border": "#e8e2d2"
      },
      "button": {
        "primaryBackground": "#ef476f",
        "primaryText": "#fffaf2",
        "ghostBackground": "rgba(239, 71, 111, 0.08)",
        "ghostBorder": "rgba(239, 71, 111, 0.4)",
        "ghostText": "#3c342c",
        "text": "#ef476f",
        "shadow": "0 10px 24px rgba(239, 71, 111, 0.35)"
      },
      "codeBlock": {
        "background": "#1f2937",
        "text": "#f8fafc",
        "border": "#e8e2d2"
      }
    }
  },
  "solarized-playbook": {
    "name": "Solarized Playbook",
    "palette": {
      "primary": "#268bd2",
      "secondary": "#2aa198",
      "accent": "#b58900",
      "background": "#fdf6e3",
      "surface": "#fffdf5",
      "border": "#e7d8b1",
      "text": "#073642",
      "muted": "#586e75"
    },
    "paletteModes": {
      "light": {
        "primary": "#268bd2",
        "secondary": "#2aa198",
        "accent": "#b58900",
        "background": "#fdf6e3",
        "surface": "#fffdf5",
        "border": "#e7d8b1",
        "text": "#073642",
        "muted": "#586e75"
      },
      "dark": {
        "primary": "#5fb3d9",
        "secondary": "#3ed2c5",
        "accent": "#e0c060",
        "background": "#002b36",
        "surface": "#073642",
        "border": "#0a4c5b",
        "text": "#fdf6e3",
        "muted": "#93a1a1"
      }
    },
    "font": {
      "heading": "'Source Sans Pro', 'Pretendard', sans-serif",
      "body": "'Source Sans Pro', 'Pretendard', sans-serif",
      "monospace": "'Space Mono', 'SFMono-Regular', monospace"
    },
    "layout": {
      "radius": "12px",
      "shadow": "0 12px 40px rgba(7, 54, 66, 0.14)",
      "spacing": "18px"
    },
    "hero": {
      "background": "linear-gradient(135deg, #fdf6e3 0%, #f0e3b1 100%)",
      "overlayOpacity": 0.18
    },
    "components": {
      "topBar": {
        "background": "rgba(253, 246, 227, 0.96)",
        "border": "#e7d8b1"
      },
      "sidebar": {
        "background": "rgba(255, 253, 245, 0.98)",
        "border": "#e7d8b1"
      },
      "card": {
        "background": "#fffaf0",
        "border": "#e7d8b1"
      },
      "button": {
        "primaryBackground": "#268bd2",
        "primaryText": "#fdf6e3",
        "ghostBackground": "rgba(38, 139, 210, 0.1)",
        "ghostBorder": "rgba(38, 139, 210, 0.5)",
        "ghostText": "#073642",
        "text": "#268bd2",
        "shadow": "0 12px 28px rgba(38, 139, 210, 0.35)"
      },
      "codeBlock": {
        "background": "#073642",
        "text": "#fdf6e3",
        "border": "#0a4c5b"
      }
    }
  }
};

const select = document.querySelector("#theme-select");
const modeSelect = document.querySelector("#mode-select");
const themeChip = document.querySelector("#theme-chip");
const params = new URLSearchParams(window.location.search);
const initial = params.get("theme");
const savedMode = params.get("mode") || localStorage.getItem("wiki-color-mode") || "system";
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

let currentTheme = select?.value || "nordic-tech";
let currentMode = savedMode;
let currentTocObserver = null;

if (initial && THEME_FILES[initial]) {
  currentTheme = initial;
}

if (select) {
  select.value = currentTheme;
}

if (modeSelect) {
  modeSelect.value = currentMode;
}

select?.addEventListener("change", (event) => {
  const theme = event.target.value;
  currentTheme = theme;
  applyThemeFromSource(theme, currentMode);
  updateUrlParam("theme", theme);
});

modeSelect?.addEventListener("change", (event) => {
  const mode = event.target.value;
  currentMode = mode;
  persistMode(mode);
  updateUrlParam("mode", mode);
  applyThemeFromSource(currentTheme, mode);
});

window.addEventListener("DOMContentLoaded", () => {
  applyThemeFromSource(currentTheme, currentMode);
  wireInteractions();
});

mediaQuery.addEventListener("change", () => {
  if (currentMode === "system") {
    applyThemeFromSource(currentTheme, currentMode);
  }
});

function updateUrlParam(key, value) {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set(key, value);
  window.history.replaceState({}, "", nextUrl.toString());
}

function persistMode(mode) {
  localStorage.setItem("wiki-color-mode", mode);
}

function getEffectiveMode(mode) {
  if (mode === "system") return mediaQuery.matches ? "dark" : "light";
  return mode;
}

function getModeLabel(mode) {
  switch (mode) {
    case "light":
      return "라이트";
    case "dark":
      return "다크";
    default:
      return "오토";
  }
}

async function applyThemeFromSource(themeName, modePreference = currentMode) {
  const path = THEME_FILES[themeName];
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`failed to load ${path}`);
    const theme = await res.json();
    applyTheme(theme, themeName, modePreference);
  } catch (err) {
    console.warn(`fetch theme failed for ${themeName}, fallback to inline preset`, err);
    const fallback = INLINE_THEME_PRESETS[themeName];
    if (fallback) {
      applyTheme(fallback, themeName, modePreference);
    }
  }
}

function applyTheme(theme, themeKey, modePreference = currentMode) {
  const root = document.documentElement;
  const { paletteModes = {}, palette, font, layout, hero, components } = theme;
  const effectiveMode = getEffectiveMode(modePreference);
  const paletteSet = paletteModes[effectiveMode] || paletteModes.light || palette;

  root.dataset.theme = themeKey;
  root.dataset.colorMode = effectiveMode;

  root.style.setProperty("--color-background", paletteSet.background || palette?.background);
  root.style.setProperty("--color-surface", paletteSet.surface || palette?.surface);
  root.style.setProperty("--color-border", paletteSet.border || palette?.border);
  root.style.setProperty("--color-primary", paletteSet.primary || palette?.primary);
  root.style.setProperty("--color-secondary", paletteSet.secondary || palette?.secondary);
  root.style.setProperty("--color-accent", paletteSet.accent || palette?.accent);
  root.style.setProperty("--color-text", paletteSet.text || palette?.text);
  root.style.setProperty("--color-muted", paletteSet.muted || palette?.muted);
  root.style.setProperty("--shadow", layout.shadow);
  root.style.setProperty("--radius", layout.radius);
  root.style.setProperty("--spacing", layout.spacing);
  root.style.setProperty("--hero-bg", hero.background);
  root.style.setProperty("--hero-overlay-opacity", hero.overlayOpacity);
  root.style.setProperty("--font-heading", font.heading);
  root.style.setProperty("--font-body", font.body);
  root.style.setProperty("--font-mono", font.monospace);

  applyComponentOverrides(components, hero);
  if (themeChip) {
    themeChip.textContent = `${theme.name || themeKey} · ${getModeLabel(modePreference)}`;
  }
}

function applyComponentOverrides(components, heroTheme) {
  const topbar = document.querySelector(".topbar");
  if (topbar && components.topBar) {
    topbar.style.background = components.topBar.background;
    topbar.style.borderColor = components.topBar.border;
  }

  const sidebar = document.querySelector(".sidebar");
  if (sidebar && components.sidebar) {
    sidebar.style.background = components.sidebar.background;
    sidebar.style.borderColor = components.sidebar.border;
  }

  document.querySelectorAll(".card, .panel, .auth-card, .plugin-block").forEach((card) => {
    card.style.background = components.card?.background;
    card.style.borderColor = components.card?.border;
  });

  document.querySelectorAll(".btn.primary").forEach((btn) => {
    btn.style.background = components.button?.primaryBackground;
    btn.style.color = components.button?.primaryText;
    btn.style.boxShadow = components.button?.shadow;
  });

  document.querySelectorAll(".btn.ghost").forEach((btn) => {
    const ghostText = components.button?.ghostText || getComputedStyle(document.documentElement).getPropertyValue("--color-text");
    btn.style.borderColor = components.button?.ghostBorder;
    btn.style.color = ghostText;
    btn.style.background = components.button?.ghostBackground;
  });

  document.querySelectorAll(".btn.text").forEach((btn) => {
    btn.style.color = components.button?.text;
  });

  document.querySelectorAll(".code-block").forEach((block) => {
    block.style.background = components.codeBlock?.background;
    block.style.color = components.codeBlock?.text;
    block.style.borderColor = components.codeBlock?.border;
  });

  const heroEl = document.querySelector(".hero");
  if (heroEl) heroEl.style.background = components.heroBackground || heroTheme?.background || getComputedStyle(document.documentElement).getPropertyValue("--hero-bg");
  const overlay = document.querySelector(".hero-overlay");
  if (overlay) {
    const overlayOpacity = heroTheme?.overlayOpacity ?? getComputedStyle(document.documentElement).getPropertyValue("--hero-overlay-opacity");
    overlay.style.opacity = overlayOpacity;
  }
}

function wireInteractions() {
  setupNavDocsDropdown();
  setupDocExperience();
  setupLoginLinks();
  hydrateRedirectChip();
  setupPluginDemo();
  setupFlowDemo();
  setupSearchPreview();
}

function setupLoginLinks() {
  const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
  const loginUrl = `login.html?redirect=${redirect}`;
  const docsUrl = "docs.html";

  ["#login-trigger", "#cta-login"].forEach((selector) => {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = loginUrl;
      });
    }
  });

  document.querySelector("#docs-btn")?.addEventListener("click", () => {
    window.location.href = docsUrl;
  });

  document.querySelector("#start-btn")?.addEventListener("click", () => {
    window.location.href = docsUrl;
  });
}

function hydrateRedirectChip() {
  const chip = document.querySelector("#redirect-chip");
  if (!chip) return;
  const redirect = params.get("redirect") || "/";
  chip.textContent = `redirect=${redirect}`;
}

function setupPluginDemo() {
  const log = document.querySelector("#plugin-log");
  if (!log) return;

  const runButton = document.querySelector("#plugin-run");
  const sampleButton = document.querySelector("#plugin-sample");
  const detailButton = document.querySelector("#plugin-detail");

  const mockResult = {
    requestId: "demo-req-1042",
    status: "success",
    durationMs: 182,
    output: {
      message: "샘플 워크플로 완료",
      nextAction: "슬랙 웹훅 전송",
    },
  };

  runButton?.addEventListener("click", () => {
    log.textContent = "실행 중... API 호출/로깅 모킹";
    setTimeout(() => {
      log.textContent = `${mockResult.requestId} · ${mockResult.status} (${mockResult.durationMs}ms) → ${mockResult.output.message}`;
    }, 420);
  });

  sampleButton?.addEventListener("click", () => {
    log.textContent = "샘플 로드: POST /api/plugins/execute { body, headers }";
  });

  detailButton?.addEventListener("click", () => {
    log.innerHTML = "<strong>액션 설명</strong> · 입력 검증 → 실행 → 결과 스트림 → 로그 보관";
  });
}

function setupFlowDemo() {
  const stepsEl = document.querySelector("#flow-steps");
  const play = document.querySelector("#flow-play");
  if (!stepsEl || !play) return;

  const steps = [
    "문서 홈 진입 · Onboarding 링크 노출",
    "SidebarNav로 API 콘솔 문서 이동",
    "ActionBlock에서 POST 실행 → 결과 로그",
    "BottomPager로 다음 문서 이동",
  ];

  const render = () => {
    stepsEl.innerHTML = steps.map((text, idx) => `<li><span class="step-index">${idx + 1}</span>${text}</li>`).join("");
  };

  play.addEventListener("click", render);
  render();
}

function setupSearchPreview() {
  const preview = document.querySelector("#search-preview");
  const play = document.querySelector("#search-play");
  if (!preview || !play) return;

  const results = [
    { title: "카카오 OAuth 연동", tags: ["로그인", "OAuth"], excerpt: "Redirect URI, 동의창 문구" },
    { title: "위키 검색 API", tags: ["Search", "API"], excerpt: "/api/wiki/search 와 정렬 옵션" },
    { title: "플러그인 실행", tags: ["ActionBlock", "Plugin"], excerpt: "문서 내 POST 호출 예시" },
  ];

  const render = () => {
    preview.innerHTML = results
      .map(
        (r) => `<div class="result"><div class="result-title">${r.title}</div><div class="result-tags">${r.tags
          .map((t) => `<span class="tag">${t}</span>`)
          .join("")}</div><p class="muted">${r.excerpt}</p></div>`
      )
      .join("");
  };

  play.addEventListener("click", render);
  render();
}

function setupNavDocsDropdown() {
  const menu = document.querySelector("#nav-doc-menu");
  const toggle = document.querySelector("#nav-docs .dropdown-toggle");
  if (!menu || !toggle) return;

  const renderItems = () => {
    menu.innerHTML = DOCS.map((doc) => {
      const state = doc.status;
      const stateLabel = state === "published" ? "바로가기" : "준비중";
      return `<a href="docs.html?doc=${doc.id}" class="nav-item" data-state="${state}">
        <span>${doc.title}</span>
        <span class="nav-pill">${stateLabel}</span>
      </a>`;
    }).join("");
  };

  renderItems();

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = menu.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (event) => {
    const target = event.target.closest(".nav-item");
    if (!target) return;
    const state = target.dataset.state;
    if (state && state !== "published") {
      event.preventDefault();
      showToast("준비 중인 문서입니다. 곧 업데이트됩니다.");
    }
  });
}

function setupDocExperience() {
  const select = document.querySelector("#doc-select");
  const navList = document.querySelector("#doc-nav");
  if (!select || !navList) return;

  const navMap = new Map(NAV_TREE.map((item) => [item.docId, item]));
  const fallbackDoc = NAV_TREE.find((item) => item.isUsable)?.docId || DOCS[0]?.id;
  const defaultDoc = params.get("doc") || fallbackDoc;

  const renderOptions = () => {
    select.innerHTML = NAV_TREE.map(
      (item) => `<option value="${item.docId}" ${item.isUsable ? "" : "disabled"}>${item.label}${
        item.isUsable ? "" : " · 준비중"
      }</option>`
    ).join("");
  };

  const renderNavTree = (activeId) => {
    navList.innerHTML = NAV_TREE.map(
      (item) =>
        `<li data-doc="${item.docId}" class="${item.docId === activeId ? "active" : ""} ${
          item.isUsable ? "" : "disabled"
        }">${item.label}${item.isUsable ? "" : " · 준비중"}</li>`
    ).join("");
  };

  const renderPluginNav = (doc) => {
    const pluginNav = document.querySelector("#plugin-nav");
    if (!pluginNav) return;
    pluginNav.innerHTML = doc.pluginNav
      ?.map(
        (item) =>
          `<li data-id="${item.id}" class="${item.state !== "active" ? "inactive" : ""}">${item.label}${
            item.state !== "active" ? " · 준비중" : ""
          }</li>`
      )
      .join("") || "";
  };

  const renderOnPageToc = (doc) => {
    const toc = document.querySelector("#onpage-toc");
    if (!toc) return;

    if (!doc.nav?.length) {
      toc.innerHTML = '<p class="muted">표시할 목차가 없습니다.</p>';
      return;
    }

    toc.innerHTML = doc.nav
      .map((item) => `<a href="#${item.id}" data-target="${item.id}">${item.label}</a>`)
      .join("");

    toc.onclick = (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      event.preventDefault();
      const targetId = link.dataset.target;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (currentTocObserver) {
      currentTocObserver.disconnect();
    }

    currentTocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = toc.querySelector(`a[data-target="${entry.target.id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            toc.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 1] }
    );

    doc.nav.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) {
        currentTocObserver.observe(section);
      }
    });
  };

  const renderDoc = (docId) => {
    const navEntry = navMap.get(docId);
    const effectiveDocId = navEntry?.isUsable === false ? fallbackDoc : docId;
    if (navEntry?.isUsable === false) {
      showToast("준비 중인 문서입니다. 곧 업데이트됩니다.");
    }

    const doc = DOCS.find((d) => d.id === effectiveDocId) || DOCS[0];
    if (!doc) return;

    select.value = doc.id;
    renderNavTree(doc.id);

    const breadcrumb = document.querySelector("#breadcrumb");
    const updated = document.querySelector("#doc-updated");
    const title = document.querySelector("#doc-title");
    const lead = document.querySelector("#doc-lead");
    const body = document.querySelector("#doc-body");
    const pager = document.querySelector("#pager");
    const status = document.querySelector("#doc-status");

    if (breadcrumb) breadcrumb.textContent = doc.breadcrumb;
    if (updated) updated.textContent = `업데이트 · ${doc.updated}`;
    if (title) title.textContent = doc.title;
    if (lead) lead.textContent = doc.lead;
    if (status) {
      status.textContent = doc.status === "published" ? "발행" : "준비중";
      status.dataset.state = doc.status;
    }

    const content = doc.sections
      ?.map((section) => {
        if (section.type === "callout") {
          return `<section class="callout success" id="${section.id}">
            <p class="callout-title">${section.title}</p>
            <ul>${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>`;
        }
        if (section.type === "code") {
          return `<section class="code-block" aria-label="${section.label}" id="${section.id}">
            <pre><code>${section.code}</code></pre>
          </section>`;
        }
        if (section.type === "plugin") {
          return `<div class="plugin-block" id="${section.id}">
            <div class="plugin-header">
              <span class="pill ghost">API Console</span>
              <span class="tag">POST /api/plugins/execute</span>
            </div>
            <div class="plugin-body">
              <div class="field">
                <label>API URL</label>
                <input type="text" value="https://api.guidebook.wiki/v1/demo" />
              </div>
              <div class="field">
                <label>Authorization</label>
                <select>
                  <option>Bearer 토큰</option>
                  <option>API Key</option>
                </select>
              </div>
              <div class="plugin-actions">
                <button class="btn primary" id="plugin-run">실행</button>
                <button class="btn ghost" id="plugin-sample">샘플 로드</button>
                <button class="btn text" id="plugin-detail">액션 설명 보기 →</button>
              </div>
              <div class="plugin-log" id="plugin-log" aria-live="polite"></div>
            </div>
          </div>`;
        }
        if (section.type === "list") {
          return `<section id="${section.id}">
            <h4>${section.title}</h4>
            <ul>${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>`;
        }
        return "";
      })
      .join("");

    if (body) {
      body.innerHTML = content || "";
      body.classList.toggle("inactive", doc.status !== "published");
    }

    renderPluginNav(doc);
    renderOnPageToc(doc);

    if (pager) {
      const prev = doc.pager?.prev ? `<a href="#" class="pager-link">← 이전: ${doc.pager.prev}</a>` : "";
      const next = doc.pager?.next ? `<a href="#" class="pager-link">다음: ${doc.pager.next} →</a>` : "";
      pager.innerHTML = `${prev}${next}`;
      pager.classList.toggle("inactive", doc.status !== "published");
    }

    if (navEntry?.isUsable === false || doc.status !== "published") {
      showToast("준비 중인 문서입니다. 연결되면 자동으로 안내합니다.");
    }

    setupPluginDemo();
  };

  renderOptions();
  renderDoc(defaultDoc);

  select.addEventListener("change", (event) => {
    const value = event.target.value;
    params.set("doc", value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    renderDoc(value);
  });

  navList.addEventListener("click", (event) => {
    const item = event.target.closest("li[data-doc]");
    if (!item) return;
    const docId = item.dataset.doc;
    const navEntry = navMap.get(docId);
    if (navEntry?.isUsable === false) {
      showToast("준비 중인 문서입니다. 곧 업데이트됩니다.");
      return;
    }
    params.set("doc", docId);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    renderDoc(docId);
  });
}

function showToast(message) {
  const toast = document.querySelector("#doc-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 2400);
}
