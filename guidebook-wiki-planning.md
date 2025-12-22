# Guidebook Wiki 기획서 v1
(API 기반 위키 플랫폼 & API 실전 플레이북)

---

## 0. 문서 개요

- 문서명: **Guidebook Wiki 기획서 (v1)**
- 서비스명: **Guidebook Wiki**
- 기본 도메인: **`guidebook.wiki`**
- 레포지토리:
    - `guidebook-backend` – Spring Boot 3 기반 모놀리식 백엔드
    - `guidebook-frontend` – Next.js 기반 BFF + 프론트엔드
- 목적:
    - Guidebook Wiki의 전체 방향성과 범위를 정리하고,
    - 위키 플랫폼과 그 위에서 운영할 **API 실전 플레이북**의 관계를 명확히 하며,
    - 프론트/백엔드를 AI 혹은 다른 개발자가 맡아도 이해할 수 있는 기준 문서로 사용한다.

## 0-1. 추천 읽기 순서

1. 이 문서(guidebook-wiki-planning.md)에서 비전과 문제 정의, 전체 구조를 파악한다.
2. `guidebook-wiki-layout-and-common-component.md`에서 핵심 레이아웃/공통 컴포넌트를 확인한다.
3. 프론트엔드 설계는 `guidebook-wiki-frontend-planning-nextjs.md` → `guidebook-wiki-frontend-planning-codex.md` 순으로 읽는다.
4. 백엔드 API 초안(`guidebook-wiki-backend-draft.md`)과 DB 설계(`guidebook-wiki-database-planning-postgresql.md`)를 함께 보며 엔드포인트와 스키마를 매칭한다.

## 0-2. 우선 개선 포인트 (v1 기준)

- **테넌트/광고/권한 정합성**: 백엔드 API와 DB 설계에서 `X-Tenant`, 광고 슬롯, 권한 정책이 일관되게 표현되는지 점검 필요.
- **플러그인(Action/Plugin Block) UX**: 레이아웃/프론트 설계에서 플러그인 배치·실행 흐름을 더 구체화(예: 실행 영역/권한 UI 패턴)하면 개발 착수 시 혼선을 줄일 수 있음.
- **검색·개인화 우선순위**: 엘라스틱서치 연동, 맞춤 추천 등은 후순위로 두되, API/DB에 향후 확장 포인트(예: 사용자 히스토리 테이블) 메모가 필요.

---

# 1. 우리가 만들고 싶은 것

## 1-1. 비전

> “어떤 주제든 올릴 수 있는 API 기반 위키 플랫폼”을 만든다.
> 
> 
> 이 안에 첫 번째 대표 위키로 `“API 실전 플레이북`”을 올린다.
> 
- **Guidebook Wiki = 하나의 플랫폼**
    - 멀티 테넌트 구조(서브도메인으로 위키 분리)
    - 권한·광고·결제·테마를 데이터로 제어하는 SaaS 위키
    - MDX 기반 문서, 검색·개인화, 확장 블록(Action/Plugin Block)까지 포함
- **API 실전 플레이북 = Guidebook Wiki 안의 ‘대표 위키’**
    - 별도의 서비스/레포가 아니라, Guidebook Wiki 위에 올리는 **콘텐츠/스페이스**
    - 공공/상용 API 연동을 “처음부터 끝까지” 안내하는 실전 가이드 모음
    - 위키 기능(문서, 광고, 플러그인 블록, 검색 등)을 실제로 검증하는 대표 사례

---

## 1-2. 왜 이걸 하는가

### (1) 위키 플랫폼만으로는 사람이 안 모임

- “위키 시스템 만들었다”만으로는 사용자가 들어올 이유가 부족하다.
- 최소한 “이거 때문에라도 한 번 들어와 본다”라는 **대표 주제**가 필요.
- 그 역할을 **API 실전 플레이북**이 담당한다.

### (2) API 실전 플레이북은 좋은 대표 주제

- 요즘 GPT + 개발을 할 때 가장 많이 건드리는 것:
    - 공공 데이터 API
    - 카카오/네이버 OAuth 로그인
    - PG 결제 API
    - 지도, 번역, 위치 등
- 전문가들은 공식 문서만 보고도 되지만,
    - 콘솔 계정 생성, 앱 등록, 키 발급, Redirect URI, OAuth 플로우, 테스트까지의
        
        **“첫 사이클”은 초보에게 매우 빡세다.**
        
