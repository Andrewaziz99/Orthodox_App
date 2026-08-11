const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';
const SESSION_GENERATION_KEY = 'auth_session_generation';
export const SESSION_CLEARED_EVENT = 'graphy-session-cleared';

export type GraphyUserType = 'super_admin' | 'church_admin' | 'servant' | 'child';

export interface AuthUser {
  id: string;
  type: GraphyUserType;
  churchId?: string;
  fullName?: string;
  classId?: string;
}

function writeTokenCookie(token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `auth_token=${token}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
}

export function setSession(accessToken: string, refreshToken: string, user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_GENERATION_KEY, crypto.randomUUID());
  setTokens(accessToken, refreshToken);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  writeTokenCookie(accessToken);
}

export function getToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionGeneration(): string | null {
  if (typeof window === 'undefined') return null;
  const generation = localStorage.getItem(SESSION_GENERATION_KEY);
  if (generation) return generation;
  if (!getToken() || !getRefreshToken()) return null;

  const migratedGeneration = crypto.randomUUID();
  localStorage.setItem(SESSION_GENERATION_KEY, migratedGeneration);
  return migratedGeneration;
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const serializedUser = localStorage.getItem(USER_KEY);
  if (!serializedUser) return null;

  try {
    return JSON.parse(serializedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken() && getUser());
}

export function clearSession(expectedGeneration?: string): void {
  if (typeof window === 'undefined') return;
  if (expectedGeneration && getSessionGeneration() !== expectedGeneration) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_GENERATION_KEY);
  document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
}
