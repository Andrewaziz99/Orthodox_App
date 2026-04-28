'use client';

import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MobileSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  lang: 'ar' | 'en';
}

export function MobileSidebarToggle({ isOpen, onToggle, lang }: MobileSidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "md:hidden fixed bottom-8 end-8 z-[70] p-5 rounded-2xl shadow-2xl text-white transition-all duration-300 active:scale-95",
        isOpen 
          ? "bg-slate-900 rotate-90" 
          : "bg-teal-600 hover:bg-teal-700 shadow-teal-500/30"
      )}
      aria-label={isOpen ? "Close Bible Sidebar" : "Open Bible Content"}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}
