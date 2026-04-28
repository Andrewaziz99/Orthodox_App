'use client';

import { Chapter } from '@/lib/bible-types';
import { ContinuousText } from './ContinuousText';
import { SearchOverlay } from './SearchOverlay';
import { ChapterGrid } from './ChapterGrid';
import { SearchResult } from '@/lib/bible-types';
import { getBookName } from '@/lib/book-names';
import { BibleSkeleton } from './BibleSkeleton';

interface BibleContentProps {
  currentChapter: Chapter | null;
  currentBookNumber: number;
  availableChapters: number[];
  selectedChapter: number;
  onSelectChapter: (c: number) => void;
  sidebarOpen: boolean;
  lang: 'ar' | 'en';
  searchTerm: string;
  searchResults: SearchResult[];
  isSearchingResults: boolean;
  isLoadingChapter: boolean;
  onSearchResultClick: (bookNumber: number, chapterNumber: number) => void;
}

export function BibleContent({
  currentChapter,
  currentBookNumber,
  availableChapters,
  selectedChapter,
  onSelectChapter,
  sidebarOpen,
  lang,
  searchTerm,
  searchResults,
  isSearchingResults,
  isLoadingChapter,
  onSearchResultClick
}: BibleContentProps) {
  const isSearching = searchTerm.trim().length > 0;
  const bookName = getBookName(currentBookNumber, lang);

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full h-full relative">
      {/* Chapter Grid Bar at the top of content area */}
      {!isSearching && (
        <ChapterGrid 
          chapters={availableChapters}
          selectedChapter={selectedChapter}
          onSelectChapter={onSelectChapter}
          lang={lang}
        />
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full relative" id="bible-scroll-container" data-lenis-prevent>
        {isSearching ? (
          <div className="relative h-full">
            {isSearchingResults && (
               <div className="absolute inset-x-0 top-0 h-1 bg-slate-100 overflow-hidden z-20">
                  <div className="h-full bg-teal-500 animate-progress origin-left" />
               </div>
            )}
            <SearchOverlay 
              results={searchResults} 
              searchTerm={searchTerm} 
              onResultClick={onSearchResultClick}
              lang={lang}
            />
          </div>
        ) : (
          <div className="relative min-h-full">
            {isLoadingChapter ? (
              <BibleSkeleton />
            ) : (
              <ContinuousText 
                chapter={currentChapter} 
                bookName={bookName}
                lang={lang}
              />
            )}
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 1s infinite linear;
        }
      `}</style>
    </div>
  );
}
