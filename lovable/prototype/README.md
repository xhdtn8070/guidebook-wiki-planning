# Prototype Snapshot (Lovable 전달용)

Guidebook Wiki 정적 프로토타입의 핵심 파일만 모았습니다. Lovable에 업로드해 현재 UI와 테마 구조를 참고하도록 쓰세요.

## 포함 파일
- `index.html` – 테넌트 홈 시안 (Hero, CTA 카드, 플러그인 카드 예시)
- `docs.html` – 문서 상세 시안 (SidebarNav, Breadcrumb, OnPageTOC, BottomPager)
- `login.html` – 카카오 전용 전체 페이지 로그인 시안
- `styles.css` – CSS 변수 기반 기본 스타일
- `theme-loader.js` – 테마 JSON을 CSS 변수에 매핑하는 로더
- `data/*.json` – 테마/레이아웃/컴포넌트 토큰 (Light/Dark 포함)
- `dev-server.js`, `package.json`, `favicon.svg` – 의존성 없는 미리보기 서버 및 메타

## 로컬 미리보기
Node만 설치되어 있으면 아래로 실행해 브라우저에서 확인할 수 있습니다.

```bash
npm run preview --prefix prototype
```

기본 포트는 `4173`이며 `http://localhost:4173/`에서 홈(`index.html`)을, `docs.html`/`login.html`은 직접 경로로 접속하면 됩니다.
