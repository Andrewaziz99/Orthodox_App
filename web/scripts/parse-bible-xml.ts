import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

interface VerseData {
  number: number;
  text: string;
}

interface ChapterData {
  number: number;
  verses: VerseData[];
}

interface BookData {
  number: number;
  name: string;
  chapters: ChapterData[];
}

interface TestamentData {
  name: string;
  books: BookData[];
}

interface BibleData {
  translation: string;
  testaments: TestamentData[];
}

const BOOK_NAMES: { [key: string]: string } = {
  '1': 'Genesis',
  '2': 'Exodus',
  '3': 'Leviticus',
  '4': 'Numbers',
  '5': 'Deuteronomy',
  '6': 'Joshua',
  '7': 'Judges',
  '8': 'Ruth',
  '9': '1 Samuel',
  '10': '2 Samuel',
  '11': '1 Kings',
  '12': '2 Kings',
  '13': '1 Chronicles',
  '14': '2 Chronicles',
  '15': 'Ezra',
  '16': 'Nehemiah',
  '17': 'Esther',
  '18': 'Job',
  '19': 'Psalms',
  '20': 'Proverbs',
  '21': 'Ecclesiastes',
  '22': 'Isaiah',
  '23': 'Jeremiah',
  '24': 'Lamentations',
  '25': 'Ezekiel',
  '26': 'Daniel',
  '27': 'Hosea',
  '28': 'Joel',
  '29': 'Amos',
  '30': 'Obadiah',
  '31': 'Jonah',
  '32': 'Micah',
  '33': 'Nahum',
  '34': 'Habakkuk',
  '35': 'Zephaniah',
  '36': 'Haggai',
  '37': 'Zechariah',
  '38': 'Malachi',
  '39': 'Matthew',
  '40': 'Mark',
  '41': 'Luke',
  '42': 'John',
  '43': 'Acts',
  '44': 'Romans',
  '45': '1 Corinthians',
  '46': '2 Corinthians',
  '47': 'Galatians',
  '48': 'Ephesians',
  '49': 'Philippians',
  '50': 'Colossians',
  '51': '1 Thessalonians',
  '52': '2 Thessalonians',
  '53': '1 Timothy',
  '54': '2 Timothy',
  '55': 'Titus',
  '56': 'Philemon',
  '57': 'Hebrews',
  '58': 'James',
  '59': '1 Peter',
  '60': '2 Peter',
  '61': '1 John',
  '62': '2 John',
  '63': '3 John',
  '64': 'Jude',
  '65': 'Revelation',
};

interface BibleMetadata {
  translation: string;
  testaments: {
    name: string;
    books: {
      number: number;
      name: string;
      chapterCount: number;
    }[];
  }[];
}

async function parseBible(
  filePath: string,
  language: 'en' | 'ar',
  dataDir: string
): Promise<{ bibleData: BibleData; metadata: BibleMetadata }> {
  const xmlContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = await parseStringPromise(xmlContent);

  const bible = parsed.bible;
  const translation = bible.$?.translation || 'Unknown';
  const testaments: TestamentData[] = [];
  const metadataTestaments: BibleMetadata['testaments'] = [];

  const langDir = path.join(dataDir, 'bible', language);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  for (const testamentXml of bible.testament) {
    const testamentName = testamentXml.$?.name || 'Unknown';
    const books: BookData[] = [];
    const metadataBooks: BibleMetadata['testaments'][0]['books'] = [];

    for (const bookXml of testamentXml.book) {
      const bookNumber = parseInt(bookXml.$?.number || '0', 10);
      const bookName = BOOK_NAMES[bookNumber.toString()] || `Book ${bookNumber}`;
      const chapters: ChapterData[] = [];

      const bookDir = path.join(langDir, bookNumber.toString());
      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir, { recursive: true });
      }

      for (const chapterXml of bookXml.chapter) {
        const chapterNumber = parseInt(chapterXml.$?.number || '0', 10);
        const verses: VerseData[] = [];

        for (const verseXml of chapterXml.verse) {
          const verseNumber = parseInt(verseXml.$?.number || '0', 10);
          const verseText = Array.isArray(verseXml._) ? verseXml._.join('') : (verseXml._ || '');

          verses.push({
            number: verseNumber,
            text: verseText.trim(),
          });
        }

        const chapterData = {
          number: chapterNumber,
          verses,
        };

        // Write individual chapter file
        const chapterPath = path.join(bookDir, `${chapterNumber}.json`);
        fs.writeFileSync(chapterPath, JSON.stringify(chapterData, null, 2), 'utf-8');

        chapters.push(chapterData);
      }

      books.push({
        number: bookNumber,
        name: bookName,
        chapters,
      });

      metadataBooks.push({
        number: bookNumber,
        name: bookName,
        chapterCount: chapters.length,
      });
    }

    testaments.push({
      name: testamentName,
      books,
    });

    metadataTestaments.push({
      name: testamentName,
      books: metadataBooks,
    });
  }

  return {
    bibleData: { translation, testaments },
    metadata: { translation, testaments: metadataTestaments }
  };
}

async function main() {
  try {
    const pdfDir = path.join(process.cwd(), 'public', 'assets', 'Bible');
    const dataDir = path.join(process.cwd(), 'public', 'data');

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log('📖 Parsing Bible XML files...');

    let bibleMetadata: { en?: BibleMetadata; ar?: BibleMetadata } = {};

    // Parse English Bible
    const enFilePath = path.join(pdfDir, 'EnglishNIVBible.xml');
    if (fs.existsSync(enFilePath)) {
      console.log('  Parsing English Bible...');
      const { bibleData, metadata } = await parseBible(enFilePath, 'en', dataDir);
      bibleMetadata.en = metadata;
      
      // Still write the full JSON for server-side use
      const enOutputPath = path.join(dataDir, 'bible-en.json');
      fs.writeFileSync(enOutputPath, JSON.stringify(bibleData, null, 2), 'utf-8');
      console.log(`  ✓ English Bible saved (split files + ${enOutputPath})`);
    }

    // Parse Arabic Bible
    const arFilePath = path.join(pdfDir, 'ArabicAVDBible.xml');
    if (fs.existsSync(arFilePath)) {
      console.log('  Parsing Arabic Bible...');
      const { bibleData, metadata } = await parseBible(arFilePath, 'ar', dataDir);
      bibleMetadata.ar = metadata;
      
      // Still write the full JSON for server-side use
      const arOutputPath = path.join(dataDir, 'bible-ar.json');
      fs.writeFileSync(arOutputPath, JSON.stringify(bibleData, null, 2), 'utf-8');
      console.log(`  ✓ Arabic Bible saved (split files + ${arOutputPath})`);
    }

    // Write combined metadata
    if (bibleMetadata.en || bibleMetadata.ar) {
      const metaOutputPath = path.join(dataDir, 'bible-metadata.json');
      fs.writeFileSync(metaOutputPath, JSON.stringify(bibleMetadata, null, 2), 'utf-8');
      console.log(`  ✓ Bible metadata saved to ${metaOutputPath}`);
    }

    console.log('✅ Bible parsing complete!');
  } catch (error) {
    console.error('❌ Error parsing Bible:', error);
    process.exit(1);
  }
}

main();
