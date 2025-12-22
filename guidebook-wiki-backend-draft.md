# Guidebook Backend API v1 (Draft)

> **읽기 가이드:** 플랫폼 비전과 프론트 IA는 `guidebook-wiki-planning.md`와 `guidebook-wiki-frontend-planning-nextjs.md`를 먼저 확인하고, DB 스키마는 `guidebook-wiki-database-planning-postgresql.md`와 함께 보면 필드/엔티티 정합성을 점검하기 쉽다.
- 서비스: **Guidebook Wiki**
- 베이스 URL 예시:
    - `https://api.guidebook.wiki/api/v1/...`
- 인증:
    - OAuth 로그인 → 서버에서 JWT 발급
    - 클라이언트는 `Authorization: Bearer <JWT>` 헤더로 전달
- 테넌트:
    - 프론트(Next)가 서브도메인에서 추출 → `X-Tenant: <tenantCode>` 헤더로 전달
        
        (모든 위키 관련 API에 필수)
        

---

## 0. 공통 규칙

### 0.1. 공통 헤더

- `X-Tenant: string`
    - 예: `playbook`, `acme`
    - 어떤 테넌트(위키)를 대상으로 요청하는지 표시
- `Authorization: Bearer <JWT>` (선택 / 상황에 따라 필수)
    - 로그인 후 요청에 사용
- `Content-Type: application/json`
- `Accept: application/json`

### 0.2. 공통 응답 포맷

가능하면 통일된 래퍼 형태 사용:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}

```

에러일 때:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PAGE_NOT_FOUND",
    "message": "문서를 찾을 수 없습니다.",
    "details": null
  }
}

```

- `code`: 기계가 쓰기 쉬운 에러 코드
- `message`: 사용자/로그용 메시지
- `details`: 필요 시 추가 정보

---

## 1. 인증 / 유저

1뎁스에서는 **B2C OAuth + 내부 JWT**만 쓴다.

OIDC SSO(B2B)는 나중에.

### 1.1. OAuth 로그인 시작

**[GET] `/api/v1/auth/oauth/{provider}/start`**

- 설명:
    - 프론트가 이 엔드포인트를 호출해서 **외부 로그인 화면으로 리다이렉트** 시킨다.
- Path 변수:
    - `provider`: `google`, `github`, `kakao` 등 (지원 목록 내부 관리)
- Query:
    - `redirectUri` (optional): 로그인 이후 돌아올 프론트 URL
        
        예: `https://app.guidebook.wiki/auth/callback`
        
- 플로우:
    1. 프론트에서 `window.location`을 이 URL로 보냄
    2. 백엔드가 외부 OAuth 인증 화면으로 302 리다이렉트

응답: 302 Redirect (JSON 응답 없음)

---

### 1.2. OAuth 콜백 (서버 → 프론트로 JWT 전달)

**[GET] `/api/v1/auth/oauth/{provider}/callback`**

- 설명:
    - 외부 OAuth 서버에서 백엔드로 리다이렉트될 때 호출.
    - 백엔드는 토큰을 교환하고, 내부 유저 생성/매핑 후 JWT를 만든다.
    - 그 다음 프론트로 다시 리다이렉트하면서 JWT를 전달.
- Query (OAuth 서버가 넘기는 값들):
    - `code`, `state` 등 (provider별로 다름)
- 처리 로직:
    1. provider별 OAuth 토큰 교환
    2. 외부 유저 정보 → 내부 User 테이블과 매핑
        - 없으면 생성, 있으면 조회
    3. Guidebook 내부 JWT 생성
    4. **프론트 콜백 URL**로 다시 리다이렉트
        - 예: `https://app.guidebook.wiki/auth/callback?token=xxx&tenant=playbook`

응답: 302 Redirect

> 이 부분은 나중에 보안/UX 고려해서
> 
> 
> 쿼리 대신 `code`를 내려주고, 프론트가 그 `code`로 `/auth/token`을 다시 치게 하는 방식도 가능.
> 
> v1에서는 “JWT를 쿼리로 보내고, 프론트가 즉시 저장 후 제거” 컨셉만 정리해 두자.
> 

---

### 1.3. 현재 유저 정보 조회

**[GET] `/api/v1/auth/me`**

- 설명:
    - 현재 JWT 기준으로 유저 정보를 조회.
- 헤더:
    - `Authorization: Bearer <JWT>`

