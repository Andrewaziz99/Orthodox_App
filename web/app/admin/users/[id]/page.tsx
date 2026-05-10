'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createUser, getUser, updateUser } from '@/lib/api/users';
import { getChurches, type Church } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireAdmin, isSuperAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { ToastContainer, useToast } from '@/components/admin/Toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface Form {
  name: string; email: string; phone: string;
  password: string; role: UserRole; churchId: string;
}
const EMPTY: Form = { name: '', email: '', phone: '', password: '', role: 'servant', churchId: '' };

const ROLES = [
  { value: 'super_admin',  label: 'مشرف عام'       },
  { value: 'church_admin', label: 'مشرف كنيسة'     },
  { value: 'servant',      label: 'خادم'            },
  { value: 'child',        label: 'طفل (طالب)'      },
] as const;

const STATUS_OPTIONS = [
  { value: 'active',    label: 'نشط'      },
  { value: 'inactive',  label: 'غير نشط'  },
  { value: 'suspended', label: 'موقوف'    },
] as const;

export default function UserFormPage() {
  const router   = useRouter();
  const params   = useParams();
  useRequireAdmin();

  const isEdit   = !!params?.id && params.id !== 'new';
  const userId   = isEdit ? (params.id as string) : null;
  const toast    = useToast();
  const isSuper  = isSuperAdmin();

  const [form, setForm]       = useState<Form>(EMPTY);
  const [status, setStatus]   = useState('active');
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [churchList, userData] = await Promise.all([
          getChurches().catch(() => []),
          isEdit && userId ? getUser(userId) : Promise.resolve(null),
        ]);
        setChurches(churchList);
        if (userData) {
          setForm({
            name: userData.name ?? '', email: userData.email ?? '',
            phone: userData.phone ?? '', password: '',
            role: userData.role, churchId: userData.churchId ?? '',
          });
          setStatus(userData.status ?? 'active');
        }
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const set = (f: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('الاسم مطلوب'); return; }
    if (!isEdit && !form.email && !form.phone) { toast.error('يجب إدخال البريد الإلكتروني أو رقم الهاتف'); return; }
    if (!isEdit && !form.password && form.role !== 'child') { toast.error('كلمة المرور مطلوبة'); return; }

    setLoading(true);
    const payload: any = {
      name: form.name.trim(), role: form.role, status,
      ...(form.email    && { email: form.email.trim()    }),
      ...(form.phone    && { phone: form.phone.trim()    }),
      ...(form.churchId && { churchId: form.churchId     }),
      ...(form.password && { password: form.password     }),
    };

    try {
      if (isEdit && userId) {
        await updateUser(userId, payload);
        toast.success('تم تحديث بيانات المستخدم بنجاح ✓');
      } else {
        await createUser(payload);
        toast.success('تمت إضافة المستخدم بنجاح ✓');
        setTimeout(() => router.push('/admin/users'), 1500);
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const visibleRoles = isSuper ? ROLES : ROLES.filter(r => r.value !== 'super_admin');

  if (fetching) return (
    <>
      <AdminTopbar title={isEdit ? 'تعديل مستخدم' : 'إضافة مستخدم'} />
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    </>
  );

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />
      <AdminTopbar title={isEdit ? 'تعديل مستخدم' : 'إضافة مستخدم'} />

      <div className="p-6" dir="rtl">
        <button onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />العودة إلى المستخدمين
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.name} onChange={set('name')}
                placeholder="الاسم الكامل" required disabled={loading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={set('email')}
                  placeholder="user@example.com" disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="+20 100 000 0000" disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEdit ? 'كلمة مرور جديدة' : 'كلمة المرور'}{!isEdit && <span className="text-red-500 mr-1">*</span>}
              </label>
              <input type="password" value={form.password} onChange={set('password')}
                placeholder="••••••••" required={!isEdit} disabled={loading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
              {isEdit && <p className="text-xs text-gray-400 mt-1">اتركها فارغة للإبقاء على كلمة المرور الحالية</p>}
            </div>

            {/* Role + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدور <span className="text-red-500">*</span></label>
                <select value={form.role} onChange={set('role')} disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
                >
                  {visibleRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select value={status} onChange={e => setStatus(e.target.value)} disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
                >
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* Church */}
            {form.role !== 'super_admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الكنيسة</label>
                <select value={form.churchId} onChange={set('churchId')} disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-right"
                >
                  <option value="">— بدون كنيسة —</option>
                  {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المستخدم'}
              </button>
              <button type="button" onClick={() => router.push('/admin/users')} disabled={loading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
