export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  number: number;
  name: string;
  chapters: Chapter[];
}

export interface Testament {
  name: string;
  books: Book[];
}

export interface Bible {
  translation: string;
  testaments: Testament[];
}

export interface MetadataBook {
  number: number;
  name: string;
  chapterCount: number;
}

export interface MetadataTestament {
  name: string;
  books: MetadataBook[];
}

export interface BibleMetadata {
  translation: string;
  testaments: MetadataTestament[];
}

export interface CombinedBibleMetadata {
  en?: BibleMetadata;
  ar?: BibleMetadata;
}

export interface SearchMatch {
  start: number;
  end: number;
  word: string;
}

export interface SearchResult {
  verseRef: string; // e.g., "Genesis 1:3"
  bookNumber: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  matches: SearchMatch[];
}

export interface VerseWithHighlight {
  verse: Verse;
  bookName: string;
  chapterNumber: number;
  hasMatch: boolean;
  matches: SearchMatch[];
}
