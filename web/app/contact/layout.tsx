import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: 'تواصل مع مبادرة أرثوذكسي للدراسات الكتابية لأي استفسار أو اقتراح',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
