'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getChurches, deleteChurch, approveChurch, rejectChurch, type Church } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { ToastContainer, useToast } from '@/components/admin/Toast';
import { Plus, Building2, CheckCircle, XCircle, Clock, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function ChurchesPage() {
  const router = useRouter();
  useRequireSuperAdmin();

  const toast = useToast();
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Church | null>(null);

  const load = async () => {
    try {
      setChurches(await getChurches());
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (church: Church) => {
    setBusy(church.id);
    try {
      await approveChurch(church.id);
      await load();
      toast.success(`تم تفعيل كنيسة "${church.name}" بنجاح`);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally { setBusy(null); }
  };

  const handleReject = async (church: Church) => {
    setBusy(church.id);
    try {
      await rejectChurch(church.id);
      await load();
      toast.success(`تم رفض كنيسة "${church.name}"`);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally { setBusy(null); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusy(confirmDelete.id);
    setConfirmDelete(null);
    try {
      await deleteChurch(confirmDelete.id);
      await load();
      toast.success(`تم حذف كنيسة "${confirmDelete.name}" بنجاح`);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally { setBusy(null); }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { cls: string; icon: typeof CheckCircle; label: string }> = {
      active:   { cls: 'bg-green-100 text-green-800',  icon: CheckCircle, label: 'نشط'    },
      pending:  { cls: 'bg-yellow-100 text-yellow-800', icon: Clock,       label: 'معلق'   },
      rejected: { cls: 'bg-red-100 text-red-800',      icon: XCircle,     label: 'مرفوض' },
    };
    const s = map[status] ?? map.pending;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
        <Icon className="w-3 h-3" />{s.label}
      </span>
    );
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />
      <AdminTopbar title="إدارة الكنائس" />

      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">الكنائس</h1>
            <p className="text-gray-500 mt-1">إدارة الكنائس المسجلة في النظام</p>
          </div>
          <button onClick={() => router.push('/admin/churches/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />إضافة كنيسة
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : churches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <Building2 className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد كنائس بعد</p>
            <button onClick={() => router.push('/admin/churches/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />إضافة كنيسة
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['اسم الكنيسة','الموقع','التواصل','الحالة','الطلاب','الإجراءات'].map(h => (
                    <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {churches.map(church => (
                  <tr key={church.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg"><Building2 className="w-4 h-4 text-blue-600" /></div>
                        <span className="font-medium text-gray-900">{church.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{church.location || '—'}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">{church.phone || '—'}</p>
                      <p className="text-xs text-gray-400">{church.email || ''}</p>
                    </td>
                    <td className="px-5 py-4">{statusBadge(church.status)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{church.maxChildren?.toLocaleString('ar-EG') || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {busy === church.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            {church.status === 'pending' && (
                              <>
                                <button onClick={() => handleApprove(church)}
                                  className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
                                >قبول</button>
                                <button onClick={() => handleReject(church)}
                                  className="px-2.5 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                                >رفض</button>
                              </>
                            )}
                            <button onClick={() => router.push(`/admin/churches/${church.id}`)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            ><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => setConfirmDelete(church)}
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
              هل أنت متأكد من حذف كنيسة <strong>"{confirmDelete.name}"</strong>؟ لا يمكن التراجع عن هذا الإجراء.
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
