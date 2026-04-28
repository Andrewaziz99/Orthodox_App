// components/ui/SectionHeader.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  eyebrow?: string;           // Small label above heading
  heading: string;
  description?: string;
  centered?: boolean;
  showAccent?: boolean;       // Gold decorative line
  className?: string;
}

export const SectionHeader = ({
  eyebrow,
  heading,
  description,
  centered = false,
  showAccent = true,
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        'mb-12 flex flex-col',
        centered ? 'items-center text-center mx-auto' : 'items-start text-start',
        className
      )}
    >
      {eyebrow && (
        <span className="text-teal-600 font-extrabold uppercase tracking-[0.2em] text-xs mb-4">
          {eyebrow}
        </span>
      )}
      
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.2]">
        {heading}
      </h2>

      {showAccent && (
        <div 
          className={cn(
            "h-1.5 w-20 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full my-6",
            centered ? "mx-auto" : ""
          )} 
        />
      )}

      {description && (
        <p className={cn(
          "max-w-3xl text-lg text-slate-600 leading-relaxed font-medium",
          centered ? "mx-auto" : ""
        )}>
          {description}
        </p>
      )}
    </div>
  );
};
