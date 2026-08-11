'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chapter, BibleMetadata, MetadataBook, MetadataTestament } from '@/lib/bible-types';
import { getBibleChapter } from '@/lib/api/bible';

// Versioned because Graphy's 75-book IDs differ from the removed 66-book corpus.
const STORAGE_KEY = 'orthodox_bible_position_v2';

export function useBibleNavigation(metadata: BibleMetadata, lang: 'en' | 'ar') {
  const [selectedTestament, setSelectedTestament] = useState<'OT' | 'NT'>('OT');
  
  // Initialize from localStorage if available, otherwise default
  const [selectedBookNumber, setSelectedBookNumber] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  
  const [currentChapterData, setCurrentChapterData] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Smart Cache for chapters
  const chapterCache = useRef<Map<string, Chapter>>(new Map());
  const initialLoadDone = useRef(false);

  const testaments = metadata.testaments || [];
  
  const allBooks = useMemo<MetadataBook[]>(() => {
    return testaments.flatMap((t: MetadataTestament) => t.books);
  }, [testaments]);

  // Handle Initial State from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { book, chapter, testament } = JSON.parse(saved);
        setSelectedBookNumber(book || 1);
        setSelectedChapter(chapter || 1);
        setSelectedTestament(testament || 'OT');
      } catch (e) {
        console.error('Failed to parse saved position');
      }
    }
    initialLoadDone.current = true;
  }, []);

  // Persist State to LocalStorage
  useEffect(() => {
    if (!initialLoadDone.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      book: selectedBookNumber,
      chapter: selectedChapter,
      testament: selectedTestament
    }));
  }, [selectedBookNumber, selectedChapter, selectedTestament]);

  const currentTestamentBooks = useMemo<MetadataBook[]>(() => {
    const isOT = selectedTestament === 'OT';
    return (testaments[isOT ? 0 : 1]?.books || []) as MetadataBook[];
  }, [testaments, selectedTestament]);

  const currentBook = useMemo<MetadataBook | undefined>(() => {
    return allBooks.find((b: MetadataBook) => b.number === selectedBookNumber) || allBooks[0];
  }, [allBooks, selectedBookNumber]);

  const availableChapters = useMemo(() => {
    if (!currentBook) return [];
    return Array.from({ length: currentBook.chapterCount }, (_, i) => i + 1);
  }, [currentBook]);

  // Optimized Fetcher with Caching
  const fetchChapterData = useCallback(async (bookNum: number, chapterNum: number, language: 'en' | 'ar') => {
    const cacheKey = `${language}-${bookNum}-${chapterNum}`;
    
    // Return from cache if exists
    if (chapterCache.current.has(cacheKey)) {
      return chapterCache.current.get(cacheKey)!;
    }

    try {
      const chapter = await getBibleChapter(bookNum, chapterNum, language);
      
      // Save to cache
      chapterCache.current.set(cacheKey, chapter);
      return chapter;
    } catch (error) {
      console.error(`Error fetching chapter ${bookNum}:${chapterNum}`, error);
      return null;
    }
  }, []);

  // Main Effect for Active Chapter
  useEffect(() => {
    let isMounted = true;
    
    async function updateActiveChapter() {
      if (!currentBook) {
        setCurrentChapterData(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const chapter = await fetchChapterData(selectedBookNumber, selectedChapter, lang);
      
      if (isMounted) {
        setCurrentChapterData(chapter);
        setIsLoading(false);
        
        // Prefetch Neighbors
        prefetchNeighbors(selectedBookNumber, selectedChapter, lang);
      }
    }

    updateActiveChapter();

    return () => {
      isMounted = false;
    };
  }, [lang, selectedBookNumber, selectedChapter, currentBook, fetchChapterData]);

  // Smart Prefetching Logic
  const prefetchNeighbors = useCallback((bookNum: number, chapterNum: number, language: 'en' | 'ar') => {
    // 1. Next Chapter in same book
    if (chapterNum < (currentBook?.chapterCount || 0)) {
        fetchChapterData(bookNum, chapterNum + 1, language);
    } 
    // 2. Previous Chapter in same book
    if (chapterNum > 1) {
        fetchChapterData(bookNum, chapterNum - 1, language);
    }
  }, [currentBook, fetchChapterData]);

  const handleSelectTestament = useCallback((testament: 'OT' | 'NT') => {
    setSelectedTestament(testament);
    const books = testaments[testament === 'OT' ? 0 : 1]?.books || [];
    if (books.length > 0) {
      setSelectedBookNumber(books[0].number);
      setSelectedChapter(1);
    }
  }, [testaments]);

  const handleSelectBook = useCallback((bookNumber: number) => {
    setSelectedBookNumber(bookNumber);
    setSelectedChapter(1);
    
    const testamentIndex = testaments.findIndex((testament) => testament.books.some((book) => book.number === bookNumber));
    setSelectedTestament(testamentIndex === 1 ? 'NT' : 'OT');
  }, [testaments]);

  const handleSelectChapter = useCallback((chapter: number) => {
    setSelectedChapter(chapter);
  }, []);

  return {
    selectedTestament,
    selectedBookNumber,
    selectedChapter,
    allBooks,
    currentTestamentBooks,
    currentBook,
    availableChapters,
    currentChapter: currentChapterData,
    isLoading,
    handleSelectTestament,
    handleSelectBook,
    handleSelectChapter
  };
}
