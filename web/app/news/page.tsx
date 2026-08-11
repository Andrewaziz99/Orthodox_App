"use client";

import React from 'react';
import Link from 'next/link';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { getNewsArticles, DynamicNewsArticle, pick } from '@/lib/api/content';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function NewsPage() {
  const { t, dir, locale } = useLang();
  const [articles, setArticles] = React.useState<DynamicNewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { content, loading: contentLoading, error: contentError } = useSiteContent('news_page');
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  React.useEffect(() => {
    getNewsArticles()
      .then(setArticles)
      .catch(() => setError('News is temporarily unavailable.'))
      .finally(() => setLoading(false));
  }, []);

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.news'), href: '/news' }
  ];

  const get = (key: string, fallbackKey?: string, defaultVal: string = '') => {
    return pick(content, key, locale) || (fallbackKey ? t(fallbackKey) : defaultVal);
  };

  if (loading || contentLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (error || contentError) return <div className="min-h-screen flex items-center justify-center bg-white text-slate-700">{error || contentError}</div>;

  return (
    <>
      <PageHero 
        title={get('heading', 'news.heading')} 
        subtitle={get('subheading', undefined, locale === 'ar' ? 'آخر الأخبار والتحديثات من مدرسة الكتاب' : 'Latest news and updates from Bible School')}
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
                {articles.length} {locale === 'ar' ? 'أخبار' : 'Articles'}
              </span>
            </div>
          </div>

          {/* Featured Article (First item) */}
          {articles.length > 0 && (
            <Link href={`/news/${articles[0].slug}`} className="group block mb-12 focus:outline-none">
              <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] bg-slate-100 overflow-hidden">
                    {articles[0].image ? (
                      <img 
                        src={articles[0].image} 
                        alt={locale === 'ar' ? articles[0].titleAr : articles[0].titleEn} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
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
                        {locale === 'ar' ? articles[0].categoryAr : articles[0].categoryEn}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{articles[0].date}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight group-hover:text-teal-600 transition-colors duration-300">
                      {locale === 'ar' ? articles[0].titleAr : articles[0].titleEn}
                    </h2>
                    
                    <p className="text-slate-600 text-base leading-relaxed mb-8 line-clamp-3">
                      {locale === 'ar' ? articles[0].excerptAr : articles[0].excerptEn}
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
            {articles.slice(1).map((item) => {
              const title = locale === 'ar' ? item.titleAr : item.titleEn;
              const excerpt = locale === 'ar' ? item.excerptAr : item.excerptEn;
              const category = locale === 'ar' ? item.categoryAr : item.categoryEn;

              return (
                <Link key={item.slug} href={`/news/${item.slug}`} className="group block focus:outline-none h-full">
                  <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden h-full">
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
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
                          {category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-teal-600 transition-colors duration-300 leading-snug">
                        {title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                        {excerpt}
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
              );
            })}
          </div>
          {articles.length === 0 && (
            <div className="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-16 text-center text-slate-500">
              {locale === 'ar' ? 'لا توجد أخبار منشورة حالياً.' : 'No news articles are published yet.'}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
