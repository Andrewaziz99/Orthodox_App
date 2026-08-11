// app/page.tsx  ← HOME PAGE (Async Server Component)
//
// Fetches dynamic CMS content for each section at request time (ISR, 60s).
// If the backend is unavailable the sections fall back to locale JSON strings.

import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AudienceSection from "@/components/sections/AudienceSection";
import CurriculaSection from "@/components/sections/CurriculaSection";
import AppSection from "@/components/sections/AppSection";
import { VideosSection } from "@/components/sections/VideosSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { CTASection } from "@/components/sections/CTASection";
import {
  getSectionContent,
  getNewsArticles,
  getCurriculaList,
  getVideos,
} from "@/lib/api/content";

export default async function HomePage() {
  // Fetch all section content in parallel
  const content = await Promise.all([
    getSectionContent("hero"),
    getSectionContent("about"),
    getSectionContent("audience"),
    getSectionContent("app"),
    getSectionContent("videos"),
    getSectionContent("vision"),
    getSectionContent("cta"),
    getNewsArticles(),
    getCurriculaList(),
    getVideos(),
    getSectionContent("news"),
    getSectionContent("curricula"),
  ]).catch((error) => {
    console.error('Home page content is unavailable:', error);
    return null;
  });

  if (!content) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Content temporarily unavailable</h1>
          <p className="mt-3 text-slate-600">Please try again in a few minutes.</p>
        </div>
      </main>
    );
  }

  const [
    heroContent,
    aboutContent,
    audienceContent,
    appContent,
    videosContent,
    visionContent,
    ctaContent,
    newsArticles,
    curricula,
    dynamicVideos,
    newsSection,
    curriculaSection,
  ] = content;

  return (
    <>
      <HeroSection content={heroContent} />
      <AboutSection content={aboutContent} />
      <AudienceSection content={audienceContent} />
      <CurriculaSection content={curricula} sectionContent={curriculaSection} />
      <AppSection content={appContent} />
      <VideosSection content={videosContent} videos={dynamicVideos} />
      <NewsSection content={newsArticles} sectionContent={newsSection} />
      <VisionSection content={visionContent} />
      <CTASection content={ctaContent} />
    </>
  );
}

