import { getNewsArticles, getNewsArticle } from '@/lib/api/content';
import NewsDetailClient from '@/app/news/[slug]/NewsDetailClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return articles.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getNewsArticle(params.slug);
  if (!item) return {};
  return {
    title: item.titleAr,
    description: item.excerptAr,
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getNewsArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  return <NewsDetailClient article={article} />;
}
