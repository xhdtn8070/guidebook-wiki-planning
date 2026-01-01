# Lovable 요청 프롬프트 (붙여넣기용)

아래 파일을 업로드했습니다. 이를 참고해 **Guidebook Wiki** 프로토타입을 더 세련된 UI로 재구성하고, 가능하면 **Next.js(App Router) + TypeScript** 구조로 만들어 주세요.

## 제공 파일
- `prototype/index.html` – 테넌트 홈 시안
- `prototype/docs.html` – 문서 상세 시안 (SidebarNav, Breadcrumb, OnPageTOC 포함)
- `prototype/login.html` – 전체 페이지 로그인(카카오 전용) 시안
- `prototype/styles.css` – CSS 변수 기반 테마/컴포넌트 스타일
- `prototype/theme-loader.js` – 테마 JSON을 CSS 변수로 주입하는 로더
- `prototype/data/*.json` – 테마/레이아웃/컴포넌트 토큰 모음
- `design-brief.md` – 페이지·컴포넌트 요구사항 및 테마/UX 지침

## 목표
- 홈(`/`), 문서(`/docs/[...slug]`), 검색(`/search`), 로그인(`/auth/login`), OAuth 콜백(`/auth/callback`)을 갖춘 UI 킷.
- **TopBar**(브랜드, Docs 그룹 드롭다운, 검색, 테마/모드 토글, 로그인 버튼) + **SidebarNav** + **OnPageTOC**를 갖춘 3칼럼 문서 레이아웃.
- 테마 토큰(light/dark)과 테넌트 프리셋(`data/*.json`)을 읽어 CSS 변수/스타일에 반영. 모드/테마 선택은 `localStorage`로 유지.

## 요청 사항
1. **기술 스택**: Next.js(App Router) + React + TypeScript. 스타일은 CSS 변수 기반으로 유지하되, 필요하면 CSS Modules/Vanilla Extract/Styled Components 중 하나를 사용해도 됩니다. Tailwind는 사용하지 말아주세요.
2. **라우트/페이지**
   - `/`: Hero(tenant pill, 제목, 리드, CTA 2~3개) + 빠른 시작 카드 + 인기/최근 리스트. Docs 드롭다운/테마 토글 표시.
   - `/docs/[...slug]`: 좌측 SidebarNav, 상단 Breadcrumb + PageHeader(제목/요약/업데이트 정보/gateType 뱃지), 본문(MDX 렌더 placeholder), ActionBlock 카드 예시, BottomPager, 우측 OnPageTOC(스티키, 해시 업데이트), Docs 그룹 셀렉트.
   - `/search`: 검색 입력 + 결과 카드(제목/요약/경로/태그/점수), 스켈레톤 로딩.
   - `/auth/login`: 리다이렉트 칩 + 소셜 로그인 버튼(카카오), 폼 필드 placeholder, 오류 메시지 placeholder. TopBar 유지.
   - `/auth/callback`: 토큰 저장 후 redirect 처리용 로딩 상태 페이지(간단한 문구/스피너).
3. **데이터/상태**
   - 테마/모드 선택은 `localStorage`에 `guidebook_theme`/`guidebook_mode`로 저장. 시스템 모드 시 `prefers-color-scheme` 반영.
   - Docs 그룹/문서 트리는 목데이터(`data/*.json` 또는 동일 구조 mock`)로 구성하고, `isUsable=false`나 `COMING_SOON`은 비활성 + 토스트("준비 중입니다") 처리.
   - OnPageTOC는 문서 헤딩을 기준으로 스크롤 스파이. 클릭 시 스무스 스크롤 + 해시 업데이트.
4. **UI/스타일**
   - 디자인 토큰(`--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--radius-*`, `--shadow-*`)과 폰트/레이아웃 값은 `data/*.json`에 맞춰 매핑.
   - 카드/버튼/탭/토스트/스켈레톤 등 기본 컴포넌트 예시를 포함해 반응형으로 구성.
   - 접근성: aria-label, 포커스 아웃라인, 대비를 챙겨 주세요.
5. **구조**
   - `components` 폴더에 LayoutRoot, TopBar, SidebarNav, OnPageTOC, ThemeToggle, ActionBlock 등 핵심 컴포넌트를 분리.
   - API 호출은 `lib/api.ts`에 목 fetch 함수로 넣고, 추후 실제 API로 교체 가능하게 해주세요.

## 산출물
- Next.js 프로젝트 구조(소스 코드)와 실행 방법을 README에 짧게 기재.
- 홈/문서/검색/로그인 페이지를 전부 탐색 가능한 상태로 제공.
- 테마 프리셋 2~3개를 선택할 수 있고 light/dark 모드를 즉시 전환 가능.

※ 정적 HTML/CSS 버전을 유지하고 싶다면, 위 요구사항을 동일하게 적용한 정적 번들을 추가로 제공해도 됩니다.
