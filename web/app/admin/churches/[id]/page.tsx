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
  name: string; location: string; address: string;
  phone: string; email: string; maxChildren: string;
}
const EMPTY: Form = { name: '', location: '', address: '', phone: '', email: '', maxChildren: '' };

export default function ChurchFormPage() {
  const router = useRouter();
  const params = useParams();
  useRequireSuperAdmin();

  const isEdit    = !!params?.id && params.id !== 'new';
  const churchId  = isEdit ? (params.id as string) : null;
  const toast     = useToast();

  const [form, setForm]       = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !churchId) return;
    getChurch(churchId)
      .then(c => setForm({
        name: c.name ?? '', location: c.location ?? '', address: c.address ?? '',
        phone: c.phone ?? '', email: c.email ?? '', maxChildren: c.maxChildren?.toString() ?? '',
      }))
      .catch(err => toast.error(handleApiError(err)))
      .finally(() => setFetching(false));
  }, []);

  const set = (f: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('اسم الكنيسة مطلوب'); return; }
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      maxChildren: form.maxChildren ? parseInt(form.maxChildren) : undefined,
    };
    try {
      if (isEdit && churchId) {
        await updateChurch(churchId, payload);
        toast.success('تم تحديث بيانات الكنيسة بنجاح ✓');
      } else {
        await createChurch(payload);
        toast.success('تمت إضافة الكنيسة بنجاح ✓');
        setTimeout(() => router.push('/admin/churches'), 1500);
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name',        label: 'اسم الكنيسة',      placeholder: 'كنيسة السيدة العذراء',       required: true,  type: 'text',   col: 'full' },
    { key: 'location',    label: 'المدينة / المنطقة', placeholder: 'القاهرة',                    required: false, type: 'text',   col: 'half' },
    { key: 'address',     label: 'العنوان الكامل',    placeholder: 'شارع، حي',                   required: false, type: 'text',   col: 'half' },
    { key: 'phone',       label: 'رقم الهاتف',        placeholder: '+20 100 000 0000',           required: false, type: 'tel',    col: 'half' },
    { key: 'email',       label: 'البريد الإلكتروني', placeholder: 'church@example.com',         required: false, type: 'email',  col: 'half' },
    { key: 'maxChildren', label: 'الحد الأقصى للطلاب', placeholder: '100',                       required: false, type: 'number', col: 'half' },
  ] as const;

  if (fetching) return (
    <>
      <AdminTopbar title={isEdit ? 'تعديل كنيسة' : 'إضافة كنيسة'} />
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    </>
  );

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />
      <AdminTopbar title={isEdit ? 'تعديل كنيسة' : 'إضافة كنيسة'} />

      <div className="p-6" dir="rtl">
        <button onClick={() => router.push('/admin/churches')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />العودة إلى الكنائس
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? 'تعديل بيانات الكنيسة' : 'إضافة كنيسة جديدة'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map(f => (
                <div key={f.key} className={f.col === 'full' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {f.label}{f.required && <span className="text-red-500 mr-1">*</span>}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={set(f.key)}
                    placeholder={f.placeholder}
                    required={f.required}
                    disabled={loading}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الكنيسة'}
              </button>
              <button type="button" onClick={() => router.push('/admin/churches')} disabled={loading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
