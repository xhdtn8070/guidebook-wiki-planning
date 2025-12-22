# Guidebook Wiki DB 설계 v1 (PostgreSQL)

> **읽기 가이드:** API 흐름은 `guidebook-wiki-planning.md`와 `guidebook-wiki-backend-draft.md`를 먼저 보고, 프론트/레이아웃 요구사항은 `guidebook-wiki-frontend-planning-nextjs.md`와 `guidebook-wiki-layout-and-common-component.md`를 참고한다.
## 0. 공통 설계 규칙

### 0.1. 공통 컬럼

모든 주요 테이블은 다음 3개 필드를 공통으로 가진다.

```sql
id          BIGSERIAL PRIMARY KEY,
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()

```

### 0.2. 작성자/수정자 컬럼

**“사람이 작성/수정한 콘텐츠나 설정”** 에 대해서는 다음 두 컬럼을 추가한다.

```sql
created_by  BIGINT REFERENCES users(id),
updated_by  BIGINT REFERENCES users(id)

```

예: `wiki_pages`, `plugin_configs`, `tenants` 등.

관계 테이블(예: `user_tenants`, `fcm_tokens`)처럼 “작성자 정보가 크게 의미 없는” 경우는

`created_by/updated_by` 없이 `created_at/updated_at`만 둔다.

---

## 1. ENUM 타입 정의

```sql
-- 문서 접근 방식
CREATE TYPE gate_type AS ENUM ('FREE', 'AFTER_AD', 'SUBSCRIBER');

-- 문서 공개 범위
CREATE TYPE visibility_type AS ENUM ('PUBLIC', 'TENANT_ONLY', 'ROLE_BASED');

-- 테넌트 내 역할
CREATE TYPE tenant_role AS ENUM ('TENANT_ADMIN', 'EDITOR', 'VIEWER');

-- OAuth Provider
CREATE TYPE oauth_provider AS ENUM ('GOOGLE', 'GITHUB', 'KAKAO');

-- 플러그인 타입
CREATE TYPE plugin_type AS ENUM ('API_CONSOLE', 'DIAGRAM', 'QUIZ', 'CUSTOM');

-- FCM 플랫폼
CREATE TYPE device_platform AS ENUM ('WEB', 'ANDROID', 'IOS');

```

---

## 2. 테넌트 & 유저

### 2.1. tenants

테넌트(위키 인스턴스) 정보.

```sql
CREATE TABLE tenants (
    id              BIGSERIAL PRIMARY KEY,
    tenant_code     VARCHAR(50) NOT NULL UNIQUE,  -- 예: 'playbook', 'acme'
    name            VARCHAR(100) NOT NULL,

    created_by      BIGINT REFERENCES users(id),
    updated_by      BIGINT REFERENCES users(id),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```

- `tenant_code`는 `X-Tenant` 헤더와 매핑되는 값.

---

### 2.2. users

Guidebook 전체 유저.

```sql
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    display_name    VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```

- 여기서는 일반적으로 “누가 유저를 만들었는가”보다
    
    OAuth 플로우를 통해 자연스럽게 생성되므로 `created_by`는 생략.
    

---

### 2.3. user_identities (OAuth 계정 매핑)

```sql
CREATE TABLE user_identities (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    provider        oauth_provider NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    raw_profile     JSONB,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (provider, provider_user_id)
);

```

---

### 2.4. user_tenants (테넌트별 유저 역할)

```sql
CREATE TABLE user_tenants (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    tenant_id       BIGINT NOT NULL REFERENCES tenants(id),
    role            tenant_role NOT NULL DEFAULT 'VIEWER',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, tenant_id)
);

```

- 누가 이 관계를 생성했는지까지 추적할 필요성은 상대적으로 낮아서
    
    v1에서는 `created_by/updated_by` 없이 간다 (필요하면 나중에 추가 가능).
    

---

## 3. 위키 문서 구조

### 3.1. wiki_pages (문서 트리)

```sql
CREATE TABLE wiki_pages (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL REFERENCES tenants(id),

    parent_id       BIGINT REFERENCES wiki_pages(id),
    depth           INT NOT NULL DEFAULT 0,          -- 0: 루트, 1: 자식 ...

    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,           -- path segment (예: 'intro')
    full_path       VARCHAR(1024) NOT NULL,          -- 예: 'kakao/oauth/intro'

    summary         TEXT,
    content_mdx     TEXT,

    gate_type       gate_type NOT NULL DEFAULT 'FREE',
    visibility      visibility_type NOT NULL DEFAULT 'PUBLIC',

    icon_key        VARCHAR(100),
    order_in_parent INT NOT NULL DEFAULT 0,

    created_by      BIGINT REFERENCES users(id),
    updated_by      BIGINT REFERENCES users(id),

    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 같은 테넌트 내 full_path 유니크
CREATE UNIQUE INDEX ux_wiki_pages_tenant_full_path
    ON wiki_pages(tenant_id, full_path)
    WHERE is_deleted = FALSE;

-- 같은 부모 내 slug 유니크
CREATE UNIQUE INDEX ux_wiki_pages_tenant_parent_slug
    ON wiki_pages(tenant_id, parent_id, slug)
    WHERE is_deleted = FALSE;

-- 트리/정렬 조회용
CREATE INDEX idx_wiki_pages_tenant_parent_order
    ON wiki_pages(tenant_id, parent_id, order_in_parent);

```

