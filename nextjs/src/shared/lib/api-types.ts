export type ApiErrorPayload = {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
};

export type BackendResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
      error: null;
      refreshedTokens?: AuthTokenBundle | null;
    }
  | {
      ok: false;
      status: number;
      data: null;
      error: ApiErrorPayload;
      refreshedTokens?: AuthTokenBundle | null;
    };

export type TenantVisibility = "PUBLIC" | "PRIVATE";
export type TenantRole = "OWNER" | "ADMIN" | "MEMBER";
export type UserStatus = "ACTIVE" | "BLOCKED" | "WITHDRAWN";
export type OAuthProvider = "KAKAO" | "GOOGLE" | "NAVER" | "APPLE";
export type GuidebookStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type PageStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type PageAccessPolicy = "INHERIT" | "PUBLIC" | "TENANT_ONLY";
export type NotificationType =
  | "TENANT_INVITED"
  | "GUIDEBOOK_INVITED"
  | "PAGE_PERMISSION_GRANTED"
  | "GUIDEBOOK_PERMISSION_GRANTED"
  | "SYSTEM";

export type GuidebookPermission = "ADMIN" | "EDITOR" | "VIEWER";
export type EffectiveAction = "DENY" | "READ" | "WRITE" | "MANAGE";
export type PermissionSource = "PAGE_OVERRIDE" | "GUIDEBOOK" | "TENANT_DEFAULT" | "NONE";

export type AuthTokenBundle = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type HomeResponse = {
  me: {
    userId: number;
    displayName: string;
  };
  notifications: {
    unreadCount: number;
    recent: HomeNotificationItem[];
  };
  recentPages: HomePageItem[];
  starredPages: HomePageItem[];
  tenants: HomeTenantItem[] | null;
};

export type HomeNotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  dataJson: string;
  readAt: string | null;
  createdAt: string;
};

export type HomePageItem = {
  pageId: number;
  guidebookId: number;
  tenantId: number;
  title: string;
  url: string;
  viewedAt?: string | null;
  starredAt?: string | null;
};

export type HomeTenantItem = {
  tenantId: number;
  name: string;
  visibility: TenantVisibility;
};

export type TenantResponse = {
  tenantId: number;
  tenantCode: string;
  name: string;
  visibility: TenantVisibility;
};

export type UserMeResponse = {
  userId: number;
  displayName: string;
  status: UserStatus;
  linkedProviders: OAuthProvider[];
};

export type TenantMeItem = {
  tenantId: number;
  tenantCode: string;
  name: string;
  visibility: TenantVisibility;
  role: TenantRole;
};

export type TenantMeResponse = {
  items: TenantMeItem[];
};

export type NavItem = {
  pageId: number;
  title: string;
  url: string;
  children: NavItem[];
};

export type WikiNavTree = {
  tenantId: number;
  guidebookId: number;
  items: NavItem[];
};

export type NavContext = {
  tenantId: number;
  guidebookId: number;
  breadcrumb: NavContextItem[];
  prev: NavContextItem | null;
  next: NavContextItem | null;
};

export type NavContextItem = {
  pageId: number;
  title: string;
  url: string;
};

export type HeadingSection = {
  type: "HEADING";
  level: number;
  text: string;
  id?: string | null;
};

export type MarkdownSection = {
  type: "MARKDOWN";
  content: string;
};

export type CalloutSection = {
  type: "CALLOUT";
  variant: "INFO" | "WARNING" | "DANGER" | "SUCCESS";
  title?: string | null;
  content: string;
};

export type CodeSection = {
  type: "CODE";
  lang?: string | null;
  content: string;
};

export type TabsSection = {
  type: "TABS";
  items: {
    key: string;
    label: string;
    content: GuidebookSection[];
  }[];
};

export type ImageSection = {
  type: "IMAGE";
  fileId?: number | null;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export type VideoSection = {
  type: "VIDEO";
  fileId?: number | null;
  title?: string | null;
};

export type TableSection = {
  type: "TABLE";
  headers?: string[] | null;
  rows: string[][];
};

export type GuidebookSection =
  | HeadingSection
  | MarkdownSection
  | CalloutSection
  | CodeSection
  | TabsSection
  | ImageSection
  | VideoSection
  | TableSection;

export type PageResponse = {
  pageId: number;
  tenantId: number;
  guidebookId: number;
  parentPageId: number | null;
  orderInParent: number;
  title: string;
  sections: GuidebookSection[];
  meta: Record<string, unknown>;
  status: PageStatus;
  accessPolicy: PageAccessPolicy;
  isUsable: boolean;
  isDeleted: boolean;
};

export type PageDetail = {
  page: PageResponse;
  navContext: NavContext | null;
};

export type PageSearchResult = {
  pageId: number;
  guidebookId: number;
  title: string;
  snippet: string | null;
  updatedAt: string;
  url: string;
};

export type PageSearchResponse = {
  items: PageSearchResult[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type PermissionGateState = {
  effectivePermission: GuidebookPermission | null;
  effectiveAction: EffectiveAction;
  source: PermissionSource;
};

export type GuidebookListResponse = {
  items: GuidebookSummary[];
};

export type TenantCreateRequest = {
  tenantCode: string;
  name: string;
  visibility: TenantVisibility;
};

export type GuidebookCreateRequest = {
  code: string;
  name: string;
  description?: string | null;
  status?: GuidebookStatus;
};

export type GuidebookUpdateRequest = {
  name?: string | null;
  description?: string | null;
  status?: GuidebookStatus | null;
  orderInTenant?: number | null;
};

export type GuidebookSummary = {
  guidebookId: number;
  tenantId: number;
  code: string;
  name: string;
  description: string | null;
  status: GuidebookStatus;
  orderInTenant: number;
  isDeleted: boolean;
};

export type PageListResponse = {
  items: PageResponse[];
};

export type PageCreateRequest = {
  title: string;
  parentPageId?: number | null;
  orderInParent?: number | null;
  sections: GuidebookSection[];
  meta?: Record<string, unknown> | null;
  status?: PageStatus;
  accessPolicy?: PageAccessPolicy;
  isUsable?: boolean;
};

export type PageUpdateRequest = {
  title?: string | null;
  sections?: GuidebookSection[] | null;
  meta?: Record<string, unknown> | null;
  status?: PageStatus | null;
  accessPolicy?: PageAccessPolicy | null;
  isUsable?: boolean | null;
};

export type ViewerSession = {
  user: UserMeResponse | null;
  tenants: TenantMeItem[];
  activeTenantId: number | null;
};

export type FileUploadSession = {
  fileId: number;
  uploadUrl: string;
  accessUrl?: string | null;
};
