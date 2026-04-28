'use client';

import { Tabs } from '@/components/ui';

interface TestamentTabsProps {
  activeTestament: 'OT' | 'NT';
  onTestamentChange: (t: 'OT' | 'NT') => void;
  lang: 'ar' | 'en';
}

export function TestamentTabs({ activeTestament, onTestamentChange, lang }: TestamentTabsProps) {
  const tabs = [
    { id: 'OT', label: lang === 'ar' ? 'العهد القديم' : 'Old Test.' },
    { id: 'NT', label: lang === 'ar' ? 'العهد الجديد' : 'New Test.' },
  ];

  return (
    <div className="mb-4 flex justify-center">
      <Tabs
        tabs={tabs}
        activeTab={activeTestament}
        onTabChange={(id) => onTestamentChange(id as 'OT' | 'NT')}
        variant="pills"
        className=""
      />
    </div>
  );
}
