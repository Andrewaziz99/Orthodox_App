/**
 * Next.js Middleware
 * Server-side route protection — runs on every request before rendering.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = ['/admin'];

// Routes accessible only when NOT logged in
const AUTH_ONLY_ROUTES = ['/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (set on login — see session.ts)
  const token = request.cookies.get('auth_token')?.value;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ONLY_ROUTES.includes(pathname);

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on admin and auth routes only
  matcher: ['/admin/:path*', '/auth/login'],
};
