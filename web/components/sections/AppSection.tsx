// components/sections/AppSection.tsx
"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { Button, Card, Badge } from '../ui';
import { 
  BookOpen, 
  ClipboardCheck, 
  Award, 
  Trophy, 
  BarChart3, 
  Book, 
  Bell, 
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { appFeatures } from '@/lib/data/features';

export default function AppSection() {
  const { t, dir, locale } = useLang();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const sectionRef = useRef<HTMLElement>(null);

  const iconMap: Record<string, any> = {
    BookOpen, ClipboardCheck, Award, Trophy, BarChart3, Book, Bell, ShoppingBag
  };

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const xStart = dir === 'rtl' ? 60 : -60;
      const xEnd = dir === 'rtl' ? -60 : 60;

      // Left content slides in from start
      gsap.from('.app-content', {
        opacity: 0, x: xStart, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: '.app-content', start: 'top 80%' },
      });

      // Right feature cards stagger
      gsap.from('.app-feature-card', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.app-features-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="app" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 end-[-10%] w-[40rem] h-[40rem] bg-amber-100/30 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content Side */}
          <div className="app-content">
            <Badge variant="secondary" className="mb-6 bg-teal-50 text-teal-700 border-teal-100 px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
              {t('app.eyebrow')}
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
              {t('app.heading')}
              <br />
              <span className="text-teal-600">{t('app.headingHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-12 font-medium">
              {t('app.description')}
            </p>

            <div className="flex flex-wrap gap-5">
              <Button 
                variant="primary" 
                size="lg" 
                href="/app-page"
                icon={<ArrowIcon className="w-5 h-5" />}
                iconPosition="end"
                className="btn-interactive"
              >
                {t('app.cta')}
              </Button>
              <div className="flex -space-x-3 rtl:space-x-reverse">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden shadow-sm">
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                   </div>
                 ))}
                 <div className="flex items-center ps-5 text-sm font-bold text-slate-500 italic">
                    +500 Users
                 </div>
              </div>
            </div>
          </div>

          {/* Features Visual Side */}
          <div className="relative">
             {/* Feature Grid with perspective hint */}
             <div className="app-features-grid grid grid-cols-2 gap-5 relative z-10">
                {appFeatures.map((f, idx) => {
                  const Icon = iconMap[f.icon] || Smartphone;
                  return (
                    <Card 
                      key={f.id}
                      variant="default"
                      hoverEffect="lift"
                      className="app-feature-card p-6 border-slate-200/60 bg-white/80 backdrop-blur-sm flex items-center gap-4 group card-hoverable"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 icon-scale-wrapper">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-black text-slate-800 leading-tight">
                        {f.label[locale]}
                      </span>
                    </Card>
                  );
                })}
             </div>

             {/* Background Decoration */}
             <div className="absolute -inset-10 bg-gradient-to-br from-teal-500/5 to-amber-500/5 rounded-[3rem] -z-10 rotate-3 scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
}
