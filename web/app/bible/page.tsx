import BibleReader from '@/components/bible/BibleReader';
import { CombinedBibleMetadata } from '@/lib/bible-types';
import { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata: Metadata = {
  title: 'Bible Reader | Orthodox Christian Bible School',
  description: 'Search and read the Bible in English (NIV) and Arabic (AVD). Beautiful modern interface with verse search and highlighting.',
};

export const revalidate = 86400; // ISR: revalidate every 24 hours

function getBibleMetadata() {
  try {
    const dataDir = join(process.cwd(), 'public', 'data');
    const metaPath = join(dataDir, 'bible-metadata.json');
    const content = readFileSync(metaPath, 'utf-8');
    return JSON.parse(content) as CombinedBibleMetadata;
  } catch (error) {
    console.error('Error reading Bible metadata file:', error);
    // Return empty metadata to prevent hard crash if file is missing during build
    return {};
  }
}

export default function BiblePage() {
  const metadata = getBibleMetadata();

  return (
    <div className="h-full bg-white overflow-hidden">
      <BibleReader metadata={metadata} />
    </div>
  );
}
