"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLang } from '@/components/providers/LanguageProvider';

interface BreadcrumbProps {
  items: { label: string; href: string }[];
  variant?: 'light' | 'dark';
  className?: string;
}

export const Breadcrumb = ({ items, variant = 'light', className }: BreadcrumbProps) => {
  const { dir } = useLang();
  const ChevronIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const isDark = variant === 'dark';

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        "flex items-center",
        isDark 
          ? "bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2" 
          : "",
        className
      )}
    >
      <ol className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium">
        <li>
          <Link 
            href="/" 
            className={cn(
              "transition-colors flex items-center",
              isDark 
                ? "text-slate-400 hover:text-amber-400" 
                : "text-slate-500 hover:text-teal-600"
            )}
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {items.filter(item => item.href !== '/').map((item, index, filteredItems) => {
          const isLast = index === filteredItems.length - 1;

          return (
            <li key={item.href} className="flex items-center">
              <ChevronIcon className={cn(
                "w-4 h-4 mx-1",
                isDark ? "text-slate-600" : "text-slate-400"
              )} />
              {isLast ? (
                <span className={cn(
                  "font-bold",
                  isDark ? "text-amber-400/90" : "text-teal-600"
                )} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    isDark 
                      ? "text-slate-400 hover:text-white" 
                      : "text-slate-500 hover:text-teal-600"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
