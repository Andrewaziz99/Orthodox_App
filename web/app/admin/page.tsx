'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { getChurches } from '@/lib/api/churches';
import { getUsers } from '@/lib/api/users';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Building2, Users, BookOpen, GraduationCap, Plus, RefreshCw } from 'lucide-react';

interface Stats {
  churches: number;
  users: number;
  servants: number;
  students: number;
  loading: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [stats, setStats] = useState<Stats>({ churches: 0, users: 0, servants: 0, students: 0, loading: true });

  const loadStats = async () => {
    setStats(s => ({ ...s, loading: true }));
    try {
      const [churches, users] = await Promise.all([
        getChurches().catch(() => []),
        getUsers().catch(() => []),
      ]);
      setStats({
        churches: churches.length,
        users: users.length,
        servants: users.filter(u => u.role === 'servant').length,
        students: users.filter(u => u.role === 'child').length,
        loading: false,
      });
    } catch {
      setStats(s => ({ ...s, loading: false }));
    }
  };

  useEffect(() => { loadStats(); }, []);

  const cards = [
    { label: 'الكنائس',       value: stats.churches, icon: Building2,    color: 'bg-blue-500',   link: '/admin/churches' },
    { label: 'المستخدمون',    value: stats.users,    icon: Users,         color: 'bg-green-500',  link: '/admin/users'    },
    { label: 'الخدام',        value: stats.servants, icon: BookOpen,      color: 'bg-purple-500', link: '/admin/users'    },
    { label: 'الأطفال',       value: stats.students, icon: GraduationCap, color: 'bg-orange-500', link: '/admin/users'    },
  ];

  return (
    <>
      <AdminTopbar title="لوحة التحكم" />
      <div className="p-6" dir="rtl">

        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              أهلاً، {user?.name || 'المشرف'}!
            </h1>
            <p className="text-gray-500 mt-1">إليك ملخص النظام اليوم</p>
          </div>
          <button onClick={loadStats}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${stats.loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} onClick={() => router.push(card.link)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stats.loading ? (
                        <span className="inline-block w-10 h-9 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        card.value.toLocaleString('ar-EG')
                      )}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'إضافة كنيسة',    icon: Building2,    link: '/admin/churches/new', hover: 'hover:border-blue-400 hover:bg-blue-50'   },
              { label: 'إضافة مستخدم',   icon: Users,        link: '/admin/users/new',    hover: 'hover:border-green-400 hover:bg-green-50' },
              { label: 'إدارة المناهج',  icon: BookOpen,     link: '/admin/curricula',    hover: 'hover:border-purple-400 hover:bg-purple-50'},
            ].map(action => {
              const Icon = action.icon;
              return (
                <button key={action.label} onClick={() => router.push(action.link)}
                  className={`flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-gray-200 rounded-xl ${action.hover} transition-colors`}
                >
                  <Icon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