- 이 초기 러닝커브와 삽질 비용을
    
    **문서 + 예제 + 구조**로 줄여주면:
    
    - 공부/취미/업무 자동화를 위해 시도하는 사람들이
        
        짧은 스킵 불가 광고 정도는 수용할 가능성이 크다.
        

### (3) 우리는 데이터를 독점하는 게 아니라 “경험”을 파는 플랫폼

- 다루는 정보:
    - 공개된 API 스펙 + 노하우 → 데이터 독점 모델 X
- 대신:
    - 잘 정리된 문서 구조
    - 검색·개인화
    - 광고/권한/구독 모델
    - **위키 안에서 바로 실행 가능한 플러그인 블록 (예: API 콘솔)**
        
        를 제공하는 **위키 플랫폼(Guidebook Wiki)** 자체가 제품이다.
        

---

# 2. 서비스/시스템 구성 개요

## 2-1. 도메인 구조

- 랜딩/소개: `guidebook.wiki`
- 앱(위키 UI + BFF): `app.guidebook.wiki`
- 테넌트(위키 인스턴스) 서브도메인:
    - `<tenant>.guidebook.wiki`
    - 예:
        - `playbook.guidebook.wiki` → API 실전 플레이북 위키
        - `acme.guidebook.wiki` → 나중에 B2B 고객용 위키
- 백엔드 API 도메인(분리 가능):
    - `api.guidebook.wiki` (옵션)

> 프론트와 백엔드 도메인이 완전히 다를 수 있기 때문에,
> 
> 
> 인증은 **쿠키를 지양**하고, **헤더 기반(JWT)** 으로 통일한다.
> 

---

## 2-2. 레포 구조

- `guidebook-backend`
    - Spring Boot 3 기반 모놀리식
    - 기능 모듈:
        - 테넌트/유저/인증(OAuth/OIDC)
        - 위키 문서/목차
        - 광고/권한/결제 연계
        - 플러그인 블록(Action/Plugin Block)
        - 검색(Elasticsearch)
        - FCM 푸시
        - (후순위) LLM Q&A
- `guidebook-frontend`
    - Next.js (App Router) + MDX + MDXEditor
    - BFF 역할:
        - 서브도메인 → 테넌트 추출
        - 모든 백엔드 호출 시 `X-Tenant`, `Authorization` 헤더 부착
        - OAuth/OIDC 리다이렉트 처리

---

## 2-3. 아키텍처 개요

```mermaid
flowchart LR
    subgraph User[사용자]
        Browser[브라우저<br/>위키 뷰/에디터/로그인]
        Device[브라우저/앱<br/>FCM 알림 수신]
    end

    subgraph FE[guidebook-frontend<br/>Next.js BFF + UI]
        NextApp[Next.js App<br/>(테넌트 인식 + BFF)]
    end

    subgraph BE[guidebook-backend<br/>Spring Boot 모놀리식]
        Tenant[테넌트·유저·인증 모듈]
        Wiki[문서·목차·권한·광고 모듈]
        Plugin[플러그인 블록 엔진<br/>(Action/Plugin Block)]
        Search[검색(Elasticsearch) 연동]
        FCM[FCM 연동]
        LLM[LLM Q&A (후순위)]
    end

    User --> Browser --> NextApp
    NextApp --> Tenant
    NextApp --> Wiki
    NextApp --> Plugin
    NextApp --> Search
    Tenant --> FCM
    Wiki --> FCM
    Plugin --> FCM
    FCM --> Device

```

- **중요 포인트**:
    - API 실전 플레이북은 **Wiki+Plugin 위에서 돌아가는 하나의 테넌트/공간**일 뿐, Box 단위로 따로 그리지 않는다.
    - Plugin 엔진(ActionBlock/플러그인 블록)은 **백엔드 안에 내장된 모듈**로 시작한다.
    - 나중에 플러그인 제작 도우미 사이트/도구를 따로 뺄 수 있지만,
        
        **기본 동작은 Guidebook Wiki와 한몸**이다.
        

---

# 3. Guidebook Wiki의 핵심 개념

## 3-1. 테넌트/위키/스페이스

- **테넌트(Tenant)**:
    - `<tenant>.guidebook.wiki` 단위.
    - 하나의 조직/프로젝트/커뮤니티를 대표하는 **위키 인스턴스**.
