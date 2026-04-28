"use client";

import { useEffect } from "react";
import { useLang } from "./providers/LanguageProvider";

/**
 * Small client component that dynamically updates the lang and dir
 * attributes on the <html> element when the locale changes.
 * 
 * This replaces the old ClientHtml pattern where <html> was wrapped
 * in a client component, which blocked Next.js SSR metadata management.
 */
export default function HtmlDirectionSetter() {
  const { locale, t } = useLang();

  useEffect(() => {
    // 1. Update HTML attributes for SEO and accessibility
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    // 2. Update Document Title
    const title = t('meta.title');
    if (title) {
       document.title = title;
    }

    // 3. Update Meta Description and OG tags for client-side navigation
    const description = t('meta.description');
    
    // Helper to update/create meta tag
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, true);
    }
    
    if (title) {
       updateMeta('og:title', title, true);
    }
    
  }, [locale, t]);

  return null;
}
