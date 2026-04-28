import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأخبار',
  description: 'آخر أخبار وإعلانات مبادرة أرثوذكسي للدراسات الكتابية',
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
