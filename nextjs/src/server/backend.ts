import { cookies } from "next/headers";
import type {
  ApiEnvelope,
  ApiErrorPayload,
  AuthTokenBundle,
  BackendResult,
} from "@/shared/lib/api-types";
import { getBackendBaseUrl } from "@/server/env";
import { readSessionSnapshot } from "@/server/session";

type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type BackendRequestOptions = {
  path: string;
  method?: RequestMethod;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  tenantId?: number | string | null;
  requireAuth?: boolean;
  ignoreAuth?: boolean;
  session?: {
    accessToken: string | null;
    refreshToken: string | null;
  };
};

type RawBackendResponse<T> = BackendResult<T> & {
  refreshedTokens?: AuthTokenBundle | null;
};

export async function requestBackend<T>(options: BackendRequestOptions): Promise<RawBackendResponse<T>> {
  const cookieStore = await cookies();
  const session = options.session ?? readSessionSnapshot(cookieStore);
  const tenantId = options.tenantId ?? readSessionSnapshot(cookieStore).tenantId;

  const firstAttempt = await performRequest<T>({
    ...options,
    session,
    tenantId,
  });

  if (firstAttempt.status !== 401 || options.ignoreAuth || !session.refreshToken) {
    return firstAttempt;
  }

  const refreshedTokens = await refreshTokens(session.refreshToken);
  if (!refreshedTokens) {
    return firstAttempt;
  }

  const retried = await performRequest<T>({
    ...options,
    session: {
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
    },
    tenantId,
  });

  return {
    ...retried,
    refreshedTokens,
  };
}

async function performRequest<T>(
  options: BackendRequestOptions & {
    session: {
      accessToken: string | null;
      refreshToken: string | null;
    };
    tenantId: number | string | null;
  },
): Promise<RawBackendResponse<T>> {
  const url = new URL(options.path, getBackendBaseUrl());
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });

  const headers = new Headers();
  headers.set("Accept", "application/json");
  if (!options.ignoreAuth && options.session.accessToken) {
    headers.set("Authorization", `Bearer ${options.session.accessToken}`);
  }
  if (options.tenantId != null) {
    headers.set("X-Tenant-Id", String(options.tenantId));
  }
  if (options.body != null) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body == null ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });
    return parseResponse<T>(response);
  } catch {
    return {
      ok: false,
      status: 503,
      data: null,
      error: {
        code: "BACKEND_UNAVAILABLE",
        message: "Guidebook backend is unreachable.",
      },
    };
  }
}

async function parseResponse<T>(response: Response): Promise<RawBackendResponse<T>> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const body = await response.text();
    return response.ok
      ? {
          ok: true,
          status: response.status,
          data: body as T,
          error: null,
        }
      : {
          ok: false,
          status: response.status,
          data: null,
          error: normalizeError(null, response.status, body),
        };
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (response.ok && envelope.success && envelope.data != null) {
    return {
      ok: true,
      status: response.status,
      data: envelope.data,
      error: null,
    };
  }

  return {
    ok: false,
    status: response.status,
    data: null,
    error: normalizeError(envelope.error, response.status),
  };
}

function normalizeError(error: ApiErrorPayload | null, status: number, fallbackMessage?: string): ApiErrorPayload {
  if (error) {
    return error;
  }

  if (status === 401) {
    return { code: "UNAUTHORIZED", message: "로그인이 필요합니다." };
  }

  if (status === 403) {
    return { code: "FORBIDDEN", message: "권한이 없습니다." };
  }

  if (status === 404) {
    return { code: "NOT_FOUND", message: "요청한 리소스를 찾을 수 없습니다." };
  }

  return {
    code: "BACKEND_ERROR",
    message: fallbackMessage || "백엔드 응답을 처리하지 못했습니다.",
  };
}

async function refreshTokens(refreshToken: string): Promise<AuthTokenBundle | null> {
  try {
    const response = await fetch(new URL("/api/auth/refresh", getBackendBaseUrl()), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AuthTokenBundle | ApiEnvelope<AuthTokenBundle>;
    if ("success" in payload) {
      return payload.success ? payload.data : null;
    }
    return payload;
  } catch {
    return null;
  }
}
