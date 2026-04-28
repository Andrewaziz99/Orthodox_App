// components/sections/HeroSection.tsx
"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { Badge, Button } from '../ui';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { t, dir, locale } = useLang();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const containerRef = useRef<HTMLElement>(null);

  const stats = [
    { value: t('hero.stats.curricula.value'), label: t('hero.stats.curricula.label') },
    { value: t('hero.stats.audiences.value'), label: t('hero.stats.audiences.label') },
    { value: t('hero.stats.years.value'),     label: t('hero.stats.years.label') },
  ];

  // GSAP Hero entrance timeline
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 2.2 });

    tl.from('.hero-badge', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
    })
    .from('.hero-heading', {
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
    }, '-=0.2')
    .from('.hero-subtitle', {
      opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
    }, '-=0.3')
    .from('.hero-cta > *', {
      opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power2.out',
    }, '-=0.2')
    .from('.hero-stats > div', {
      opacity: 0, y: 15, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    }, '-=0.2')
    .from('.hero-visual', {
      opacity: 0, scale: 0.92, duration: 1, ease: 'power2.out',
    }, '-=0.8')
    .from('.hero-float', {
      opacity: 0, scale: 0, duration: 0.5, ease: 'back.out(1.7)',
    }, '-=0.3')
    .from('.hero-scroll-indicator', {
      opacity: 0, y: -10, duration: 0.5, ease: 'power2.out',
    }, '-=0.2');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pb-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white to-amber-50/20 -z-10" />
      
      {/* Animated Decorative Orbs */}
      <div className="absolute top-1/4 start-[-5%] w-[30rem] h-[30rem] bg-teal-400/5 rounded-full blur-[100px] animate-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 end-[-5%] w-[25rem] h-[25rem] bg-amber-400/5 rounded-full blur-[80px] animate-pulse pointer-events-none -z-10" style={{ animationDelay: '2s' }} />

      <div className="container-max relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-start max-w-2xl mx-auto lg:mx-0 order-2 lg:order-1">
            <Badge 
              variant="primary" 
              className="hero-badge mb-6 py-2 px-5 text-sm uppercase tracking-[0.2em] font-black"
            >
              {t('hero.badge')}
            </Badge>

            <h1 className="hero-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-slate-900 mb-6">
              {t('hero.heading')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-amber-600 text-shimmer">
                {t('hero.headingHighlight')}
              </span>
            </h1>

            <p className="hero-subtitle text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-medium">
              {t('hero.subtitle')}
            </p>

            <div className="hero-cta flex flex-wrap gap-4 mb-14">
              <Button 
                variant="primary" 
                size="lg" 
                href="#curricula"
                icon={<ArrowIcon className="w-5 h-5" />}
                iconPosition="end"
                className="px-10 shadow-lg shadow-teal-900/10 btn-interactive"
              >
                {t('hero.cta.primary')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                href="#app"
                className="px-10 border-slate-200 text-slate-700 hover:bg-slate-50 btn-interactive"
              >
                {t('hero.cta.secondary')}
              </Button>
            </div>

            {/* Stats Row */}
            <div className="hero-stats grid grid-cols-3 gap-2 sm:gap-4 md:gap-12 w-full pt-8 mb-12 border-t border-slate-200/60">
              {stats.map((stat, idx) => (
                <div key={idx} className="group">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 transition-transform duration-300 group-hover:scale-110 origin-start">
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider md:tracking-widest text-wrap">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="hero-visual relative order-1 lg:order-2 flex justify-center">
            <div className="relative w-full aspect-square max-w-[500px] lg:max-w-none">
               {/* Decorative background shapes for the image */}
               <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-[3rem] rotate-6 scale-95" />
               <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-[3rem] -rotate-3 scale-95" />
               
               <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20">
                  <Image 
                    src="/assets/hero_mockup.png" 
                    alt="App Mockup"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
               </div>

               {/* Floating elements */}
               <div className="hero-float absolute -top-6 -end-6 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center hidden md:flex">
                  <Sparkles className="w-10 h-10 text-amber-500" />
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Scroll Indicator - Static side label */}
      <div className="hero-scroll-indicator absolute top-[70%] end-6 hidden md:flex flex-col items-center gap-4 cursor-pointer group z-20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-teal-600 transition-colors [writing-mode:vertical-lr]">
          {t('hero.scrollIndicator')}
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-slate-200 flex justify-center p-1 group-hover:border-teal-400 transition-colors">
           <div className="w-1 h-2 bg-teal-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}
