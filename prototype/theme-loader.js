const THEME_FILES = {
  "nordic-tech": "data/nordic-tech.json",
  "solarized-playbook": "data/solarized-playbook.json",
  "midnight-console": "data/midnight-console.json",
  "paper-notebook": "data/paper-notebook.json",
  "gradient-pulse": "data/gradient-pulse.json",
};

const DOCS = [
  {
    id: "page_1",
    title: "카카오 OAuth 가이드",
    breadcrumb: "Docs / 인증 / 카카오 OAuth",
    lead: "GET /api/v1/wiki/nav 예시에 맞춰 좌측 트리와 우측 TOC가 동작하는 대표 문서입니다.",
    updated: "2024-06-12",
    status: "published",
    nav: [
      { id: "overview", label: "요약" },
      { id: "nav-tree", label: "네비게이션 트리" },
      { id: "flow", label: "연동 흐름" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "section",
        id: "overview",
        title: "요약",
        body: `
          <p class="muted">/api/v1/wiki/nav 응답을 그대로 사용해 좌측 SidebarNav를 렌더링하고, <code>isUsable=false</code>인 항목은 토스트만 띄웁니다.</p>
          <ul>
            <li>전체 트리는 카카오 OAuth 가이드 → 개요 → API 콘솔 → 실행 예시 순으로 3뎁스까지 내려갑니다.</li>
            <li>각 문서는 <code>GET /api/v1/wiki/pages?path=... </code>로 불러온다고 가정하고 MDX를 목업 데이터로 채워 두었습니다.</li>
            <li>우측 인페이지 TOC는 본문 헤더를 기준으로 스크롤 스파이를 적용해 현재 섹션을 강조합니다.</li>
          </ul>
        `,
      },
      {
        type: "code",
        id: "nav-tree",
        label: "[GET] /api/v1/wiki/nav 예시 (요약)",
        code: `{"nodes":[{"id":"page_1","title":"카카오 OAuth 가이드","isUsable":true,"children":[{"id":"page_2","title":"개요","isUsable":true},{"id":"page_3","title":"API 콘솔","isUsable":true,"children":[{"id":"page_3_1","title":"실행 예시","isUsable":true},{"id":"page_3_2","title":"SDK 연동 (준비 중)","isUsable":false}]}]}]}]}`,
      },
      {
        type: "section",
        id: "flow",
        title: "연동 흐름",
        body: `
          <ol>
            <li>좌측 트리에서 "API 콘솔"을 선택하면 <code>page_3</code>의 MDX를 불러와 중앙 컬럼에 렌더합니다.</li>
            <li>"실행 예시"와 같이 하위 문서도 같은 패턴으로 불러오며, 상단 드롭다운과 트리가 함께 활성 상태를 갱신합니다.</li>
            <li>"SDK 연동 (준비 중)"처럼 isUsable=false인 항목은 비활성 상태로 표시하고 토스트로 안내합니다.</li>
          </ol>
        `,
      },
    ],
    pager: { prev: "인증 공통", next: "카카오 개요" },
  },
  {
    id: "page_2",
    title: "개요",
    breadcrumb: "Docs / 인증 / 카카오 OAuth / 개요",
    lead: "카카오 OAuth 플로우를 간단히 요약하고 필요한 키와 리다이렉트 URI를 정리했습니다.",
    updated: "2024-06-05",
    status: "published",
    nav: [
      { id: "context", label: "배경" },
      { id: "setup", label: "사전 준비" },
      { id: "mdx", label: "MDX 샘플" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "section",
        id: "context",
        title: "배경",
        body: `<p>카카오 OAuth 인증 흐름과 토큰 교환 과정을 한눈에 보이도록 개요 문서를 구성했습니다.</p>`,
      },
      {
        type: "callout",
        tone: "success",
        id: "setup",
        title: "사전 준비 체크리스트",
        items: ["REST API 키 발급", "Redirect URI 등록", "동의항목 문구 검토"],
      },
      {
        type: "code",
        id: "mdx",
        label: "MDX 본문 예시",
        code: `# 카카오 OAuth 개요\n\n1. 인가 코드 받기\n2. 액세스 토큰 발급\n3. 사용자 정보 조회`,
      },
    ],
    pager: { prev: "카카오 OAuth", next: "API 콘솔" },
  },
  {
    id: "page_3",
    title: "API 콘솔",
    breadcrumb: "Docs / 인증 / 카카오 OAuth / API 콘솔",
    lead: "API 콘솔에서 액션 블록을 실행하고 응답을 확인하는 과정을 담았습니다.",
    updated: "2024-06-02",
    status: "published",
    nav: [
      { id: "layout", label: "레이아웃" },
      { id: "exec", label: "실행 예시" },
      { id: "action-block", label: "액션 블록" },
      { id: "next", label: "다음 단계" },
    ],
    pluginNav: [
      { id: "api-console", label: "API 콘솔", state: "active" },
      { id: "workflow", label: "워크플로 빌더", state: "coming" },
    ],
    sections: [
      {
        type: "section",
        id: "layout",
        title: "문서 상세 레이아웃",
        body: `<p class="muted">좌측 트리는 /api/v1/wiki/nav에서 내려준 무한 뎁스 구조를 그대로 보여주고, 오른쪽 TOC는 현재 문서 헤더만 추려서 표시합니다.</p>`,
      },
      {
        type: "section",
        id: "exec",
        title: "실행 예시",
        body: `<p>POST /api/plugins/execute 로 액션 블록을 호출하는 간단한 예시입니다. 요청/응답을 그대로 복사해 붙여넣을 수 있도록 포맷했습니다.</p>`,
      },
      {
        type: "code",
        id: "action-block",
        label: "API 콘솔 실행 요청",
        code: `POST /api/plugins/execute\nAuthorization: Bearer {token}\n{\n  "plugin": "api-console",\n  "payload": {\n    "method": "POST",\n    "url": "https://api.guidebook.wiki/v1/demo",\n    "body": { "preview": true }\n  }\n}`,
      },
      {
        type: "plugin",
        id: "action-block-demo",
      },
      {
        type: "list",
        id: "next",
        title: "다음 단계",
        items: ["실행 로그를 기록하는 webhooks 연결", "동일 액션을 워크플로 빌더에서 재사용", "SDK 예제와 비교"],
      },
    ],
    pager: { prev: "개요", next: "실행 예시" },
  },
  {
    id: "page_3_1",
    title: "실행 예시",
    breadcrumb: "Docs / 인증 / 카카오 OAuth / API 콘솔 / 실행 예시",
    lead: "POST 호출 예시와 응답 스니펫을 담은 하위 문서입니다.",
    updated: "2024-05-28",
    status: "published",
    nav: [
      { id: "sample", label: "샘플 요청" },
      { id: "response", label: "샘플 응답" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "code",
        id: "sample",
        label: "샘플 요청",
        code: `curl -X POST https://api.guidebook.wiki/v1/demo \\\n+  -H "Authorization: Bearer {token}" \\\n+  -d '{"plugin":"api-console","payload":{"method":"POST","url":"https://kapi.kakao.com/v2/user/me"}}'`,
      },
      {
        type: "code",
        id: "response",
        label: "샘플 응답",
        code: `HTTP/1.1 200 OK\n{\n  "id": 123456789,\n  "kakao_account": {\n    "profile": { "nickname": "가이드북" },\n    "email": "docs@example.com"\n  }\n}`,
      },
    ],
    pager: { prev: "API 콘솔", next: "SDK 연동" },
  },
  {
    id: "page_3_2",
    title: "SDK 연동 (준비 중)",
    breadcrumb: "Docs / 인증 / 카카오 OAuth / API 콘솔 / SDK 연동",
    lead: "SDK 샘플은 곧 업데이트될 예정입니다.",
    updated: "준비 중",
    status: "coming",
    nav: [
      { id: "placeholder", label: "예정된 내용" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "section",
        id: "placeholder",
        title: "예정된 내용",
        body: `<p>JavaScript, Kotlin, Spring 예제를 추가해 SDK 초기화와 오류 처리 패턴을 안내할 예정입니다.</p>`,
      },
    ],
    pager: { prev: "실행 예시", next: "릴리스 노트" },
  },
  {
    id: "ops-release",
    title: "릴리스 노트",
    breadcrumb: "Docs / 운영 / 릴리스 노트",
    lead: "최근 릴리스에서 바뀐 항목을 간단히 요약했습니다.",
    updated: "2024-05-10",
    status: "published",
    nav: [
      { id: "summary", label: "요약" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "section",
        id: "summary",
        title: "요약",
        body: `<ul><li>API 콘솔 실행 속도 개선</li><li>위키 검색 가중치 튜닝</li><li>TOC 스크롤 스파이 버그 수정</li></ul>`,
      },
    ],
    pager: { prev: "SDK 연동", next: "릴리스 체크리스트" },
  },
  {
    id: "ops-checklist",
    title: "릴리스 체크리스트",
    breadcrumb: "Docs / 운영 / 릴리스 체크리스트",
    lead: "배포 전/후 체크리스트는 준비 중입니다.",
    updated: "준비 중",
    status: "coming",
    nav: [
      { id: "incoming", label: "예정된 섹션" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "section",
        id: "incoming",
        title: "예정된 섹션",
        body: `<p>릴리스 전후 점검표, 롤백 기준, smoke test 템플릿을 추가합니다.</p>`,
      },
    ],
    pager: { prev: "릴리스 노트", next: "API 용어집" },
  },
  {
    id: "glossary",
    title: "API 용어집",
    breadcrumb: "Docs / 부록 / API 용어집",
    lead: "자주 등장하는 필드와 상태 코드를 정리했습니다.",
    updated: "2024-04-22",
    status: "published",
    nav: [
      { id: "terms", label: "주요 용어" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "section",
        id: "terms",
        title: "주요 용어",
        body: `<ul><li><strong>isUsable</strong>: 문서 준비 상태를 나타내는 boolean</li><li><strong>gateType</strong>: 권한/노출 조건</li><li><strong>fullPath</strong>: 문서의 고유 경로 (slug)</li></ul>`,
      },
    ],
    pager: { prev: "릴리스 체크리스트", next: "에러 코드" },
  },
  {
    id: "glossary-errors",
    title: "에러 코드",
    breadcrumb: "Docs / 부록 / API 용어집 / 에러 코드",
    lead: "위키와 API에서 공통으로 쓰는 에러 코드를 모았습니다.",
    updated: "2024-04-18",
    status: "published",
    nav: [
      { id: "codes", label: "공통 코드" },
    ],
    pluginNav: [],
    sections: [
      {
        type: "code",
        id: "codes",
        label: "공통 에러 코드",
        code: `{
  "RESTRICTED": "권한이 부족합니다",
  "NOT_FOUND": "문서를 찾을 수 없습니다",
  "NOT_USABLE": "준비 중인 문서입니다"
}`,
      },
    ],
    pager: { prev: "API 용어집", next: "끝" },
  },
];

