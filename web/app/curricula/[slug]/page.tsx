import { getCurriculaList, getCurriculum } from '@/lib/api/content';
import CurriculumDetailClient from '@/app/curricula/[slug]/CurriculumDetailClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const curricula = await getCurriculaList();
    return curricula.map((c) => ({
      slug: c.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getCurriculum(params.slug).catch(() => null);
  if (!item) return {};
  return {
    title: item.titleAr,
    description: item.descriptionAr,
  };
}

export default async function CurriculumDetailPage({ params }: { params: { slug: string } }) {
  let curriculum;
  try {
    curriculum = await getCurriculum(params.slug);
  } catch {
    return (
      <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Curricula are temporarily unavailable</h1>
        <p className="mt-3 text-slate-600">Please try again after the content service is available.</p>
      </main>
    );
  }
  
  if (!curriculum) {
    notFound();
  }

  return <CurriculumDetailClient curriculum={curriculum} />;
}
