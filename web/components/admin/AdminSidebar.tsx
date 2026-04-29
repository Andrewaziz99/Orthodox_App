/**
 * Admin Sidebar
 * Navigation sidebar for admin dashboard
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, isSuperAdmin } from '@/lib/auth/middleware';
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  LogOut,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/churches',
    label: 'Churches',
    icon: Building2,
    superAdminOnly: true,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/curricula',
    label: 'Curricula',
    icon: BookOpen,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const user = getUser();
  const isSuperAdminUser = isSuperAdmin();

  // Filter nav items based on role
  const visibleNavItems = navItems.filter(
    (item) => !item.superAdminOnly || isSuperAdminUser
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Logo/Title */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">مدرسة الكتاب</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="mb-3">
          <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
          <p className="text-xs text-gray-400 capitalize">
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
        <Link
          href="/auth/login"
          onClick={() => {
            // Clear session on logout
            if (typeof window !== 'undefined') {
              localStorage.clear();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}
