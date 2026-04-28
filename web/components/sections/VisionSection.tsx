// components/sections/VisionSection.tsx
"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { SectionHeader, Card, Button } from '../ui';
import { Sparkles, Target, Zap, Waves } from 'lucide-react';

export const VisionSection = () => {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Custom icons for the pillars
  const pillarIcons: Record<number, React.ReactNode> = {
    0: <Zap className="w-8 h-8 text-amber-500" />,
    1: <Target className="w-8 h-8 text-teal-500" />,
    2: <Waves className="w-8 h-8 text-purple-500" />
  };

  const pillars = t('vision.pillars', { returnObjects: true }) as unknown as any[];

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

      // Pillar cards stagger
      gsap.from('.vision-pillar', {
        opacity: 0, y: 30, scale: 0.95, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.vision-pillars-grid', start: 'top 80%' },
      });

      // CTA button
      gsap.from('.vision-cta', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.vision-cta', start: 'top 90%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="vision" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white to-transparent opacity-50" />
      
      <div className="container-max relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="vision-header">
            <SectionHeader 
              eyebrow={t('vision.eyebrow')}
              heading={t('vision.heading')}
              centered
              className="mb-8"
            />
          </div>
          <p className="vision-description text-slate-600 text-xl leading-relaxed mb-16 font-medium">
            {t('vision.description')}
          </p>

          <div className="vision-pillars-grid grid sm:grid-cols-3 gap-8 mb-16">
            {Array.isArray(pillars) && pillars.map((p, index) => (
              <Card 
                key={index}
                variant="default"
                hoverEffect="lift"
                className="vision-pillar p-8 flex flex-col items-center text-center bg-white/50 border-slate-200 card-hoverable"
              >
                <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 icon-scale-wrapper">
                   {pillarIcons[index] || <Sparkles className="w-8 h-8 text-teal-500" />}
                </div>
                <p className="text-lg font-black text-slate-800 leading-tight">
                  {p.label}
                </p>
              </Card>
            ))}
          </div>

          <div className="vision-cta flex justify-center">
            <Button variant="secondary" size="lg" href="/vision" className="btn-interactive">
              {t('vision.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
