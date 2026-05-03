// components/sections/CurriculaSection.tsx
"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { SectionHeader, Card, Badge, Button } from '../ui';
import { Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { curricula as staticCurricula } from '@/lib/data/curricula';
import type { DynamicCurriculum } from '@/lib/api/content';

interface CurriculaSectionProps {
  content?: DynamicCurriculum[];
  sectionContent?: any;
}

export default function CurriculaSection({ content, sectionContent }: CurriculaSectionProps) {
  const { t, dir, locale } = useLang();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const sectionRef = useRef<HTMLElement>(null);

  const featuredIds = JSON.parse(sectionContent?.featuredIds?.en || '[]');

  // If we have dynamic content but NO featured IDs are selected, hide the whole section
  if (content && content.length > 0 && featuredIds.length === 0) return <div className="hidden" id="curricula-hidden-marker" />;

  // Fallback to static if backend didn't provide data
  const dataList = (content && content.length > 0) ? content : staticCurricula;
  
  // Filter by featured selection and SORT by featuredIds order
  const publishedList = (content && content.length > 0) 
    ? (dataList as DynamicCurriculum[])
        .filter(c => c.published && featuredIds.includes(c.id))
        .sort((a, b) => featuredIds.indexOf(a.id) - featuredIds.indexOf(b.id))
    : dataList;

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header row
      gsap.from('.curricula-header-row', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.curricula-header-row', start: 'top 85%' },
      });

      // Cards stagger
      gsap.from('.curricula-card', {
        opacity: 0, y: 40, scale: 0.95, duration: 0.7, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.curricula-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="curricula" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="curricula-header-row flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <SectionHeader 
            eyebrow={sectionContent?.eyebrow?.[locale] || sectionContent?.eyebrow?.ar || t('curricula.eyebrow')}
            heading={sectionContent?.heading?.[locale] || sectionContent?.heading?.ar || t('curricula.heading')}
            description={sectionContent?.subheading?.[locale] || sectionContent?.subheading?.ar || t('curricula.subheading')}
            className="mb-0 max-w-2xl"
          />
          <Button variant="outline" href="/curricula" icon={<ArrowIcon className="w-4 h-4" />} iconPosition="end" className="btn-interactive">
            {t('curricula.viewAll')}
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="curricula-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {publishedList.map((c: any) => {
            // Determine badge image: prioritize uploaded badge URL, fallback to static based on slug
            const badgeSrc = c.badge && (c.badge.startsWith('http') || c.badge.startsWith('/'))
              ? c.badge 
              : `/assets/badges/${c.slug === 'bible-characters' ? '4ahed' : c.slug === 'biblical-concepts' ? 'amin' : c.slug === 'extended-study' ? 'kof2' : 'mo3lm'}.png`;

            // Helper to get locale string handling both dynamic and static shapes
            const getStr = (field: string) => {
              if (c[`${field}Ar`]) return locale === 'ar' ? c[`${field}Ar`] : c[`${field}En`];
              return c[field]?.[locale] || c[field]?.ar || '';
            };

            return (
              <Card 
                key={c.slug}
                variant="elevated"
                hoverEffect="lift"
                href={`/curricula/${c.slug}`}
                className="curricula-card group relative overflow-hidden flex flex-col p-0 border-none bg-white shadow-lg h-full card-hoverable"
              >
                {/* Visual Header with Badge Background */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <img 
                      src={badgeSrc} 
                      alt={getStr('title')} 
                      className={`absolute inset-0 w-full h-full object-contain scale-150 blur-[2px] group-hover:blur-0 transition-all duration-700 ${c.id ? 'opacity-100' : ''}`} 
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-amber-600/20 pointer-events-none" />
                  
                  {/* Number Overlay */}
                  <div className="absolute top-4 end-6 text-7xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                    {c.number}
                  </div>

                  {/* Level Badge */}
                  <div className="absolute bottom-4 start-6 z-20">
                     <Badge variant="primary" className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-none">
                        {c.badge && (c.badge.startsWith('http') || c.badge.startsWith('/')) ? (locale === 'ar' ? 'منهج' : 'Curriculum') : c.badge}
                     </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-teal-600 mb-4 uppercase tracking-[0.2em]">
                     <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                     {getStr('ageRange')}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-teal-600 transition-colors min-h-[3rem] line-clamp-2">
                      {getStr('title')}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2.5 text-sm text-slate-500 font-bold">
                         <Clock className="w-4 h-4 text-amber-500" />
                         <span>{getStr('duration')}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-slate-500 font-bold">
                         <Users className="w-4 h-4 text-teal-500" />
                         <span>{getStr('audience')}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                      {getStr('description')}
                    </p>
                  </div>

                  <div
                    className="inline-flex items-center gap-2 text-sm font-black text-slate-900 group/link mt-auto"
                  >
                    <span className="border-b-2 border-teal-500/30 group-hover:border-teal-500 transition-all">
                      {t('common.knowMore')}
                    </span>
                    <ArrowIcon className="w-4 h-4 text-teal-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
