// components/ui/Skeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  className,
}: SkeletonProps) => {
  const variants = {
    text: 'rounded-md h-4 w-3/4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200',
        variants[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};
