/**
 * lib/api/content.ts
 * API client functions for fetching dynamic CMS content from the NestJS backend.
 */

import { ApiError, cmsApi } from './client';

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
  graphyCurriculumId?: string;
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

export async function getSectionContent(section: string, noCache = false): Promise<SectionContent> {
  const options = noCache ? { cache: 'no-store' as RequestCache } : { next: { revalidate: 60 } };
  const items = await cmsApi.get<SiteContentItem[]>(`/content/${section}`, {
    ...options,
    requiresAuth: false,
  });
  return normalizeSectionContent(items);
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getNewsArticles(all = false): Promise<DynamicNewsArticle[]> {
  const url = all ? '/news/admin/all' : '/news';
  return cmsApi.get<DynamicNewsArticle[]>(url, {
    requiresAuth: all,
    next: { revalidate: 60 },
  });
}

export async function getNewsArticle(slug: string): Promise<DynamicNewsArticle | null> {
  try {
    return await cmsApi.get<DynamicNewsArticle>(`/news/${slug}`, { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function upsertNews(article: Partial<DynamicNewsArticle>): Promise<DynamicNewsArticle> {
  const isUpdate = Boolean(article.id);
  const url = isUpdate ? `/news/${article.id}` : '/news';
  const { createdAt, updatedAt, ...payload } = article;
  return isUpdate
    ? cmsApi.put<DynamicNewsArticle>(url, payload)
    : cmsApi.post<DynamicNewsArticle>(url, payload);
}

export async function deleteNews(id: string): Promise<void> {
  await cmsApi.delete(`/news/${id}`);
}

// ─── Curricula ────────────────────────────────────────────────────────────────

export async function getCurriculaList(all = false): Promise<DynamicCurriculum[]> {
  const url = all ? '/curricula/admin/all' : '/curricula';
  return cmsApi.get<DynamicCurriculum[]>(url, {
    requiresAuth: all,
    next: { revalidate: 60 },
  });
}

export async function getCurriculum(slug: string): Promise<DynamicCurriculum | null> {
  try {
    return await cmsApi.get<DynamicCurriculum>(`/curricula/${slug}`, { requiresAuth: false, next: { revalidate: 60 } } as any);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function upsertCurriculum(curriculum: Partial<DynamicCurriculum>): Promise<DynamicCurriculum> {
  const isUpdate = Boolean(curriculum.id);
  const url = isUpdate ? `/curricula/${curriculum.id}` : '/curricula';
  const { id, ...payload } = curriculum;
  return isUpdate
    ? cmsApi.put<DynamicCurriculum>(url, payload)
    : cmsApi.post<DynamicCurriculum>(url, payload);
}

export async function deleteCurriculum(id: string): Promise<void> {
  await cmsApi.delete(`/curricula/${id}`);
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<DynamicVideo[]> {
  return cmsApi.get<DynamicVideo[]>('/videos', {
    requiresAuth: false,
    next: { revalidate: 60 },
  });
}

export async function upsertVideo(video: Partial<DynamicVideo>): Promise<DynamicVideo> {
  const isUpdate = Boolean(video.id);
  const url = isUpdate ? `/videos/${video.id}` : '/videos';
  return isUpdate
    ? cmsApi.put<DynamicVideo>(url, video)
    : cmsApi.post<DynamicVideo>(url, video);
}

export async function deleteVideo(id: string): Promise<void> {
  await cmsApi.delete(`/videos/${id}`);
}

// ─── Admin write helpers ──────────────────────────────────────────────────────

export async function bulkUpsertSection(
  section: string,
  entries: Array<{ key: string; valueAr: string; valueEn: string; type: string }>,
): Promise<void> {
  await cmsApi.put(`/content/${section}`, entries);
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const uploadResponse = await cmsApi.postForm<{ url: string }>('/upload', formData);
  return uploadResponse.url;
}
