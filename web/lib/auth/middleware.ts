"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from './session';

/**
 * Synchronous helper to check if current user is a super admin
 */
export function isSuperAdmin(): boolean {
  const u = getUser();
  return !!u && u.role === 'super_admin';
}

/**
 * Hook used across admin client pages/layouts to ensure the user is authenticated.
 * Returns an object with `isChecking` so callers can delay rendering until check finishes.
 */
export function useRequireAdmin() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      const from = typeof window !== 'undefined' ? window.location.pathname : '/';
      router.push(`/auth/login?from=${encodeURIComponent(from)}`);
      return;
    }

    setIsChecking(false);
  }, [router]);

  return { isChecking };
}

/**
 * Hook that enforces the current user is a super admin.
 * If not, redirects back to the admin dashboard.
 */
export function useRequireSuperAdmin() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'super_admin') {
      router.push('/admin');
    }
  }, [router]);
}

export { getUser };
