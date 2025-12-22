const THEME_FILES = {
  "nordic-tech": "data/nordic-tech.json",
  "solarized-playbook": "data/solarized-playbook.json",
  "midnight-console": "data/midnight-console.json",
  "paper-notebook": "data/paper-notebook.json",
  "gradient-pulse": "data/gradient-pulse.json",
};

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
const themeChip = document.querySelector("#theme-chip");
const params = new URLSearchParams(window.location.search);
const initial = params.get("theme");

if (initial && THEME_FILES[initial]) {
  select.value = initial;
}

select.addEventListener("change", (event) => {
  const theme = event.target.value;
  applyThemeFromSource(theme);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("theme", theme);
  window.history.replaceState({}, "", nextUrl.toString());
});

window.addEventListener("DOMContentLoaded", () => {
  applyThemeFromSource(select.value);
  wireInteractions();
});

async function applyThemeFromSource(themeName) {
  const path = THEME_FILES[themeName];
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`failed to load ${path}`);
    const theme = await res.json();
    applyTheme(theme, themeName);
  } catch (err) {
    console.warn(`fetch theme failed for ${themeName}, fallback to inline preset`, err);
    const fallback = INLINE_THEME_PRESETS[themeName];
    if (fallback) {
      applyTheme(fallback, themeName);
    }
  }
}

function applyTheme(theme, themeKey) {
  const root = document.documentElement;
  const { palette, font, layout, hero, components } = theme;

  root.dataset.theme = themeKey;

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

  applyComponentOverrides(components, hero);
  if (themeChip) {
    themeChip.textContent = theme.name || themeKey;
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
    btn.style.borderColor = components.button?.ghostBorder;
    btn.style.color = components.button?.ghostText;
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
  setupAuthModal();
  setupPluginDemo();
  setupFlowDemo();
  setupSearchPreview();
}

function setupAuthModal() {
  const modal = document.querySelector("#auth-modal");
  const openers = [
    document.querySelector("#login-trigger"),
    document.querySelector("#cta-login"),
  ].filter(Boolean);
  const closeBtn = document.querySelector("#auth-close");
  const backdrop = modal?.querySelector(".modal-backdrop");

  const open = () => {
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };
  const close = () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  openers.forEach((btn) => btn.addEventListener("click", open));
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.querySelector("#email-login")?.addEventListener("click", () => {
    const log = document.querySelector("#plugin-log");
    if (log) {
      log.textContent = "이메일 로그인 모킹: 세션 생성 → 즐겨찾기 초기화";
    }
    close();
  });
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
