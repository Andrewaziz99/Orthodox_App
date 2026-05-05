import { getCurriculaList, getCurriculum } from '@/lib/api/content';
import CurriculumDetailClient from '@/app/curricula/[slug]/CurriculumDetailClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const curricula = await getCurriculaList();
  return curricula.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getCurriculum(params.slug);
  if (!item) return {};
  return {
    title: item.titleAr,
    description: item.descriptionAr,
  };
}

export default async function CurriculumDetailPage({ params }: { params: { slug: string } }) {
  const curriculum = await getCurriculum(params.slug);
  
  if (!curriculum) {
    notFound();
  }

  return <CurriculumDetailClient curriculum={curriculum} />;
}
