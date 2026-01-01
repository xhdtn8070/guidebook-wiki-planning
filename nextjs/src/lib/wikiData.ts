export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
};

export interface WikiGroup {
  id: string;
  name: string;
  slug: string;
  order: number;
  status: "PUBLISHED" | "COMING_SOON" | "DRAFT";
  defaultDocId: string;
  defaultPath: string;
  isUsable: boolean;
}

export interface WikiNavNode {
  id: string;
  title: string;
  fullPath: string;
  parentId: string | null;
  depth: number;
  orderInParent: number;
  iconKey?: string;
  gateType: "FREE" | "AFTER_AD" | "SUBSCRIBER";
  visibility: "PUBLIC" | "PRIVATE";
  isUsable: boolean;
  children: WikiNavNode[];
}

export interface WikiDocPage {
  id: string;
  groupId: string;
  title: string;
  fullPath: string;
  summary: string;
  contentMdx: string;
  gateType: "FREE" | "AFTER_AD" | "SUBSCRIBER";
  visibility: "PUBLIC" | "PRIVATE";
  iconKey?: string;
  updatedAt: string;
  breadcrumb: string[];
  updatedBy: {
    userId: string;
    displayName: string;
  };
  permission: {
    canView: boolean;
    reason: string | null;
  };
  toc: { id: string; label: string; level: number }[];
  actionBlock?: {
    type: string;
    endpoint: string;
    sampleUrl: string;
    authOptions: string[];
  };
}

export interface WikiSearchResult {
  id: string;
  title: string;
  summary: string;
  fullPath: string;
  groupId: string;
  tags: string[];
  score: number;
}

export const tenantInfo = {
  code: "playbook",
  domain: "playbook.guidebook.wiki",
  name: "API 실전 플레이북 위키",
  tagline: "REST, OAuth, 플러그인까지 한 번에 다루는 대표 테넌트",
};

export const wikiGroups: WikiGroup[] = [
  {
    id: "api-guide",
    name: "API 가이드",
    slug: "api-guide",
    order: 0,
    status: "PUBLISHED",
    defaultDocId: "page_2",
    defaultPath: "kakao/oauth/intro",
    isUsable: true,
  },
  {
    id: "sdk-reference",
    name: "SDK 레퍼런스",
    slug: "sdk-reference",
    order: 1,
    status: "PUBLISHED",
    defaultDocId: "sdk_home",
    defaultPath: "sdk/overview",
    isUsable: true,
  },
  {
    id: "plugins",
    name: "플러그인 개발",
    slug: "plugins",
    order: 2,
    status: "COMING_SOON",
    defaultDocId: "plugins_beta",
    defaultPath: "plugins/overview",
    isUsable: false,
  },
];

