// lib/types/content.ts

export interface TranslatedString {
  ar: string;
  en: string;
}

export interface Curriculum {
  slug: string;
  number: string;
  title: TranslatedString;
  duration: TranslatedString;
  audience: TranslatedString;
  description: TranslatedString;
  ageRange: TranslatedString;
  badge: string;
  fullContent?: TranslatedString;
  relatedSlugs?: string[];
}

export interface NewsArticle {
  slug: string;
  title: TranslatedString;
  excerpt: TranslatedString;
  body: TranslatedString;
  date: string;
  category: TranslatedString;
  image: string;
  author?: string;
  relatedSlugs?: string[];
}

export interface Audience {
  id: string;
  title: TranslatedString;
  icon: string; // Lucide icon name or image path
  features: string[]; // These are keys for translation
  color: string;
}

export interface Feature {
  id: string;
  label: TranslatedString;
  icon: string;
}
