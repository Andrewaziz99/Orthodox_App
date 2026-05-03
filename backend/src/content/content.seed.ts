/**
 * Content Seed Script
 *
 * Populates the SiteContent, NewsArticle, and Curriculum tables from the
 * existing static locale files (ar.json / en.json) and data files.
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register src/content/content.seed.ts
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';
import { SiteContent, ContentType } from './site-content.entity';
import { NewsArticle } from './news-article.entity';
import { Curriculum } from './curriculum.entity';

config(); // load .env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  database: process.env.DATABASE_NAME || 'orthodox_app',
  entities: [SiteContent, NewsArticle, Curriculum],
  synchronize: true,
});

// ─── Load locale files ────────────────────────────────────────────────────────

const WEB_DIR = join(__dirname, '..', '..', '..', 'web');
const ar = JSON.parse(readFileSync(join(WEB_DIR, 'locales', 'ar.json'), 'utf8'));
const en = JSON.parse(readFileSync(join(WEB_DIR, 'locales', 'en.json'), 'utf8'));

type ContentSeed = { section: string; key: string; type?: 'text' | 'textarea' | 'image' | 'json'; ar: string; en: string };

function t(arObj: any, enObj: any): ContentSeed[] {
  return []; // helper placeholder
}

// ─── Define content seeds ─────────────────────────────────────────────────────

const contentSeeds: ContentSeed[] = [
  // Hero
  { section: 'hero', key: 'badge',            type: 'text',     ar: ar.hero.badge,               en: en.hero.badge },
  { section: 'hero', key: 'heading',          type: 'text',     ar: ar.hero.heading,             en: en.hero.heading },
  { section: 'hero', key: 'headingHighlight', type: 'text',     ar: ar.hero.headingHighlight,    en: en.hero.headingHighlight },
  { section: 'hero', key: 'subtitle',         type: 'textarea', ar: ar.hero.subtitle,            en: en.hero.subtitle },
  { section: 'hero', key: 'ctaPrimary',       type: 'text',     ar: ar.hero.cta.primary,         en: en.hero.cta.primary },
  { section: 'hero', key: 'ctaSecondary',     type: 'text',     ar: ar.hero.cta.secondary,       en: en.hero.cta.secondary },
  { section: 'hero', key: 'scrollIndicator',  type: 'text',     ar: ar.hero.scrollIndicator,     en: en.hero.scrollIndicator },
  { section: 'hero', key: 'stats',            type: 'json',     ar: JSON.stringify(ar.hero.stats), en: JSON.stringify(en.hero.stats) },
  { section: 'hero', key: 'image',            type: 'image',    ar: '/assets/hero_mockup.png',   en: '/assets/hero_mockup.png' },

  // About
  { section: 'about', key: 'eyebrow',              type: 'text',     ar: ar.about.eyebrow,                    en: en.about.eyebrow },
  { section: 'about', key: 'heading',              type: 'text',     ar: ar.about.heading,                    en: en.about.heading },
  { section: 'about', key: 'whoWeAreTitle',        type: 'text',     ar: ar.about.whoWeAre.title,             en: en.about.whoWeAre.title },
  { section: 'about', key: 'whoWeAreDescription',  type: 'textarea', ar: ar.about.whoWeAre.description,       en: en.about.whoWeAre.description },
  { section: 'about', key: 'whatWeOfferTitle',     type: 'text',     ar: ar.about.whatWeOffer.title,          en: en.about.whatWeOffer.title },
  { section: 'about', key: 'whatWeOfferDescription', type: 'textarea', ar: ar.about.whatWeOffer.description,  en: en.about.whatWeOffer.description },
  { section: 'about', key: 'features',             type: 'json',     ar: JSON.stringify(ar.about.features),   en: JSON.stringify(en.about.features) },

  // Audience
  { section: 'audience', key: 'eyebrow',    type: 'text',     ar: ar.audience.eyebrow,    en: en.audience.eyebrow },
  { section: 'audience', key: 'heading',    type: 'text',     ar: ar.audience.heading,    en: en.audience.heading },
  { section: 'audience', key: 'subheading', type: 'textarea', ar: ar.audience.subheading, en: en.audience.subheading },
  { section: 'audience', key: 'churches',   type: 'json',     ar: JSON.stringify(ar.audience.churches),  en: JSON.stringify(en.audience.churches) },
  { section: 'audience', key: 'servants',   type: 'json',     ar: JSON.stringify(ar.audience.servants),  en: JSON.stringify(en.audience.servants) },
  { section: 'audience', key: 'children',   type: 'json',     ar: JSON.stringify(ar.audience.children),  en: JSON.stringify(en.audience.children) },

  // App section
  { section: 'app', key: 'eyebrow',          type: 'text',     ar: ar.app.eyebrow,          en: en.app.eyebrow },
  { section: 'app', key: 'heading',          type: 'text',     ar: ar.app.heading,          en: en.app.heading },
  { section: 'app', key: 'headingHighlight', type: 'text',     ar: ar.app.headingHighlight, en: en.app.headingHighlight },
  { section: 'app', key: 'description',      type: 'textarea', ar: ar.app.description,      en: en.app.description },
  { section: 'app', key: 'cta',              type: 'text',     ar: ar.app.cta,              en: en.app.cta },
  { section: 'app', key: 'features',         type: 'json',     ar: JSON.stringify(ar.app.features), en: JSON.stringify(en.app.features) },
  { section: 'app', key: 'image',            type: 'image',    ar: '/assets/app_mockup.png', en: '/assets/app_mockup.png' },

  // Videos
  { section: 'videos', key: 'heading',    type: 'text',     ar: ar.videos.heading,    en: en.videos.heading },
  { section: 'videos', key: 'subheading', type: 'textarea', ar: ar.videos.subheading, en: en.videos.subheading },
  { section: 'videos', key: 'items',      type: 'json',     ar: JSON.stringify(ar.videos.items), en: JSON.stringify(en.videos.items) },

  // Vision section
  { section: 'vision', key: 'eyebrow',     type: 'text',     ar: ar.vision.eyebrow,     en: en.vision.eyebrow },
  { section: 'vision', key: 'heading',     type: 'text',     ar: ar.vision.heading,     en: en.vision.heading },
  { section: 'vision', key: 'description', type: 'textarea', ar: ar.vision.description, en: en.vision.description },
  { section: 'vision', key: 'pillars',     type: 'json',     ar: JSON.stringify(ar.vision.pillars), en: JSON.stringify(en.vision.pillars) },
  { section: 'vision', key: 'cta',         type: 'text',     ar: ar.vision.cta,         en: en.vision.cta },

  // CTA section
  { section: 'cta', key: 'heading',         type: 'textarea', ar: ar.cta.heading,         en: en.cta.heading },
  { section: 'cta', key: 'description',     type: 'textarea', ar: ar.cta.description,     en: en.cta.description },
  { section: 'cta', key: 'primaryButton',   type: 'text',     ar: ar.cta.primaryButton,   en: en.cta.primaryButton },
  { section: 'cta', key: 'secondaryButton', type: 'text',     ar: ar.cta.secondaryButton, en: en.cta.secondaryButton },

  // Contact
  { section: 'contact', key: 'heading',    type: 'text',     ar: ar.contact.heading,    en: en.contact.heading },
  { section: 'contact', key: 'subheading', type: 'textarea', ar: ar.contact.subheading, en: en.contact.subheading },
  { section: 'contact', key: 'formLabels', type: 'json',     ar: JSON.stringify(ar.contact.form), en: JSON.stringify(en.contact.form) },

  // Standalone About Page
  { section: 'about_page', key: 'heading',              type: 'text',     ar: 'عن مدرستنا',                    en: 'About Our School' },
  { section: 'about_page', key: 'subheading',           type: 'textarea', ar: 'تعرف على رؤيتنا وأهدافنا ومبادئنا الأساسية في تعليم كلمة الله.', en: 'Learn about our vision, goals, and core principles in teaching God\'s word.' },
  { section: 'about_page', key: 'whoWeAreTitle',        type: 'text',     ar: 'من نحن',                         en: 'Who We Are' },
  { section: 'about_page', key: 'whoWeAreDescription',  type: 'textarea', ar: 'مدرسة كتاب مقدس متخصصة تهدف لتقديم تعليم أرثوذكسي نقي للأطفال.', en: 'A specialized Bible school aiming to provide pure Orthodox education for children.' },
  { section: 'about_page', key: 'whatWeOfferTitle',     type: 'text',     ar: 'ماذا نقدم',                      en: 'What We Offer' },
  { section: 'about_page', key: 'whatWeOfferDescription', type: 'textarea', ar: 'مناهج دراسية متدرجة، مواد تعليمية تفاعلية، وبيئة تعليمية محفزة.', en: 'Graduated curricula, interactive educational materials, and a stimulating learning environment.' },
  { section: 'about_page', key: 'valuesEyebrow',        type: 'text',     ar: 'قيمنا',                          en: 'Our Values' },
  { section: 'about_page', key: 'valuesHeading',        type: 'text',     ar: 'ما يميزنا',                      en: 'What Sets Us Apart' },
  { section: 'about_page', key: 'values',               type: 'json',     
    ar: JSON.stringify([
      { icon: 'Cross', labelAr: 'إيمان أرثوذكسي', labelEn: 'Orthodox Faith' },
      { icon: 'BookOpen', labelAr: 'دراسة كتابية', labelEn: 'Bible Study' },
      { icon: 'Users', labelAr: 'مجتمع متنامي', labelEn: 'Growing Community' },
      { icon: 'Heart', labelAr: 'حب ورعاية', labelEn: 'Love & Care' },
      { icon: 'GraduationCap', labelAr: 'تعليم منهجي', labelEn: 'Structured Learning' },
      { icon: 'Sparkles', labelAr: 'تجربة فريدة', labelEn: 'Unique Experience' },
    ]),
    en: JSON.stringify([
      { icon: 'Cross', labelAr: 'إيمان أرثوذكسي', labelEn: 'Orthodox Faith' },
      { icon: 'BookOpen', labelAr: 'دراسة كتابية', labelEn: 'Bible Study' },
      { icon: 'Users', labelAr: 'مجتمع متنامي', labelEn: 'Growing Community' },
      { icon: 'Heart', labelAr: 'حب ورعاية', labelEn: 'Love & Care' },
      { icon: 'GraduationCap', labelAr: 'تعليم منهجي', labelEn: 'Structured Learning' },
      { icon: 'Sparkles', labelAr: 'تجربة فريدة', labelEn: 'Unique Experience' },
    ])
  },

  // Standalone App Page
  { section: 'app_page', key: 'heading',          type: 'text',     ar: 'تطبيق الهاتف',          en: 'Mobile Application' },
  { section: 'app_page', key: 'description',      type: 'textarea', ar: 'كل المناهج والمواد التعليمية في متناول يدك.', en: 'All curricula and educational materials at your fingertips.' },
  { section: 'app_page', key: 'downloadHeading',  type: 'text',     ar: 'حمّل تطبيقنا اليوم',     en: 'Download Our App Today' },
  { section: 'app_page', key: 'downloadSubheading', type: 'textarea', ar: 'احصل على وصول كامل لجميع المناهج والمحتوى التعليمي من جهازك المحمول.', en: 'Get full access to all curricula and educational content from your mobile device.' },
  { section: 'app_page', key: 'featuresEyebrow',  type: 'text',     ar: 'مميزات التطبيق',        en: 'App Features' },
  { section: 'app_page', key: 'featuresHeading',  type: 'text',     ar: 'لماذا تطبيقنا؟',         en: 'Why Our App?' },
  { section: 'app_page', key: 'features',         type: 'json',     
    ar: JSON.stringify([
      { icon: 'BookOpen', titleAr: 'محتوى كتابي شامل', titleEn: 'Comprehensive Biblical Content', descriptionAr: 'جميع المناهج والمواد التعليمية في مكان واحد', descriptionEn: 'All curricula and educational materials in one place' },
      { icon: 'Zap', titleAr: 'سريع وسهل الاستخدام', titleEn: 'Fast & Easy to Use', descriptionAr: 'واجهة بسيطة وسلسة مصممة للأطفال والمعلمين', descriptionEn: 'Simple and smooth interface designed for children and teachers' },
      { icon: 'Shield', titleAr: 'آمن للأطفال', titleEn: 'Safe for Children', descriptionAr: 'بيئة آمنة ومحمية لتصفح المحتوى الكتابي', descriptionEn: 'Safe and protected environment for browsing biblical content' },
      { icon: 'Star', titleAr: 'تحديثات مستمرة', titleEn: 'Regular Updates', descriptionAr: 'محتوى جديد ومحدث بشكل دوري', descriptionEn: 'New and regularly updated content' },
    ]),
    en: JSON.stringify([
      { icon: 'BookOpen', titleAr: 'محتوى كتابي شامل', titleEn: 'Comprehensive Biblical Content', descriptionAr: 'جميع المناهج والمواد التعليمية في مكان واحد', descriptionEn: 'All curricula and educational materials in one place' },
      { icon: 'Zap', titleAr: 'سريع وسهل الاستخدام', titleEn: 'Fast & Easy to Use', descriptionAr: 'واجهة بسيطة وسلسة مصممة للأطفال والمعلمين', descriptionEn: 'Simple and smooth interface designed for children and teachers' },
      { icon: 'Shield', titleAr: 'آمن للأطفال', titleEn: 'Safe for Children', descriptionAr: 'بيئة آمنة ومحمية لتصفح المحتوى الكتابي', descriptionEn: 'Safe and protected environment for browsing biblical content' },
      { icon: 'Star', titleAr: 'تحديثات مستمرة', titleEn: 'Regular Updates', descriptionAr: 'محتوى جديد ومحدث بشكل دوري', descriptionEn: 'New and regularly updated content' },
    ])
  },

  // Standalone Vision Page
  { section: 'vision_page', key: 'heading',          type: 'text',     ar: 'رؤيتنا',                    en: 'Our Vision' },
  { section: 'vision_page', key: 'description',      type: 'textarea', ar: 'تعرف على خطواتنا نحو مستقبل أفضل لأبنائنا.', en: 'Learn about our steps towards a better future for our children.' },
  { section: 'vision_page', key: 'visionHeading',    type: 'text',     ar: 'نبني جيلاً يعرف الكتاب المقدس ويحيا بتعاليمه', en: 'Building a Generation That Knows the Bible and Lives by Its Teachings' },
  { section: 'vision_page', key: 'visionText',       type: 'textarea', ar: 'رؤيتنا هي تقديم تعليم كتابي أرثوذكسي متميز يصل لكل طفل.', en: 'Our vision is to provide outstanding Orthodox biblical education that reaches every child.' },
  { section: 'vision_page', key: 'roadmapEyebrow',   type: 'text',     ar: 'خطة العمل',                en: 'Our Roadmap' },
  { section: 'vision_page', key: 'roadmapHeading',   type: 'text',     ar: 'مسيرة التطوير',            en: 'Development Journey' },
  { section: 'vision_page', key: 'milestones',       type: 'json',     
    ar: JSON.stringify([
      { year: '2024', titleAr: 'إطلاق المنهج الأول', titleEn: 'First Curriculum Launch', descriptionAr: 'إنطلاق أول منهج للدراسة الكتابية للأطفال', descriptionEn: 'Launch of the first Bible study curriculum for children', icon: 'Lightbulb', color: 'teal' },
      { year: '2025', titleAr: 'التوسع الرقمي', titleEn: 'Digital Expansion', descriptionAr: 'إطلاق المنصة الرقمية والتطبيق الذكي', descriptionEn: 'Launch of the digital platform and smart app', icon: 'Globe', color: 'amber' },
      { year: '2026', titleAr: 'مناهج متعددة', titleEn: 'Multiple Curricula', descriptionAr: 'إضافة مناهج جديدة تغطي فئات عمرية مختلفة', descriptionEn: 'Adding new curricula covering different age groups', icon: 'TrendingUp', color: 'teal' },
      { year: '2027+', titleAr: 'التأثير العالمي', titleEn: 'Global Impact', descriptionAr: 'الوصول لأكبر عدد من الأطفال في العالم', descriptionEn: 'Reaching the maximum number of children worldwide', icon: 'Compass', color: 'amber' },
    ]),
    en: JSON.stringify([
      { year: '2024', titleAr: 'إطلاق المنهج الأول', titleEn: 'First Curriculum Launch', descriptionAr: 'إنطلاق أول منهج للدراسة الكتابية للأطفال', descriptionEn: 'Launch of the first Bible study curriculum for children', icon: 'Lightbulb', color: 'teal' },
      { year: '2025', titleAr: 'التوسع الرقمي', titleEn: 'Digital Expansion', descriptionAr: 'إطلاق المنصة الرقمية والتطبيق الذكي', descriptionEn: 'Launch of the digital platform and smart app', icon: 'Globe', color: 'amber' },
      { year: '2026', titleAr: 'مناهج متعددة', titleEn: 'Multiple Curricula', descriptionAr: 'إضافة مناهج جديدة تغطي فئات عمرية مختلفة', descriptionEn: 'Adding new curricula covering different age groups', icon: 'TrendingUp', color: 'teal' },
      { year: '2027+', titleAr: 'التأثير العالمي', titleEn: 'Global Impact', descriptionAr: 'الوصول لأكبر عدد من الأطفال في العالم', descriptionEn: 'Reaching the maximum number of children worldwide', icon: 'Compass', color: 'amber' },
    ])
  },

  // Standalone Curricula Listing Page
  { section: 'curricula_page', key: 'heading',    type: 'text',     ar: 'مناهجنا التعليمية',          en: 'Our Educational Curricula' },
  { section: 'curricula_page', key: 'subheading', type: 'textarea', ar: 'مسار متدرج من المناهج الكتابية المصممة بعناية لتناسب المراحل العمرية المختلفة', en: 'A progressive path of carefully designed biblical curricula to suit different age groups' },

  // Standalone News Listing Page
  { section: 'news_page', key: 'heading',    type: 'text',     ar: 'أحدث الأخبار',               en: 'Latest News' },
  { section: 'news_page', key: 'subheading', type: 'textarea', ar: 'تابع آخر التحديثات والفعاليات والأخبار من مدرسة الكتاب المقدس', en: 'Follow the latest updates, events, and news from Bible School' },
];

// ─── News seeds (from static data) ───────────────────────────────────────────

const newsSeeds = [
  {
    slug: 'app-update-march-2025',
    titleAr: 'تحديث التطبيق لشهر مارس ٢٠٢٥', titleEn: 'App Update - March 2025',
    excerptAr: 'ميزات جديدة للطلاب', excerptEn: 'New Features for Students',
    bodyAr: 'يسعدنا أن نعلن عن تحديث جديد لتطبيقنا يتضمن ميزات تفاعلية جديدة للطلاب، بالإضافة إلى تحسينات في الأداء وإصلاح بعض الأخطاء.',
    bodyEn: 'We are excited to announce a new update to our app including interactive features for students, performance improvements, and bug fixes.',
    categoryAr: 'تطبيق', categoryEn: 'App',
    date: '2025-03-15', author: 'Admin',
    image: '/assets/news/app-update.png', published: true, order: 1,
    relatedSlugs: ['bible-curriculum-launch'],
  },
  {
    slug: 'bible-curriculum-launch',
    titleAr: 'إطلاق مناهج الكتاب المقدس الجديدة', titleEn: 'Launch of New Bible Curricula',
    excerptAr: 'مناهج متخصصة لكل الفئات العمرية', excerptEn: 'Specialized Curricula for All Ages',
    bodyAr: 'تم إطلاق مجموعة جديدة من المناهج الدراسية لتتناسب مع جميع الفئات العمرية من الحضانة وحتى المرحلة الثانوية.',
    bodyEn: 'A new set of curricula has been launched for all ages from nursery to high school.',
    categoryAr: 'مناهج', categoryEn: 'Curriculum',
    date: '2025-02-20', image: '/assets/news/curricula-launch.png', published: true, order: 2,
    relatedSlugs: ['app-update-march-2025', 'new-vision-2025'],
  },
  {
    slug: 'new-vision-2025',
    titleAr: 'رؤيتنا المستقبلية لعام ٢٠٢٥', titleEn: 'Our Vision for 2025',
    excerptAr: 'خطواتنا القادمة في التطوير', excerptEn: 'Our Next Steps in Development',
    bodyAr: 'نشارككم رؤيتنا للعام الجديد حيث نهدف إلى الوصول إلى المزيد من الكنائس في جميع أنحاء العالم.',
    bodyEn: 'We share our vision for the new year as we aim to reach more churches worldwide.',
    categoryAr: 'رؤية', categoryEn: 'Vision',
    date: '2025-01-10', image: '/assets/news/vision-2025.png', published: true, order: 3,
    relatedSlugs: [],
  },
];

// ─── Curricula seeds ──────────────────────────────────────────────────────────

const curriculaSeeds = [
  {
    slug: 'bible-characters', number: '1', badge: '📖',
    titleAr: 'شخصيات الكتاب المقدس', titleEn: 'Bible Characters',
    durationAr: 'سنتان', durationEn: '2 Years',
    audienceAr: 'حضانة وأولى ابتدائي', audienceEn: 'Nursery & Grade 1',
    descriptionAr: 'مدخل مناسب لبناء معرفة أولية بشخصيات الكتاب المقدس وأحداثه الأساسية.',
    descriptionEn: 'An appropriate introduction to building foundational knowledge of Bible characters and key events.',
    ageRangeAr: '٤ – ٦ سنوات', ageRangeEn: '4 – 6 years',
    published: true, order: 1,
  },
  {
    slug: 'biblical-concepts', number: '2', badge: '✨',
    titleAr: 'مفاهيم كتابية للأطفال', titleEn: 'Biblical Concepts for Children',
    durationAr: 'سنتان', durationEn: '2 Years',
    audienceAr: 'ثانية وثالثة ابتدائي', audienceEn: 'Grades 2 & 3',
    descriptionAr: 'منهج يساعد الأطفال على فهم المفاهيم الكتابية الأساسية بطريقة مناسبة لأعمارهم.',
    descriptionEn: 'A curriculum helping children understand core biblical concepts in an age-appropriate way.',
    ageRangeAr: '٧ – ٩ سنوات', ageRangeEn: '7 – 9 years',
    published: true, order: 2,
  },
  {
    slug: 'extended-study', number: '3', badge: '📚',
    titleAr: 'دراسة موسعة في الكتاب المقدس', titleEn: 'Extended Bible Study',
    durationAr: 'أربع سنوات', durationEn: '4 Years',
    audienceAr: 'من رابعة ابتدائي حتى أولى إعدادي', audienceEn: 'Grade 4 – Grade 7',
    descriptionAr: 'رحلة أعمق في دراسة الكتاب المقدس بشكل منظم ومتدرج.',
    descriptionEn: 'A deeper journey into structured and progressive Bible study.',
    ageRangeAr: '١٠ – ١٣ سنة', ageRangeEn: '10 – 13 years',
    published: true, order: 3,
  },
  {
    slug: 'servant-prep', number: '4', badge: '🌟',
    titleAr: 'إعداد خدام مدرسة كتاب مقدس', titleEn: 'Bible School Servant Preparation',
    durationAr: 'ثلاث سنوات', durationEn: '3 Years',
    audienceAr: 'من ثانية إعدادي حتى أولى ثانوي', audienceEn: 'Grades 8 – 10',
    descriptionAr: 'منهج يهدف إلى إعداد جيل متدرج نحو الخدمة والفهم الأعمق والمسؤولية.',
    descriptionEn: 'A curriculum preparing a generation for service, deeper understanding, and responsibility.',
    ageRangeAr: '١٤ – ١٦ سنة', ageRangeEn: '14 – 16 years',
    published: true, order: 4,
  },
];

// ─── Run seed ─────────────────────────────────────────────────────────────────

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ DB Connected');

  const scRepo = AppDataSource.getRepository(SiteContent);
  const newsRepo = AppDataSource.getRepository(NewsArticle);
  const currRepo = AppDataSource.getRepository(Curriculum);

  // Seed SiteContent (upsert)
  for (const item of contentSeeds) {
    const existing = await scRepo.findOne({ where: { section: item.section, key: item.key } });
    if (!existing) {
      await scRepo.save(scRepo.create({
        section: item.section,
        key: item.key,
        type: (item.type as ContentType) || ContentType.TEXT,
        valueAr: item.ar,
        valueEn: item.en,
      }));
      console.log(`  📝 Seeded: ${item.section}/${item.key}`);
    } else {
      console.log(`  ⏭  Exists: ${item.section}/${item.key}`);
    }
  }

  // Seed News
  for (const article of newsSeeds) {
    const existing = await newsRepo.findOne({ where: { slug: article.slug } });
    if (!existing) {
      await newsRepo.save(newsRepo.create(article));
      console.log(`  📰 Seeded news: ${article.slug}`);
    }
  }

  // Seed Curricula
  for (const curriculum of curriculaSeeds) {
    const existing = await currRepo.findOne({ where: { slug: curriculum.slug } });
    if (!existing) {
      await currRepo.save(currRepo.create(curriculum));
      console.log(`  📗 Seeded curriculum: ${curriculum.slug}`);
    }
  }

  await AppDataSource.destroy();
  console.log('\n✅ Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
