// components/sections/VisionSection.tsx
"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { SectionHeader, Card, Button } from '../ui';
import { Sparkles, BookOpenCheck, Globe2, ScrollText } from 'lucide-react';
import type { SectionContent } from '@/lib/api/content';

interface VisionSectionProps {
  content?: SectionContent;
}

export const VisionSection = ({ content = {} }: VisionSectionProps) => {
  const { t, locale } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  // Helper: prefer DB value, fall back to locale JSON
  const c = (key: string, fallback: string) =>
    content[key]?.[locale as 'ar' | 'en'] || content[key]?.ar || fallback;
  
  const pillarIcons: Record<number, { icon: React.ReactNode, color: string, bg: string, border: string }> = {
    0: { 
      icon: <BookOpenCheck className="w-8 h-8" />, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-100'
    },
    1: { 
      icon: <Globe2 className="w-8 h-8" />, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50/50',
      border: 'border-teal-100'
    },
    2: { 
      icon: <ScrollText className="w-8 h-8" />, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50/50',
      border: 'border-rose-100'
    }
  };

  let pillars: any[] = [];
  try {
    const raw = content['pillars']?.[locale as 'ar' | 'en'] || content['pillars']?.ar;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        pillars = Array.isArray(parsed) ? parsed : Object.values(parsed);
      }
    }
  } catch (err) {
    console.error("Pillars parse error:", err);
  }

  // Final fallback to translations if DB content is empty or invalid
  if (!pillars || !Array.isArray(pillars) || pillars.length === 0) {
    const translated = t('vision.pillars', { returnObjects: true });
    pillars = Array.isArray(translated) ? translated : (translated ? Object.values(translated) : []);
  }

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header + description
      gsap.from('.vision-header', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.vision-header', start: 'top 85%' },
      });

      gsap.from('.vision-description', {
        opacity: 0, y: 20, duration: 0.7, delay: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: '.vision-description', start: 'top 85%' },
      });

      // Pillar cards stagger - using fromTo to ensure they end up visible
      gsap.fromTo('.vision-pillar', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'back.out(1.7)',
          scrollTrigger: { 
            trigger: '.vision-pillars-grid', 
            start: 'top bottom', // Fire as soon as it enters the screen
            once: true 
          },
          immediateRender: false
        }
      );

      // CTA button
      gsap.from('.vision-cta', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.vision-cta', start: 'top 90%' },
      });

      // Force refresh for layout shifts
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef, dependencies: [pillars] });

  return (
    <section ref={sectionRef} id="vision" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white to-transparent opacity-50" />
      
      <div className="container-max relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="vision-header">
            <SectionHeader 
              eyebrow={c('eyebrow', t('vision.eyebrow'))}
              heading={c('heading', t('vision.heading'))}
              centered
              className="mb-8"
            />
          </div>
          <p className="vision-description text-slate-600 text-xl leading-relaxed mb-16 font-medium">
            {c('description', t('vision.description'))}
          </p>

          <div className="vision-pillars-grid grid sm:grid-cols-3 gap-8 mb-16">
            {Array.isArray(pillars) && pillars.length > 0 ? pillars.map((p, index) => {
              if (!p) return null;
              const iconValue = p.icon || '';
              const isCustomIcon = typeof iconValue === 'string' && (iconValue.startsWith('http') || iconValue.startsWith('/'));
              
              return (
                <Card 
                  key={index}
                  variant="default"
                  hoverEffect="lift"
                  className="vision-pillar p-8 flex flex-col items-center text-center bg-white border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group"
                >
                   <div className={`mb-6 p-3 rounded-2xl border shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isCustomIcon ? 'bg-white border-slate-100' : (pillarIcons[index]?.bg || 'bg-slate-50')} ${isCustomIcon ? '' : (pillarIcons[index]?.border || 'border-slate-100')} ${pillarIcons[index]?.color || 'text-slate-600'}`}>
                      {isCustomIcon ? (
                        <img src={iconValue} alt={p.label || ''} className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center">
                          {pillarIcons[index]?.icon || <span className="text-2xl">{iconValue}</span>}
                        </div>
                      )}
                   </div>
                  <p className="text-lg font-black text-slate-800 leading-tight group-hover:text-teal-700 transition-colors">
                    {p.label || ''}
                  </p>
                </Card>
              );
            }) : (
              <div className="col-span-full py-12 text-slate-400 italic bg-slate-100 rounded-2xl">
                {locale === 'ar' ? 'لا يوجد عناصر حالياً' : 'No vision pillars defined yet.'}
              </div>
            )}
          </div>

          <div className="vision-cta flex justify-center">
            <Button variant="secondary" size="lg" href="/vision" className="btn-interactive">
              {c('cta', t('vision.cta'))}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
