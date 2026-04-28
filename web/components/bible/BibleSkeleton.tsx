'use client';

import { useLang } from '../providers/LanguageProvider';

export function BibleSkeleton() {
  const { locale } = useLang();
  
  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 px-6 sm:px-10 md:px-16 animate-pulse">
      {/* Book Title Skeleton */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="h-12 sm:h-16 bg-slate-100 rounded-2xl w-2/3 mb-4" />
        <div className="w-16 h-1 bg-slate-100 rounded-full mb-6" />
        <div className="h-8 bg-slate-50 rounded-lg w-1/4" />
      </div>
      
      {/* Verses Skeleton */}
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-4 bg-slate-100 rounded shrink-0 mt-1" />
              <div className="h-6 bg-slate-100 rounded-full w-full" />
            </div>
            <div className="h-6 bg-slate-50 rounded-full w-[94%] ms-8" />
            <div className="h-6 bg-slate-50 rounded-full w-[97%] ms-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
