// Mock data for Guidebook Wiki prototype

export interface DocGroup {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'coming_soon' | 'draft';
  isUsable: boolean;
}

export interface NavItem {
  id: string;
  title: string;
  path: string;
  isUsable: boolean;
  children?: NavItem[];
}

export interface DocPage {
  id: string;
  groupId: string;
  title: string;
  lead: string;
  breadcrumb: string;
  updated: string;
  status: 'published' | 'draft';
  gateType?: 'public' | 'member' | 'premium';
  toc: { id: string; label: string; level: number }[];
  content: string;
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  path: string;
  tags: string[];
  score: number;
}

// Doc Groups
export const docGroups: DocGroup[] = [
  {
    id: 'api-guide',
    title: 'API 가이드',
    description: 'REST API 연동 및 인증 가이드',
    status: 'active',
    isUsable: true,
  },
  {
    id: 'sdk-reference',
    title: 'SDK 레퍼런스',
    description: '언어별 SDK 사용법과 예시 코드',
    status: 'active',
    isUsable: true,
  },
  {
    id: 'plugins',
    title: '플러그인 개발',
    description: 'ActionBlock 플러그인 제작 가이드',
    status: 'coming_soon',
    isUsable: false,
  },
  {
    id: 'deployment',
    title: '배포 가이드',
    description: '테넌트 배포 및 인프라 구성',
    status: 'draft',
    isUsable: false,
  },
];

// Navigation tree
export const navItems: NavItem[] = [
  {
    id: 'getting-started',
    title: '시작하기',
    path: '/docs/getting-started',
    isUsable: true,
    children: [
      { id: 'quickstart', title: '빠른 시작', path: '/docs/getting-started/quickstart', isUsable: true },
      { id: 'installation', title: '설치 가이드', path: '/docs/getting-started/installation', isUsable: true },
    ],
  },
  {
    id: 'authentication',
    title: '인증',
    path: '/docs/authentication',
    isUsable: true,
    children: [
      { id: 'kakao-oauth', title: '카카오 OAuth', path: '/docs/authentication/kakao-oauth', isUsable: true },
      { id: 'naver-oauth', title: '네이버 OAuth', path: '/docs/authentication/naver-oauth', isUsable: false },
      { id: 'google-oauth', title: 'Google OAuth', path: '/docs/authentication/google-oauth', isUsable: true },
    ],
  },
  {
    id: 'api-reference',
    title: 'API 레퍼런스',
    path: '/docs/api-reference',
    isUsable: true,
    children: [
      { id: 'wiki-nav', title: 'Wiki Navigation API', path: '/docs/api-reference/wiki-nav', isUsable: true },
      { id: 'wiki-pages', title: 'Wiki Pages API', path: '/docs/api-reference/wiki-pages', isUsable: true },
      { id: 'search-api', title: 'Search API', path: '/docs/api-reference/search', isUsable: false },
    ],
  },
  {
    id: 'plugins',
    title: '플러그인',
    path: '/docs/plugins',
    isUsable: false,
  },
];

// Sample doc page
export const sampleDocPage: DocPage = {
  id: 'kakao-oauth',
  groupId: 'api-guide',
  title: '카카오 OAuth 가이드',
  lead: 'GET /api/v1/wiki/nav 예시에 맞춰 좌측 트리와 우측 TOC가 동작하는 대표 문서입니다.',
  breadcrumb: 'Docs / 인증 / 카카오 OAuth',
  updated: '2024-06-12',
  status: 'published',
  gateType: 'public',
  toc: [
    { id: 'overview', label: '요약', level: 1 },
    { id: 'prerequisites', label: '사전 준비', level: 1 },
    { id: 'flow', label: '연동 흐름', level: 1 },
    { id: 'step-1', label: 'Step 1. 앱 등록', level: 2 },
    { id: 'step-2', label: 'Step 2. 콜백 설정', level: 2 },
    { id: 'step-3', label: 'Step 3. 토큰 발급', level: 2 },
    { id: 'code-example', label: '코드 예시', level: 1 },
    { id: 'faq', label: 'FAQ', level: 1 },
  ],
  content: `
## 요약

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

## 코드 예시

\`\`\`typescript
const getKakaoToken = async (code: string) => {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'YOUR_APP_KEY',
      redirect_uri: 'YOUR_REDIRECT_URI',
      code,
    }),
  });
  return response.json();
};
\`\`\`

## FAQ

**Q: Access Token 만료 시 어떻게 갱신하나요?**
A: Refresh Token을 사용하여 새로운 Access Token을 발급받을 수 있습니다.
  `,
};

// Popular/Recent documents
export const popularDocs = [
  { id: '1', title: '카카오 OAuth 첫 설정', views: 1520 },
  { id: '2', title: '네이버 지도 API 시작하기', views: 1234 },
  { id: '3', title: 'PG 연동 체크리스트', views: 987 },
  { id: '4', title: 'JWT 토큰 관리 베스트 프랙티스', views: 876 },
];

export const recentDocs = [
  { id: '1', title: 'API 콘솔 플러그인 베타', date: '2024-06-12' },
  { id: '2', title: '테넌트별 광고 슬롯 가이드', date: '2024-06-10' },
  { id: '3', title: '슬랙 알림 웹훅 템플릿', date: '2024-06-08' },
  { id: '4', title: '멀티 테넌트 인증 가이드', date: '2024-06-05' },
];

// Search results mock
export const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: '카카오 OAuth 가이드',
    summary: 'REST API를 사용한 카카오 로그인 연동 방법을 안내합니다.',
    path: '/docs/authentication/kakao-oauth',
    tags: ['OAuth', 'Kakao', '인증'],
    score: 0.95,
  },
  {
    id: '2',
    title: 'Google OAuth 통합',
    summary: 'Google 계정을 사용한 소셜 로그인 구현 가이드입니다.',
    path: '/docs/authentication/google-oauth',
    tags: ['OAuth', 'Google', '인증'],
    score: 0.88,
  },
  {
    id: '3',
    title: 'Wiki Navigation API',
    summary: '문서 네비게이션 트리를 조회하는 API 레퍼런스입니다.',
    path: '/docs/api-reference/wiki-nav',
    tags: ['API', 'Navigation'],
    score: 0.72,
  },
];
