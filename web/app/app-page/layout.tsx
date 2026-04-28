import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'التطبيق',
  description: 'حمل تطبيق أرثوذكسي للدراسات الكتابية للأطفال للتعلم في أي وقت وأي مكان',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
