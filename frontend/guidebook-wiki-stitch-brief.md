# Guidebook Wiki Stitch Brief

작성일: 2026-03-29 (KST)

## Product intent
- 내부 위키/문서 도구다.
- 가장 중요한 경험은 `읽기`, `탐색`, `검색`, `권한 상태 인지`다.
- 랜딩 페이지처럼 보이기보다, 차분한 product surface로 보여야 한다.

## Locked constraints
- API 계약은 이미 잠겨 있다.
  - `GET /api/home`
  - `GET /api/wiki/nav`
  - `GET /api/search/pages`
  - `GET /api/pages/{pageId}`
  - `GET /api/users/me`
  - `GET /api/tenants/me`
- canonical route는 다음 기준을 유지해야 한다.
  - 읽기: `/guidebooks/[guidebookId]/pages/[pageId]`
  - 검색: `/search`
  - 로그인: `/login`
  - 세션 브리지: `/auth`
  - 관리 진입: `/admin/guidebooks/[guidebookId]`, `/admin/pages/[pageId]`
- tenant는 경로가 아니라 context다. UI에서 선택/유지되지만 route 주체는 아니다.

## frontend-skill 기준

### Visual thesis
- quiet editorial control room
- 낮은 채도, 높은 가독성, cardless에 가까운 product layout
- 문서 본문은 에디토리얼, 나머지 조작면은 restrained operational UI

### Content plan
- 홈: 최근 문서, starred, notifications, workspace rail
- 읽기: 좌측 nav, 중앙 reader, 우측 toc
- 검색: 큰 검색 입력, 리스트형 결과, 상태 설명 rail
- 권한 게이트: 로그인 필요 / tenant 필요 / 권한 없음
- 관리 진입: page list, permission gate, raw payload preview

### Interaction thesis
- sticky header + sticky nav/toc
- 검색 우선 접근
- tenant 변경 시 상태가 명확하게 드러나야 함
- 과한 애니메이션보다 부드러운 reveal, hover, section entrance 정도만 허용

## Must-have screens
1. Signed-out home
2. Signed-in home
3. Search with results
4. Search empty/gated states
5. Reader layout
6. Login + auth bridge states
7. Admin guidebook entry
8. Admin page entry

## Avoid
- 대시보드 카드 모자이크
- 랜딩 페이지식 카피 과다
- 여러 accent color 경쟁
- 무거운 gradient background로 제품 UI를 덮는 방식
- 데이터 계약이 늘어나는 제안

## Existing references
- backend `/oauth/login` HTML
- backend `/auth` ticket exchange HTML
- backend `/poc/wiki`, `/poc/viewer`, `/poc/editor`

이 레퍼런스들은 시각 정답이 아니라 interaction truth로 사용한다.
- provider login 시작 방식
- auth ticket 처리 단계
- pageId 중심 viewer/editor 흐름
- tenant/token 의존성