- **위키(Wiki)**:
    - 테넌트가 운영하는 문서 전체 집합.
- **스페이스/컬렉션(논리 개념)**:
    - 테넌트 안에서 특정 주제를 묶어 쓰는 단위 (예: “API 실전 플레이북”, “사내 온보딩 문서” 등)
    - DB 구조나 라우팅 구조로 표현할 뿐, 별도 서비스는 아님.

> “API 실전 플레이북”은 playbook 테넌트의 주요 스페이스로 시작하고,
> 
> 
> Guidebook Wiki 기능을 다 활용해보는 **대표 예시**일 뿐이다.
> 

---

# 4. 문서, 에디터, 플러그인 블록

## 4-1. 문서 & 에디터 전략

### 문서 저장 방식

- DB에 MDX 문자열로 저장:
    - `title`
    - `full_path` (예: `kakao/oauth/intro`)
    - `summary`
    - `content_mdx`
    - `gateType`, `visibility`, `iconKey`
    - `updatedBy`, `updatedAt`

### MDX 파일 연동

- 위키에서 직접 작성/수정
- “현재 페이지 MDX 다운로드”
- “MDX 파일 업로드로 문서 생성/갱신”

> 저장의 기준은 “DB가 진짜”, MDX 파일은 백업·협업·배포용 포맷.
> 

### 에디터 & 렌더러

- 에디터: **MDXEditor**
- 렌더러: Next.js + MDX
- 요구사항:
    - 텍스트, 코드블록, 리스트, 테이블, 인용구 등 기본 편집
    - MDX 컴포넌트(ActionBlock 등) 삽입 UI
    - 독스사우루스/다이노서우스처럼 깔끔한 문서 레이아웃
    - 수정자/수정일 표기
    - (추후) 버전 히스토리 확장 가능성 염두

---

## 4-2. 플러그인 블록(Action/Plugin Block) – v1

### 개념

- **플러그인 블록 = 문서 안에 삽입되는 확장 블록**
    - ex) API 콘솔, 코드 실행 예제, 다이어그램 뷰어, 퀴즈 등
- 1뎁스:
    - 전부 `guidebook-backend` 안에 모듈로 구현
    - Guidebook Wiki 공통 기능으로 제공 (API 실전 플레이북만의 기능 아님)
- 이후:
    - 플러그인 인터페이스를 공개해서
    - 외부에서 플러그인 모듈을 추가할 수 있는 구조까지 확장

### MDX에서의 표현

```
<ActionBlock type="api-console" configId="kakao-oauth-main" />
<ActionBlock type="diagram" configId="sequence-001" />

```

### 백엔드 역할

- 플러그인 정의/설정 관리:
    - `type`, `configId`, 권한, 사용 가능 테넌트 등
- 런타임:
    - 프론트에서 ActionBlock 렌더 요청 →
        
        백엔드가 config 조회 / 실행에 필요한 정보 반환
        
- 1뎁스에서는:
    - 플러그인은 “내장 모듈”로 동작
    - API 콘솔 모듈도 여기 포함 (별도 서비스 X)

### 플러그인 시스템 방향

- **현재(1뎁스)**:
    - 모든 플러그인 = 내장 모듈
    - API 실전 플레이북에 필요해서 만든 플러그인도
        
        “모든 테넌트가 쓸 수 있는 기본 기능”으로 제공
        
- **미래(플러그인 시스템)**:
    - 플러그인 인터페이스 정의:
        - 입력/출력, config 구조, 권한 규칙 등
    - 외부 플러그인 패키지를 등록/관리할 수 있는 구조 제공
    - 전체 시스템에 악영향을 주지 않도록 sandbox/제한된 실행 컨텍스트 고려
    - “플러그인 만드는 법”을 가이드하는 별도 문서/사이트는
        
        `plugins.guidebook.wiki` 형태로 분리할 수 있음 (기획 상 옵션)
        

---

# 5. 인증, 권한, 수익

## 5-1. 인증/세션 구조

- 프론트/백엔드 도메인이 다를 수 있으므로:
    - **쿠키 세션은 지양**
    - 인증은 **헤더 기반 JWT**로 통일
