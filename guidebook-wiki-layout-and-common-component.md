# 0. 전역 레이아웃 & 공통 컴포넌트

> **읽기 가이드:** 먼저 `guidebook-wiki-planning.md`로 전체 방향을 확인하고, 이후 프론트엔드 설계(`guidebook-wiki-frontend-planning-nextjs.md`)를 보기 전에 본 문서로 UI 공통 요소를 정리한다.
## 0-1. 전역 레이아웃 구조

```
+------------------------------------------------------+
| TopBar (글로벌 네비, 로그인 상태, 검색 버튼)         |
+------------------------------------------------------+
| Sidebar (옵션) | MainContent                          |
|               |                                      |
|               |  페이지별 컨텐츠                      |
+------------------------------------------------------+
| Footer (간단한 카피라이트/링크)                      |
+------------------------------------------------------+

```

### 공통 컴포넌트 목록

- `LayoutRoot`
    - TopBar + Footer + children 래핑
- `TopBar`
    - 로고/서비스명 (Guidebook Wiki)
    - 현재 테넌트 이름 표시
    - 검색 버튼(/search 이동)
    - 테마 토글(라이트/다크/오토, 우측)
    - 로그인/유저 메뉴 (로그인 버튼 클릭 시 `/auth/login?redirect=현재경로`로 이동)
- `SidebarNav`
    - `GET /api/wiki/nav` 결과를 트리 형태로 렌더
- `OnPageTOC`
    - 현재 문서 헤딩 기반 우측 목차(스크롤 연동)
- `Breadcrumb`
    - 현재 문서 위치 기준 상단 경로 표시
- `WikiContent`
    - MDX 문자열 → React 컴포넌트로 렌더
- `ActionBlock`
    - 문서 내 플러그인 블록 렌더링
- `LoadingSpinner`, `ErrorBox`
- `ProtectedRoute` 또는 `RequireRole` (Admin 레이아웃에서 사용)

## 0-2. 테마/컬러 모드 (라이트·다크·오토)

- 전역 `ThemeProvider`
    - 모드: `light | dark | system`
    - 초기값: `localStorage` 저장값 우선 → 없으면 `prefers-color-scheme`을 읽어서 system 적용
    - SSR/CSR 전환 시 FOUC 방지를 위해 HTML class를 인라인 스크립트로 선셋팅
- `ThemeToggle` (TopBar 우측)
    - 클릭 시 모드 순환: 라이트 ↔ 다크 ↔ 시스템
    - 현재 모드 표시 아이콘/라벨 포함
- 테넌트 테마 구조
    - **테마 선택 후에도 라이트/다크 팔레트가 모두 정의**되어 있어야 함 (예: `playbook` 테마 라이트/다크)
    - 주요 토큰 샘플(팔레트마다 값 지정):

        | 토큰 키 | 라이트 | 다크 |
        | --- | --- | --- |
        | `--color-bg` | #ffffff | #0f172a |
        | `--color-surface` | #f8fafc | #111827 |
        | `--color-text` | #0f172a | #e5e7eb |
        | `--color-accent` | #2563eb | #60a5fa |
    - 토큰 적용 대상: TopBar, SidebarNav, WikiContent(코드/Callout 포함), Button, Card 등
- 상태 유지
    - 모드 변경 시 `localStorage.setItem('guidebook_theme_mode', mode)` 저장
    - 시스템 모드일 때는 `prefers-color-scheme` 변경 이벤트를 구독해 실시간 반영

---

# 1. 테넌트 홈 `/`

## 1-1. 와이어프레임

```
[TopBar]

--------------------------------------------------------
|                        Hero                          |
|  [테넌트 이름]                                       |
|  간단한 소개 문구                                   |
|  [주요 문서로 가는 버튼들]                          |
--------------------------------------------------------
|  추천 섹션 (선택)                                    |
|  - 인기 문서 리스트                                 |
|  - 최근 업데이트 문서 리스트                        |
--------------------------------------------------------

[Footer]

```

## 1-2. 호출 API

- `GET /api/wiki/nav` (BFF → BE `/api/v1/wiki/nav`)
- (선택) 인기/최근 문서:
    - `GET /api/wiki/pages?path=home` 또는
    - 나중에 `/api/v1/wiki/pages/highlights` 같은 전용 API 추가 가능

## 1-3. 필요한 컴포넌트

- 페이지 컴포넌트: `HomePage`
- `HeroSection`
- `TenantIntroCard`
- `QuickLinksSection`
    - “시작하기”, “API 실전 플레이북 바로가기” 등
- (선택) `HighlightsSection`
    - `PopularDocumentsList`
    - `RecentDocumentsList`

