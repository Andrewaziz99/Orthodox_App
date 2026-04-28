"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { news } from '@/lib/data/news';

export default function NewsPage() {
  const { t, dir, locale } = useLang();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.news'), href: '/news' }
  ];

  return (
    <>
      <PageHero 
        title={t('news.heading')} 
        subtitle={locale === 'ar' ? 'آخر الأخبار والتحديثات من مدرسة الكتاب' : 'Latest news and updates from Bible School'}
        breadcrumbs={breadcrumbs} 
      />

      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 end-0 w-[40rem] h-[40rem] bg-teal-50/30 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 start-0 w-[25rem] h-[25rem] bg-amber-50/20 rounded-full blur-[100px] translate-y-1/2" />

        <div className="container-max relative z-10">
          {/* Grid Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
              <span className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
                {news.length} {locale === 'ar' ? 'أخبار' : 'Articles'}
              </span>
            </div>
          </div>

          {/* Featured Article (First item) */}
          {news.length > 0 && (
            <Link href={`/news/${news[0].slug}`} className="group block mb-12 focus:outline-none">
              <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] bg-slate-100 overflow-hidden">
                    {news[0].image ? (
                      <Image 
                        src={news[0].image} 
                        alt={news[0].title[locale]} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-amber-600/10" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                        {news[0].category[locale]}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{news[0].date}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight group-hover:text-teal-600 transition-colors duration-300">
                      {news[0].title[locale]}
                    </h2>
                    
                    <p className="text-slate-600 text-base leading-relaxed mb-8 line-clamp-3">
                      {news[0].excerpt[locale]}
                    </p>

                    <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 group-hover:gap-3 transition-all duration-300">
                      {t('news.readMore')}
                      <ArrowIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Rest of news grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(1).map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="group block focus:outline-none h-full">
                <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.title[locale]} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-teal-600/10" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                        {item.category[locale]}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-teal-600 transition-colors duration-300 leading-snug">
                      {item.title[locale]}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                      {item.excerpt[locale]}
                    </p>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center gap-2">
                      <span className="text-sm font-bold text-teal-600 group-hover:text-teal-700 transition-colors">
                        {t('news.readMore')}
                      </span>
                      <ArrowIcon className="w-4 h-4 text-teal-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
