import { getNewsArticles, getNewsArticle } from '@/lib/api/content';
import NewsDetailClient from '@/app/news/[slug]/NewsDetailClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const articles = await getNewsArticles();
    return articles.map((art) => ({
      slug: art.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getNewsArticle(params.slug).catch(() => null);
  if (!item) return {};
  return {
    title: item.titleAr,
    description: item.excerptAr,
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  let article;
  try {
    article = await getNewsArticle(params.slug);
  } catch {
    return (
      <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">News is temporarily unavailable</h1>
        <p className="mt-3 text-slate-600">Please try again after the content service is available.</p>
      </main>
    );
  }
  
  if (!article) {
    notFound();
  }

  return <NewsDetailClient article={article} />;
}