- `created_by` / `updated_by`: 문서 작성자/마지막 수정자 추적용.

---

### 3.2. wiki_page_history (후순위, 옵션)

문서 버전 관리가 필요해졌을 때 사용할 히스토리 테이블.

```sql
CREATE TABLE wiki_page_history (
    id              BIGSERIAL PRIMARY KEY,
    page_id         BIGINT NOT NULL REFERENCES wiki_pages(id),
    tenant_id       BIGINT NOT NULL REFERENCES tenants(id),

    version         INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    summary         TEXT,
    content_mdx     TEXT NOT NULL,

    created_by      BIGINT REFERENCES users(id), -- 이 버전의 작성자
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_wiki_page_history_page_version
    ON wiki_page_history(page_id, version);

```

- v1에서는 필수는 아니고, “추후 버전 관리 필요 시 도입” 수준.

---

## 4. 플러그인 블록 (Plugin / Action Block)

### 4.1. plugin_configs

```sql
CREATE TABLE plugin_configs (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL REFERENCES tenants(id),

    config_id       VARCHAR(100) NOT NULL,    -- MDX에서 쓰는 식별자
    type            plugin_type NOT NULL,     -- 'API_CONSOLE', 'DIAGRAM', ...

    display_name    VARCHAR(255) NOT NULL,
    description     TEXT,

    settings        JSONB NOT NULL,          -- 타입별 설정 정보 (URL, METHOD 등)
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_by      BIGINT REFERENCES users(id),
    updated_by      BIGINT REFERENCES users(id),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (tenant_id, config_id)
);

```

- 플러그인 설정은 “사람이 직접 만드는 설정”이라
    
    `created_by` / `updated_by` 두는 게 중요.
    

---

## 5. 알림(Firebase Cloud Messaging)

### 5.1. fcm_tokens

```sql
CREATE TABLE fcm_tokens (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    tenant_id       BIGINT REFERENCES tenants(id),   -- 특정 테넌트 컨텍스트에서 등록된 경우

    token           VARCHAR(512) NOT NULL,
    platform        device_platform NOT NULL,
    user_agent      TEXT,
    lang            VARCHAR(20),

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (token)
);

```

- 누가 이 토큰을 직접 만든다기보다 “클라이언트 + 유저 액션으로 생성”되는 데이터라
    
    v1에서는 `created_by/updated_by`는 생략.
    

---

## 6. 검색용 인덱스 (DB 기반 간이 검색)

Elasticsearch 도입 전, 혹은 무료 플랜에서 DB 기반 검색용으로 사용할 수 있는 인덱스.

```sql
-- 제목 검색용
CREATE INDEX idx_wiki_pages_title_trgm
    ON wiki_pages
    USING GIN (title gin_trgm_ops);

-- 본문 검색용 (간단 용도, 실제 운영에서는 ES로 대체 예정)
CREATE INDEX idx_wiki_pages_content_trgm
    ON wiki_pages
    USING GIN (content_mdx gin_trgm_ops);

```

> ES 도입 후에는, 문서 생성/수정/삭제 이벤트 시 ES 인덱스를 갱신하는 구조로 확장.
> 

---

## 7. v1에서 실제 구현 우선순위 테이블

MVP 기준으로 우선 구현 대상:

1. `tenants`
2. `users`
3. `user_identities`
4. `user_tenants`
5. `wiki_pages`
6. `plugin_configs`
7. `fcm_tokens` (FCM을 바로 붙일 거면)

`wiki_page_history`는 후순위.

추후 권한 테이블이 더 세분화되면 `page_role_permissions` 같은 걸 추가할 여지도 있음.

---

이렇게 하면:

- 공통 필드(id/created_at/updated_at)가 통일되어 있고,
- 사람이 작성하는 주요 엔티티에는 created_by/updated_by가 들어가 있어서
- 나중에 “누가 만들었고, 누가 고쳤냐”를 전부 추적 가능해.

이제 이걸 기준으로 JPA 엔티티/기본 BaseEntity 같은 것 설계할 수 있고,

원하면 다음 단계로 **Kotlin/JPA 엔티티 초안 + BaseEntity 구조**도 바로 뽑아줄게.