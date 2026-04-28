import { SearchMatch } from './bible-types';
import React from 'react';

/**
 * Convert verse text with matches into JSX with highlighted elements
 * Preserves original text but wraps matched portions in <mark> elements
 */
export function highlightText(
  text: string,
  matches: SearchMatch[]
): React.ReactNode {
  if (matches.length === 0) {
    return text;
  }

  // Sort matches by start position
  const sortedMatches = [...matches].sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first occurrence)
  const uniqueMatches: SearchMatch[] = [];
  for (const match of sortedMatches) {
    const overlaps = uniqueMatches.some(
      (m) => !(match.end <= m.start || match.start >= m.end)
    );
    if (!overlaps) {
      uniqueMatches.push(match);
    }
  }

  // Build JSX elements
  const elements: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const match of uniqueMatches) {
    // Add text before match
    if (match.start > lastEnd) {
      elements.push(text.substring(lastEnd, match.start));
    }

    // Add highlighted match using React.createElement
    elements.push(
      React.createElement(
        'mark',
        { key: `match-${match.start}`, className: 'highlighted-word' },
        text.substring(match.start, match.end)
      )
    );

    lastEnd = match.end;
  }

  // Add remaining text
  if (lastEnd < text.length) {
    elements.push(text.substring(lastEnd));
  }

  return elements;
}

/**
 * Create a summary of matches for display
 * e.g., "5 matches found in 3 verses"
 */
export function createMatchSummary(
  searchResults: any[], // Array of SearchResult
  searchTerm?: string
): string {
  if (searchResults.length === 0) {
    return `No results found${searchTerm ? ` for "${searchTerm}"` : ''}`;
  }

  const totalMatches = searchResults.reduce((sum, result) => sum + result.matches.length, 0);
  const verseCount = searchResults.length;

  const verseWord = verseCount === 1 ? 'verse' : 'verses';
  const matchWord = totalMatches === 1 ? 'match' : 'matches';

  return `${totalMatches} ${matchWord} found in ${verseCount} ${verseWord}${
    searchTerm ? ` for "${searchTerm}"` : ''
  }`;
}

/**
 * Calculate reading statistics based on search results
 */
export function getReadingStats(searchResults: any[]) {
  const totalWords = searchResults.reduce((sum, result) => {
    const words = result.text.split(/\s+/).length;
    return sum + words;
  }, 0);

  const estimatedReadingTime = Math.ceil(totalWords / 200); // Avg 200 words per minute

  return {
    totalWords,
    verseCount: searchResults.length,
    estimatedReadingTime,
  };
}
