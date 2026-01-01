# Guidebook Wiki 재디자인 브리프 (Lovable용)

## 프로젝트 개요
- **서비스**: Guidebook Wiki – 멀티 테넌트 API 기반 위키 플랫폼. 대표 테넌트는 **API 실전 플레이북**.
- **목표**: 홈/문서/검색/로그인 흐름을 직관적으로 보여주고, 테넌트별 테마와 플러그인(ActionBlock) 확장성을 살린 UI.
- **참고 코드**: `prototype/` 폴더의 정적 시안(`index.html`, `docs.html`, `login.html`)과 테마 JSON(`data/*.json`).

## 핵심 UX 요구사항
1. **TopBar**
   - 브랜드/테넌트명, Docs 그룹 전환 드롭다운, 검색 진입, 테마·모드 토글, 로그인/유저 메뉴를 포함.
   - 로그인 버튼은 `/auth/login?redirect=현재경로` 패턴으로 이동.
2. **SidebarNav + 문서 상세**
   - 좌측 트리 내 `isUsable=false`인 문서는 비활성 + 토스트("준비 중입니다") 처리.
   - 중앙: Breadcrumb + PageHeader(제목, 요약, 업데이트 정보, gateType 뱃지) + WikiContent(MDX 렌더) + BottomPager.
   - 우측: OnPageTOC(스크롤 스파이, 해시 업데이트). TopBar 높이만큼 스티키 오프셋 적용.
3. **Doc Group Switcher**
   - 상단 Docs 드롭다운 및 본문 선택 박스에서 그룹을 바꿔 nav/tree/문서를 리셋. `COMING_SOON`/`isUsable=false` 그룹은 비활성 + 토스트.
4. **홈(/)**
   - Hero(테넌트 pill, 제목, 리드, CTA 2~3개) + 추천/빠른 시작 카드 + 인기/최근 업데이트 리스트 섹션.
5. **검색(/search)**
   - 검색어 입력 + 결과 리스트(제목/요약/경로/태그/점수). 로딩 시 스켈레톤.
6. **로그인(/auth/login)**
   - 전체 페이지 로그인. 소셜(예: 카카오) 버튼 + redirect 칩 노출. TopBar/ThemeToggle 유지.
7. **플러그인(ActionBlock)**
   - 문서 내 카드 형태. 헤더(타입, 엔드포인트), 필드 입력, 실행 버튼, 결과 영역 예시를 갖춘다.

## 테마/브랜드 가이드
- **CSS 변수 토큰**: `prototype/styles.css`와 `theme-loader.js`가 사용하는 토큰(`--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--radius-lg` 등)을 유지하거나 호환 매핑 제공.
- **테마 데이터**: `prototype/data/*.json`에 `palette`, `font`, `layout`, `hero`, `components` 키가 공통. 최소 `Midnight Console`, `Solarized Playbook`, `Paper Notebook` 느낌을 모두 시험 가능하게 해달라.
- **모드**: light/dark/system 모드. `localStorage`로 유지하며 시스템 모드 시 `prefers-color-scheme` 변화를 반영.

## 상호작용 세부사항
- 테마·모드 선택 시 상단 chip 등 현재 상태를 즉시 반영, 선택값을 `localStorage`에 저장.
- 그룹/문서 전환 시 문서 스크롤을 최상단으로 리셋. 뒤로가기는 직전 스크롤 위치 복원.
- OnPageTOC 클릭 시 URL 해시를 업데이트하고 스무스 스크롤.
- 검색/TopBar 등 입력 요소는 접근성(arai-label, 포커스 스타일) 반영.

## 기술 요청(Next.js 권장)
- 가능하면 **Next.js(App Router) + TypeScript**로 재구성. 라우트: `/`, `/docs/[...slug]`, `/search`, `/auth/login`, `/auth/callback`.
- 글로벌 레이아웃/테마 공급자 분리(`LayoutRoot`, `TopBar`, `SidebarNav`, `OnPageTOC`, `Breadcrumb`, `ThemeToggle`).
- 목데이터는 `prototype/data/*.json`을 import하거나 동일 구조의 mock을 사용. 이후 API 교체가 쉽도록 `lib/api.ts` 등으로 fetch 함수 분리.

## 산출물 기대치
- 반응형(모바일/태블릿/데스크톱) 지원.
- 주요 상호작용(토스트, 스켈레톤, 탭/드롭다운)과 디자인 토큰 적용 예시 포함.
- 코드 내 주석은 최소화하고, 컴포넌트/스타일 계층을 명료하게 나눌 것.
