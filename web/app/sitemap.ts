import { MetadataRoute } from 'next';
import { getAllCurriculaSlugs } from '@/lib/data/curricula';
import { getAllNewsSlugs } from '@/lib/data/news';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orthodox-bible-school-vercel.app';

  // Base routes
  const routes = [
    '',
    '/about',
    '/app-page',
    '/contact',
    '/curricula',
    '/news',
    '/vision',
    '/bible',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes for Curricula
  const curriculaSlugs = getAllCurriculaSlugs();
  const curriculaRoutes = curriculaSlugs.map((slug: string) => ({
    url: `${baseUrl}/curricula/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic routes for News
  const newsSlugs = getAllNewsSlugs();
  const newsRoutes = newsSlugs.map((slug: string) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...curriculaRoutes, ...newsRoutes];
}
