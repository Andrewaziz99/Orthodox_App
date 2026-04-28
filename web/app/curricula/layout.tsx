import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المناهج',
  description: 'مناهج دراسية متدرجة تغطي كافة جوانب الكتاب المقدس والعقيدة الأرثوذكسية',
};

export default function CurriculaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
