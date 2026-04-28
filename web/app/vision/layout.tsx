import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رؤيتنا',
  description: 'رؤية مبادرة أرثوذكسي في بناء جيل مسيحي واعي بكنيسته وعقيدته',
};

export default function VisionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
