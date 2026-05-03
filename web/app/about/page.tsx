"use client";

import React from 'react';
import { PageHero } from "@/components/ui/PageHero";
import { useLang } from "@/components/providers/LanguageProvider";
import { BookOpen, Users, GraduationCap, Heart, Cross, Sparkles } from 'lucide-react';

import { useSiteContent } from '@/hooks/useSiteContent';
import { pick } from '@/lib/api/content';

export default function AboutPage() {
  const { t, locale } = useLang();
  const { content, loading } = useSiteContent('about_page');

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' }
  ];

  // Helper to get dynamic value or fallback to translation
  const get = (key: string, fallbackKey: string) => {
    return pick(content, key, locale) || t(fallbackKey);
  };

  const features = [
    {
      icon: BookOpen,
      title: get('whoWeAreTitle', 'about.whoWeAre.title'),
      description: get('whoWeAreDescription', 'about.whoWeAre.description'),
      accent: 'teal',
    },
    {
      icon: GraduationCap,
      title: get('whatWeOfferTitle', 'about.whatWeOffer.title'),
      description: get('whatWeOfferDescription', 'about.whatWeOffer.description'),
      accent: 'amber',
    },
  ];

  const defaultValues = [
    { icon: 'Cross', labelAr: 'إيمان أرثوذكسي', labelEn: 'Orthodox Faith' },
    { icon: 'BookOpen', labelAr: 'دراسة كتابية', labelEn: 'Bible Study' },
    { icon: 'Users', labelAr: 'مجتمع متنامي', labelEn: 'Growing Community' },
    { icon: 'Heart', labelAr: 'حب ورعاية', labelEn: 'Love & Care' },
    { icon: 'GraduationCap', labelAr: 'تعليم منهجي', labelEn: 'Structured Learning' },
    { icon: 'Sparkles', labelAr: 'تجربة فريدة', labelEn: 'Unique Experience' },
  ];

  let valuesData = defaultValues;
  try {
    const rawValues = content['values']?.[locale] || JSON.stringify(defaultValues);
    valuesData = JSON.parse(rawValues);
  } catch (e) {
    valuesData = defaultValues;
  }

  const iconMap: any = { BookOpen, Users, GraduationCap, Heart, Cross, Sparkles };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <>
      <PageHero 
        title={get('heading', 'about.heading')} 
        subtitle={get('subheading', 'about.whoWeAre.description')}
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
              {get('valuesEyebrow', 'common.values')}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-5">
              {get('valuesHeading', 'common.whatSetsUsApart')}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mx-auto" />
          </div>

          {/* Values Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {valuesData.map((value: any, idx: number) => {
              const Icon = iconMap[value.icon] || Sparkles;
              return (
                <div 
                  key={idx}
                  className="group relative bg-white rounded-2xl p-8 border border-slate-100 text-center hover:border-teal-200 transition-all duration-400 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {locale === 'ar' ? value.labelAr : value.labelEn}
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
