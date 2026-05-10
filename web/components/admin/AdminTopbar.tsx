'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

interface AdminTopbarProps {
  title: string;
  onMenuClick?: () => void;
}

export default function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
  const [mounted, setMounted] = useState(false);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    setMounted(true);
    setDateLabel(
      new Date().toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="text-sm text-gray-500 min-h-6">
          {mounted ? dateLabel : '\u00a0'}
        </div>
      </div>
    </div>
  );
}
