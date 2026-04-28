import { Bible, SearchResult, SearchMatch } from './bible-types';
import { normalizeForSearch, removeArabicDiacritics } from './normalization';
import { getBookName } from './book-names';

/**
 * Inverted index structure for fast searching
 * Maps normalized words to their locations in the Bible
 */
export interface SearchIndex {
  wordToVerses: Map<string, SearchLocation[]>;
  language: 'ar' | 'en';
}

export interface SearchLocation {
  bookNumber: number;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  wordStartIndex: number;
  wordEndIndex: number;
}

/**
 * Build an inverted index for the entire Bible
 * This is done once at initialization for fast subsequent searches
 */
export function buildSearchIndex(bibleData: Bible, language: 'ar' | 'en'): SearchIndex {
  const wordToVerses = new Map<string, SearchLocation[]>();

  for (const testament of bibleData.testaments) {
    for (const book of testament.books) {
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          // Split verse into words and index each one
          indexVerseText(
            verse.text,
            book.number,
            chapter.number,
            verse.number,
            wordToVerses,
            language
          );
        }
      }
    }
  }

  return { wordToVerses, language };
}

/**
 * Index a single verse's text by breaking it into words
 */
function indexVerseText(
  verseText: string,
  bookNumber: number,
  chapterNumber: number,
  verseNumber: number,
  wordToVerses: Map<string, SearchLocation[]>,
  language: 'ar' | 'en'
): void {
  // Split by whitespace and punctuation, but keep positions
  const words = verseText.match(/\S+/g) || [];
  let currentPos = 0;

  for (const word of words) {
    const startIndex = verseText.indexOf(word, currentPos);
    if (startIndex === -1) continue;

    const endIndex = startIndex + word.length;
    const normalized = normalizeForSearch(word, language);

    // Add this location to the word's index
    if (!wordToVerses.has(normalized)) {
      wordToVerses.set(normalized, []);
    }

    wordToVerses.get(normalized)!.push({
      bookNumber,
      chapterNumber,
      verseNumber,
      verseText,
      wordStartIndex: startIndex,
      wordEndIndex: endIndex,
    });

    currentPos = endIndex;
  }
}

/**
 * Search using the pre-built index
 * Much faster than linear search through entire Bible
 */
export function searchBibleWithIndex(
  searchTerm: string,
  bibleData: Bible,
  index: SearchIndex,
  language: 'ar' | 'en'
): SearchResult[] {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  const normalizedSearchTerm = normalizeForSearch(searchTerm, language);
  const results: SearchResult[] = [];
  const seen = new Set<string>(); // Prevent duplicate verses

  // Split search term into individual words
  const searchWords = normalizedSearchTerm
    .split(/\s+/)
    .filter(word => word.length > 0);

  if (searchWords.length === 0) {
    return [];
  }

  // Find verses matching any search word
  for (const searchWord of searchWords) {
    const matchingLocations = index.wordToVerses.get(searchWord) || [];

    for (const location of matchingLocations) {
      const verseKey = `${location.bookNumber}-${location.chapterNumber}-${location.verseNumber}`;

      // Skip if we already added this verse
      if (seen.has(verseKey)) {
        continue;
      }

      seen.add(verseKey);

      // Find exact match positions in original text
      const matches = findExactMatches(
        location.verseText,
        searchTerm,
        language
      );

      if (matches.length > 0) {
        const translatedBookName = getBookName(location.bookNumber, language);
        const verseRef = `${translatedBookName} ${location.chapterNumber}:${location.verseNumber}`;

        results.push({
          verseRef,
          bookNumber: location.bookNumber,
          bookName: translatedBookName,
          chapterNumber: location.chapterNumber,
          verseNumber: location.verseNumber,
          text: location.verseText,
          matches,
        });
      }
    }
  }

  return results;
}

/**
 * Find exact match positions in verse text
 * Handles diacritics by using character mapping
 */
function findExactMatches(
  verseText: string,
  searchTerm: string,
  language: 'ar' | 'en'
): SearchMatch[] {
  const matches: SearchMatch[] = [];
  
  // Create normalized version of verse
  const normalizedVerse = normalizeForSearch(verseText, language);
  const normalizedTerm = normalizeForSearch(searchTerm, language);
  
  // Create character map for position tracking
  const charMap = createCharacterMap(verseText, language);
  
  let searchIndex = 0;

  while (searchIndex < normalizedVerse.length) {
    const matchIndex = normalizedVerse.indexOf(normalizedTerm, searchIndex);
    if (matchIndex === -1) {
      break;
    }

    // Find corresponding position in original text
    const originalStart = charMap.findIndex(pos => pos === matchIndex);
    
    if (originalStart !== -1) {
      // Find end position in original text
      let originalEnd = originalStart;
      let normalizedLength = 0;
      
      for (let i = originalStart; i < verseText.length && normalizedLength < normalizedTerm.length; i++) {
        originalEnd = i + 1;
        const isArabicDiacritic = language === 'ar' && /[\u064B-\u0652]/.test(verseText[i]);
        if (!isArabicDiacritic) {
          normalizedLength++;
        }
      }

      if (normalizedLength === normalizedTerm.length) {
        const word = verseText.substring(originalStart, originalEnd);
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
 * Create a character-by-character map from original to normalized text
 */
function createCharacterMap(text: string, language: 'ar' | 'en'): number[] {
  const map: number[] = [];
  let normalizedIndex = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isArabicDiacritic = language === 'ar' && /[\u064B-\u0652]/.test(char);
    
    if (isArabicDiacritic) {
      map.push(normalizedIndex);
    } else {
      map.push(normalizedIndex);
      normalizedIndex++;
    }
  }
  
  return map;
}
