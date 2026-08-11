import { MetadataRoute } from 'next';
import { getCurriculaList, getNewsArticles } from '@/lib/api/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orthodox-bible-school-vercel.app';
  const routes = ['', '/about', '/app-page', '/contact', '/curricula', '/news', '/vision', '/bible'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  const dynamicContent = await Promise.all([getCurriculaList(), getNewsArticles()]).catch(
    (error) => {
      console.error('Dynamic sitemap content is unavailable:', error);
      return null;
    },
  );
  if (!dynamicContent) return routes;
  const [curricula, news] = dynamicContent;
  const curriculaRoutes = curricula.map((item) => ({
    url: `${baseUrl}/curricula/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const newsRoutes = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  return [...routes, ...curriculaRoutes, ...newsRoutes];
}
