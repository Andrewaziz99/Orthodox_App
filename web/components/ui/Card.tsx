import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  variant?: 'default' | 'glass' | 'feature' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accentColor?: 'teal' | 'gold' | 'crimson' | 'none';
  hoverEffect?: 'none' | 'lift' | 'glow' | 'zoom';
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export const Card = ({
  variant = 'default',
  padding = 'md',
  accentColor = 'none',
  hoverEffect = 'none',
  children,
  className,
  href,
}: CardProps) => {
  const variants = {
    default: 'bg-white border border-slate-200 shadow-sm',
    glass: 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm',
    feature: 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm',
    elevated: 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const accents = {
    teal: 'border-t-4 border-t-teal-500',
    gold: 'border-t-4 border-t-amber-500',
    crimson: 'border-t-4 border-t-rose-600',
    none: '',
  };

  const hoverEffects = {
    none: '',
    lift: 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 hover:border-teal-500/30',
    glow: 'hover:shadow-[0_0_30px_rgba(13,148,136,0.15)] hover:border-teal-500/50',
    zoom: 'hover:scale-[1.02] hover:shadow-xl',
  };

  const cardClasses = cn(
    'rounded-3xl transition-all duration-500 ease-out',
    variants[variant],
    paddings[padding],
    accents[accentColor],
    hoverEffects[hoverEffect],
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn("block group/card outline-none", cardClasses)}>
        {children}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};