const DOC_MAP = new Map(DOCS.map((doc) => [doc.id, doc]));

const NAV_TREE = [
  {
    label: "인증",
    isUsable: true,
    children: [
      {
        label: "카카오 OAuth 가이드",
        docId: "page_1",
        isUsable: true,
        children: [
          { label: "개요", docId: "page_2", isUsable: true },
          {
            label: "API 콘솔",
            docId: "page_3",
            isUsable: true,
            children: [
              { label: "실행 예시", docId: "page_3_1", isUsable: true },
              { label: "SDK 연동 (준비 중)", docId: "page_3_2", isUsable: false },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "운영",
    isUsable: true,
    children: [
      { label: "릴리스 노트", docId: "ops-release", isUsable: true },
      { label: "릴리스 체크리스트", docId: "ops-checklist", isUsable: false },
    ],
  },
  {
    label: "부록",
    isUsable: true,
    children: [
      {
        label: "API 용어집",
        docId: "glossary",
        isUsable: true,
        children: [{ label: "에러 코드", docId: "glossary-errors", isUsable: true }],
      },
    ],
  },
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

  const flattenNav = (nodes, acc = []) => {
    nodes.forEach((node) => {
      if (node.docId) acc.push(node);
      if (node.children) flattenNav(node.children, acc);
    });
    return acc;
  };

  const navMap = new Map(flattenNav(NAV_TREE).map((item) => [item.docId, item]));
  const fallbackDoc = flattenNav(NAV_TREE).find((item) => item.isUsable)?.docId || DOCS[0]?.id;
  const defaultDoc = params.get("doc") || fallbackDoc;
  const initialHash = window.location.hash?.replace("#", "") || "";
  const scrollPositions = new Map();
  let currentDocId = defaultDoc;

  const renderOptions = () => {
    select.innerHTML = flattenNav(NAV_TREE)
      .map(
        (item) => `<option value="${item.docId}" ${item.isUsable ? "" : "disabled"}>${item.label}${
          item.isUsable ? "" : " · 준비중"
        }</option>`
      )
      .join("");
  };

  const renderNavTree = (activeId) => {
    const renderNode = (node) => {
      if (node.children?.length) {
        return `<li class="nav-group">
            <div class="nav-group-label">${node.label}</div>
            <ul>${node.children.map((child) => renderNode(child)).join("")}</ul>
          </li>`;
      }

      return `<li data-doc="${node.docId}" class="${node.docId === activeId ? "active" : ""} ${
        node.isUsable ? "" : "disabled"
      }">${node.label}${node.isUsable ? "" : " · 준비중"}</li>`;
    };

    navList.innerHTML = NAV_TREE.map((item) => renderNode(item)).join("");
  };

  const getNeighbor = (docId, direction) => {
    const usable = flattenNav(NAV_TREE).filter((item) => item.isUsable !== false);
    const index = usable.findIndex((item) => item.docId === docId);
    if (index === -1) return null;
    const offset = direction === "next" ? 1 : -1;
    return usable[index + offset] || null;
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
        window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}#${targetId}`);
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

  const renderDoc = (docId, options = {}) => {
    const { hash = "", restoreScroll = false, scrollPosition = 0 } = options;
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
        if (section.type === "section") {
          return `<section class="section-card" id="${section.id}">
            <h2>${section.title}</h2>
            ${section.body}
          </section>`;
        }
        if (section.type === "callout") {
          return `<section class="callout success" id="${section.id}">
            <p class="callout-title">${section.title}</p>
            <ul>${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>`;
        }
        if (section.type === "code") {
          return `<section class="section-card" id="${section.id}">
            <h3>${section.label}</h3>
            <div class="code-block" aria-label="${section.label}">
              <pre><code>${section.code}</code></pre>
            </div>
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
          return `<section class="section-card" id="${section.id}">
            <h3>${section.title}</h3>
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
      const prev = getNeighbor(doc.id, "prev");
      const next = getNeighbor(doc.id, "next");
      const prevLabel = prev ? DOC_MAP.get(prev.docId)?.title || prev.label || prev.docId : "";
      const nextLabel = next ? DOC_MAP.get(next.docId)?.title || next.label || next.docId : "";
      const prevLink = prev
        ? `<a href="docs.html?doc=${prev.docId}" class="pager-link" data-doc="${prev.docId}">← 이전: ${prevLabel}</a>`
        : "";
      const nextLink = next
        ? `<a href="docs.html?doc=${next.docId}" class="pager-link" data-doc="${next.docId}">다음: ${nextLabel} →</a>`
        : "";
      pager.innerHTML = `${prevLink}${nextLink}`;
      pager.classList.toggle("inactive", doc.status !== "published");

      pager.querySelectorAll(".pager-link").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const targetDoc = link.dataset.doc;
          if (!targetDoc) return;
          navigateToDoc(targetDoc, { push: true });
        });
      });
    }

    if (navEntry?.isUsable === false || doc.status !== "published") {
      showToast("준비 중인 문서입니다. 연결되면 자동으로 안내합니다.");
    }

    const scrollToTarget = () => {
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
      }

      if (restoreScroll) {
        window.scrollTo({ top: scrollPosition, behavior: "auto" });
        return;
      }

      window.scrollTo({ top: 0, behavior: "auto" });
    };

    requestAnimationFrame(scrollToTarget);

    setupPluginDemo();
  };

  const buildUrl = (docId, hash = "") => {
    params.set("doc", docId);
    return `${window.location.pathname}?${params.toString()}${hash ? `#${hash}` : ""}`;
  };

  const navigateToDoc = (docId, options = {}) => {
    const { push = true, restoreScroll = false, scrollPosition = 0, hash = "" } = options;
    if (currentDocId && currentDocId !== docId) {
      scrollPositions.set(currentDocId, window.scrollY);
    }
    const url = buildUrl(docId, hash);
    const state = { doc: docId, scroll: restoreScroll ? scrollPosition : 0, hash };
    const method = push ? "pushState" : "replaceState";
    window.history[method](state, "", url);
    renderDoc(docId, { hash, restoreScroll, scrollPosition: restoreScroll ? scrollPosition : 0 });
    currentDocId = docId;
  };

  window.addEventListener("popstate", (event) => {
    const docId = event.state?.doc || params.get("doc") || fallbackDoc;
    const storedScroll = event.state?.scroll ?? scrollPositions.get(docId) ?? 0;
    const hash = (event.state?.hash || window.location.hash.replace("#", "")) ?? "";
    navigateToDoc(docId, { push: false, restoreScroll: true, scrollPosition: storedScroll, hash });
  });

  renderOptions();
  window.history.replaceState({ doc: defaultDoc, scroll: window.scrollY, hash: initialHash }, "", buildUrl(defaultDoc, initialHash));
  renderDoc(defaultDoc, { hash: initialHash, restoreScroll: Boolean(initialHash), scrollPosition: 0 });

  select.addEventListener("change", (event) => {
    const value = event.target.value;
    navigateToDoc(value, { push: true });
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
    navigateToDoc(docId, { push: true });
  });
}

function showToast(message) {
  const toast = document.querySelector("#doc-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 2400);
}
