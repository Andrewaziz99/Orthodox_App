"use client";

import React from 'react';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { BookOpen, Users, GraduationCap, Heart, Cross, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { t, locale } = useLang();

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' }
  ];

  const features = [
    {
      icon: BookOpen,
      title: t('about.whoWeAre.title'),
      description: t('about.whoWeAre.description'),
      accent: 'teal',
    },
    {
      icon: GraduationCap,
      title: t('about.whatWeOffer.title'),
      description: t('about.whatWeOffer.description'),
      accent: 'amber',
    },
  ];

  const values = [
    { icon: Cross, label: locale === 'ar' ? 'إيمان أرثوذكسي' : 'Orthodox Faith' },
    { icon: BookOpen, label: locale === 'ar' ? 'دراسة كتابية' : 'Bible Study' },
    { icon: Users, label: locale === 'ar' ? 'مجتمع متنامي' : 'Growing Community' },
    { icon: Heart, label: locale === 'ar' ? 'حب ورعاية' : 'Love & Care' },
    { icon: GraduationCap, label: locale === 'ar' ? 'تعليم منهجي' : 'Structured Learning' },
    { icon: Sparkles, label: locale === 'ar' ? 'تجربة فريدة' : 'Unique Experience' },
  ];

  return (
    <>
      <PageHero 
        title={t('about.heading')} 
        subtitle={t('about.whoWeAre.description')}
        breadcrumbs={breadcrumbs} 
      />

      {/* Feature Cards Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 end-0 w-[40rem] h-[40rem] bg-teal-50/50 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 start-0 w-[30rem] h-[30rem] bg-amber-50/50 rounded-full blur-[100px] translate-y-1/2" />

        <div className="container-max relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isAlt = feature.accent === 'amber';
              return (
                <div 
                  key={idx}
                  className="group relative bg-white rounded-3xl border border-slate-100 p-10 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Accent corner decoration */}
                  <div className={`absolute top-0 end-0 w-24 h-24 rounded-es-[3rem] ${isAlt ? 'bg-amber-50' : 'bg-teal-50'} transition-all duration-500 group-hover:w-32 group-hover:h-32`} />
                  
                  {/* Icon */}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${isAlt ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="relative z-10 text-2xl md:text-3xl font-black text-slate-900 mb-5 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="relative z-10 text-slate-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className={`mt-8 h-1 w-12 rounded-full ${isAlt ? 'bg-amber-400' : 'bg-teal-400'} transition-all duration-500 group-hover:w-20`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Grid Section */}
      <section className="py-20 md:py-28 bg-slate-50 relative">
        <div className="container-max">
          {/* Section Title */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-4">
              {locale === 'ar' ? 'قيمنا' : 'Our Values'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-5">
              {locale === 'ar' ? 'ما يميزنا' : 'What Sets Us Apart'}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto" />
          </div>

          {/* Values Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div 
                  key={idx}
                  className="group relative bg-white rounded-2xl p-8 border border-slate-100 text-center hover:border-teal-200 transition-all duration-400 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {value.label}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
