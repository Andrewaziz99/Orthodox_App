"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createUser, getUser, updateUser, type CreateUserRequest, type UpdateUserRequest } from '@/lib/api/users';
import { getAllChurches, type Church } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireAdmin } from '@/lib/auth/middleware';
import { isSuperAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import FormField from '@/components/admin/FormField';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  churchId: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'servant',
  churchId: '',
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'church_admin', label: 'Church Admin' },
  { value: 'servant', label: 'Servant (Teacher)' },
  { value: 'child', label: 'Child (Student)' },
];

export default function UserForm({ mode }: { mode: 'new' | 'edit' }) {
  const router = useRouter();
  const params = useParams();
  useRequireAdmin();

  const isEdit = mode === 'edit';
  const userId = isEdit ? (params?.id as string) : null;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canAssignSuperAdmin = isSuperAdmin();

  const visibleRoles = ROLE_OPTIONS.filter(
    (r) => canAssignSuperAdmin || r.value !== 'super_admin'
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [churchList, userData] = await Promise.all([
          getAllChurches().catch(() => []),
          isEdit && userId ? getUser(userId) : Promise.resolve(null),
        ]);

        setChurches(churchList);

        if (userData) {
          setForm({
            name: userData.name ?? '',
            email: userData.email ?? '',
            phone: userData.phone ?? '',
            password: '',
            role: userData.role,
            churchId: userData.churchId ?? '',
          });
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [isEdit, userId]);

  const set = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!isEdit && !form.email && !form.phone) {
      setError('Provide either an email or phone number.');
      return;
    }
    if (!isEdit && !form.password && form.role !== 'child') {
      setError('Password is required for non-student users.');
      return;
    }

    setLoading(true);

    const payload: CreateUserRequest | UpdateUserRequest = {
      name: form.name.trim(),
      role: form.role,
      ...(form.email.trim() && { email: form.email.trim() }),
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.churchId.trim() && { churchId: form.churchId.trim() }),
      ...(form.password.trim() && { password: form.password.trim() }),
    };

    try {
      if (isEdit && userId) {
        if (!payload.password) delete payload.password;
        await updateUser(userId, payload);
        setSuccess('User updated successfully.');
      } else {
        await createUser(payload);
        setSuccess('User created successfully.');
        setTimeout(() => router.push('/admin/users'), 1000);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <AdminTopbar title={isEdit ? 'Edit User' : 'New User'} />
        <div className="p-6 flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title={isEdit ? 'Edit User' : 'New User'} />

      <div className="w-full p-6">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>

        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              id="name"
              label="Full Name"
              value={form.name}
              onChange={set('name')}
              placeholder="John Doe"
              required
              disabled={loading}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="user@example.com"
                hint="Required for email login"
                disabled={loading}
              />
              <FormField
                id="phone"
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+20 100 123 4567"
                hint="Required for OTP login"
                disabled={loading}
              />
            </div>

            <FormField
              id="password"
              label={isEdit ? 'New Password' : 'Password'}
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              required={!isEdit}
              hint={isEdit ? 'Leave blank to keep current password' : undefined}
              disabled={loading}
            />

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => set('role')(e.target.value)}
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {visibleRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {form.role !== 'super_admin' && (
              <div>
                <label htmlFor="church" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Church
                </label>
                <select
                  id="church"
                  value={form.churchId}
                  onChange={(e) => set('churchId')(e.target.value)}
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— No church assigned —</option>
                  {churches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/users')}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
