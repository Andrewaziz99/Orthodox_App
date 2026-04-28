'use client';

import { useState } from 'react';
import { TestamentTabs } from './TestamentTabs';
import { BookList } from './BookList';
import { Input } from '@/components/ui';
import { Search, X, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { MetadataBook } from '@/lib/bible-types';
import { cn } from '@/lib/utils/cn';
import { useTranslation } from '@/hooks/useTranslation';

interface BibleSidebarProps {
  // Navigation props
  selectedTestament: 'OT' | 'NT';
  selectedBookNumber: number;
  selectedChapter: number;
  currentTestamentBooks: MetadataBook[];
  availableChapters: number[];
  onSelectTestament: (t: 'OT' | 'NT') => void;
  onSelectBook: (b: number) => void;
  onSelectChapter: (c: number) => void;
  lang: 'ar' | 'en';
  // Search props
  searchTerm: string;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
  // Mobile props
  isOpen: boolean;
  onClose: () => void;
}

export function BibleSidebar({
  selectedTestament,
  selectedBookNumber,
  selectedChapter,
  currentTestamentBooks,
  availableChapters,
  onSelectTestament,
  onSelectBook,
  onSelectChapter,
  lang,
  searchTerm,
  onSearch,
  onClearSearch,
  isOpen,
  onClose
}: BibleSidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-[60] bg-white border-e border-slate-200 shadow-2xl flex flex-col transition-all duration-500 ease-in-out",
          "w-[85vw] sm:w-80", // Mobile width
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full", // Mobile slide
          "md:static md:flex md:translate-x-0 rtl:md:translate-x-0 md:transform-none md:shadow-none md:z-auto", // Desktop state
          isCollapsed ? "md:w-16 lg:w-16" : "md:w-72 lg:w-80" // Dynamic width
        )}
      >
        {/* Mobile Close Button */}
        <div className="flex md:hidden justify-end p-4 border-b border-slate-100">
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:text-teal-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex flex-col border-b border-slate-100 py-2 px-2 items-end">
           <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-teal-600 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
           >
              {isCollapsed ? (
                lang === 'ar' ? <PanelLeftOpen className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />
              ) : (
                lang === 'ar' ? <PanelRightClose className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />
              )}
           </button>
           
           {isCollapsed && (
             <button 
                onClick={() => setIsCollapsed(false)}
                className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-all active:scale-95"
                title="Search"
             >
                <Search className="w-5 h-5" />
             </button>
           )}
        </div>

        {!isCollapsed && (
          <>
            <div className="p-4 border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <Input 
                  type="text"
                  placeholder={lang === 'ar' ? 'بحث في الكتاب المقدس...' : 'Search the Bible...'}
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="ps-10 pe-10 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 w-full"
                />
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                  <button 
                    onClick={onClearSearch}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 px-4 pt-4 pb-2">
              <TestamentTabs 
                activeTestament={selectedTestament}
                onTestamentChange={onSelectTestament}
                lang={lang}
              />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col pt-2">
              <BookList 
                books={currentTestamentBooks}
                selectedBookNumber={selectedBookNumber}
                onSelectBook={onSelectBook}
                lang={lang}
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
}
