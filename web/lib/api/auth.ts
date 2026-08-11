import { clearSession, getSessionGeneration, type AuthUser } from '../auth/session';
import { graphyApi } from './client';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return graphyApi.post<LoginResponse>('/auth/login', data, { requiresAuth: false });
}

export async function logout(): Promise<void> {
  const sessionGeneration = getSessionGeneration() ?? undefined;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    await graphyApi.post('/auth/logout', undefined, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
    clearSession(sessionGeneration);
  }
}
