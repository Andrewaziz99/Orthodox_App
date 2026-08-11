'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchResult } from '@/lib/bible-types';
import { searchBible } from '@/lib/api/bible';

export interface UseBibleSearchProps {
  language: 'en' | 'ar';
}

export function useBibleSearch({ language }: UseBibleSearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSearchResults([]);
      try {
        setSearchResults(await searchBible(searchTerm, language));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, language]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
  }, []);

  return {
    searchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleClearSearch,
  };
}
