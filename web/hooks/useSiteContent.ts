/**
 * hooks/useSiteContent.ts
 * Client-side hook for components that need to read dynamic content.
 * Used primarily inside admin forms; public pages use server-side fetching.
 */
'use client';

import { useState, useEffect } from 'react';
import { getSectionContent, SectionContent, pick } from '@/lib/api/content';

interface UseSiteContentReturn {
  content: SectionContent;
  setContent: React.Dispatch<React.SetStateAction<SectionContent>>;
  loading: boolean;
  /** Convenience: get a field for the current locale with t() fallback */
  getField: (key: string, locale: 'ar' | 'en', fallback?: string) => string;
}

export function useSiteContent(section: string): UseSiteContentReturn {
  const [content, setContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We pass true to bypass Next.js cache so the admin always sees fresh data
    getSectionContent(section, true)
      .then(setContent)
      .finally(() => setLoading(false));
  }, [section]);

  const getField = (key: string, locale: 'ar' | 'en', fallback = '') => {
    const val = pick(content, key, locale);
    return val || fallback;
  };

  return { content, setContent, loading, getField };
}
