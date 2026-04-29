/**
 * Admin Topbar
 * Top navigation bar with breadcrumbs and user menu
 */

'use client';

import { Menu } from 'lucide-react';

interface AdminTopbarProps {
  title: string;
  onMenuClick?: () => void;
}

export default function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Additional actions can go here */}
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
