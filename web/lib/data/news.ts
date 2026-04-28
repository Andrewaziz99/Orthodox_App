import { NewsArticle } from '../types/content';

export const news: NewsArticle[] = [
  {
    slug: 'app-update-march-2025',
    title: { ar: 'تحديث التطبيق لشهر مارس ٢٠٢٥', en: 'App Update - March 2025' },
    excerpt: { ar: 'ميزات جديدة للطلاب', en: 'New Features for Students' },
    body: {
      ar: 'يسعدنا أن نعلن عن تحديث جديد لتطبيقنا يتضمن ميزات تفاعلية جديدة للطلاب، بالإضافة إلى تحسينات في الأداء وإصلاح بعض الأخطاء. الآن يمكن للطلاب متابعة تقدمهم بشكل أفضل.',
      en: 'We are excited to announce a new update to our app including interactive features for students, performance improvements, and bug fixes. Students can now track their progress better.'
    },
    category: { ar: 'تطبيق', en: 'App' },
    date: '2025-03-15',
    author: 'Admin',
    image: '/assets/news/app-update.png',
    relatedSlugs: ['bible-curriculum-launch']
  },
  {
    slug: 'bible-curriculum-launch',
    title: { ar: 'إطلاق مناهج الكتاب المقدس الجديدة', en: 'Launch of New Bible Curricula' },
    excerpt: { ar: 'مناهج متخصصة لكل الفئات العمرية', en: 'Specialized Curricula for All Ages' },
    body: {
      ar: 'تم إطلاق مجموعة جديدة من المناهج الدراسية لتتناسب مع جميع الفئات العمرية من الحضانة وحتى المرحلة الثانوية، والتي تم تصميمها بعناية لتقديم محتوى تعليمي مفيد وممتع.',
      en: 'A new set of curricula has been launched for all ages from nursery to high school, carefully designed to provide engaging and beneficial educational content.'
    },
    category: { ar: 'مناهج', en: 'Curriculum' },
    date: '2025-02-20',
    image: '/assets/news/curricula-launch.png',
    relatedSlugs: ['app-update-march-2025', 'new-vision-2025']
  },
  {
    slug: 'new-vision-2025',
    title: { ar: 'رؤيتنا المستقبلية لعام ٢٠٢٥', en: 'Our Vision for 2025' },
    excerpt: { ar: 'خطواتنا القادمة في التطوير', en: 'Our Next Steps in Development' },
    body: {
      ar: 'نشارككم رؤيتنا للعام الجديد حيث نهدف إلى الوصول إلى المزيد من الكنائس في جميع أنحاء العالم، وتقديم محتوى مترجم بلغات متعددة لخدمة أبناء الكنيسة في كل مكان.',
      en: 'We share our vision for the new year as we aim to reach more churches worldwide and provide translated content in multiple languages to serve church members everywhere.'
    },
    category: { ar: 'رؤية', en: 'Vision' },
    date: '2025-01-10',
    image: '/assets/news/vision-2025.png',
    relatedSlugs: []
  }
];

export function getNewsBySlug(slug: string) {
  return news.find(n => n.slug === slug);
}

export function getAllNewsSlugs() {
  return news.map(n => n.slug);
}
