# Guidebook Frontend 구현 가이드 (Codex용)
## 1. 기술 스택 & 기본 규칙

- 프레임워크: **Next.js (App Router)**
- 언어: **TypeScript**
- 스타일: **Tailwind CSS**
- UI 라이브러리: **shadcn/ui** 기반 (Button, Card, Input, Dialog 등 사용)
- 상태 관리:
    - 복잡한 전역 상태 라이브러리(X)
    - **SWR + React hooks** 중심
- 빌드/런타임:
    - Node 18+ 기준

---

## 2. 폴더 구조 가이드

대략 아래 구조를 기준으로 구현해줘:

```
src/
  app/
    layout.tsx
    page.tsx                   # /
    docs/
      [...slug]/
        page.tsx               # /docs/...
    search/
      page.tsx                 # /search
    auth/
      callback/
        page.tsx               # /auth/callback
    admin/
      layout.tsx               # /admin 공통 레이아웃
      page.tsx                 # /admin dashboard
      pages/
        page.tsx               # /admin/pages
        new/
          page.tsx             # /admin/pages/new
        [pageId]/
          edit/
            page.tsx           # /admin/pages/{id}/edit
      plugins/
        page.tsx               # /admin/plugins

    api/
      wiki/
        nav/route.ts           # BFF: /api/wiki/nav
        pages/route.ts         # BFF: /api/wiki/pages
      search/route.ts          # BFF: /api/search
      plugins/
        configs/
          [configId]/route.ts  # BFF: /api/plugins/configs/{configId}
      auth/
        me/route.ts            # BFF: /api/auth/me
      notifications/
        fcm-token/route.ts     # (후순위) FCM 토큰 등록

  components/
    layout/
      LayoutRoot.tsx
      TopBar.tsx
      Footer.tsx
      SidebarNav.tsx
      Breadcrumb.tsx
    wiki/
      WikiContent.tsx
      PageHeader.tsx
      BottomPager.tsx
      ActionBlock.tsx
    admin/
      AdminLayout.tsx
      AdminSidebar.tsx
      AdminPageTree.tsx
      AdminPageDetailPanel.tsx
      PageMetaForm.tsx
      MdxEditorWrapper.tsx
      PluginListTable.tsx
      PluginDetailForm.tsx
    common/
      LoadingSpinner.tsx
      ErrorBox.tsx
      ToastManager.tsx
      ConfirmDialog.tsx

  lib/
    api/
      fetcher.ts               # 기본 fetch 래퍼
      fetchWithAuth.ts         # Authorization 헤더 포함 래퍼
    auth/
      token.ts                 # 토큰 read/write 유틸
    tenant/
      tenant.ts                # host → tenantCode 파싱 유틸
    mdx/
      compileMdx.ts            # MDX → React 컴포넌트 유틸

  hooks/
    useAuthToken.ts
    useMe.ts
    useTenant.ts

```

> 위 구조는 가이드일 뿐이지만, 가능하면 이대로 생성해줘.
> 

---

## 3. 환경 변수 & 백엔드 호출 규칙

### 3-1. 환경 변수

`.env.local` 예시:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080  # guidebook-backend
NEXT_PUBLIC_DEFAULT_TENANT=playbook             # 로컬 개발용 기본 테넌트

```

규칙:

- BFF(Route handlers)는 **항상** `process.env.NEXT_PUBLIC_API_BASE_URL`를 읽어서
    
    `BE_BASE_URL + "/api/v1/..."` 형태로 백엔드 호출을 만들 것.
    

예시:

```tsx
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

await fetch(`${BASE_URL}/api/v1/wiki/nav`, { ... });

```

---

## 4. 인증 & 토큰 사용 규칙

### 4-1. 토큰 저장

- JWT는 **localStorage**에 저장.
- key 이름은 **`guidebook_token`** 로 고정.

```tsx
// 저장
localStorage.setItem('guidebook_token', token);

// 읽기
const token = localStorage.getItem('guidebook_token');

```

### 4-2. 훅 & fetch 래퍼

- `useAuthToken()` 훅:
    - 브라우저 환경에서 localStorage에서 토큰 읽어오기.
- `fetchWithAuth(url, options)`:
    - `useAuthToken()` 또는 전달받은 토큰을 사용해서
    - `Authorization: Bearer ${token}` 헤더를 항상 붙여서 호출.

```tsx
export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const token = /* localStorage or parameter */;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${baseUrl}${path}`, { ...options, headers });
}

```

※ 정확한 구현은 자유지만, **“모든 인증 필요 API 호출은 Authorization 헤더 기반”** 이라는 점을 지켜줘.

---

## 5. 테넌트 추출 규칙

### 5-1. 프로덕션

- 도메인: `https://{tenant}.guidebook.wiki`
- 예: `https://playbook.guidebook.wiki` → `tenantCode = "playbook"`

### 5-2. 로컬 개발

- 기본:
    - `http://localhost:3000` 에서 접속할 때,
    - 쿼리 `?tenant=playbook` 이 있으면 그걸 우선.
    - 없으면 `.env`의 `NEXT_PUBLIC_DEFAULT_TENANT` 사용.

### 5-3. 유틸 함수 요구

- `lib/tenant/tenant.ts`에 아래 기능을 구현:

```tsx
export function getTenantFromHost(host: string): string {
  // 프로덕션: playbook.guidebook.wiki → "playbook"
  // 서브도메인 없는 경우(로컬 등)는 NEXT_PUBLIC_DEFAULT_TENANT 사용
}

```

- BFF(Route handlers)에서는:
    - `req.headers.get('host')`를 읽어서 `tenantCode` 추출
    - 백엔드 호출 시 항상 `X-Tenant: {tenantCode}` 헤더를 추가해서 호출할 것.

---

## 6. UX 최소 요구사항 (Loading/에러/토스트)

AI가 반드시 지켜야 하는 최소 UX:

1. **로딩 상태**
    - API 호출 중에는 각 화면/컴포넌트에서 `LoadingSpinner` 또는 Skeleton 표시.
2. **에러 처리**
    - API 실패 시 `ErrorBox` 또는 에러 메시지 영역 출력.
    - 콘솔 로그만 찍고 끝내지 말 것.
3. **저장/수정 성공 토스트**
    - 문서 저장/플러그인 설정 변경 등, **쓰기 요청 성공 시**:
        - 상단에 토스트(`ToastManager`)로 “저장되었습니다” 같은 메시지 보여줄 것.
4. **권한 에러**
    - 문서 조회 시 403/권한 부족이 발생하면:
        - “권한이 필요합니다”, “구독/광고 후 접근 가능” 등의 안내 영역을 렌더링만 해주면 됨.
            
            (실제 광고/결제/구독 로직은 미구현이어도 괜찮음)
            

---

이 6개 항목이 **“구현 디테일 가드레일”** 이고,

앞에서 만든:

- 전체 기획서
- API 스펙 문서 (백엔드)
- 화면별 와이어프레임 & 컴포넌트 목록

이 셋을 같이 붙여주면, Codex가 **guidebook-frontend 초기 버전**은 충분히 뽑을 수 있을 거야.

이제 이 문서 복붙해서,

“이 가이드와 아래 기획/스펙을 바탕으로 Next.js 프로젝트 코드를 생성해줘”

라고 단계별로 시키면 될 듯 👌