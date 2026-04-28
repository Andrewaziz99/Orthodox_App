// app/page.tsx  ← This is the HOME PAGE
//
// In Next.js App Router:
// • app/page.tsx        → yoursite.com/
// • app/about/page.tsx  → yoursite.com/about
// • app/curricula/page.tsx → yoursite.com/curricula
//
// This page is a SERVER COMPONENT by default (no "use client" at the top).

import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AudienceSection from "@/components/sections/AudienceSection";
import CurriculaSection from "@/components/sections/CurriculaSection";
import AppSection from "@/components/sections/AppSection";
import { VideosSection } from "@/components/sections/VideosSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />           {/* Section 1+2: Hero with CTA */}
      <AboutSection />          {/* Section 3: من نحن / ماذا نقدم */}
      <AudienceSection />       {/* Section 4: من نخدم */}
      <CurriculaSection />      {/* Section 5: المناهج */}
      <AppSection />            {/* Section 6: التطبيق */}
      <VideosSection />
      <NewsSection />
      <VisionSection />
      <CTASection />
    </>
  );
}
