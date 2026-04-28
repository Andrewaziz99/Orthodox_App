// components/ui/Tabs.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
  className,
}: TabsProps) => {
  return (
    <div className={cn("flex", className)}>
      <div 
        className={cn(
          "flex items-center gap-1",
          variant === 'pills' ? "bg-slate-100 p-1 rounded-2xl" : "border-b border-slate-200 w-full"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                  isActive 
                    ? "bg-white text-teal-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                {tab.label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-bold transition-all duration-200 relative",
                isActive 
                  ? "text-teal-600 after:absolute after:bottom-0 after:start-0 after:end-0 after:h-0.5 after:bg-teal-600" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
