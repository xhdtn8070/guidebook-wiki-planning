# Guidebook Wiki Frontend API Sync

작성일: 2026-03-29 (KST)

## 기준
- 프론트 기준 계약은 `guidebook-wiki-backend/master`의 `/api` 엔드포인트다.
- 예전 planning 문서의 `/api/v1/...` 전제는 더 이상 사용하지 않는다.
- Next 프론트는 page route를 canonical route로 고정한다.
  - 읽기: `/guidebooks/[guidebookId]/pages/[pageId]?tenantId={tenantId}`
  - 관리 진입: `/admin/guidebooks/[guidebookId]?tenantId={tenantId}`
  - 페이지 관리 진입: `/admin/pages/[pageId]?tenantId={tenantId}`

## 화면별 매핑

| 화면 | Next 경로 | Backend API | 필수 컨텍스트 | 실패 상태 |
| --- | --- | --- | --- | --- |
| 홈 | `/` | `GET /api/home` | `Authorization` | 로그인 게이트 |
| 검색 | `/search?q=&tenantId=` | `GET /api/search/pages` | `Authorization`, `X-Tenant-Id` | 로그인 게이트, tenant 게이트, 빈 결과 |
| 문서 읽기 | `/guidebooks/[guidebookId]/pages/[pageId]?tenantId=` | `GET /api/pages/{pageId}`, `GET /api/wiki/nav?guidebookId=` | `Authorization`, `X-Tenant-Id` | 로그인 게이트, tenant 게이트, not found |
| 세션 | `/me` | `GET /api/users/me`, `GET /api/tenants/me` | `Authorization` | 비로그인 요약 |
| 가이드북 관리 진입 | `/admin/guidebooks/[guidebookId]?tenantId=` | `GET /api/guidebooks`, `GET /api/guidebooks/{guidebookId}/pages`, `GET /api/guidebooks/{guidebookId}/permissions/me` | `Authorization`, `X-Tenant-Id` | tenant 게이트, 권한 게이트 |
| 페이지 관리 진입 | `/admin/pages/[pageId]?tenantId=` | `GET /api/pages/{pageId}`, `GET /api/pages/{pageId}/permissions/me` | `Authorization`, `X-Tenant-Id` | tenant 게이트, 권한 게이트 |

## 세션/BFF 규칙
- 토큰 저장은 browser storage가 아니라 Next httpOnly cookie를 사용한다.
- 로그인 시작은 `/api/session/oauth/[provider]`에서 처리한다.
  - 내부적으로 backend `/api/oauth/{provider}/login`으로 redirect
  - 복귀 경로는 cookie에 저장
- 로그인 완료는 `/auth#ticket=...`에서 처리한다.
  - 내부적으로 Next `/api/session/exchange-ticket`
  - backend `/api/auth/exchange-ticket` 호출 후 쿠키 저장
- tenant 선택은 `/api/session/tenant`에서 쿠키로 관리한다.

## POC HTML 대응

| 기존 HTML 예제 | 역할 | Next 대응 |
| --- | --- | --- |
| `/oauth/login` | provider 선택 | `/login`, `/api/session/oauth/[provider]` |
| `/auth` | ticket 교환 | `/auth`, `/api/session/exchange-ticket` |
| `/poc/wiki` | guidebook/page 목록 | `/admin/guidebooks/[guidebookId]` |
| `/poc/viewer` | pageId 기반 뷰어 | `/guidebooks/[guidebookId]/pages/[pageId]` |
| `/poc/editor` | page update / file insert 실험 | `/admin/pages/[pageId]` |

## 설계 메모
- backend가 내려주는 URL(`/t/{tenantId}/g/{guidebookId}/p/{pageId}`)은 그대로 쓰지 않고, 프론트 헬퍼에서 canonical route로 변환한다.
- page detail은 `page + navContext`, nav는 별도 `wiki/nav` 호출로 조합한다.
- section renderer는 backend `GuidebookSection` 구조를 그대로 따른다.
- 이번 단계에서는 editor 본체와 고급 파일/VOD UI를 구현하지 않는다. 관리 진입/gate까지만 맞춘다.