응답 예:

```json
{
  "success": true,
  "data": {
    "userId": "u_12345",
    "displayName": "홍길동",
    "email": "user@example.com",
    "roles": ["USER"],
    "tenants": [
      {
        "tenantCode": "playbook",
        "role": "TENANT_ADMIN"
      }
    ]
  },
  "error": null
}

```

- 필드 설명 추가:
    - `isUsable` (boolean, default: `true`): 문서가 아직 준비되지 않았을 때 `false`. 프론트는 항목을 비활성화하고 클릭 시 “준비 중입니다” 토스트를 표시하며, 트리 구조/순서는 그대로 유지한다.

---

## 2. 위키 구조(목차) API

앞서 말한 것처럼 **구조/컨텐츠/권한**을 분리한다.

### 2.0. 문서 그룹 조회

**[GET] `/api/v1/wiki/groups`**

- 설명: 하나의 테넌트에 여러 위키 그룹(예: "API 가이드", "운영 핸드북")을 둘 수 있으므로, 최상단 드롭다운에서 고를 수 있도록 전체 그룹 메타 정보를 내려준다.
- 헤더: `X-Tenant: <tenantCode>`
- 응답 필드 예시:

```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "api-guide",
        "name": "API 가이드",
        "slug": "api-guide",
        "order": 0,
        "status": "PUBLISHED",
        "defaultDocId": "page_1",
        "isUsable": true
      },
      {
        "id": "ops-handbook",
        "name": "운영 핸드북",
        "slug": "ops-handbook",
        "order": 1,
        "status": "PUBLISHED",
        "defaultDocId": "ops_home",
        "isUsable": true
      }
    ]
  },
  "error": null
}
```

- 비고: 그룹 상태(`isUsable=false` 혹은 `status=COMING_SOON`)일 경우 프론트에서 드롭다운을 비활성화하고 토스트로 안내한다.

### 2.1. 전체 네비게이션 트리 조회

**[GET] `/api/v1/wiki/nav`**

- 설명:
    - 해당 테넌트·그룹의 전체 문서 트리(목차 구조)를 가져온다.
    - 내용(MDX)은 포함하지 않고, **구조 + 메타 정보**만 전달.
    - 문서 준비 상태는 `isUsable`(boolean)로 구분해 프론트에서 비활성 처리할 수 있게 한다.
- 헤더:
    - `X-Tenant: <tenantCode>`
    - `Authorization` (선택: 비공개 문서 여부에 따라 다르게 내려줄 수도 있음. v1에서는 그냥 구조 전체 내려줘도 됨)

Query (옵션):

- `groupId` (필수): 어떤 위키 그룹의 네비게이션을 가져올지 지정한다. 없으면 `400`.
- `depth`: 숫자 (예: `2`) – 너무 깊이까지 안 가져오고 싶을 때 (v1은 전체 가져오기 우선)

응답 예:

```json
{
  "success": true,
  "data": {
    "groupId": "api-guide",
    "nodes": [
      {
        "id": "page_1",
        "title": "카카오 OAuth 가이드",
        "fullPath": "kakao/oauth",
        "parentId": null,
        "depth": 0,
        "orderInParent": 0,
        "iconKey": "kakao",
        "gateType": "FREE",
        "visibility": "PUBLIC",
        "isUsable": true,
        "children": [
          {
            "id": "page_2",
            "title": "개요",
            "fullPath": "kakao/oauth/intro",
            "parentId": "page_1",
            "depth": 1,
            "orderInParent": 0,
            "iconKey": "doc",
            "gateType": "FREE",
            "visibility": "PUBLIC",
            "isUsable": true,
            "children": []
          },
          {
            "id": "page_3",
            "title": "API 콘솔",
            "fullPath": "kakao/oauth/console",
            "parentId": "page_1",
            "depth": 1,
            "orderInParent": 1,
            "iconKey": "play",
            "gateType": "FREE",
            "visibility": "PUBLIC",
            "isUsable": true,
            "children": [
              {
                "id": "page_3_1",
                "title": "실행 예시",
                "fullPath": "kakao/oauth/console/run",
                "parentId": "page_3",
                "depth": 2,
                "orderInParent": 0,
                "iconKey": "code",
                "gateType": "FREE",
                "visibility": "PUBLIC",
                "isUsable": true,
                "children": []
              },
              {
                "id": "page_3_2",
                "title": "SDK 연동 (준비 중)",
                "fullPath": "kakao/oauth/console/sdk",
                "parentId": "page_3",
                "depth": 2,
                "orderInParent": 1,
                "iconKey": "sdk",
                "gateType": "FREE",
                "visibility": "PUBLIC",
                "isUsable": false,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  "error": null
}

```

