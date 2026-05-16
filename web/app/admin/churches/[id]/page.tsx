'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createChurch, getChurch, updateChurch } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { ToastContainer, useToast } from '@/components/admin/Toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Form {
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  maxChildren: string;
}

const EMPTY: Form = {
  name: '', location: '', address: '', phone: '', email: '', maxChildren: '',
};

export default function ChurchFormPage() {
  const router  = useRouter();
  const params  = useParams();
  useRequireSuperAdmin();

  const isEdit   = !!params?.id && params.id !== 'new';
  const churchId = isEdit ? (params.id as string) : null;
  const toast    = useToast();

  const [form, setForm]         = useState<Form>(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load existing church when editing
  useEffect(() => {
    if (!isEdit || !churchId) { setFetching(false); return; }

    getChurch(churchId)
      .then(c => {
        setForm({
          name:        c.name        ?? '',
          location:    c.location    ?? '',
          address:     c.address     ?? '',
          phone:       c.phone       ?? '',
          email:       c.email       ?? '',
          maxChildren: c.maxChildren != null ? String(c.maxChildren) : '',
        });
      })
      .catch(err => toast.error(handleApiError(err)))
      .finally(() => setFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    if (!trimmedName) { toast.error('اسم الكنيسة مطلوب'); return; }

    // Build payload — only send fields that have values
    const payload: Record<string, unknown> = { name: trimmedName };
    if (form.location.trim())    payload.location    = form.location.trim();
    if (form.address.trim())     payload.address     = form.address.trim();
    if (form.phone.trim())       payload.phone       = form.phone.trim();
    if (form.email.trim())       payload.email       = form.email.trim();
    if (form.maxChildren.trim()) payload.maxChildren = parseInt(form.maxChildren, 10);

    console.log('[Church Form] Submitting payload:', payload);

    setLoading(true);
    try {
      if (isEdit && churchId) {
        const updated = await updateChurch(churchId, payload);
        console.log('[Church Form] Updated:', updated);
        toast.success(`تم تحديث بيانات "${updated.name}" بنجاح ✓`);
        setTimeout(() => router.push('/admin'), 1200);
      } else {
        const created = await createChurch(payload);
        console.log('[Church Form] Created:', created);
        toast.success(`تمت إضافة "${created.name}" بنجاح ✓`);
        setTimeout(() => router.push('/admin'), 1200);
      }
    } catch (err) {
      console.error('[Church Form] Error:', err);
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <AdminTopbar title={isEdit ? 'تعديل كنيسة' : 'إضافة كنيسة'} />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />
      <AdminTopbar title={isEdit ? 'تعديل كنيسة' : 'إضافة كنيسة'} />

      <div className="p-6" dir="rtl">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة إلى لوحة التحكم
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            {isEdit ? 'تعديل بيانات الكنيسة' : 'إضافة كنيسة جديدة'}
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-6">

              {/* Name — full row */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  اسم الكنيسة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="مثال: كنيسة السيدة العذراء"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-base"
                />
              </div>

              {/* Location + Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">المدينة / المنطقة</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={set('location')}
                    placeholder="القاهرة"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان الكامل</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={set('address')}
                    placeholder="شارع، حي"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+20 100 000 0000"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="church@example.com"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Max Children */}
              <div className="sm:w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الحد الأقصى للطلاب</label>
                <input
                  type="number"
                  min="1"
                  value={form.maxChildren}
                  onChange={set('maxChildren')}
                  placeholder="100"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all font-semibold"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ...</>
                  : <><Save className="w-4 h-4" />{isEdit ? 'حفظ التعديلات' : 'إضافة الكنيسة'}</>
                }
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                disabled={loading}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-semibold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
