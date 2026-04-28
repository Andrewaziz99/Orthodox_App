"use client";

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurriculumBySlug } from '@/lib/data/curricula';
import { useLang } from '@/components/providers/LanguageProvider';
import { PageHero } from '@/components/ui/PageHero';
import { Clock, Users, BookOpen, ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';

export default function CurriculumDetailClient({ slug }: { slug: string }) {
  const { t, locale, dir } = useLang();
  const curriculum = getCurriculumBySlug(slug);
  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  if (!curriculum) {
    notFound();
  }

  const breadcrumbs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.curricula'), href: '/curricula' },
    { label: curriculum.title[locale], href: `/curricula/${slug}` }
  ];

  const badgeSrc = `/assets/badges/${slug === 'bible-characters' ? '4ahed' : slug === 'biblical-concepts' ? 'amin' : slug === 'extended-study' ? 'kof2' : 'mo3lm'}.png`;

  const details = [
    {
      icon: Clock,
      label: t('curricula.duration', 'المدة'),
      value: curriculum.duration[locale],
      color: 'amber',
    },
    {
      icon: Users,
      label: t('curricula.audience', 'الفئة المستهدفة'),
      value: curriculum.audience[locale],
      color: 'teal',
    },
  ];

  return (
    <>
      <PageHero 
        title={curriculum.title[locale]} 
        subtitle={curriculum.description[locale]}
        breadcrumbs={breadcrumbs} 
      />
      
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle decoration */}
        <div className="absolute top-0 start-0 w-[30rem] h-[30rem] bg-teal-50/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 end-0 w-[20rem] h-[20rem] bg-amber-50/15 rounded-full blur-[80px]" />

        <div className="container-max max-w-5xl mx-auto relative z-10">
          {/* Back Navigation */}
          <Link 
            href="/curricula" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors mb-10 group"
          >
            <BackArrow className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            {locale === 'ar' ? 'العودة للمناهج' : 'Back to Curricula'}
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Details Cards */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {details.map((detail, idx) => {
                  const Icon = detail.icon;
                  const isTeal = detail.color === 'teal';
                  return (
                    <div 
                      key={idx}
                      className="group p-6 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-300"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isTeal ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {detail.label}
                      </span>
                      <span className="block text-lg font-black text-slate-900">
                        {detail.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Content Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {t('curricula.content', 'المحتوى الدراسي')}
                  </h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-slate-600 leading-[1.9] text-lg">
                    {locale === 'ar' 
                      ? "هذا نص تجريبي للمحتوى الدراسي. سيتم استبدال هذا النص لاحقاً بالتفاصيل الكاملة للمنهج، بما في ذلك الدروس الأسبوعية والمواضيع التعليمية لكل مرحلة. يهدف هذا الجزء إلى إعطاء فكرة عن شكل الصفحة وكيفية عرض النصوص الطويلة." 
                      : "This is placeholder text for the curriculum content. This text will be replaced later with the full details of the curriculum, including weekly lessons and educational topics for each stage. This section aims to provide an idea of the page layout and how long text is displayed."}
                  </p>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-3 my-10">
                <div className="flex-1 h-px bg-slate-100" />
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Back CTA */}
              <Link 
                href="/curricula"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <BackArrow className="w-4 h-4" />
                {locale === 'ar' ? 'عرض جميع المناهج' : 'View All Curricula'}
              </Link>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                {/* Badge Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-xl mb-6">
                  <div className="relative aspect-square p-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-amber-600/10" />
                    <div className="relative w-full h-full">
                      <Image 
                        src={badgeSrc} 
                        alt={curriculum.title[locale]}
                        fill
                        className="object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <div className="p-6 text-center border-t border-white/5">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-white/80">{curriculum.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
                    {locale === 'ar' ? 'معلومات سريعة' : 'Quick Info'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-500 font-semibold">{locale === 'ar' ? 'الفئة العمرية' : 'Age Range'}</span>
                      <span className="text-sm font-bold text-slate-900">{curriculum.ageRange[locale]}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-500 font-semibold">{locale === 'ar' ? 'المستوى' : 'Level'}</span>
                      <span className="text-sm font-bold text-teal-600">{curriculum.badge}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-sm text-slate-500 font-semibold">{locale === 'ar' ? 'الرقم' : 'Number'}</span>
                      <span className="text-sm font-bold text-amber-600">{curriculum.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
