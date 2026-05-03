/**
 * lib/api/content.ts
 * API client functions for fetching dynamic CMS content from the NestJS backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    const fetchOptions: RequestInit = noCache 
      ? { cache: 'no-store' } 
      : { next: { revalidate: 60 } };
      
    const res = await fetch(`${API_BASE}/content/${section}`, fetchOptions);
    if (!res.ok) return {};
    const items: SiteContentItem[] = await res.json();
    return normalizeSectionContent(items);
  } catch {
    return {};
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getNewsArticles(all = false): Promise<DynamicNewsArticle[]> {
  try {
    const url = all
      ? `${API_BASE}/news?all=true`
      : `${API_BASE}/news`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getNewsArticle(slug: string): Promise<DynamicNewsArticle | null> {
  try {
    const res = await fetch(`${API_BASE}/news/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function upsertNews(article: Partial<DynamicNewsArticle>, token: string): Promise<DynamicNewsArticle | null> {
  try {
    const isUpdate = !!article.id;
    const url = isUpdate ? `${API_BASE}/news/${article.id}` : `${API_BASE}/news`;
    
    // Strip metadata
    const { createdAt, updatedAt, ...payload } = article as any;

    const res = await fetch(url, {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteNews(id: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Curricula ────────────────────────────────────────────────────────────────

export async function getCurriculaList(all = false): Promise<DynamicCurriculum[]> {
  try {
    const url = all
      ? `${API_BASE}/curricula?all=true`
      : `${API_BASE}/curricula`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCurriculum(slug: string): Promise<DynamicCurriculum | null> {
  try {
    const res = await fetch(`${API_BASE}/curricula/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function upsertCurriculum(curriculum: Partial<DynamicCurriculum>, token: string): Promise<DynamicCurriculum | null> {
  try {
    const isUpdate = !!curriculum.id;
    const url = isUpdate ? `${API_BASE}/curricula/${curriculum.id}` : `${API_BASE}/curricula`;
    
    // Strip metadata that backend might reject
    const { createdAt, updatedAt, ...payload } = curriculum as any;

    const res = await fetch(url, {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteCurriculum(id: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/curricula/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<DynamicVideo[]> {
  try {
    const res = await fetch(`${API_BASE}/videos`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function upsertVideo(video: Partial<DynamicVideo>, token: string): Promise<DynamicVideo | null> {
  try {
    const isUpdate = !!video.id;
    const url = isUpdate ? `${API_BASE}/videos/${video.id}` : `${API_BASE}/videos`;
    const res = await fetch(url, {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(video),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteVideo(id: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Admin write helpers (require auth token) ─────────────────────────────────

export async function upsertSiteContent(
  section: string,
  key: string,
  valueAr: string,
  valueEn: string,
  type: string,
  token: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/content/${section}/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ valueAr, valueEn, type }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function bulkUpsertSection(
  section: string,
  entries: Array<{ key: string; valueAr: string; valueEn: string; type: string }>,
  token: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/content/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entries),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function uploadImage(file: File, token: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
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
