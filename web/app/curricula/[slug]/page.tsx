import { getAllCurriculaSlugs, getCurriculumBySlug } from '@/lib/data/curricula';
import CurriculumDetailClient from '@/app/curricula/[slug]/CurriculumDetailClient';
import { Metadata } from 'next';

export function generateStaticParams() {
  const slugs = getAllCurriculaSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = getCurriculumBySlug(params.slug);
  if (!item) return {};
  return {
    title: item.title.ar,
    description: item.description.ar,
  };
}

export default function CurriculumDetailPage({ params }: { params: { slug: string } }) {
  return <CurriculumDetailClient slug={params.slug} />;
}
