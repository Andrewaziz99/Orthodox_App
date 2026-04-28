"use client";

import React from 'react';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { Smartphone, Download, Star, Zap, Shield, BookOpen } from 'lucide-react';

export default function AppPage() {
  const { t, locale } = useLang();

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.app'), href: '/app-page' }
  ];

  const features = [
    {
      icon: BookOpen,
      title: locale === 'ar' ? 'محتوى كتابي شامل' : 'Comprehensive Biblical Content',
      description: locale === 'ar' ? 'جميع المناهج والمواد التعليمية في مكان واحد' : 'All curricula and educational materials in one place',
    },
    {
      icon: Zap,
      title: locale === 'ar' ? 'سريع وسهل الاستخدام' : 'Fast & Easy to Use',
      description: locale === 'ar' ? 'واجهة بسيطة وسلسة مصممة للأطفال والمعلمين' : 'Simple and smooth interface designed for children and teachers',
    },
    {
      icon: Shield,
      title: locale === 'ar' ? 'آمن للأطفال' : 'Safe for Children',
      description: locale === 'ar' ? 'بيئة آمنة ومحمية لتصفح المحتوى الكتابي' : 'Safe and protected environment for browsing biblical content',
    },
    {
      icon: Star,
      title: locale === 'ar' ? 'تحديثات مستمرة' : 'Regular Updates',
      description: locale === 'ar' ? 'محتوى جديد ومحدث بشكل دوري' : 'New and regularly updated content',
    },
  ];

  return (
    <>
      <PageHero 
        title={t('app.heading')} 
        subtitle={t('app.description', ' ')}
        breadcrumbs={breadcrumbs} 
      />

      {/* App Download CTA Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gradient-to-br from-teal-50/40 to-amber-50/20 rounded-full blur-[120px]" />
        
        <div className="container-max relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-xl shadow-teal-500/20 mb-8">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
              {locale === 'ar' ? 'حمّل تطبيقنا اليوم' : 'Download Our App Today'}
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              {locale === 'ar' 
                ? 'احصل على وصول كامل لجميع المناهج والمحتوى التعليمي من جهازك المحمول'
                : 'Get full access to all curricula and educational content from your mobile device'}
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap justify-center gap-5 mb-20">
            <button className="group flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Download className="w-6 h-6 text-teal-400" />
              <div className="text-start">
                <span className="block text-xs text-slate-400 leading-none">{locale === 'ar' ? 'قريباً على' : 'Coming Soon on'}</span>
                <span className="block text-lg font-bold leading-snug">App Store</span>
              </div>
            </button>
            <button className="group flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Download className="w-6 h-6 text-amber-400" />
              <div className="text-start">
                <span className="block text-xs text-slate-400 leading-none">{locale === 'ar' ? 'قريباً على' : 'Coming Soon on'}</span>
                <span className="block text-lg font-bold leading-snug">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* App Features Grid */}
      <section className="py-20 md:py-28 bg-slate-50 relative">
        <div className="container-max">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-4">
              {locale === 'ar' ? 'مميزات التطبيق' : 'App Features'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5">
              {locale === 'ar' ? 'لماذا تطبيقنا؟' : 'Why Our App?'}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isAlt = idx % 2 !== 0;
              return (
                <div 
                  key={idx}
                  className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-teal-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
                >
                  <div className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-6 ${isAlt ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
