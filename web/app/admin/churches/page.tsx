/**
 * Churches Page
 * List and manage all churches (super admin only)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getChurches, approveChurch, rejectChurch, type Church } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Plus, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ChurchesPage() {
  const router = useRouter();
  useRequireSuperAdmin(); // Protect route
  
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadChurches();
  }, []);

  const loadChurches = async () => {
    try {
      const data = await getChurches();
      setChurches(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveChurch(id);
      await loadChurches();
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this church?')) return;
    
    setActionLoading(id);
    try {
      await rejectChurch(id);
      await loadChurches();
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    const icons = {
      active: CheckCircle,
      pending: Clock,
      rejected: XCircle,
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  return (
    <>
      <AdminTopbar title="Churches Management" />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Churches</h1>
            <p className="text-gray-600 mt-1">
              Manage church registrations and subscriptions
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/churches/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Church
          </button>
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
            <p className="text-gray-600">Loading churches...</p>
          </div>
        ) : churches.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No churches yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first church
            </p>
            <button
              onClick={() => router.push('/admin/churches/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Church
            </button>
          </div>
        ) : (
          /* Churches Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Church Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Students
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {churches.map((church) => (
                  <tr
                    key={church.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/churches/${church.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">
                          {church.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {church.location || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{church.phone || '-'}</div>
                      <div className="text-sm text-gray-500">{church.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(church.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {church.maxChildren || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {church.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(church.id)}
                              disabled={actionLoading === church.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(church.id)}
                              disabled={actionLoading === church.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                      </div>
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
