/**
 * Authentication Session Management
 * Handles JWT token storage, validation, and user session
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'super_admin' | 'church_admin' | 'servant' | 'child';
  churchId?: string;
}

export interface AuthToken {
  access_token: string;
  role: string;
}

/**
 * Store authentication token and user data.
 * Writes to both localStorage (client reads) and a cookie (middleware reads).
 */
export function setSession(token: string, user: AuthUser): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Also persist to cookie so Next.js middleware can check auth server-side.
  // Not httpOnly — client JS needs read access too. Use Secure in production.
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? '; Secure' : '';
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `auth_token=${token}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
}

/**
 * Get stored authentication token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Check if user has required role
 */
export function hasRole(requiredRoles: string[]): boolean {
  const user = getUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

/**
 * Clear session and logout
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Expire the cookie so middleware stops allowing access immediately
  document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

/**
 * Decode JWT token (basic, without verification)
 * For display purposes only - server validates
 */
export function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTime;
}

/**
 * Get user from token
 */
export function getUserFromToken(token: string): AuthUser | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub || decoded.id,
    name: decoded.name || '',
    email: decoded.email,
    phone: decoded.phone,
    role: decoded.role,
    churchId: decoded.churchId,
  };
}