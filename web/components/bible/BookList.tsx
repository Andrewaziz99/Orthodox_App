'use client';

import { MetadataBook } from '@/lib/bible-types';
import { cn } from '@/lib/utils/cn';
import { getBookName } from '@/lib/book-names';

interface BookListProps {
  books: MetadataBook[];
  selectedBookNumber: number;
  onSelectBook: (bookNumber: number) => void;
  lang: 'ar' | 'en';
}

const getCategory = (num: number, lang: 'ar' | 'en') => {
  if (num >= 1 && num <= 5) return lang === 'ar' ? 'أسفار موسى' : 'Pentateuch';
  if (num >= 6 && num <= 17) return lang === 'ar' ? 'الأسفار التاريخية' : 'Historical';
  if (num >= 18 && num <= 22) return lang === 'ar' ? 'الأسفار الشعرية' : 'Wisdom';
  if (num >= 23 && num <= 27) return lang === 'ar' ? 'الأنبياء الكبار' : 'Major Prophets';
  if (num >= 28 && num <= 39) return lang === 'ar' ? 'الأنبياء الصغار' : 'Minor Prophets';
  if (num >= 40 && num <= 43) return lang === 'ar' ? 'الأناجيل' : 'Gospels';
  if (num === 44) return lang === 'ar' ? 'تاريخ' : 'Acts';
  if (num >= 45 && num <= 58) return lang === 'ar' ? 'رسائل بولس' : 'Pauline Epistles';
  if (num >= 59 && num <= 65) return lang === 'ar' ? 'الرسائل العامة' : 'General Epistles';
  if (num === 66) return lang === 'ar' ? 'رؤيا' : 'Revelation';
  return '';
};

export function BookList({ books, selectedBookNumber, onSelectBook, lang }: BookListProps) {
  // Group books by category
  const groupedBooks = books.reduce((acc, book) => {
    const category = getCategory(book.number, lang);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(book);
    return acc;
  }, {} as Record<string, MetadataBook[]>);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar" data-lenis-prevent>
      {Object.entries(groupedBooks).map(([category, catBooks]) => (
        <div key={category} className="mb-6">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-slate-50 pb-1">
            {category}
          </div>
          <div className="flex flex-col gap-1">
            {catBooks.map((book) => (
              <button
                key={book.number}
                onClick={() => onSelectBook(book.number)}
                className={cn(
                  "group relative flex items-center w-full px-4 py-3 rounded-2xl text-[15px] font-bold transition-all duration-300",
                  selectedBookNumber === book.number
                    ? "bg-teal-50 text-teal-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full me-3 transition-all duration-300",
                  selectedBookNumber === book.number ? "bg-teal-500 scale-100" : "bg-transparent scale-0 group-hover:scale-100 group-hover:bg-slate-300"
                )} />
                {getBookName(book.number, lang)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
