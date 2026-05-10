'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser, type User } from '@/lib/api/users';
import { handleApiError } from '@/lib/api/client';
import { useRequireAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { ToastContainer, useToast } from '@/components/admin/Toast';
import { Plus, Users as UsersIcon, Pencil, Trash2, Loader2 } from 'lucide-react';

type RoleFilter = 'all' | 'super_admin' | 'church_admin' | 'servant' | 'child';

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'مشرف عام', church_admin: 'مشرف كنيسة', servant: 'خادم', child: 'طفل',
};
const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  church_admin: 'bg-blue-100 text-blue-800',
  servant: 'bg-green-100 text-green-800',
  child: 'bg-gray-100 text-gray-700',
};
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  suspended: 'bg-red-100 text-red-700',
};
const STATUS_LABELS: Record<string, string> = {
  active: 'نشط', inactive: 'غير نشط', suspended: 'موقوف',
};

export default function UsersPage() {
  const router = useRouter();
  useRequireAdmin();

  const toast = useToast();
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState<string | null>(null);
  const [filter, setFilter]     = useState<RoleFilter>('all');
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const load = async () => {
    try {
      setUsers(await getUsers());
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusy(confirmDelete.id);
    setConfirmDelete(null);
    try {
      await deleteUser(confirmDelete.id);
      await load();
      toast.success(`تم حذف المستخدم "${confirmDelete.name}" بنجاح`);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally { setBusy(null); }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  const counts: Record<string, number> = {
    all: users.length,
    super_admin: users.filter(u => u.role === 'super_admin').length,
    church_admin: users.filter(u => u.role === 'church_admin').length,
    servant: users.filter(u => u.role === 'servant').length,
    child: users.filter(u => u.role === 'child').length,
  };

  const filterTabs = [
    { key: 'all',          label: 'الكل'          },
    { key: 'super_admin',  label: 'مشرفون عامون'  },
    { key: 'church_admin', label: 'مشرفو كنائس'   },
    { key: 'servant',      label: 'خدام'           },
    { key: 'child',        label: 'أطفال'          },
  ] as const;

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />
      <AdminTopbar title="إدارة المستخدمين" />

      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">المستخدمون</h1>
            <p className="text-gray-500 mt-1">إدارة جميع مستخدمي النظام</p>
          </div>
          <button onClick={() => router.push('/admin/users/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />إضافة مستخدم
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === t.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {t.label}
              <span className={`mr-2 px-1.5 py-0.5 rounded-full text-xs ${
                filter === t.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <UsersIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا يوجد مستخدمون</p>
            <button onClick={() => router.push('/admin/users/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />إضافة مستخدم
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['الاسم','التواصل','الدور','الحالة','تاريخ الإضافة','الإجراءات'].map(h => (
                    <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">{user.phone || user.email || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[user.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[user.status] ?? user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {busy === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            <button onClick={() => router.push(`/admin/users/${user.id}`)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            ><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => setConfirmDelete(user)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            ><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center px-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              هل أنت متأكد من حذف <strong>"{confirmDelete.name}"</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >إلغاء</button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >حذف</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
