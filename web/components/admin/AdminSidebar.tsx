'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getUser } from '@/lib/auth/session';
import { isSuperAdmin } from '@/lib/auth/middleware';
import { LayoutDashboard, Building2, Users, BookOpen, LayoutTemplate, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin',            label: 'الرئيسية',     icon: LayoutDashboard, superAdminOnly: false },
  { href: '/admin/churches',   label: 'الكنائس',      icon: Building2,       superAdminOnly: true  },
  { href: '/admin/users',      label: 'المستخدمون',   icon: Users,           superAdminOnly: false },
  { href: '/admin/curricula',  label: 'المناهج',      icon: BookOpen,        superAdminOnly: false },
  { href: '/admin/content',    label: 'إدارة المحتوى', icon: LayoutTemplate,  superAdminOnly: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? getUser() : null;
  const isSuper = mounted ? isSuperAdmin() : false;

  const visible = navItems.filter((i) => !i.superAdminOnly || isSuper);

  const handleLogout = () => {
    clearSession();
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white" dir="rtl">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">مدرسة الكتاب</h1>
        <p className="text-xs text-gray-400 mt-1">لوحة الإدارة</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {visible.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-sm font-medium px-4">{user?.name || 'المشرف'}</p>
        <p className="text-xs text-gray-400 px-4 mb-3 capitalize">{user?.role?.replace('_', ' ')}</p>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
