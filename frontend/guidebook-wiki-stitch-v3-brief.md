# Guidebook Wiki Stitch V3 Brief

작성일: 2026-03-29 (KST)

## 목적
- 현재 Next 프로젝트의 첫 진입면을 기준으로 Stitch에 2차 리디자인을 요청한다.
- 이번 요청은 시각 피드백만이 아니라, **고정밀 시안 + React/Tailwind 코드**를 함께 받아 Next 프레젠테이션 계층에 섹션 단위로 흡수하는 것을 목표로 한다.
- source of truth는 현재 Next의 route, API contract, state gate다. Stitch는 구조를 갈아엎는 도구가 아니라 이를 더 제품답게 재구성하는 디자인 파트너로 사용한다.

## Source of truth
- 현재 Next 구현과 캡처
- `frontend/guidebook-wiki-frontend-api-sync.md`
- `frontend/guidebook-wiki-redesign-v2-brief.md`
- 로컬 캡처/리포트: `.local/guidebook-wiki/reports/redesign-reference-pack.md`
- seeded 데이터 예시: `.local/guidebook-wiki/reports/normalized-demo-content.json`
- Lovable reference:
  - `lovable-response/src/pages/Index.tsx`
  - `lovable-response/src/pages/DocsPage.tsx`
  - `lovable-response/src/pages/SearchPage.tsx`
  - `lovable-response/src/components/layout/TopBar.tsx`

## Locked constraints
- 백엔드 API 계약은 추가하지 않는다.
  - `GET /api/home`
  - `GET /api/users/me`
  - `GET /api/tenants/me`
  - `GET /api/tenants/{tenantId}`
  - `GET /api/guidebooks`
- route는 유지한다.
  - `/introduce`
  - `/`
  - `/tenant/[tenantId]`
  - `/login`
  - `/auth`
- reader/search/admin route는 유지하되, 이번 Stitch 핵심 범위에서는 제외한다.
- tenant는 workspace hub route에서는 path segment, 나머지 surface에서는 context로 유지한다.
- editor 본체, 파일/VOD, 권한 편집 UI는 이번 범위 밖이다.

## Request scope
1. Global header / shell
2. `/introduce`
3. `/`
4. `/tenant/[tenantId]`
5. Login / auth-required state
6. Signed-out tenant gate

## Design direction
- 목표 톤: modern knowledge product, clean, product-grade, not old wiki
- 가져올 것:
  - workspace 공간감
  - 검색 중심 docs shell
  - reader/product feel
- 버릴 것:
  - 콘솔풍 무드
  - 오래된 위키 인상
  - 약한 브랜드 위계
  - 카드 남발
- 로그인 전후의 제품 구성이 명확히 달라야 한다.
- `/`는 개인 홈, `/tenant/[tenantId]`는 특정 워크스페이스 허브로 확실히 구분되어야 한다.

## Deliverables
- Light/Dark 동등 품질
- 데스크톱 우선, 모바일 대응 포함
- 공통 header/shell
- `/introduce`, `/`, `/tenant/[tenantId]`, 로그인/tenant gate 시안
- 각 화면의 **React/Tailwind 코드**

## Code absorption targets
- `nextjs/src/shared/layout/global-header.tsx`
- `nextjs/src/features/introduce/introduce-experience.tsx`
- `nextjs/src/features/home/home-dashboard.tsx`
- `nextjs/src/features/tenant/tenant-workspace-experience.tsx`
- `nextjs/src/features/home/home-signed-out-gate.tsx`

## Absorption rules
- Stitch 코드는 **section reference code**로 취급한다.
- Next App Router 구조, auth bridge, tenant context, permission gate는 유지한다.
- Stitch 산출물은 페이지 통째 교체가 아니라, header/hero/list/rail 같은 섹션 단위로만 흡수한다.
- 데이터 바인딩과 mutation은 기존 Next 서버 로더와 타입을 그대로 사용한다.

## Acceptance
- 현재 Next보다 첫인상과 정보 위계가 명확히 강해야 한다.
- Lovable보다 더 정제됐지만 workspace 제품감은 유지돼야 한다.
- 로그인 전/후, tenant gate 상태가 디자인 안에서 자연스럽게 드러나야 한다.
- Stitch 코드가 현재 Next 프레젠테이션 계층에 바로 흡수 가능한 수준이어야 한다.
