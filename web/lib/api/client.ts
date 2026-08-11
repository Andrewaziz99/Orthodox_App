import {
  clearSession,
  getRefreshToken,
  getSessionGeneration,
  getToken,
  setTokens,
} from '../auth/session';

export const GRAPHY_API_URL =
  process.env.NEXT_PUBLIC_GRAPHY_API_URL || 'http://localhost:3000/api/v1';
export const CMS_API_URL =
  process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3005';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  next?: { revalidate?: number };
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<string | null> | null = null;
const REFRESH_INTENT_PREFIX = 'graphy-refresh-intent:';
const REFRESH_INTENT_TTL_MS = 60_000;

interface RefreshIntent {
  id: string;
  createdAt: number;
  expiresAt: number;
}

async function requestTokenRefresh(refreshToken: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30_000);
  try {
    return await fetch(`${GRAPHY_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function parseRefreshIntent(serializedIntent: string, now: number): RefreshIntent | null {
  const parsedIntent: unknown = JSON.parse(serializedIntent);
  if (typeof parsedIntent !== 'object' || parsedIntent === null) return null;
  if (!('id' in parsedIntent) || typeof parsedIntent.id !== 'string') return null;
  if (!('createdAt' in parsedIntent) || typeof parsedIntent.createdAt !== 'number') return null;
  if (!('expiresAt' in parsedIntent) || typeof parsedIntent.expiresAt !== 'number') return null;
  return parsedIntent.expiresAt > now ? (parsedIntent as RefreshIntent) : null;
}

function getRefreshIntents(now: number): RefreshIntent[] {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(REFRESH_INTENT_PREFIX))
    .flatMap((key) => {
      try {
        const intent = parseRefreshIntent(localStorage.getItem(key) ?? '', now);
        if (intent) return [intent];
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
      }
      localStorage.removeItem(key);
      return [];
    })
    .sort((left, right) => left.createdAt - right.createdAt || left.id.localeCompare(right.id));
}

async function withRefreshFallbackLock<T>(rotate: () => Promise<T>): Promise<T> {
  const intent: RefreshIntent = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    expiresAt: Date.now() + REFRESH_INTENT_TTL_MS,
  };
  const key = `${REFRESH_INTENT_PREFIX}${intent.id}`;
  localStorage.setItem(key, JSON.stringify(intent));

  try {
    while (true) {
      intent.expiresAt = Date.now() + REFRESH_INTENT_TTL_MS;
      localStorage.setItem(key, JSON.stringify(intent));
      await wait(50);
      if (getRefreshIntents(Date.now())[0]?.id !== intent.id) continue;

      const heartbeat = window.setInterval(() => {
        intent.expiresAt = Date.now() + REFRESH_INTENT_TTL_MS;
        localStorage.setItem(key, JSON.stringify(intent));
      }, REFRESH_INTENT_TTL_MS / 2);
      try {
        return await rotate();
      } finally {
        window.clearInterval(heartbeat);
      }
    }
  } finally {
    localStorage.removeItem(key);
  }
}

async function performTokenRefresh(
  refreshToken: string,
  sessionGeneration: string,
): Promise<string | null> {
  const response = await requestTokenRefresh(refreshToken);

  if (!response.ok) {
    if (
      response.status === 401 &&
      getSessionGeneration() === sessionGeneration &&
      getRefreshToken() === refreshToken
    ) {
      clearSession(sessionGeneration);
    }
    return parseResponse<string>(response);
  }

  const tokens = (await response.json()) as TokenPair;
  if (getSessionGeneration() !== sessionGeneration) return null;
  if (getRefreshToken() !== refreshToken) return getToken();
  setTokens(tokens.accessToken, tokens.refreshToken);
  return tokens.accessToken;
}

async function refreshAcrossTabs(
  refreshToken: string,
  sessionGeneration: string,
): Promise<string | null> {
  const rotate = () => {
    if (getSessionGeneration() !== sessionGeneration) return Promise.resolve(null);
    if (getRefreshToken() !== refreshToken) return Promise.resolve(getToken());
    return performTokenRefresh(refreshToken, sessionGeneration);
  };

  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request('graphy-session-refresh', rotate);
  }
  return withRefreshFallbackLock(rotate);
}

async function refreshAccessToken(sessionGeneration: string | null): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !sessionGeneration) return null;

  if (!refreshPromise) {
    refreshPromise = refreshAcrossTabs(refreshToken, sessionGeneration).finally(() => {
        refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      typeof errorData === 'object' && errorData && 'message' in errorData
        ? String(errorData.message)
        : response.statusText;
    throw new ApiError(response.status, message, errorData);
  }

  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}

async function request<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestOptions = {},
  hasRetried = false,
): Promise<T> {
  const { requiresAuth = true, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);
  const token = requiresAuth ? getToken() : null;
  const sessionGeneration = requiresAuth ? getSessionGeneration() : null;

  if (requestOptions.body && !(requestOptions.body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...requestOptions,
      headers: requestHeaders,
    });

    if (response.status === 401 && requiresAuth && !hasRetried) {
      const refreshedToken = await refreshAccessToken(sessionGeneration);
      if (refreshedToken && getSessionGeneration() === sessionGeneration) {
        return request<T>(baseUrl, endpoint, options, true);
      }
    }

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }
}

function createApiClient(baseUrl: string) {
  return {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(baseUrl, endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, payload?: unknown, options?: RequestOptions) =>
      request<T>(baseUrl, endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    postForm: <T>(endpoint: string, formData: FormData, options?: RequestOptions) =>
      request<T>(baseUrl, endpoint, { ...options, method: 'POST', body: formData }),
    patch: <T>(endpoint: string, payload?: unknown, options?: RequestOptions) =>
      request<T>(baseUrl, endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    put: <T>(endpoint: string, payload?: unknown, options?: RequestOptions) =>
      request<T>(baseUrl, endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(baseUrl, endpoint, { ...options, method: 'DELETE' }),
  };
}

export const graphyApi = createApiClient(GRAPHY_API_URL);
export const cmsApi = createApiClient(CMS_API_URL);

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return error.message || 'Validation error.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An error occurred.';
    }
  }

  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}