- 1차 인증 전략(B2C 중심):
    - 외부 OAuth 로그인 (예: GitHub/Google 등)
    - 백엔드에서 OAuth 플로우 처리 후
        - 내부 유저 생성/매핑
        - Guidebook 자체 JWT 발급
    - 프론트는 JWT를 저장 후,
        - 모든 API 호출에 `Authorization: Bearer <JWT>` 헤더 포함
        - `X-Tenant`, (필요하면 `X-Channel`) 같이 보냄
- 중장기:
    - 각 테넌트에 OIDC SSO 설정을 등록
    - B2B용 SSO 지원 (issuer, clientId 등 저장 후 동적으로 사용)

## 5-2. 권한/게이트

- `gateType`:
    - `FREE` – 누구나
    - `AFTER_AD` – 광고 시청 후 열람
    - `SUBSCRIBER` – 구독자 전용
- `visibility`:
    - `PUBLIC`
    - `TENANT_ONLY`
    - `ROLE_BASED`
- 접근 흐름:
    - **항상 백엔드에서 권한 체크**
        
        → 프론트는 gateType에 따라 광고/구독 UI 처리
        

## 5-3. 광고 & 구독

- Guidebook Wiki 차원의 공통 수익 모델:
    - 광고 인프라:
        - `AFTER_AD` 타입 문서/블록에 스킵 불가 광고 도입
    - 구독:
        - 테넌트 단위/개인 단위 구독 가능
        - 광고 제거, 추가 기능(검색/LLM/플러그인 제한 해제 등) 제공
- API 실전 플레이북은 이 모델을 **가장 적극적으로 사용하는 대표 테넌트**.

---

# 6. 검색, LLM, FCM

## 6-1. 검색(Elasticsearch)

- 테넌트 단위 전체 텍스트 검색
- 필드:
    - title, summary, tags, content 텍스트, updatedAt 등
- 플랜:
    - 기본: 간단 DB 검색
    - 유료: ES 기반 검색 제공

## 6-2. LLM Q&A (후순위)

- 위키 내용만으로 답하는 Q&A 챗봇
- 테넌트별 ON/OFF, 상위 플랜 전용
- 문서 청크 → 임베딩 → Q&A

## 6-3. FCM 알림

- 알림 대상:
    - 내가 즐겨찾기한 위키/문서에 업데이트
    - API 실전 플레이북의 새로운 챕터, 공지
- 동작:
    - 프론트에서 FCM 토큰 등록
    - 백엔드 이벤트 발생 시 FCM 발송

---

# 7. API 실전 플레이북의 위치

- **위치**:
    - `playbook.guidebook.wiki` 같은 테넌트로 시작
    - Guidebook Wiki의 모든 기능(플러그인 블록, 광고, 구독, 검색 등)을 최대한 사용해본다.
- **정체성**:
    - “이런 식으로 위키를 만들 수 있다”를 보여주는 대표 샘플
    - 동시에 실제 사용자 트래픽을 유도하는 간판 콘텐츠
- **특별한 백엔드 서비스 없음**:
    - API 콘솔, 목킹, 예제 코드 등은 모두
        
        `guidebook-backend`의 플러그인 블록/도메인 모듈로 구현된다.
        

---

# 8. 단계별 로드맵 (플러그인까지 포함)

## Phase 1 – Guidebook Wiki V1 (플러그인 내장형)

- 멀티 테넌트 (서브도메인 → `X-Tenant`)
- DB 기반 MDX 문서/목차 관리
- MDXEditor + Next.js 렌더링
- JWT + OAuth 기반 인증 (헤더 기반)
- gateType/visibility 적용
- API 실전 플레이북 위키 1차 구성
- 기본 플러그인 블록:
    - 예: 간단 API 콘솔, 코드 예제 블록 등 (내장 모듈로)

## Phase 2 – 플랫폼 기능 확장

- Elasticsearch 검색
- FCM 알림 1차 도입
- 플러그인 인터페이스 1차 설계:
    - 내부에서만 사용하는 형태로 구조 정리
- API 실전 플레이북:
    - 더 많은 API 튜토리얼 + API 콘솔 고도화

## Phase 3 – 플러그인 시스템 & B2B

- 플러그인 시스템 정식화:
    - 외부/내부 개발자가 플러그인 제작 가능
    - 플러그인 등록/관리 UI 및 검증 플로우
- OIDC SSO 지원 (B2B)
- LLM Q&A 베타
- Guidebook Wiki를 B2B SaaS 패키지로 판매:
    - 테넌트 관리, 결제, 고급 기능 플랜

---