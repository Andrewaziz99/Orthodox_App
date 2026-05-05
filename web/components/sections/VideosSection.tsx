// components/sections/VideosSection.tsx
"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/animations/gsap-config';
import { useLang } from '../providers/LanguageProvider';
import { SectionHeader } from '../ui';
import { Play, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SectionContent, DynamicVideo } from '@/lib/api/content';

interface VideosSectionProps {
  content?: SectionContent;
  videos?: DynamicVideo[];
}

export const VideosSection = ({ content = {}, videos = [] }: VideosSectionProps) => {
  const { t, locale } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeVideo, setActiveVideo] = React.useState<DynamicVideo | null>(null);
  
  // Helper: prefer DB value, fall back to locale JSON
  const c = (key: string, fallback: string) =>
    content[key]?.[locale as 'ar' | 'en'] || content[key]?.ar || fallback;

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.from('.videos-header', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.videos-header', start: 'top 85%' },
      });

      // Video cards stagger with scale
      gsap.from('.video-card', {
        opacity: 0, scale: 0.9, y: 20, duration: 0.7, stagger: 0.12, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.videos-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="container-max relative z-10">
        <div className="videos-header">
          <SectionHeader 
            eyebrow={c('heading', t('videos.heading'))}
            heading={c('subheading', t('videos.subheading'))}
            centered
            className="mb-16"
          />
        </div>

        <div className="videos-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className="video-card group cursor-pointer"
            >
              <div className="relative aspect-video bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-2">
                {/* Thumbnail */}
                {v.thumbnailUrl ? (
                  <img 
                    src={v.thumbnailUrl} 
                    alt={locale === 'ar' ? v.titleAr : v.titleEn}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                   <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-amber-500/10" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-teal-600 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute inset-0 border-4 border-transparent group-hover:border-teal-500/10 rounded-3xl transition-all duration-500" />
              </div>
              <h3 className="mt-6 text-center font-bold text-slate-800 transition-colors duration-300 group-hover:text-teal-600">
                {locale === 'ar' ? v.titleAr : v.titleEn}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" 
            onClick={() => setActiveVideo(null)} 
          />
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {activeVideo.isYoutube ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeID(activeVideo.videoUrl)}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video 
                src={activeVideo.videoUrl} 
                className="w-full h-full" 
                controls 
                autoPlay 
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// Helper to extract YouTube ID
function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
