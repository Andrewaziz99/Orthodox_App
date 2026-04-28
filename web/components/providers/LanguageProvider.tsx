// components/providers/LanguageProvider.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import arMessages from '@/locales/ar.json';
import enMessages from '@/locales/en.json';

type Locale = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: Direction;
  t: (key: string, optionsOrParams?: any) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Helper to access nested keys in an object using dot notation (e.g., "nav.home")
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  const dir: Direction = locale === 'ar' ? 'rtl' : 'ltr';

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Update HTML attributes for immediate feedback
    document.documentElement.setAttribute('lang', newLocale);
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr');
    // Persist preference
    localStorage.setItem('locale', newLocale);
  }, []);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLocale(saved);
    }
  }, [setLocale]);

  /**
   * Translation function with nested key support and parameter interpolation.
   * Supports returning objects/arrays if optionsOrParams.returnObjects is true.
   */
  const t = useCallback(
    (key: string, optionsOrParams?: any): any => {
      const messages = locale === 'ar' ? arMessages : enMessages;
      let value = getNestedValue(messages, key);

      if (value === undefined || value === null) {
        console.warn(`Missing translation key: "${key}" for locale "${locale}"`);
        return key; // Fallback to key itself
      }

      // Handle parameter interpolation ONLY if value is a string
      if (typeof value === 'string' && optionsOrParams && typeof optionsOrParams === 'object') {
        // Simple heuristic: if it has returnObjects, we don't treat it as interpolation params
        if (!optionsOrParams.returnObjects) {
          Object.entries(optionsOrParams).forEach(([k, v]) => {
            value = (value as string).replace(new RegExp(`{{${k}}}`, 'g'), String(v));
          });
        }
      }

      return value;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
