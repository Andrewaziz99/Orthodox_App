/**
 * Protected Route Middleware
 * HOC and hooks for route protection
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, hasRole, getUser } from '../auth/session';

/**
 * Hook to protect routes - redirects if not authenticated
 */
export function useRequireAuth(requiredRoles?: string[]) {
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(requiredRoles)) {
        router.push('/unauthorized');
        return;
      }
    }

    setIsChecking(false);
  }, [router, requiredRoles]);

  return {
    user: getUser(),
    isAuthenticated: isAuthenticated(),
    isChecking,
  };
}

/**
 * Hook for admin-only routes
 */
export function useRequireAdmin() {
  return useRequireAuth(['super_admin', 'church_admin']);
}

/**
 * Hook for super admin only routes
 */
export function useRequireSuperAdmin() {
  return useRequireAuth(['super_admin']);
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(): boolean {
  return hasRole(['super_admin', 'church_admin']);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(): boolean {
  return hasRole(['super_admin']);
}

/**
 * Get current user's church ID
 */
export function getCurrentChurchId(): string | null {
  const user = getUser();
  return user?.churchId || null;
}

export { getUser };
