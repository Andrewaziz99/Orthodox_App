'use client';

import { useRequireAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { BookOpen, Clock } from 'lucide-react';

const CURRICULA = [
  { id: 1, name: 'البذور',   nameEn: 'Seeds',    age: 'ما قبل المدرسة', grades: 'الحضانة – KG2',    desc: 'قصص الكتاب المقدس الأساسية ومفاهيم الإيمان للأطفال الصغار.' },
  { id: 2, name: 'البراعم',  nameEn: 'Sprouts',  age: 'المرحلة الابتدائية الأولى', grades: 'الصف 1 – 3', desc: 'مقدمة لقصص العهد القديم والصلاة والحياة الكنسية.' },
  { id: 3, name: 'الأغصان', nameEn: 'Branches', age: 'المرحلة الابتدائية', grades: 'الصف 4 – 6',      desc: 'استكشاف أعمق للكتاب المقدس والتقويم القبطي والقديسين.' },
  { id: 4, name: 'الجذور',  nameEn: 'Roots',    age: 'المرحلة الإعدادية', grades: 'الصف 7 – 9',      desc: 'اللاهوت الأرثوذكسي وتاريخ الكنيسة والدفاع عن الإيمان.' },
  { id: 5, name: 'الثمار',  nameEn: 'Fruits',   age: 'المرحلة الثانوية', grades: 'الصف 10 – 12',     desc: 'التكوين الإيماني المتقدم والقيادة والتحضير للخدمة.' },
];

export default function CurriculaPage() {
  useRequireAdmin();

  return (
    <>
      <AdminTopbar title="المناهج الدراسية" />
      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">المناهج الدراسية</h1>
            <p className="text-gray-500 mt-1">خمسة مناهج حسب الفئات العمرية — الباك إند قادم في المرحلة الثانية</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" />المرحلة الثانية
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULA.map(c => (
            <div key={c.id}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 p-6 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-4xl font-bold text-gray-100">#{c.id}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{c.nameEn}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">{c.age}</span>
                <span className="text-xs text-gray-400">{c.grades}</span>
              </div>
              <p className="text-sm text-gray-600">{c.desc}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                  <Clock className="w-3 h-3" />التطوير في المرحلة الثانية
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">المرحلة الثانية — محرك المناهج</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-800">
            {[
              'جدولة الدروس الأسبوعية تلقائيًا (BullMQ)',
              'تتبع تقدم الطلاب في كل منهج',
              'نظام التقييم والدرجات',
              'ترقية الطلاب بين المناهج',
              'تسجيل الحضور عبر QR',
              'لوحة المتصدرين والنقاط',
              'عرض محتوى PDF',
              'الإشعارات الفورية (Firebase FCM)',
            ].map(f => (
              <div key={f} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span><span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
