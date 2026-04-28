"use client";

import React from 'react';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { Target, Eye, Compass, TrendingUp, Lightbulb, Globe } from 'lucide-react';

export default function VisionPage() {
  const { t, locale } = useLang();

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.vision'), href: '/vision' }
  ];

  const milestones = [
    {
      year: '2024',
      title: locale === 'ar' ? 'إطلاق المنهج الأول' : 'First Curriculum Launch',
      description: locale === 'ar' ? 'إنطلاق أول منهج للدراسة الكتابية للأطفال مع مواد تعليمية متكاملة' : 'Launch of the first Bible study curriculum for children with comprehensive educational materials',
      icon: Lightbulb,
      color: 'teal',
    },
    {
      year: '2025',
      title: locale === 'ar' ? 'التوسع الرقمي' : 'Digital Expansion',
      description: locale === 'ar' ? 'إطلاق المنصة الرقمية والتطبيق الذكي لتسهيل الوصول للمحتوى التعليمي' : 'Launch of the digital platform and smart app for easier access to educational content',
      icon: Globe,
      color: 'amber',
    },
    {
      year: '2026',
      title: locale === 'ar' ? 'مناهج متعددة' : 'Multiple Curricula',
      description: locale === 'ar' ? 'إضافة مناهج جديدة تغطي فئات عمرية مختلفة ومواضيع كتابية متنوعة' : 'Adding new curricula covering different age groups and diverse biblical topics',
      icon: TrendingUp,
      color: 'teal',
    },
    {
      year: '2027+',
      title: locale === 'ar' ? 'التأثير العالمي' : 'Global Impact',
      description: locale === 'ar' ? 'الوصول لأكبر عدد من الأطفال والأسر في مختلف أنحاء العالم' : 'Reaching the maximum number of children and families worldwide',
      icon: Compass,
      color: 'amber',
    },
  ];

  return (
    <>
      <PageHero 
        title={t('vision.heading')} 
        subtitle={t('vision.description')}
        breadcrumbs={breadcrumbs} 
      />

      {/* Vision Statement Banner */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-teal-50/30 rounded-full blur-[120px]" />
        
        <div className="container-max relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
              {locale === 'ar' 
                ? 'نبني جيلاً يعرف الكتاب المقدس ويحيا بتعاليمه' 
                : 'Building a Generation That Knows the Bible and Lives by Its Teachings'}
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {locale === 'ar'
                ? 'رؤيتنا هي تقديم تعليم كتابي أرثوذكسي متميز يصل لكل طفل، من خلال مناهج حديثة ومنصة رقمية متطورة تجعل دراسة الكتاب المقدس تجربة ممتعة ومثمرة.'
                : 'Our vision is to provide outstanding Orthodox biblical education that reaches every child, through modern curricula and an advanced digital platform that makes Bible study an enjoyable and fruitful experience.'}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline / Roadmap */}
      <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
        <div className="container-max">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-4">
              {locale === 'ar' ? 'خطة العمل' : 'Our Roadmap'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5">
              {locale === 'ar' ? 'مسيرة التطوير' : 'Development Journey'}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto" />
          </div>

          {/* Timeline Cards */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 start-8 md:start-1/2 w-px bg-gradient-to-b from-teal-200 via-amber-200 to-teal-200 -translate-x-1/2" />

            <div className="space-y-12 md:space-y-16">
              {milestones.map((milestone, idx) => {
                const Icon = milestone.icon;
                const isEven = idx % 2 === 0;
                const isTeal = milestone.color === 'teal';

                return (
                  <div key={idx} className={`relative flex items-start gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline Dot */}
                    <div className="absolute start-8 md:start-1/2 -translate-x-1/2 z-10">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isTeal ? 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-teal-500/20' : 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/20'}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`ms-20 md:ms-0 md:w-[calc(50%-2.5rem)] ${isEven ? 'md:text-end md:pe-0' : 'md:text-start md:ps-0'}`}>
                      <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <span className={`inline-block text-sm font-black mb-3 ${isTeal ? 'text-teal-600' : 'text-amber-600'}`}>
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
