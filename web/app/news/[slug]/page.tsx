import { getAllNewsSlugs, getNewsBySlug } from '@/lib/data/news';
import NewsDetailClient from '@/app/news/[slug]/NewsDetailClient';
import { Metadata } from 'next';

export function generateStaticParams() {
  const slugs = getAllNewsSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = getNewsBySlug(params.slug);
  if (!item) return {};
  return {
    title: item.title.ar,
    description: item.excerpt.ar,
  };
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  return <NewsDetailClient slug={params.slug} />;
}
