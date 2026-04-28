import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Bible } from '@/lib/bible-types';
import { buildSearchIndex, searchBibleWithIndex, SearchIndex } from '@/lib/bible-search-optimized';

// Server-side cache for Bible data and indices
let cachedBibles: { en?: Bible; ar?: Bible } = {};
let cachedIndices: { en?: SearchIndex; ar?: SearchIndex } = {};

function getBibleData(lang: 'en' | 'ar'): Bible {
  if (cachedBibles[lang]) return cachedBibles[lang]!;

  const filePath = path.join(process.cwd(), 'public', 'data', `bible-${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Bible;
  cachedBibles[lang] = data;
  return data;
}

function getSearchIndex(lang: 'en' | 'ar'): SearchIndex {
  if (cachedIndices[lang]) return cachedIndices[lang]!;

  const bibleData = getBibleData(lang);
  const index = buildSearchIndex(bibleData, lang);
  cachedIndices[lang] = index;
  return index;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const lang = (searchParams.get('lang') || 'ar') as 'en' | 'ar';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const bibleData = getBibleData(lang);
    const index = getSearchIndex(lang);
    const results = searchBibleWithIndex(query, bibleData, index, lang);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
