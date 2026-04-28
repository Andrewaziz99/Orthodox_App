/**
 * Text normalization utilities for Bible search
 * Handles removal of diacritics for both Arabic and English text
 */

/**
 * Remove Arabic diacritical marks (harakat)
 * Removes: FATHAH, DAMMAH, KASRAH, SUKUN, SHADDA, FATHATAN, DAMMATAN, KASRATAN, etc.
 */
export function removeArabicDiacritics(text: string): string {
  return text.replace(/[\u064B-\u0652]/g, '');
}

/**
 * Remove English accents and diacritical marks
 * Converts é → e, ñ → n, ç → c, etc.
 */
export function removeEnglishAccents(text: string): string {
  return text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .normalize('NFC'); // Recompose
}

/**
 * Normalize text for search based on language
 * Removes diacritics and converts to lowercase
 */
export function normalizeForSearch(
  text: string,
  language: 'ar' | 'en'
): string {
  let normalized = text;

  if (language === 'ar') {
    normalized = removeArabicDiacritics(normalized);
  } else if (language === 'en') {
    normalized = removeEnglishAccents(normalized);
  }

  return normalized.toLowerCase().trim();
}

/**
 * Normalize text but preserve original casing for display
 * Used when we need to match but keep original formatting
 */
export function normalizeForSearchPreservCase(
  text: string,
  language: 'ar' | 'en'
): string {
  let normalized = text;

  if (language === 'ar') {
    normalized = removeArabicDiacritics(normalized);
  } else if (language === 'en') {
    normalized = removeEnglishAccents(normalized);
  }

  return normalized.trim();
}
