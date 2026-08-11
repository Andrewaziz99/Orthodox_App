'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Building2, LayoutTemplate } from 'lucide-react';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { getChurches } from '@/lib/api/churches';
import { getEducationalCurricula } from '@/lib/api/curricula';
import { getUser } from '@/lib/auth/session';

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [stats, setStats] = useState({ totalChurches: 0, totalCurricula: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const [churches, curricula] = await Promise.all([
        user?.type === 'super_admin' ? getChurches().catch(() => []) : Promise.resolve([]),
        getEducationalCurricula().catch(() => []),
      ]);
      setStats({ totalChurches: churches.length, totalCurricula: curricula.length });
      setLoading(false);
    };
    void loadStats();
  }, [user?.type]);

  const statCards = [
    ...(user?.type === 'super_admin' ? [{ title: 'Total Churches', value: stats.totalChurches, icon: Building2, color: 'bg-blue-500', link: '/admin/churches' }] : []),
    { title: 'Curricula', value: stats.totalCurricula, icon: BookOpen, color: 'bg-purple-500', link: '/admin/curricula' },
  ];

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName || 'Admin'}!</h1>
          <p className="mt-2 text-gray-600">Here is the current Graphy administration overview.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <button key={card.title} onClick={() => router.push(card.link)} className="rounded-lg bg-white p-6 text-left shadow transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-gray-600">{card.title}</p><p className="mt-2 text-3xl font-bold text-gray-900">{loading ? '...' : card.value}</p></div>
                  <div className={`${card.color} rounded-lg p-3`}><Icon className="h-6 w-6 text-white" /></div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {user?.type === 'super_admin' && (
              <button onClick={() => router.push('/admin/churches')} className="rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50">
                <Building2 className="mx-auto mb-2 h-8 w-8 text-gray-400" /><p className="text-sm font-medium text-gray-700">Review Churches</p>
              </button>
            )}
            {user?.type === 'super_admin' && (
              <button onClick={() => router.push('/admin/content')} className="rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-teal-500 hover:bg-teal-50">
                <LayoutTemplate className="mx-auto mb-2 h-8 w-8 text-gray-400" /><p className="text-sm font-medium text-gray-700">Manage CMS Content</p>
              </button>
            )}
            <button onClick={() => router.push('/admin/curricula')} className="rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-purple-500 hover:bg-purple-50">
              <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-400" /><p className="text-sm font-medium text-gray-700">View Curricula</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
