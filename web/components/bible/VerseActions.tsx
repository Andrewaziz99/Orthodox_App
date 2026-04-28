'use client';

import { useState } from 'react';
import { Copy, Bookmark, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface VerseActionsProps {
  verseText: string;
  verseRef: string; // e.g. "Genesis 1:1"
  isVisible: boolean;
}

export function VerseActions({ verseText, verseRef, isVisible }: VerseActionsProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${verseText} (${verseRef})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleBookmark = () => {
    // Basic local bookmark state for UI feedback
    setBookmarked(!bookmarked);
    // Real app would save this to localStorage or API
  };

  return (
    <div
      className={cn(
        "absolute -top-10 start-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-slate-200 p-1 flex items-center gap-1 transition-all duration-200 z-20",
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
      )}
    >
      <button
        onClick={handleCopy}
        className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600 hover:text-teal-600"
        title="Copy Verse"
      >
        {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        onClick={handleBookmark}
        className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600 hover:text-teal-600"
        title={bookmarked ? "Bookmarked" : "Bookmark Verse"}
      >
        <Bookmark className={cn("w-4 h-4", bookmarked && "fill-teal-600 text-teal-600")} />
      </button>
    </div>
  );
}
