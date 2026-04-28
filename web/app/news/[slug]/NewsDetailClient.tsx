"use client";

import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getNewsBySlug } from '@/lib/data/news';
import { useLang } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';

export default function NewsDetailClient({ slug }: { slug: string }) {
  const { t, locale, dir } = useLang();
  const article = getNewsBySlug(slug);
  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.news'), href: '/news' },
    { label: article.category[locale], href: '/news' }
  ];

  return (
    <>
      <PageHero 
        title={article.title[locale]} 
        subtitle={article.excerpt[locale]}
        breadcrumbs={breadcrumbs} 
      />
      
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 end-0 w-[30rem] h-[30rem] bg-teal-50/20 rounded-full blur-[100px]" />

        <div className="container-max max-w-4xl mx-auto relative z-10">
          {/* Back Navigation */}
          <Link 
            href="/news" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors mb-10 group"
          >
            <BackArrow className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            {locale === 'ar' ? 'العودة للأخبار' : 'Back to News'}
          </Link>

          {/* Featured Image */}
          {article.image && (
            <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
               <Image 
                  src={article.image} 
                  alt={article.title[locale]} 
                  fill 
                  className="object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </div>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-12 pb-8 border-b border-slate-100">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
              {article.category[locale]}
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{article.date}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <User className="w-4 h-4 text-teal-500" />
                <span>{article.author}</span>
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl leading-[1.9] text-slate-700 font-medium mb-8">
               {article.body[locale]}
            </p>
            
            {/* Decorative divider */}
            <div className="flex items-center gap-3 my-12">
              <div className="flex-1 h-px bg-slate-100" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-teal-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="flex-1 h-px bg-slate-100" />
            </div>
          </div>

          {/* Back to News CTA */}
          <div className="mt-16 pt-8 border-t border-slate-100">
            <Link 
              href="/news"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <BackArrow className="w-4 h-4" />
              {locale === 'ar' ? 'عرض جميع الأخبار' : 'View All News'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