---

# 2. 문서 상세 `/docs/[...slug]`

## 2-1. 와이어프레임

```
[TopBar]

+------------------------------------------------------+---------------------------+
| SidebarNav              |  Breadcrumb                |      OnPageTOC (우측)    |
| (문서 트리, 폴더/문서) |----------------------------|---------------------------|
|                         |  [Page Title]             |  - 현재 문서의 헤딩 목록  |
|                         |  Meta info (updatedAt,    |  - 스크롤 위치 연동       |
|                         |   updatedBy, gateType)    |  - 현재 섹션 강조         |
|                         |---------------------------|  - 클릭 시 해당 섹션 이동 |
|                         |  WikiContent(MDX)         |                           |
|                         |    - 일반 텍스트          |  (오른쪽은 스티키로       |
|                         |    - 코드 블록            |   문서 읽는 동안 따라다님) |
|                         |    - <ActionBlock ...>    |                           |
|                         |---------------------------|                           |
|                         |  Bottom Nav (이전/다음)   |                           |
+------------------------------------------------------+---------------------------+

[Footer]

```

- 우측 인페이지 TOC는 TopBar 아래에서 시작되도록 스티키 오프셋을 두고, 코드/실행 예시가 답답하지 않도록 중앙 컬럼 폭을 넓힌다.

## 2-2. 호출 API

- 최초 렌더 시:
    - `GET /api/wiki/nav`
    - `GET /api/wiki/pages?path={fullPath}`
- 권한 부족인 경우:
    - 응답 에러에서 `gateType` 확인 후 광고/구독/로그인 UI 표시
    - (선택) `/api/wiki/pages/permission?path=...` 먼저 호출 가능

## 2-3. 필요한 컴포넌트

- 페이지 컴포넌트: `DocPage`
- `SidebarNav`
    - `NavTree`, `NavTreeItem`
    - `isUsable=false` 문서는 비활성 스타일(회색/커서 막힘) + 클릭 시 “준비 중입니다” 토스트
