'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChapterGridProps {
  chapters: number[];
  selectedChapter: number;
  onSelectChapter: (chapter: number) => void;
  lang: 'ar' | 'en';
}

export function ChapterGrid({ chapters, selectedChapter, onSelectChapter, lang }: ChapterGridProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-30 w-full bg-white">
      {/* Floating Toggle Button - Centered */}
      <div className="flex justify-center h-20 items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-6 py-1.5 rounded-full shadow-sm border transition-all duration-300",
            isOpen 
              ? "bg-slate-900 border-slate-800 text-white" 
              : "bg-white border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600"
          )}
        >
          <Hash className="w-3.5 h-3.5 opacity-60" />
          <span className="text-[13px] font-bold tracking-wide">
            {isOpen 
              ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close Menu')
              : (lang === 'ar' ? `الأصحاح ${selectedChapter}` : `Chapter ${selectedChapter}`)
            }
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Grid Area */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out bg-slate-50/50",
          isOpen ? "max-h-[600px] opacity-100 shadow-inner" : "max-h-0 opacity-0"
        )}
      >
        <div className="w-full py-6">
          <div className="flex flex-col items-center">
            {/* Flex display for truly tight spacing regardless of screen width */}
            <div className="flex flex-wrap justify-center gap-1.5 px-4 max-h-[400px] overflow-y-auto custom-scrollbar pb-4 w-full max-w-6xl mx-auto">
              {chapters.map((chap) => (
                <button
                  key={chap}
                  onClick={() => {
                    onSelectChapter(chap);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                    selectedChapter === chap
                      ? "bg-teal-600 text-white shadow-md ring-2 ring-teal-100 scale-105"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600"
                  )}
                >
                  {chap}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