---

## 3. 문서 컨텐츠 API

### 3.1. 문서 조회 (권한 체크 포함)

**[GET] `/api/v1/wiki/pages`**

- 설명:
    - 특정 경로의 문서 MDX 컨텐츠와 메타정보를 가져온다.
    - 내부에서 **권한 체크를 같이 수행**한다.
- 헤더:
    - `X-Tenant: <tenantCode>`
    - `Authorization` (선택, 권한 필요 문서일 경우 필수)
- Query:
    - `groupId`: 문서가 속한 그룹 ID (필수, 동일 `fullPath`를 다른 그룹이 재사용할 수 있음)
    - `path`: 문서의 `fullPath`
        - 예: `/api/v1/wiki/pages?groupId=api-guide&path=kakao/oauth/intro`

성공 응답 예 (열람 가능):

```json
{
  "success": true,
  "data": {
    "id": "page_2",
    "title": "개요",
    "fullPath": "kakao/oauth/intro",
    "summary": "카카오 OAuth 전체 흐름 개요",
    "contentMdx": "# 카카오 OAuth 개요\n\n여기에 MDX 본문...",
    "gateType": "AFTER_AD",
    "visibility": "PUBLIC",
    "iconKey": "doc",
    "updatedAt": "2025-01-01T10:00:00Z",
    "updatedBy": {
      "userId": "u_12345",
      "displayName": "홍길동"
    },
    "permission": {
      "canView": true,
      "reason": null
    }
  },
  "error": null
}

```

권한 부족 응답 예:

- HTTP status: `403`
- Body:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESTRICTED",
    "message": "이 문서를 보기 위한 권한이 없습니다.",
    "details": {
      "gateType": "AFTER_AD",
      "required": "WATCH_AD_OR_SUBSCRIBE"
    }
  }
}

```

프론트는 `error.details.gateType`를 보고

광고 UI or 구독 유도 UI를 보여줄 수 있음.

---

### 3.2. 문서 메타만 조회 (Optional)

**[GET] `/api/v1/wiki/pages/meta`**

- 설명:
    - `contentMdx`를 제외한 메타 정보만 가져오고 싶을 때.
    - SSR에서 SEO 용도로 쓰거나, 목록/상단 정보만 먼저 그리고 싶을 때.
- Query:
    - `groupId`
    - `path`

응답 구조는 `/wiki/pages`와 동일하지만 `contentMdx`는 `null` 혹은 미포함.

---

## 4. 권한 체크 API (별도)

프론트에서 **먼저 권한 체크**만 하고,

그 결과에 따라 광고/로그인/구독 화면을 보여준 뒤

필요할 때 다시 컨텐츠 조회를 치는 플로우를 원할 수 있음.

### 4.1. 문서 권한 체크

**[GET] `/api/v1/wiki/pages/permission`**

- 설명:
    - 현재 유저가 특정 문서를 볼 수 있는지 여부만 체크.
- 헤더:
    - `X-Tenant`
    - `Authorization` (선택)
- Query:
    - `groupId`
    - `path`

응답 예:

```json
{
  "success": true,
  "data": {
    "path": "kakao/oauth/intro",
    "gateType": "AFTER_AD",
    "visibility": "PUBLIC",
    "permission": {
      "canView": false,
      "reason": "NEED_AD_OR_SUBSCRIPTION"
    }
  },
  "error": null
}

```

---

## 5. 문서 편집/관리 API (어드민용 v1)

완전한 CMS 수준까지는 아니더라도,

최소한 **문서를 만들고 수정할 수 있는 API**는 필요.

### 5.1. 문서 생성

**[POST] `/api/v1/admin/wiki/pages`**

- 설명:
    - 테넌트 어드민이 새로운 문서를 생성.
- 헤더:
    - `X-Tenant`
    - `Authorization` (테넌트 어드민 권한 필요)

요청 Body 예:

```json
{
  "title": "카카오 OAuth 개요",
  "parentId": "page_1",        // null이면 루트
  "slug": "intro",             // fullPath = parent.fullPath + "/" + slug
  "summary": "카카오 OAuth 전체 흐름의 개요를 설명합니다.",
  "contentMdx": "# 카카오 OAuth 개요\n\n...",
  "gateType": "FREE",
  "visibility": "PUBLIC",
  "iconKey": "doc",
  "orderInParent": 0
}