const apiGuideNav: WikiNavNode[] = [
  {
    id: "page_1",
    title: "카카오 OAuth 가이드",
    fullPath: "kakao/oauth",
    parentId: null,
    depth: 0,
    orderInParent: 0,
    iconKey: "kakao",
    gateType: "FREE",
    visibility: "PUBLIC",
    isUsable: true,
    children: [
      {
        id: "page_2",
        title: "개요",
        fullPath: "kakao/oauth/intro",
        parentId: "page_1",
        depth: 1,
        orderInParent: 0,
        iconKey: "doc",
        gateType: "FREE",
        visibility: "PUBLIC",
        isUsable: true,
        children: [],
      },
      {
        id: "page_3",
        title: "API 콘솔",
        fullPath: "kakao/oauth/console",
        parentId: "page_1",
        depth: 1,
        orderInParent: 1,
        iconKey: "play",
        gateType: "AFTER_AD",
        visibility: "PUBLIC",
        isUsable: true,
        children: [
          {
            id: "page_3_1",
            title: "실행 예시",
            fullPath: "kakao/oauth/console/run",
            parentId: "page_3",
            depth: 2,
            orderInParent: 0,
            iconKey: "code",
            gateType: "FREE",
            visibility: "PUBLIC",
            isUsable: true,
            children: [],
          },
          {
            id: "page_3_2",
            title: "SDK 연동 (준비 중)",
            fullPath: "kakao/oauth/console/sdk",
            parentId: "page_3",
            depth: 2,
            orderInParent: 1,
            iconKey: "sdk",
            gateType: "FREE",
            visibility: "PUBLIC",
            isUsable: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "api_nav",
    title: "Wiki Navigation API",
    fullPath: "api-reference/wiki-nav",
    parentId: null,
    depth: 0,
    orderInParent: 1,
    iconKey: "tree",
    gateType: "FREE",
    visibility: "PUBLIC",
    isUsable: true,
    children: [],
  },
  {
    id: "wiki_pages",
    title: "Wiki Pages API",
    fullPath: "api-reference/wiki-pages",
    parentId: null,
    depth: 0,
    orderInParent: 2,
    iconKey: "doc",
    gateType: "SUBSCRIBER",
    visibility: "PRIVATE",
    isUsable: true,
    children: [],
  },
];

const sdkNav: WikiNavNode[] = [
  {
    id: "sdk_home",
    title: "SDK 소개",
    fullPath: "sdk/overview",
    parentId: null,
    depth: 0,
    orderInParent: 0,
    iconKey: "box",
    gateType: "FREE",
    visibility: "PUBLIC",
    isUsable: true,
    children: [],
  },
  {
    id: "sdk_auth",
    title: "인증 헬퍼",
    fullPath: "sdk/auth-helper",
    parentId: null,
    depth: 0,
    orderInParent: 1,
    iconKey: "key",
    gateType: "FREE",
    visibility: "PUBLIC",
    isUsable: true,
    children: [],
  },
];

export const wikiNavTree: Record<string, WikiNavNode[]> = {
  "api-guide": apiGuideNav,
  "sdk-reference": sdkNav,
};

const wikiPages: Record<string, WikiDocPage> = {
  "api-guide:kakao/oauth/intro": {
    id: "page_2",
    groupId: "api-guide",
    title: "카카오 OAuth 개요",
    fullPath: "kakao/oauth/intro",
    summary: "카카오 OAuth 전체 흐름과 필수 설정을 한 번에 훑어보는 대표 문서",
    contentMdx: `## 요약

카카오 OAuth를 통해 사용자 인증을 구현하는 방법을 안내합니다.
이 문서에서는 카카오 개발자 콘솔 설정부터 토큰 발급까지 전체 흐름을 다룹니다.

## 사전 준비

- 카카오 개발자 계정
- 등록된 애플리케이션
- Redirect URI 설정

## 연동 흐름

### Step 1. 앱 등록

카카오 개발자 콘솔에서 애플리케이션을 등록하고 앱 키를 발급받습니다.

### Step 2. 콜백 설정

OAuth 인증 후 사용자를 리다이렉트할 Callback URL을 등록합니다.

### Step 3. 토큰 발급

인가 코드를 사용하여 Access Token을 발급받습니다.

## FAQ

**Q: Access Token 만료 시 어떻게 갱신하나요?**
A: Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.`,
    gateType: "FREE",
    visibility: "PUBLIC",
    iconKey: "doc",
    updatedAt: "2024-06-12T10:00:00Z",
    breadcrumb: ["Docs", "인증", "카카오 OAuth"],
    updatedBy: {
      userId: "u_12345",
      displayName: "홍길동",
    },
    permission: {
      canView: true,
      reason: null,
    },
    toc: [
      { id: "overview", label: "요약", level: 1 },
      { id: "prerequisites", label: "사전 준비", level: 1 },
      { id: "flow", label: "연동 흐름", level: 1 },
      { id: "step-1", label: "Step 1. 앱 등록", level: 2 },
      { id: "step-2", label: "Step 2. 콜백 설정", level: 2 },
      { id: "step-3", label: "Step 3. 토큰 발급", level: 2 },
      { id: "faq", label: "FAQ", level: 1 },
    ],
  },
  "api-guide:kakao/oauth/console": {
    id: "page_3",
    groupId: "api-guide",
    title: "API 콘솔",
    fullPath: "kakao/oauth/console",
    summary: "ActionBlock으로 API를 직접 실행하며 학습하는 콘솔 페이지",
    contentMdx: `## 콘솔 개요

ActionBlock을 사용해 API를 직접 호출하고, 결과를 문서 안에서 확인하세요.`,
    gateType: "AFTER_AD",
    visibility: "PUBLIC",
    iconKey: "play",
    updatedAt: "2024-06-10T08:00:00Z",
    breadcrumb: ["Docs", "인증", "카카오 OAuth"],
    updatedBy: {
      userId: "u_56789",
      displayName: "김가이드",
    },
    permission: {
      canView: true,
      reason: null,
    },
    toc: [
      { id: "console", label: "콘솔 개요", level: 1 },
      { id: "try", label: "실행하기", level: 1 },
    ],
    actionBlock: {
      type: "API Console",
      endpoint: "POST /oauth/token",
      sampleUrl: "https://api.guidebook.wiki/v1/demo",
      authOptions: ["Bearer 토큰", "API Key"],
    },
  },
  "api-guide:api-reference/wiki-nav": {
    id: "api_nav",
    groupId: "api-guide",
    title: "Wiki Navigation API",
    fullPath: "api-reference/wiki-nav",
    summary: "문서 트리를 반환하는 핵심 API의 스키마와 예시",
    contentMdx: `## API 설명

**GET /api/v1/wiki/nav?groupId=api-guide**
테넌트와 그룹 기준으로 전체 문서 트리를 반환합니다.`,
    gateType: "FREE",
    visibility: "PUBLIC",
    iconKey: "tree",
    updatedAt: "2024-06-01T12:00:00Z",
    breadcrumb: ["Docs", "API 레퍼런스"],
    updatedBy: {
      userId: "u_11111",
      displayName: "이문서",
    },
    permission: {
      canView: true,
      reason: null,
    },
    toc: [{ id: "summary", label: "API 설명", level: 1 }],
  },
  "sdk-reference:sdk/overview": {
    id: "sdk_home",
    groupId: "sdk-reference",
    title: "SDK 소개",
    fullPath: "sdk/overview",
    summary: "가이드북 SDK의 역할과 주요 사용법",
    contentMdx: `## SDK 소개

프론트엔드에서 BFF를 쉽게 호출하도록 돕는 헬퍼를 제공합니다.`,
    gateType: "FREE",
    visibility: "PUBLIC",
    iconKey: "box",
    updatedAt: "2024-05-20T09:00:00Z",
    breadcrumb: ["Docs", "SDK"],
    updatedBy: {
      userId: "u_99999",
      displayName: "정SDK",
    },
    permission: {
      canView: true,
      reason: null,
    },
    toc: [{ id: "sdk", label: "SDK 소개", level: 1 }],
  },
};

export const popularDocs = [
  { id: "page_2", title: "카카오 OAuth 개요", views: 1520, path: "kakao/oauth/intro", groupId: "api-guide" },
  { id: "api_nav", title: "Wiki Navigation API", views: 1234, path: "api-reference/wiki-nav", groupId: "api-guide" },
  { id: "page_3", title: "API 콘솔", views: 987, path: "kakao/oauth/console", groupId: "api-guide" },
  { id: "sdk_home", title: "SDK 소개", views: 876, path: "sdk/overview", groupId: "sdk-reference" },
];

export const recentDocs = [
  { id: "page_3", title: "API 콘솔", date: "2024-06-12", path: "kakao/oauth/console", groupId: "api-guide" },
  { id: "api_nav", title: "Wiki Navigation API", date: "2024-06-10", path: "api-reference/wiki-nav", groupId: "api-guide" },
  { id: "page_2", title: "카카오 OAuth 개요", date: "2024-06-08", path: "kakao/oauth/intro", groupId: "api-guide" },
  { id: "sdk_home", title: "SDK 소개", date: "2024-06-05", path: "sdk/overview", groupId: "sdk-reference" },
];

const searchIndex: WikiSearchResult[] = [
  {
    id: "page_2",
    title: "카카오 OAuth 개요",
    summary: "개발자 콘솔 설정과 토큰 발급까지 한 번에 보기",
    fullPath: "kakao/oauth/intro",
    groupId: "api-guide",
    tags: ["OAuth", "Kakao", "Authentication"],
    score: 0.97,
  },
  {
    id: "page_3",
    title: "API 콘솔",
    summary: "문서 안에서 액션 블록으로 바로 실행",
    fullPath: "kakao/oauth/console",
    groupId: "api-guide",
    tags: ["ActionBlock", "Console"],
    score: 0.89,
  },
  {
    id: "api_nav",
    title: "Wiki Navigation API",
    summary: "문서 트리 반환 스키마",
    fullPath: "api-reference/wiki-nav",
    groupId: "api-guide",
    tags: ["API", "Navigation"],
    score: 0.85,
  },
  {
    id: "sdk_home",
    title: "SDK 소개",
    summary: "BFF 호출 헬퍼 소개",
    fullPath: "sdk/overview",
    groupId: "sdk-reference",
    tags: ["SDK", "Helper"],
    score: 0.8,
  },
];

export const apiExamples = {
  groups: {
    endpoint: "GET /api/v1/wiki/groups",
    response: {
      success: true,
      data: {
        tenantCode: tenantInfo.code,
        groups: wikiGroups,
      },
      error: null,
    },
  },
  nav: {
    endpoint: "GET /api/v1/wiki/nav?groupId=api-guide",
    response: {
      success: true,
      data: {
        groupId: "api-guide",
        nodes: apiGuideNav,
      },
      error: null,
    },
  },
  page: {
    endpoint: "GET /api/v1/wiki/pages?groupId=api-guide&path=kakao/oauth/intro",
    response: {
      success: true,
      data: wikiPages["api-guide:kakao/oauth/intro"],
      error: null,
    },
  },
};

const flattenNav = (nodes: WikiNavNode[]): WikiNavNode[] =>
  nodes.flatMap((node) => [node, ...flattenNav(node.children)]);

export const getDefaultPathForGroup = (groupId: string | null | undefined) => {
  if (!groupId) return null;
  return wikiGroups.find((group) => group.id === groupId)?.defaultPath ?? null;
};

export const getPagerForPath = (nodes: WikiNavNode[], fullPath: string) => {
  const flat = flattenNav(nodes).filter((node) => node.isUsable);
  const index = flat.findIndex((node) => node.fullPath === fullPath);
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  };
};

export const fetchWikiGroups = async (): Promise<ApiResponse<{ groups: WikiGroup[]; tenantCode: string }>> => ({
  success: true,
  data: {
    tenantCode: tenantInfo.code,
    groups: wikiGroups,
  },
  error: null,
});

export const fetchWikiNav = async (groupId: string): Promise<ApiResponse<{ groupId: string; nodes: WikiNavNode[] }>> => ({
  success: true,
  data: {
    groupId,
    nodes: wikiNavTree[groupId] ?? [],
  },
  error: null,
});

export const fetchWikiPage = async (
  groupId: string,
  path: string
): Promise<ApiResponse<WikiDocPage>> => {
  const page = wikiPages[`${groupId}:${path}`];

  if (!page) {
    return {
      success: false,
      data: null,
      error: {
        code: "PAGE_NOT_FOUND",
        message: "문서를 찾을 수 없습니다.",
        details: null,
      },
    };
  }

  return {
    success: true,
    data: page,
    error: null,
  };
};

export const searchWiki = async (query: string): Promise<ApiResponse<{ results: WikiSearchResult[] }>> => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return {
      success: true,
      data: { results: [] },
      error: null,
    };
  }

  const results = searchIndex.filter((item) =>
    item.title.toLowerCase().includes(normalized) ||
    item.summary.toLowerCase().includes(normalized) ||
    item.tags.some((tag) => tag.toLowerCase().includes(normalized))
  );

  return {
    success: true,
    data: { results },
    error: null,
  };
};
