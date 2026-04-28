import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف أكثر على مبادرة أرثوذكسي للدراسات الكتابية للأطفال',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