```

응답:

```json
{
  "success": true,
  "data": {
    "id": "page_2",
    "fullPath": "kakao/oauth/intro"
  },
  "error": null
}

```

---

### 5.2. 문서 수정

**[PUT] `/api/v1/admin/wiki/pages/{pageId}`**

- 설명:
    - 기존 문서의 메타/내용 수정.
- Path:
    - `pageId`
- Body (부분 수정 허용):

```json
{
  "title": "카카오 OAuth 개요 (수정본)",
  "summary": "더 보완된 설명",
  "contentMdx": "# 수정된 카카오 OAuth 개요\n\n...",
  "gateType": "AFTER_AD"
}

```

응답: 수정된 문서 기본 정보 반환.

---

### 5.3. 문서 이동/정렬 (Optional)

**[POST] `/api/v1/admin/wiki/pages/{pageId}/move`**

- Body:

```json
{
  "newParentId": "page_10",
  "newOrderInParent": 1
}

```

---

## 6. 플러그인 블록 API (v1 – 내장 모듈)

문서 안에서 `<ActionBlock>` 같은 걸 렌더링할 때,

프론트가 필요한 설정을 가져오는 API.

### 6.1. 플러그인 설정 조회

**[GET] `/api/v1/plugins/configs/{configId}`**

- 설명:
    - 플러그인 타입/설정 가져오기
- Path:
    - `configId`: MDX에서 사용한 configId
- 헤더:
    - `X-Tenant`
    - `Authorization` (필요한 경우)

응답 예 (API 콘솔 타입):

```json
{
  "success": true,
  "data": {
    "configId": "kakao-oauth-main",
    "type": "api-console",
    "displayName": "카카오 OAuth 토큰 요청 콘솔",
    "description": "샘플 요청을 직접 날려볼 수 있는 콘솔입니다.",
    "settings": {
      "method": "POST",
      "url": "https://kapi.kakao.com/oauth/token",
      "headersTemplate": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "bodyTemplate": {
        "grant_type": "authorization_code",
        "client_id": "<YOUR_CLIENT_ID>",
        "code": "<AUTH_CODE>"
      },
      "safe": true
    }
  },
  "error": null
}

```

프론트는 `type`과 `settings`를 보고 적절한 UI를 렌더.

---

## 7. FCM 토큰 등록 API

푸시 알림을 위한 FCM 토큰 등록.

### 7.1. FCM 토큰 등록/갱신

**[POST] `/api/v1/notifications/fcm-token`**

- 헤더:
    - `Authorization` (로그인 유저 기준)
    - `X-Tenant` (어느 테넌트 컨텍스트에서 등록했는지)
- Body:

```json
{
  "token": "fcm_token_string",
  "deviceInfo": {
    "platform": "web",
    "userAgent": "Chrome 123",
    "lang": "ko-KR"
  }
}

```

응답:

```json
{
  "success": true,
  "data": {
    "registered": true
  },
  "error": null
}

```

---

## 8. 검색 API (v1: 최소 정의)

### 8.1. 간단 검색

**[GET] `/api/v1/search`**

- 헤더:
    - `X-Tenant`
- Query:
    - `q`: 검색어
    - `limit`: 기본 20

응답 예:

```json
{
  "success": true,
  "data": {
    "query": "카카오",
    "results": [
      {
        "pageId": "page_1",
        "title": "카카오 OAuth 가이드",
        "fullPath": "kakao/oauth",
        "summary": "카카오 로그인 연동 전체 가이드",
        "score": 1.23
      }
    ]
  },
  "error": null
}

```

초기에는 DB LIKE 기반으로 구현 → 나중에 ES로 교체.

---

지금 단계에서 중요한 건:

- **헤더 규칙**: `X-Tenant` + `Authorization: Bearer`
- **3축 분리**: `nav` / `page` / `permission`
- **플러그인 블록**: `/plugins/configs/{configId}` 단일 엔드포인트
- **인증 플로우**: OAuth → JWT → `/auth/me`