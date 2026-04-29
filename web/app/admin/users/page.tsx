/**
 * Users Page
 * List and manage all users
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, type User } from '@/lib/api/users';
import { handleApiError } from '@/lib/api/client';
import { useRequireAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Plus, Users as UsersIcon, CheckCircle, XCircle } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  useRequireAdmin(); // Protect route
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole);

  const getRoleBadge = (role: string) => {
    const styles = {
      super_admin: 'bg-purple-100 text-purple-800',
      church_admin: 'bg-blue-100 text-blue-800',
      servant: 'bg-green-100 text-green-800',
      child: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {role.replace('_', ' ')}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const icons = {
      active: CheckCircle,
      inactive: XCircle,
      suspended: XCircle,
    };
    
    const styles = {
      active: 'text-green-600',
      inactive: 'text-gray-400',
      suspended: 'text-red-600',
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <div className={`flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-sm capitalize">{status}</span>
      </div>
    );
  };

  const roleStats = {
    all: users.length,
    super_admin: users.filter(u => u.role === 'super_admin').length,
    church_admin: users.filter(u => u.role === 'church_admin').length,
    servant: users.filter(u => u.role === 'servant').length,
    child: users.filter(u => u.role === 'child').length,
  };

  return (
    <>
      <AdminTopbar title="Users Management" />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">
              Manage all system users
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/users/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(roleStats).map(([role, count]) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filterRole === role
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-600 mt-1 capitalize">
                {role === 'all' ? 'All Users' : role.replace('_', ' ')}
              </p>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-6">
              {filterRole === 'all' 
                ? 'Get started by adding your first user'
                : `No users with role: ${filterRole.replace('_', ' ')}`}
            </p>
            {filterRole === 'all' && (
              <button
                onClick={() => router.push('/admin/users/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            )}
          </div>
        ) : (
          /* Users Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone || user.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/users/${user.id}`);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
