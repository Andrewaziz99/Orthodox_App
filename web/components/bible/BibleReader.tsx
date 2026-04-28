'use client';

import { useState } from 'react';
import { CombinedBibleMetadata } from '@/lib/bible-types';
import { useBibleNavigation } from '@/hooks/useBibleNavigation';
import { useBibleSearch } from '@/hooks/useBibleSearch';
import { BibleSidebar } from './BibleSidebar';
import { BibleContent } from './BibleContent';
import { MobileSidebarToggle } from './MobileSidebarToggle';

import { useLang } from '../providers/LanguageProvider';

interface BibleReaderProps {
  metadata: CombinedBibleMetadata;
}

export default function BibleReader({ metadata }: BibleReaderProps) {
  const { locale: lang } = useLang();
  // Assume either en or ar is present based on the metadata object
  const currentMetadata = metadata[lang] || metadata['en'] || metadata['ar'];

  const navigation = useBibleNavigation(currentMetadata!, lang);
  const search = useBibleSearch({ language: lang });
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSelectChapterWithScroll = (chapter: number) => {
    navigation.handleSelectChapter(chapter);
    const container = document.getElementById('bible-scroll-container');
    if (container) container.scrollTop = 0;
  };

  const handleSearchResultClick = (bookNumber: number, chapterNumber: number) => {
    navigation.handleSelectBook(bookNumber);
    navigation.handleSelectChapter(chapterNumber);
    search.handleClearSearch();
    setMobileSidebarOpen(false);
    
    // Scroll to top of content
    const container = document.getElementById('bible-scroll-container');
    if (container) container.scrollTop = 0;
  };

  return (
    <div className="flex w-full max-w-full h-[calc(100vh-96px)] overflow-hidden bg-white">
      <BibleSidebar
        selectedTestament={navigation.selectedTestament}
        selectedBookNumber={navigation.selectedBookNumber}
        selectedChapter={navigation.selectedChapter}
        currentTestamentBooks={navigation.currentTestamentBooks}
        availableChapters={navigation.availableChapters}
        onSelectTestament={navigation.handleSelectTestament}
        onSelectBook={navigation.handleSelectBook}
        onSelectChapter={navigation.handleSelectChapter}
        lang={lang}
        searchTerm={search.searchTerm}
        onSearch={search.handleSearch}
        onClearSearch={search.handleClearSearch}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <BibleContent
        currentChapter={navigation.currentChapter}
        currentBookNumber={navigation.selectedBookNumber}
        availableChapters={navigation.availableChapters}
        selectedChapter={navigation.selectedChapter}
        onSelectChapter={handleSelectChapterWithScroll}
        sidebarOpen={mobileSidebarOpen}
        lang={lang}
        searchTerm={search.searchTerm}
        searchResults={search.searchResults}
        isSearchingResults={search.isSearching}
        isLoadingChapter={navigation.isLoading}
        onSearchResultClick={handleSearchResultClick}
      />

      <MobileSidebarToggle 
        isOpen={mobileSidebarOpen} 
        onToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        lang={lang} 
      />
    </div>
  );
}
