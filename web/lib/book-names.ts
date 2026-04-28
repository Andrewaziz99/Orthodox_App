// Complete Bible book names mapping (all 66 books)
// Old Testament (1-39) + New Testament (40-66)

export const bookNameMap: Record<number, { en: string; ar: string }> = {
  // Old Testament - Pentateuch
  1: { en: 'Genesis', ar: 'التكوين' },
  2: { en: 'Exodus', ar: 'الخروج' },
  3: { en: 'Leviticus', ar: 'اللاويين' },
  4: { en: 'Numbers', ar: 'العدد' },
  5: { en: 'Deuteronomy', ar: 'التثنية' },

  // Old Testament - Historical Books
  6: { en: 'Joshua', ar: 'يوشع' },
  7: { en: 'Judges', ar: 'القضاة' },
  8: { en: 'Ruth', ar: 'راعوث' },
  9: { en: '1 Samuel', ar: '1 صموئيل' },
  10: { en: '2 Samuel', ar: '2 صموئيل' },
  11: { en: '1 Kings', ar: '1 الملوك' },
  12: { en: '2 Kings', ar: '2 الملوك' },
  13: { en: '1 Chronicles', ar: '1 أخبار الأيام' },
  14: { en: '2 Chronicles', ar: '2 أخبار الأيام' },
  15: { en: 'Ezra', ar: 'عزرا' },
  16: { en: 'Nehemiah', ar: 'نحميا' },
  17: { en: 'Esther', ar: 'استير' },

  // Old Testament - Wisdom & Poetry
  18: { en: 'Job', ar: 'أيوب' },
  19: { en: 'Psalms', ar: 'المزامير' },
  20: { en: 'Proverbs', ar: 'الأمثال' },
  21: { en: 'Ecclesiastes', ar: 'الجامعة' },
  22: { en: 'Song of Solomon', ar: 'نشيد الأنشاد' },

  // Old Testament - Major Prophets
  23: { en: 'Isaiah', ar: 'إشعياء' },
  24: { en: 'Jeremiah', ar: 'إرميا' },
  25: { en: 'Lamentations', ar: 'مراثي إرميا' },
  26: { en: 'Ezekiel', ar: 'حزقيال' },
  27: { en: 'Daniel', ar: 'دانيال' },

  // Old Testament - Minor Prophets
  28: { en: 'Hosea', ar: 'هوشع' },
  29: { en: 'Joel', ar: 'يوئيل' },
  30: { en: 'Amos', ar: 'عاموس' },
  31: { en: 'Obadiah', ar: 'عبديا' },
  32: { en: 'Jonah', ar: 'يونان' },
  33: { en: 'Micah', ar: 'ميخا' },
  34: { en: 'Nahum', ar: 'ناحوم' },
  35: { en: 'Habakkuk', ar: 'حبقوق' },
  36: { en: 'Zephaniah', ar: 'صفنيا' },
  37: { en: 'Haggai', ar: 'حجي' },
  38: { en: 'Zechariah', ar: 'زكريا' },
  39: { en: 'Malachi', ar: 'ملاخي' },

  // New Testament - Gospels
  40: { en: 'Matthew', ar: 'متى' },
  41: { en: 'Mark', ar: 'مرقس' },
  42: { en: 'Luke', ar: 'لوقا' },
  43: { en: 'John', ar: 'يوحنا' },

  // New Testament - Acts & Paul's Letters
  44: { en: 'Acts', ar: 'أعمال الرسل' },
  45: { en: 'Romans', ar: 'رومية' },
  46: { en: '1 Corinthians', ar: '1 كورنثوس' },
  47: { en: '2 Corinthians', ar: '2 كورنثوس' },
  48: { en: 'Galatians', ar: 'غلاطية' },
  49: { en: 'Ephesians', ar: 'أفسس' },
  50: { en: 'Philippians', ar: 'فيلبي' },
  51: { en: 'Colossians', ar: 'كولوسي' },
  52: { en: '1 Thessalonians', ar: '1 تسالونيكي' },
  53: { en: '2 Thessalonians', ar: '2 تسالونيكي' },
  54: { en: '1 Timothy', ar: '1 تيموثاوس' },
  55: { en: '2 Timothy', ar: '2 تيموثاوس' },
  56: { en: 'Titus', ar: 'تيطس' },
  57: { en: 'Philemon', ar: 'فليمون' },

  // New Testament - Hebrews & James
  58: { en: 'Hebrews', ar: 'العبرانيين' },
  59: { en: 'James', ar: 'يعقوب' },

  // New Testament - Peter, John, Jude Letters
  60: { en: '1 Peter', ar: '1 بطرس' },
  61: { en: '2 Peter', ar: '2 بطرس' },
  62: { en: '1 John', ar: '1 يوحنا' },
  63: { en: '2 John', ar: '2 يوحنا' },
  64: { en: '3 John', ar: '3 يوحنا' },
  65: { en: 'Jude', ar: 'يهوذا' },

  // New Testament - Revelation
  66: { en: 'Revelation', ar: 'الرؤيا' },
};

/**
 * Get the translated name of a Bible book
 * @param bookNumber Book number (1-66)
 * @param language Language code ('en' or 'ar')
 * @returns Book name in the specified language
 */
export function getBookName(
  bookNumber: number,
  language: 'en' | 'ar'
): string {
  const bookNames = bookNameMap[bookNumber];
  if (!bookNames) {
    return `Book ${bookNumber}`;
  }
  return bookNames[language];
}
