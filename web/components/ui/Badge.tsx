// components/ui/Badge.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'teal' | 'gold' | 'red' | 'purple' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  icon,
}: BadgeProps) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-teal-600 text-white border-teal-500 shadow-[0_0_15px_rgba(13,148,136,0.3)]',
    secondary: 'bg-amber-100 text-amber-800 border-amber-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    outline: 'bg-transparent text-slate-600 border-slate-200',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-black uppercase tracking-widest border rounded-full transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="me-1.5">{icon}</span>}
      {children}
    </span>
  );
};
