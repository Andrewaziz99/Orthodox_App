import { Bible, SearchResult, SearchMatch } from './bible-types';
import { normalizeForSearch } from './normalization';
import { getBookName } from './book-names';

/**
 * Search the Bible for a term across all verses
 * Normalizes both search term and verse text before matching
 * Returns all matching verses with match positions highlighted
 */
export function searchBible(
  searchTerm: string,
  bibleData: Bible,
  language: 'ar' | 'en'
): SearchResult[] {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  const normalizedSearchTerm = normalizeForSearch(searchTerm, language);
  const results: SearchResult[] = [];
  let matchCount = 0;
  const maxResults = 100; // Limit results to prevent lag

  // Iterate through all testaments, books, chapters, and verses
  outer: for (const testament of bibleData.testaments) {
    for (const book of testament.books) {
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          if (matchCount >= maxResults) break outer; // Exit early if we have enough results
          
          const normalizedVerseText = normalizeForSearch(verse.text, language);
          const matches = findMatches(normalizedVerseText, normalizedSearchTerm, verse.text, language);

          if (matches.length > 0) {
            const translatedBookName = getBookName(book.number, language);
            const verseRef = `${translatedBookName} ${chapter.number}:${verse.number}`;
            results.push({
              verseRef,
              bookNumber: book.number,
              bookName: translatedBookName,
              chapterNumber: chapter.number,
              verseNumber: verse.number,
              text: verse.text,
              matches,
            });
            matchCount++;
          }
        }
      }
    }
  }

  return results;
}

/**
 * Create a character-by-character map from original to normalized text
 * Tracks which characters in original correspond to positions in normalized
 */
function createCharacterMap(text: string, language: 'ar' | 'en'): number[] {
  const map: number[] = [];
  let normalizedIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isArabicDiacritic = language === 'ar' && /[\u064B-\u0652]/.test(char);
    
    // If it's a diacritic, map to same normalized index (it will be removed)
    if (isArabicDiacritic) {
      map.push(normalizedIndex);
    } else {
      // Regular character - increment normalized index
      map.push(normalizedIndex);
      normalizedIndex++;
    }
  }
  
  return map;
}

/**
 * Find all matches of a search term in the text
 * Returns array of match positions with the original text
 * Uses character mapping to correctly handle diacritics
 */
function findMatches(
  normalizedText: string,
  normalizedSearchTerm: string,
  originalText: string,
  language: 'ar' | 'en'
): SearchMatch[] {
  const matches: SearchMatch[] = [];
  const charMap = createCharacterMap(originalText, language);
  
  let searchIndex = 0;

  // Find all occurrences of the normalized search term
  while (searchIndex < normalizedText.length) {
    const matchIndex = normalizedText.indexOf(normalizedSearchTerm, searchIndex);
    if (matchIndex === -1) {
      break;
    }

    // Find corresponding position in original text using character map
    const originalStart = charMap.findIndex(pos => pos === matchIndex);
    
    if (originalStart !== -1) {
      // Find end position in original text
      let originalEnd = originalStart;
      let normalizedLength = 0;
      
      for (let i = originalStart; i < originalText.length && normalizedLength < normalizedSearchTerm.length; i++) {
        originalEnd = i + 1;
        // Only count non-diacritics in normalized length
        const isArabicDiacritic = language === 'ar' && /[\u064B-\u0652]/.test(originalText[i]);
        if (!isArabicDiacritic) {
          normalizedLength++;
        }
      }

      if (normalizedLength === normalizedSearchTerm.length) {
        const word = originalText.substring(originalStart, originalEnd);
        matches.push({
          start: originalStart,
          end: originalEnd,
          word,
        });
      }
    }

    searchIndex = matchIndex + 1;
  }

  return matches;
}

/**
 * Get unique books and verse counts from search results
 */
export function getSearchStats(results: SearchResult[]): {
  versesFound: number;
  booksFound: Set<string>;
  matchCount: number;
} {
  const booksFound = new Set<string>();
  let matchCount = 0;

  for (const result of results) {
    booksFound.add(result.bookName);
    matchCount += result.matches.length;
  }

  return {
    versesFound: results.length,
    booksFound,
    matchCount,
  };
}
