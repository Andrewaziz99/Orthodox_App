// hooks/useTranslation.ts
'use client';
import { useLang } from '@/components/providers/LanguageProvider';

/**
 * Convenience hook for accessing the translation function and locale info.
 * This is the primary way components should access text content.
 */
export function useTranslation() {
  const { t, locale, dir } = useLang();
  return { t, locale, dir };
}