- `OnPageTOC` (문서 내 헤딩 기반 인페이지 목차)
    - 스크롤 스파이로 현재 섹션 하이라이트, 우측 스티키 위치 고정
    - 목차 클릭 시 동일 페이지 내 앵커로 스무스 스크롤하며 URL 해시(#섹션ID)를 업데이트 → 해시로 직접 진입 시 해당 섹션으로 초기 스크롤
- `Breadcrumb`
- `PageHeader`
    - title, summary, updatedAt, updatedBy, gateType 뱃지
- `WikiContent`
    - 내부에서 MDX → React 렌더
    - MDX 컴포넌트 매핑:
        - `ActionBlock`
        - `CodeBlock`
        - `CalloutBox` (note, warning 등)
- `ActionBlock`
    - 내부에서 `/api/plugins/configs/{configId}` 호출
    - 타입별:
        - `ApiConsole`
        - `DiagramViewer` (나중)
        - 기타 플러그인
- `BottomPager` (이전/다음 문서 링크)
    - 문서 전환 시 항상 문서 최상단으로 이동하고, 브라우저 뒤로가기로 복귀할 때는 이전 문서의 스크롤 위치를 복원

---

# 3. 검색 `/search`

## 3-1. 와이어프레임

```
[TopBar]

----------------- Search Page -------------------------
[ 검색어 입력창                      ][ Search 버튼 ]

--------------------------------------------------------
검색 결과:
- [문서 제목 1]  (경로, 요약, 태그, 점수)
- [문서 제목 2]
- ...

--------------------------------------------------------

[Footer]

```

## 3-2. 호출 API

- `GET /api/search?q={query}`

## 3-3. 필요한 컴포넌트

- 페이지 컴포넌트: `SearchPage`
- `SearchForm`
- `SearchResultList`
    - `SearchResultItem` (제목, 요약, path)
- (선택) 검색 히스토리/추천 검색어 섹션

---

# 4. 로그인 `/auth/login`

## 4-1. 와이어프레임

```
[TopBar]

--------------------------------------------------------
| [Guidebook 로고]   테넌트명                     [Theme Toggle] |
--------------------------------------------------------
|                    로그인                          |
|  - 이메일/비밀번호 입력 (폼) 또는                 |
|  - 소셜 로그인 버튼들 (Google/GitHub 등)         |
|  [로그인] [소셜 로그인 버튼들]                   |
|  실패 시 에러 메시지, 가입/비밀번호 찾기 링크(옵션)|
--------------------------------------------------------

[Footer]

```

## 4-2. 플로우

1. TopBar의 로그인 버튼 클릭 → `/auth/login?redirect=현재경로`로 이동 (모달/팝업 없음, 전체 페이지 전환)
2. 사용자가 폼 로그인 혹은 소셜 버튼 클릭 → 외부 OAuth 화면 → 백엔드 콜백 → `/auth/callback?token=...&redirect=...` 리다이렉트
3. 이후 `/auth/callback`에서 토큰 저장 및 redirect 처리

## 4-3. 필요한 컴포넌트

- 페이지 컴포넌트: `AuthLoginPage`
- `LoginForm` (이메일/비밀번호 필드, 로그인 버튼)
- `SocialLoginButtons` (구글/GitHub 등)
- `FormErrorMessage`

---

# 5. OAuth 콜백 `/auth/callback`

## 5-1. 와이어프레임

```
[로딩 화면]
"로그인 처리 중입니다..."

(성공 시 자동으로 메인 페이지 or 이전 페이지로 redirect)
(실패 시 에러 메시지 + 다시 시도 버튼)

```

## 5-2. 로직

1. URL 쿼리에서 `token`, `tenant` 등 추출
2. `localStorage.setItem('guidebook_token', token)`
3. 성공 시 지정된 경로로 redirect (`/` 또는 query의 `redirect`)

## 5-3. 필요한 컴포넌트

- 페이지 컴포넌트: `AuthCallbackPage`
- `FullPageSpinner`
- `AuthErrorMessage` (에러 케이스)

---

# 6. Admin Layout `/admin/*`

## 6-1. 와이어프레임

```
[TopBar]

+------------------------------------------------------+
| AdminSidebar        |   Admin Main Content           |
| - Dashboard         |  ---------------------------   |
| - Pages             |   (각 하위 페이지 컨텐츠)      |
| - Plugins           |                               |
| - Settings (옵션)   |                               |
+------------------------------------------------------+

[Footer]

```

## 6-2. 필요한 컴포넌트

- 레이아웃 컴포넌트: `AdminLayout`
    - `RequireRole` (TENANT_ADMIN/EDITOR 체크)
- `AdminSidebar`
    - 메뉴 항목: Dashboard, Pages, Plugins
- `AdminHeader` (선택, admin 내 탭/필터 등)

---

# 7. Admin Pages 리스트 `/admin/pages`

## 7-1. 와이어프레임

```
[AdminLayout]

--------------------------------------------------------
| 좌측: 문서 트리 (편집 모드)                          |
|  - 드래그/드롭으로 순서 변경 (후순위)                |
|
| 우측: 선택한 문서 상세 정보 (간단 메타 + 버튼)       |
|  [제목]                                              |
|  경로(fullPath), gateType, visibility                |
|  [편집하기] [새 하위 문서 추가] [삭제(후순위)]       |
--------------------------------------------------------

```

## 7-2. 호출 API

- `GET /api/wiki/nav` (어드민 모드에서도 동일)
- (선택) `GET /api/wiki/pages/meta?path=...`
    
    트리에서 선택한 문서의 메타만 가져오고 싶을 때
    

## 7-3. 필요한 컴포넌트

- 페이지 컴포넌트: `AdminPagesPage`
- `AdminPageTree`
    - 재사용: `SidebarNav`에서 스타일만 다르게
- `AdminPageDetailPanel`
    - 선택된 문서 정보 표시
    - 액션 버튼:
        - “Edit” → `/admin/pages/{id}/edit`
        - “Add Child Page” → `/admin/pages/new?parent={id}`

---

# 8. Admin Page 신규/수정 `/admin/pages/new`, `/admin/pages/[pageId]/edit`

## 8-1. 와이어프레임

```
[AdminLayout]

--------------------------------------------------------
| 상단: 문서 메타 Form                                 |
|  - Title                                             |
|  - Slug                                             |
|  - Parent 선택 (드롭다운 or 경로 입력)               |
|  - gateType (FREE / AFTER_AD / SUBSCRIBER)          |
|  - visibility                                       |
|  - Icon 선택                                        |
--------------------------------------------------------
| 하단: MDXEditor                                     |
|  -------------------------------------------------  |
|  | [MDXEditor 영역]                               | |
|  | - 헤더/리스트/코드/표 등 편집                  | |
|  | - ActionBlock 같은 MDX 컴포넌트도 텍스트로 삽입 | |
|  -------------------------------------------------  |
--------------------------------------------------------
| [취소] [임시 저장] [저장 후 보기]                   |
--------------------------------------------------------

```

## 8-2. 호출 API

- 신규:
    - `POST /api/admin/wiki/pages`
- 수정:
    - `GET /api/wiki/pages?path=...` or `GET /api/admin/wiki/pages/{id}` (추가 예정)
    - `PUT /api/admin/wiki/pages/{id}`

## 8-3. 필요한 컴포넌트

- 페이지 컴포넌트: `AdminPageEditPage`
- `PageMetaForm`
    - Title input
    - Slug input
    - Parent selector
    - gateType/visibility select
    - Icon picker
- `MdxEditorWrapper`
    - 내부에 `MDXEditor` 실제 인스턴스
    - 상위와 `contentMdx` 문자열로 입/출력
- `FormToolbar`
    - 저장/취소/미리보기 버튼

---

# 9. Admin Plugins `/admin/plugins`

## 9-1. 와이어프레임

```
[AdminLayout]

-------------------- 플러그인 설정 리스트 ------------
[새 플러그인 추가] 버튼

| ConfigId            | Type         | Name                 | 활성  | 편집 |
|---------------------|-------------|----------------------|------|-----|
| kakao-oauth-main    | API_CONSOLE | 카카오 OAuth 콘솔    | ON   | [편집]
| sample-diagram-01   | DIAGRAM     | 예제 시퀀스 다이어그램 | OFF | [편집]
--------------------------------------------------------

(행 클릭 or 편집 버튼 클릭 시 아래 상세 편집)
--------------------------------------------------------
[플러그인 상세 패널]
- 기본 정보 (configId, type, name, description)
- Settings(JSON 에디터 or 폼)
- [저장]
--------------------------------------------------------

```

## 9-2. 호출 API (기획 레벨)

- 리스트:
    - `GET /api/admin/plugins/configs` (백엔드에 추가 필요)
- 단건:
    - `GET /api/plugins/configs/{configId}`
- 생성:
    - `POST /api/admin/plugins/configs`
- 수정:
    - `PUT /api/admin/plugins/configs/{id}`

## 9-3. 필요한 컴포넌트

- 페이지 컴포넌트: `AdminPluginsPage`
- `PluginListTable`
- `PluginDetailForm`
    - Type 선택
    - Name/Description input
    - Settings JSON 편집 or 타입별 폼 (API_CONSOLE용: method/url/headers/bodyTemplate 등)
- (선택) `JsonEditor` (간단한 textarea + JSON validation 정도)

---

# 10. 공통 UI 요소

## 10-1. Feedback

- `ToastManager` (글로벌)
    - 저장 성공/실패 알림
- `ConfirmDialog`
    - 삭제/위험한 작업 시 확인 팝업

## 10-2. 상태 표시

- `LoadingSpinner` / `Skeleton`
- `ErrorBox` (메시지 + 다시 시도 버튼)

---

# 11. 한 번 더 요약 – 화면별 컴포넌트 맵

- **공통**
    - `LayoutRoot`, `TopBar`, `Footer`, `SidebarNav`, `Breadcrumb`, `WikiContent`, `ActionBlock`
- **홈 `/`**
    - `HomePage`, `HeroSection`, `QuickLinksSection`, `HighlightsSection(옵션)`
- **문서 `/docs/[...slug]`**
    - `DocPage`, `PageHeader`, `BottomPager`
- **검색 `/search`**
    - `SearchPage`, `SearchForm`, `SearchResultList`
- **인증 `/auth/login`, `/auth/callback`**
    - `AuthLoginPage`, `LoginForm`, `SocialLoginButtons`, `FormErrorMessage`
    - `AuthCallbackPage`, `FullPageSpinner`, `AuthErrorMessage`
- **Admin 레이아웃 `/admin/*`**
    - `AdminLayout`, `AdminSidebar`, `AdminHeader(옵션)`
- **Admin Pages**
    - `AdminPagesPage`, `AdminPageTree`, `AdminPageDetailPanel`
    - `AdminPageEditPage`, `PageMetaForm`, `MdxEditorWrapper`
- **Admin Plugins**
    - `AdminPluginsPage`, `PluginListTable`, `PluginDetailForm`, `JsonEditor(옵션)`
- **공통 UX**
    - `ToastManager`, `ConfirmDialog`, `LoadingSpinner`, `ErrorBox`

---

이 정도면:

- 프론트 개발자/AI가 “어떤 화면이 있고, 어떤 컴포넌트를 만들어야 하는지” 그림이 명확하고,
- 백엔드 API 문서와도 1:1로 매칭이 잘 되는 상태야.

다음으로 더 하고 싶다면:

- 각 컴포넌트마다 **Props 설계**를 JSON/TS 타입으로 정리해 주거나,
- 실제로 `guidebook-frontend` 레포의 **폴더 구조** (`components`, `app`, `lib`, `hooks` 등)를 설계해볼 수 있어.

원하면 **컴포넌트별 Props 타입 설계**까지 이어서 해보자.