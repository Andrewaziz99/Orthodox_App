'use client';

import { SearchResult } from '@/lib/bible-types';
import { Card } from '@/components/ui';

interface SearchOverlayProps {
  results: SearchResult[];
  searchTerm: string;
  onResultClick: (bookNumber: number, chapterNumber: number) => void;
  lang: 'ar' | 'en';
}

export function SearchOverlay({ results, searchTerm, onResultClick, lang }: SearchOverlayProps) {
  if (!searchTerm) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        {lang === 'ar' ? `نتائج البحث عن "${searchTerm}"` : `Search results for "${searchTerm}"`}
        <span className="text-sm font-normal text-slate-500 ms-3">
          ({results.length} {lang === 'ar' ? 'نتيجة' : 'results'})
        </span>
      </h2>

      {results.length === 0 ? (
        <Card variant="elevated" className="text-center py-12 text-slate-500">
          {lang === 'ar' ? 'لم يتم العثور على أية نتائج.' : 'No results found.'}
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result, i) => (
            <button
              key={`${result.verseRef}-${i}`}
              onClick={() => onResultClick(result.bookNumber, result.chapterNumber)}
              className="w-full text-start block"
            >
              <Card variant="default" className="hover:border-teal-300 transition-colors cursor-pointer group">
                <div className="font-bold text-teal-700 mb-2 group-hover:text-teal-800 transition-colors">
                  {result.verseRef}
                </div>
                <div 
                  className="text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightMatches(result.text, searchTerm) }} 
                />
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple highlighter helper
function highlightMatches(text: string, term: string) {
  if (!term || term.trim() === '') return text;
  
  // Basic case-insensitive highlight
  // Note: for more advanced Arabic search highlighting it may need more logic, 
  // but for now we fallback to simple replacement.
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200/60 text-slate-900 rounded px-1 -mx-1">$1</mark>');
}
