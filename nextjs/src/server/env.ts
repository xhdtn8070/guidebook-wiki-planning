const defaultBackendUrl = "http://localhost:8080";

export const sessionCookieNames = {
  accessToken: "guidebook_access_token",
  refreshToken: "guidebook_refresh_token",
  tenantId: "guidebook_tenant_id",
  redirectTo: "guidebook_post_login_redirect",
} as const;

export function getBackendBaseUrl() {
  return process.env.GUIDEBOOK_API_BASE_URL?.replace(/\/$/, "") || defaultBackendUrl;
}
