import BibleReader from '@/components/bible/BibleReader';
import { Metadata } from 'next';
import { getBibleMetadata } from '@/lib/api/bible';

export const metadata: Metadata = {
  title: 'Bible Reader | Orthodox Christian Bible School',
  description: 'Search and read the Bible in English (WEB) and Arabic.',
};

export const revalidate = 86400; // ISR: revalidate every 24 hours

async function loadBibleMetadata() {
  try {
    return await getBibleMetadata();
  } catch (error) {
    console.error('Error loading Bible metadata:', error);
    return {};
  }
}

export default async function BiblePage() {
  const metadata = await loadBibleMetadata();

  return (
    <div className="h-full bg-white overflow-hidden">
      <BibleReader metadata={metadata} />
    </div>
  );
}
