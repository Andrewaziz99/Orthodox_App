"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { curricula } from '@/lib/data/curricula';

export default function CurriculaPage() {
  const { t, dir, locale } = useLang();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.curricula'), href: '/curricula' }
  ];

  return (
    <>
      <PageHero 
        title={t('curricula.heading')} 
        subtitle={t('curricula.subheading', ' ')}
        breadcrumbs={breadcrumbs} 
      />

      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 start-0 w-[40rem] h-[40rem] bg-teal-50/30 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 end-0 w-[30rem] h-[30rem] bg-amber-50/20 rounded-full blur-[100px] translate-y-1/2" />

        <div className="container-max relative z-10">
          {/* Grid Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-teal-400 to-teal-600" />
              <span className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
                {curricula.length} {locale === 'ar' ? 'مناهج' : 'Curricula'}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {curricula.map((c, idx) => {
              const badgeSrc = `/assets/badges/${c.slug === 'bible-characters' ? '4ahed' : c.slug === 'biblical-concepts' ? 'amin' : c.slug === 'extended-study' ? 'kof2' : 'mo3lm'}.png`;
              const isAlt = idx % 2 !== 0;

              return (
                <Link
                  key={c.slug}
                  href={`/curricula/${c.slug}`}
                  className="group block focus:outline-none h-full"
                >
                  <div className="relative overflow-hidden flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full">
                    {/* Visual Header */}
                    <div className="relative h-52 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                      {/* Tinted overlay */}
                      <div className={`absolute inset-0 z-10 ${isAlt ? 'bg-gradient-to-br from-amber-600/15 to-teal-600/10' : 'bg-gradient-to-br from-teal-600/15 to-amber-600/10'}`} />
                      
                      {/* Badge image */}
                      <div className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-700">
                        <Image 
                          src={badgeSrc} 
                          alt={c.title[locale]} 
                          fill 
                          className="object-contain scale-125 group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                      
                      {/* Number Overlay */}
                      <div className="absolute top-4 end-6 text-7xl font-black text-white/8 group-hover:text-white/15 transition-all duration-500">
                        {c.number}
                      </div>

                      {/* Level Badge */}
                      <div className="absolute bottom-4 start-6 z-20">
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                          {c.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 flex flex-col flex-1">
                      {/* Age Range Tag */}
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-teal-600 mb-4 uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {c.ageRange[locale]}
                      </div>

                      <h3 className="text-lg font-black text-slate-900 mb-4 leading-snug group-hover:text-teal-600 transition-colors duration-300">
                        {c.title[locale]}
                      </h3>

                      {/* Meta Info */}
                      <div className="space-y-2.5 mb-5 flex-1">
                        <div className="flex items-center gap-2.5 text-sm text-slate-500 font-semibold">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>{c.duration[locale]}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-500 font-semibold">
                          <Users className="w-4 h-4 text-teal-500" />
                          <span>{c.audience[locale]}</span>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {c.description[locale]}
                      </p>

                      {/* Read more */}
                      <div className="mt-auto pt-5 border-t border-slate-100 flex items-center gap-2">
                        <span className="text-sm font-bold text-teal-600 group-hover:text-teal-700 transition-colors">
                          {t('common.knowMore')}
                        </span>
                        <ArrowIcon className="w-4 h-4 text-teal-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
