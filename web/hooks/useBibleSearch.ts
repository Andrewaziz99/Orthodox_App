'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchResult } from '@/lib/bible-types';

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
      try {
        const response = await fetch(`/api/bible/search?q=${encodeURIComponent(searchTerm)}&lang=${language}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSearchResults(data.results || []);
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
