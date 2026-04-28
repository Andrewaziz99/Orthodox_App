"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { SectionHeader, Card, Badge, Button } from '../ui';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { news } from '@/lib/data/news';

export const NewsSection = () => {
  const { t, locale, dir } = useLang();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header row
      gsap.from('.news-header-row', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.news-header-row', start: 'top 85%' },
      });

      // News cards stagger
      gsap.from('.news-card', {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.news-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="news" className="py-24 bg-white relative">
      <div className="container-max">
        <div className="news-header-row flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <SectionHeader 
            eyebrow={t('news.eyebrow')}
            heading={t('news.heading')}
            className="mb-0"
          />
          <Button variant="ghost" size="sm" href="/news" icon={<ArrowIcon className="w-4 h-4" />} iconPosition="end" className="btn-interactive">
            {t('news.viewAll')}
          </Button>
        </div>

        <div className="news-grid grid md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item, index) => (
            <Card 
              key={item.slug} 
              variant="elevated" 
              href={`/news/${item.slug}`}
              className="news-card group flex flex-col p-4 h-full card-hoverable"
            >
              <div className="aspect-[16/10] bg-slate-100 rounded-2xl mb-6 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10" />
                 {item.image ? (
                   <Image 
                     src={item.image} 
                     alt={item.title[locale]} 
                     fill 
                     className="object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                 ) : (
                   <div className="absolute inset-0 bg-slate-200" />
                 )}
              </div>

              <div className="flex items-center gap-3 mb-4">
                 <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-100 uppercase tracking-tighter">
                   {item.category[locale]}
                 </Badge>
                 <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                 </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight">
                {item.title[locale]}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {item.excerpt[locale]}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-teal-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-2">
                   {t('news.readMore')}
                   <ArrowIcon className="w-4 h-4" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
