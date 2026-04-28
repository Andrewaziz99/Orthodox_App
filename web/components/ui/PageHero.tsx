// components/ui/PageHero.tsx
"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href: string }[];
  centered?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const PageHero = ({
  title,
  subtitle,
  breadcrumbs,
  centered = true,
  className,
  children,
}: PageHeroProps) => {
  return (
    <section 
      className={cn(
        "relative pt-20 pb-20 md:pt-24 md:pb-28 overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900",
        className
      )}
    >
      {/* Animated Mesh Gradient Layers */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 start-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_50%,rgba(13,148,136,0.4),transparent_60%)]" />
        <div className="absolute top-0 end-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_20%,rgba(212,160,23,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 start-1/2 w-full h-full bg-[radial-gradient(ellipse_at_50%_100%,rgba(13,148,136,0.2),transparent_40%)]" />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative Floating Elements */}
      <div className="absolute top-12 end-[15%] w-2 h-2 bg-amber-400/40 rounded-full animate-pulse" />
      <div className="absolute bottom-16 start-[10%] w-1.5 h-1.5 bg-teal-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 end-[8%] w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Bottom Edge Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      <div className="container-max relative z-10">
        <div className={cn(
          "flex flex-col",
          centered ? "items-center text-center" : "items-start text-start"
        )}>
          {/* Breadcrumb with glass effect */}
          <div className="mb-8 md:mb-10">
            <Breadcrumb items={breadcrumbs} variant="dark" className="mb-0" />
          </div>
          
          {/* Title with gold accent */}
          <div className="relative mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {title}
            </h1>
            {/* Gold accent line */}
            <div className={cn(
              "mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-600",
              centered ? "mx-auto" : ""
            )} />
          </div>

          {subtitle && (
            <p className="max-w-2xl text-lg md:text-xl text-slate-300/90 leading-relaxed font-medium">
              {subtitle}
            </p>
          )}

          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
