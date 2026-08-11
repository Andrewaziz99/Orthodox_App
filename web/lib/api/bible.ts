import type {
  BibleMetadata,
  Chapter,
  CombinedBibleMetadata,
  MetadataBook,
  SearchMatch,
  SearchResult,
} from '../bible-types';
import { bookNameMap } from '../book-names';
import { graphyApi } from './client';

type Locale = 'en' | 'ar';
type Translation = 'WEB' | 'Arabic';

const ARABIC_BOOK_NAMES: Record<string, string> = {
  ...Object.fromEntries(Object.values(bookNameMap).map((entry) => [entry.en, entry.ar])),
  Tobit: 'طوبيا',
  Judith: 'يهوديت',
  'Additions to Esther': 'تتمة أستير',
  Wisdom: 'الحكمة',
  Sirach: 'يشوع بن سيراخ',
  Baruch: 'باروخ',
  'Additions to Daniel': 'تتمة دانيال',
  '1 Maccabees': 'المكابيين الأول',
  '2 Maccabees': 'المكابيين الثاني',
};

const ARABIC_DIVISION_NAMES: Record<string, string> = {
  Pentateuch: 'أسفار موسى',
  'Historical Books': 'الأسفار التاريخية',
  'Wisdom / Poetry Books': 'الأسفار الحكمية والشعرية',
  'Major Prophets': 'الأنبياء الكبار',
  'Minor Prophets': 'الأنبياء الصغار',
  'Deuterocanonical Books': 'الأسفار القانونية الثانية',
  Gospels: 'الأناجيل',
  Acts: 'أعمال الرسل',
  'Pauline Epistles': 'رسائل بولس',
  'General Epistles': 'الرسائل الجامعة',
  Revelation: 'الرؤيا',
};

interface GraphyBibleBook {
  id: number;
  name: string;
  abbreviation: string | null;
  chapterCount: number;
  chaptersWithText: number[];
}

interface GraphyBibleTestament {
  name: string;
  divisions: Array<{ name: string; books: GraphyBibleBook[] }>;
}

interface GraphyBibleChapter {
  chapterNumber: number;
  available: boolean;
  verses: Array<{ number: number; text: string }>;
}

interface GraphyBibleSearchHit {
  bookId: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
}

const translationFor = (locale: Locale): Translation => (locale === 'en' ? 'WEB' : 'Arabic');

function displayBookName(book: GraphyBibleBook | GraphyBibleSearchHit, locale: Locale): string {
  const name = 'name' in book ? book.name : book.bookName;
  if (locale === 'ar') {
    return ARABIC_BOOK_NAMES[name] || name;
  }
  return name;
}

function mapMetadata(source: GraphyBibleTestament[], locale: Locale): BibleMetadata {
  return {
    translation: translationFor(locale),
    testaments: source.map((testament) => ({
      name: testament.name,
      books: testament.divisions.flatMap((division) =>
        division.books.map<MetadataBook>((book) => ({
          number: book.id,
          name: displayBookName(book, locale),
          chapterCount: book.chapterCount,
          division: locale === 'ar' ? ARABIC_DIVISION_NAMES[division.name] || division.name : division.name,
        }))),
    })),
  };
}

export async function getBibleMetadata(): Promise<CombinedBibleMetadata> {
  const books = await graphyApi.get<GraphyBibleTestament[]>('/bible/books', {
    requiresAuth: false,
    next: { revalidate: 86400 },
  });
  return { en: mapMetadata(books, 'en'), ar: mapMetadata(books, 'ar') };
}

export async function getBibleChapter(
  bookId: number,
  chapterNumber: number,
  locale: Locale,
): Promise<Chapter> {
  const translation = translationFor(locale);
  const chapter = await graphyApi.get<GraphyBibleChapter>(
    `/bible/chapters/${bookId}/${chapterNumber}?translation=${translation}`,
    { requiresAuth: false },
  );
  return { number: chapter.chapterNumber, verses: chapter.available ? chapter.verses : [] };
}

function findMatches(text: string, query: string): SearchMatch[] {
  const matches: SearchMatch[] = [];
  const normalizedText = text.toLocaleLowerCase();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  let position = 0;

  while (normalizedQuery && (position = normalizedText.indexOf(normalizedQuery, position)) !== -1) {
    matches.push({ start: position, end: position + query.trim().length, word: text.slice(position, position + query.trim().length) });
    position += normalizedQuery.length;
  }
  return matches;
}

export async function searchBible(query: string, locale: Locale): Promise<SearchResult[]> {
  const translation = translationFor(locale);
  const hits = await graphyApi.get<GraphyBibleSearchHit[]>(
    `/bible/search?q=${encodeURIComponent(query)}&translation=${translation}`,
    { requiresAuth: false },
  );
  return hits.map((hit) => {
    const bookName = displayBookName(hit, locale);
    return {
      verseRef: `${bookName} ${hit.chapterNumber}:${hit.verseNumber}`,
      bookNumber: hit.bookId,
      bookName,
      chapterNumber: hit.chapterNumber,
      verseNumber: hit.verseNumber,
      text: hit.text,
      matches: findMatches(hit.text, query),
    };
  });
}
