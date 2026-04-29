/**
 * Admin Dashboard Overview
 * Main dashboard with statistics and quick actions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { getChurches } from '@/lib/api/churches';
import { getUsers } from '@/lib/api/users';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Building2, Users, BookOpen, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalChurches: number;
  totalUsers: number;
  totalCurricula: number;
  activeStudents: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalChurches: 0,
    totalUsers: 0,
    totalCurricula: 5, // Fixed: 5 curricula mentioned in docs
    activeStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [churches, users] = await Promise.all([
        getChurches().catch(() => []),
        getUsers().catch(() => []),
      ]);

      setStats({
        totalChurches: churches.length,
        totalUsers: users.length,
        totalCurricula: 5,
        activeStudents: users.filter((u) => u.role === 'child').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Churches',
      value: stats.totalChurches,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/admin/churches',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/users',
    },
    {
      title: 'Curricula',
      value: stats.totalCurricula,
      icon: BookOpen,
      color: 'bg-purple-500',
      link: '/admin/curricula',
    },
    {
      title: 'Active Students',
      value: stats.activeStudents,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/admin/users',
    },
  ];

  return (
    <>
      <AdminTopbar title="Dashboard" />
      
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Admin'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with Bible School today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => router.push(card.link)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {loading ? '...' : card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/churches/new')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Add Church</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/users/new')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Add User</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/curricula')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Manage Curricula
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Activity tracking coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
}
