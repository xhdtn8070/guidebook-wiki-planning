# Guidebook Wiki Redesign V2 Brief

작성일: 2026-03-29 (KST)

## 목적
- 현재 Next 프로젝트를 기준으로 2차 리디자인을 요청한다.
- 이번 요청은 시각 재해석만이 아니라, 소개 → 워크스페이스 → 리더로 이어지는 정보 구조를 더 제품답게 다듬는 데 초점을 둔다.
- 목표는 “예쁜 시안”이 아니라 실제 Next 프로젝트의 완성도를 올릴 수 있는 full-flow 디자인 세트를 받는 것이다.

## Source of truth
- 현재 Next 구현과 캡처
- `frontend/guidebook-wiki-frontend-api-sync.md`
- 로컬 비교 팩: `.local/guidebook-wiki/reports/redesign-reference-pack.md`
- 실제 seed 이후 데이터 예시: `.local/guidebook-wiki/reports/normalized-demo-content.json`

## Locked constraints
- 백엔드 API 계약은 추가하지 않는다.
  - `GET /api/home`
  - `GET /api/wiki/nav`
  - `GET /api/search/pages`
  - `GET /api/pages/{pageId}`
  - `GET /api/users/me`
  - `GET /api/tenants/me`
  - permission endpoints
- canonical route는 유지한다.
  - `/introduce`
  - `/`
  - `/tenant/[tenantId]`
  - `/onboarding`
  - `/search`
  - `/guidebooks/[guidebookId]/pages/[pageId]`
  - `/login`
  - `/auth`
  - `/admin/guidebooks/[guidebookId]`
  - `/admin/pages/[pageId]`
- tenant는 reader/search/admin에서 context를 유지하고, workspace hub에서는 `/tenant/[tenantId]` segment로 표현한다.
- editor 본체, 파일/VOD, 권한 편집 UI는 이번 범위 밖이다.

## Screen scope
1. `/introduce` signed-out 제품 소개
2. `/` signed-in 통합 workspace home
3. `/tenant/[tenantId]` workspace hub
4. `/onboarding` 최소 생성 플로우
5. Search results
6. Search empty state
7. Search auth gate
8. Search tenant gate
9. Reader layout
10. Login
11. Auth bridge
12. Admin guidebook entry
13. Admin page entry
14. Permission denied / auth-required states

## Visual direction
- Lovable의 제품형 docs shell 감각은 유지한다.
- 다만 과한 콘솔/개발자 무드와 복고적인 위키 인상은 줄인다.
- 더 밝고 정제된 modern minimal docs UI로 간다.
- 얇은 보더, 절제된 accent, 높은 가독성, 더 강한 정보 위계를 원한다.
- 랜딩 페이지처럼만 보이지 않고, 첫 방문 순간부터 “문서 제품”의 성격이 읽혀야 한다.

## Mode strategy
- Light/Dark를 동등한 품질로 설계한다.
- Light가 단순한 파생 모드가 아니고, 독립적으로 완성된 세트여야 한다.
- Dark도 제품형 문서 셸의 밀도를 유지하되, 과한 콘솔 분위기로 흐르면 안 된다.

## What to keep
- Lovable의 상단 검색 중심 구조
- 좌측 nav / 중앙 reader / 우측 TOC의 docs shell
- 로그인과 리더가 같은 제품 안에서 이어지는 느낌
- 상태 화면도 placeholder가 아니라 의도된 제품 화면처럼 보이게 만드는 접근

## What to remove
- 과한 레트로 콘솔 무드
- 위키보다 오래된 관리자 도구처럼 보이는 인상
- 카드가 과도하게 분절된 화면
- 데이터 계약을 늘려야만 성립하는 디자인 제안

## Design asks
- 홈은 current Next보다 더 강한 first impression이 필요하다.
- `/introduce`는 제품 정체성과 workspace model을 한 번에 설명해야 한다.
- `/`는 개인화된 통합 허브로, `/tenant/[tenantId]`는 특정 워크스페이스 허브로 명확히 달라 보여야 한다.
- 검색은 결과 리스트 자체가 제품의 중심 기능처럼 보여야 한다.
- 리더는 breadcrumb, metadata, actions, nav, toc가 자연스럽게 정리된 docs product shell이어야 한다.
- onboarding, 로그인, tenant, permission gate는 placeholder가 아니라 의도된 상태 화면처럼 디자인해야 한다.
- 관리자 진입 화면도 단순 표가 아니라 실제 운영면의 시작점처럼 보여야 한다.

## Acceptance
- 현재 API 계약 위에서 바로 구현 가능해야 한다.
- Light/Dark 둘 다 제공되어야 한다.
- 로그인 전/후, tenant 없음, 권한 없음, 결과 없음 상태가 빠지지 않아야 한다.
- current Next보다 introduce, home, search의 첫인상이 명확히 강해야 한다.
- reader가 docs product로 읽히는 shell 완성도를 가져야 한다.
