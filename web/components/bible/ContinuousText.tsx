'use client';

import { useState } from 'react';
import { Chapter } from '@/lib/bible-types';
import { VerseActions } from './VerseActions';
import { cn } from '@/lib/utils/cn';

interface ContinuousTextProps {
  chapter: Chapter | null;
  bookName: string;
  lang: 'ar' | 'en';
}

export function ContinuousText({ chapter, bookName, lang }: ContinuousTextProps) {
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);

  if (!chapter) return null;

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 px-6 sm:px-10 md:px-16 text-xl sm:text-2xl leading-[1.8] sm:leading-[2] font-cairo">
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
          {bookName}
        </h2>
        <div className="w-16 h-1 bg-teal-500 rounded-full mb-6" />
        <span className="text-2xl font-bold text-slate-500">
          {lang === 'ar' ? 'الصحاح' : 'Chapter'} {chapter.number}
        </span>
      </div>
      
      <div className="text-slate-800 text-justify" style={{ direction: 'inherit' }}>
        {chapter.verses.map((verse) => (
          <span
            key={verse.number}
            className="relative inline"
            onMouseEnter={() => setHoveredVerse(verse.number)}
            onMouseLeave={() => setHoveredVerse(null)}
          >
            <sup className="text-teal-500 font-bold opacity-80 text-[0.6em] px-1 select-none align-baseline">
              {verse.number}
            </sup>
            <span 
              className={cn(
                "transition-all duration-300 cursor-text rounded-sm px-0.5",
                hoveredVerse === verse.number && "bg-teal-50 text-slate-900"
              )}
            >
              {verse.text}{' '}
            </span>
            
            <span className="absolute">
               <VerseActions 
                  verseText={verse.text} 
                  verseRef={`${bookName} ${chapter.number}:${verse.number}`} 
                  isVisible={hoveredVerse === verse.number} 
               />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
