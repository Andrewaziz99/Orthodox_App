/**
 * lib/api/content.ts
 * API client functions for fetching dynamic CMS content from the NestJS backend.
 */

import { api } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteContentItem {
  id: string;
  section: string;
  key: string;
  valueAr?: string;
  valueEn?: string;
  type: 'text' | 'textarea' | 'image' | 'json';
  updatedAt: string;
}

/** Helper: turn an array of SiteContentItems into a flat key→locale map */
export type SectionContent = Record<string, { ar: string; en: string; type: string }>;

export interface DynamicNewsArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  bodyAr: string;
  bodyEn: string;
  categoryAr: string;
  categoryEn: string;
  date: string;
  author?: string;
  image?: string;
  published: boolean;
  order: number;
  relatedSlugs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DynamicCurriculum {
  id: string;
  slug: string;
  number: string;
  badge: string;
  titleAr: string;
  titleEn: string;
  durationAr: string;
  durationEn: string;
  audienceAr: string;
  audienceEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ageRangeAr: string;
  ageRangeEn: string;
  fullContentAr?: string;
  fullContentEn?: string;
  order: number;
  published: boolean;
  relatedSlugs?: string[];
}

export interface DynamicVideo {
  id: string;
  titleAr: string;
  titleEn: string;
  thumbnailUrl?: string;
  videoUrl: string;
  isYoutube: boolean;
  order: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalize an array of SiteContentItems into a flat { key: { ar, en } } map
 * so components can do: content['heading'].ar
 */
export function normalizeSectionContent(items: SiteContentItem[]): SectionContent {
  return items.reduce<SectionContent>((acc, item) => {
    acc[item.key] = { ar: item.valueAr ?? '', en: item.valueEn ?? '', type: item.type };
    return acc;
  }, {});
}

/**
 * Pick a locale value from a SectionContent entry.
 * Falls back to the other locale, then empty string.
 */
export function pick(
  content: SectionContent,
  key: string,
  locale: 'ar' | 'en',
): string {
  const entry = content[key];
  if (!entry) return '';
  return entry[locale] || entry[locale === 'ar' ? 'en' : 'ar'] || '';
}

// ─── Site Content ─────────────────────────────────────────────────────────────

/**
 * Fetch all key/value pairs for a section.
 * Returns an empty array if the backend is unavailable (graceful fallback).
 */
export async function getSectionContent(section: string, noCache = false): Promise<SectionContent> {
  try {
    const options = noCache ? { cache: 'no-store' as RequestCache } : { next: { revalidate: 60 } } as any;
    const items = await api.get<SiteContentItem[]>(`/content/${section}`, { ...options, requiresAuth: false });
    return normalizeSectionContent(items);
  } catch (error) {
    console.error(`Failed to fetch section content (${section}):`, error);
    return {};
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getNewsArticles(all = false): Promise<DynamicNewsArticle[]> {
  try {
    const url = all ? '/news?all=true' : '/news';
    return await api.get<DynamicNewsArticle[]>(url, { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch {
    return [];
  }
}

export async function getNewsArticle(slug: string): Promise<DynamicNewsArticle | null> {
  try {
    return await api.get<DynamicNewsArticle>(`/news/${slug}`, { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch {
    return null;
  }
}

export async function upsertNews(article: Partial<DynamicNewsArticle>, token: string): Promise<DynamicNewsArticle | null> {
  try {
    const isUpdate = !!article.id;
    const url = isUpdate ? `/news/${article.id}` : '/news';
    
    // Strip metadata
    const { createdAt, updatedAt, ...payload } = article as any;

    if (isUpdate) {
      return await api.patch<DynamicNewsArticle>(url, payload);
    } else {
      return await api.post<DynamicNewsArticle>(url, payload);
    }
  } catch {
    return null;
  }
}

export async function deleteNews(id: string, token: string): Promise<boolean> {
  try {
    await api.delete(`/news/${id}`);
    return true;
  } catch {
    return false;
  }
}

// ─── Curricula ────────────────────────────────────────────────────────────────

export async function getCurriculaList(all = false): Promise<DynamicCurriculum[]> {
  try {
    const url = all ? '/curricula?all=true' : '/curricula';
    return await api.get<DynamicCurriculum[]>(url, { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch {
    return [];
  }
}

export async function getCurriculum(slug: string): Promise<DynamicCurriculum | null> {
  try {
    return await api.get<DynamicCurriculum>(`/curricula/${slug}`, { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch {
    return null;
  }
}

export async function upsertCurriculum(curriculum: Partial<DynamicCurriculum>, token: string): Promise<DynamicCurriculum | null> {
  try {
    const isUpdate = !!curriculum.id;
    const url = isUpdate ? `/curricula/${curriculum.id}` : '/curricula';
    
    // Strip metadata that backend might reject
    const { createdAt, updatedAt, ...payload } = curriculum as any;

    if (isUpdate) {
      return await api.patch<DynamicCurriculum>(url, payload);
    } else {
      return await api.post<DynamicCurriculum>(url, payload);
    }
  } catch {
    return null;
  }
}

export async function deleteCurriculum(id: string, token: string): Promise<boolean> {
  try {
    await api.delete(`/curricula/${id}`);
    return true;
  } catch {
    return false;
  }
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<DynamicVideo[]> {
  try {
    return await api.get<DynamicVideo[]>('/videos', { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch {
    return [];
  }
}

export async function upsertVideo(video: Partial<DynamicVideo>, token: string): Promise<DynamicVideo | null> {
  try {
    const isUpdate = !!video.id;
    const url = isUpdate ? `/videos/${video.id}` : '/videos';
    if (isUpdate) {
      return await api.patch<DynamicVideo>(url, video);
    } else {
      return await api.post<DynamicVideo>(url, video);
    }
  } catch {
    return null;
  }
}

export async function deleteVideo(id: string, token: string): Promise<boolean> {
  try {
    await api.delete(`/videos/${id}`);
    return true;
  } catch {
    return false;
  }
}

// ─── Admin write helpers ──────────────────────────────────────────────────────

export async function bulkUpsertSection(
  section: string,
  entries: Array<{ key: string; valueAr: string; valueEn: string; type: string }>,
  token: string,
): Promise<boolean> {
  try {
    await api.put(`/content/${section}`, entries);
    return true;
  } catch {
    return false;
  }
}

export async function uploadImage(file: File, token: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Custom request for FormData
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.url as string;
  } catch {
    return null;
  }
}
