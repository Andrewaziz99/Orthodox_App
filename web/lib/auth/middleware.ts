"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, SESSION_CLEARED_EVENT } from './session';

/**
 * Synchronous helper to check if current user is a super admin
 */
export function isSuperAdmin(): boolean {
  const u = getUser();
  return !!u && u.type === 'super_admin';
}

/**
 * Hook used across admin client pages/layouts to ensure the user is authenticated.
 * Returns an object with `isChecking` so callers can delay rendering until check finishes.
 */
export function useRequireAdmin() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const redirectToLogin = () => {
      const from = window.location.pathname;
      router.push(`/auth/login?from=${encodeURIComponent(from)}`);
    };
    const user = getUser();
    if (!isAuthenticated() || !user || !['super_admin', 'church_admin'].includes(user.type)) {
      redirectToLogin();
      return;
    }

    setIsChecking(false);
    window.addEventListener(SESSION_CLEARED_EVENT, redirectToLogin);
    const handleStorage = () => {
      if (!isAuthenticated()) redirectToLogin();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(SESSION_CLEARED_EVENT, redirectToLogin);
      window.removeEventListener('storage', handleStorage);
    };
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
    const enforceRole = () => {
      const user = getUser();
      if (!isAuthenticated()) router.push('/auth/login');
      else if (!user || user.type !== 'super_admin') router.push('/admin');
    };
    enforceRole();
    window.addEventListener(SESSION_CLEARED_EVENT, enforceRole);
    window.addEventListener('storage', enforceRole);
    return () => {
      window.removeEventListener(SESSION_CLEARED_EVENT, enforceRole);
      window.removeEventListener('storage', enforceRole);
    };
  }, [router]);
}

export { getUser };
