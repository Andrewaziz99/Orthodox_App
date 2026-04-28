// components/sections/AboutSection.tsx
"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { SectionHeader, Card } from '../ui';
import { BookOpen, Smartphone, Church, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const { t, dir } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-teal-600" />,
      title: t('about.features.curricula.title'),
      desc: t('about.features.curricula.description'),
    },
    {
      icon: <Smartphone className="w-6 h-6 text-amber-600" />,
      title: t('about.features.platform.title'),
      desc: t('about.features.platform.description'),
    },
    {
      icon: <Church className="w-6 h-6 text-purple-600" />,
      title: t('about.features.church.title'),
      desc: t('about.features.church.description'),
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      title: t('about.features.motivation.title'),
      desc: t('about.features.motivation.description'),
    },
  ];

  // GSAP animations
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Section header fade in
      gsap.from('.about-header', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-header', start: 'top 85%' },
      });

      // Left content blocks slide from start
      const xStart = dir === 'rtl' ? 50 : -50;
      gsap.from('.about-content-block', {
        opacity: 0, x: xStart, duration: 0.9, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-content', start: 'top 80%' },
      });

      // Right cards stagger
      gsap.from('.about-feature-card', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-cards-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-white relative">
      <div className="container-max">
        <div className="about-header">
          <SectionHeader 
            eyebrow={t('about.eyebrow')}
            heading={t('about.heading')}
            centered
            className="mb-20"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Main Content */}
          <div className="about-content space-y-12">
            <div className="about-content-block relative">
              <div className="absolute -start-4 top-0 w-1 h-full bg-teal-500 rounded-full opacity-20" />
              <h3 className="text-3xl font-black text-slate-900 mb-6">{t('about.whoWeAre.title')}</h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                {t('about.whoWeAre.description')}
              </p>
            </div>

            <div className="about-content-block relative">
              <div className="absolute -start-4 top-0 w-1 h-full bg-amber-500 rounded-full opacity-20" />
              <h3 className="text-3xl font-black text-slate-900 mb-6">{t('about.whatWeOffer.title')}</h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                {t('about.whatWeOffer.description')}
              </p>
            </div>
          </div>

          {/* Feature Highlight Cards */}
          <div className="about-cards-grid grid sm:grid-cols-2 gap-6">
            {features.map((item, idx) => (
              <Card 
                key={idx}
                variant="default"
                hoverEffect="lift"
                className="about-feature-card p-8 border-slate-100 bg-slate-50/50 hover:bg-white card-hoverable"
              >
                <div className="mb-6 w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center icon-scale-wrapper">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
