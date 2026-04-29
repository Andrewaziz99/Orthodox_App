"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createChurch, getChurch, updateChurch } from '@/lib/api/churches';
import { handleApiError } from '@/lib/api/client';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';
import AdminTopbar from '@/components/admin/AdminTopbar';
import FormField from '@/components/admin/FormField';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';

interface FormState {
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  maxChildren: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  location: '',
  address: '',
  phone: '',
  email: '',
  maxChildren: '',
};

export default function ChurchForm({ mode }: { mode: 'new' | 'edit' }) {
  const router = useRouter();
  const params = useParams();
  useRequireSuperAdmin();

  const isEdit = mode === 'edit';
  const churchId = isEdit ? (params?.id as string) : null;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit || !churchId) return;

    const load = async () => {
      try {
        const church = await getChurch(churchId);
        setForm({
          name: church.name ?? '',
          location: church.location ?? '',
          address: church.address ?? '',
          phone: church.phone ?? '',
          email: church.email ?? '',
          maxChildren: church.maxChildren?.toString() ?? '',
        });
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [isEdit, churchId]);

  const set = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Church name is required.');
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      maxChildren: form.maxChildren ? parseInt(form.maxChildren, 10) : undefined,
    } as any;

    try {
      if (isEdit && churchId) {
        await updateChurch(churchId, payload);
        setSuccess('Church updated successfully.');
      } else {
        await createChurch(payload);
        setSuccess('Church created successfully.');
        setTimeout(() => router.push('/admin/churches'), 1000);
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
        <AdminTopbar title={isEdit ? 'Edit Church' : 'New Church'} />
        <div className="p-6 flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title={isEdit ? 'Edit Church' : 'New Church'} />

      <div className="p-6 max-w-2xl">
        <button
          onClick={() => router.push('/admin/churches')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Churches
        </button>

        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? 'Edit Church' : 'Add New Church'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              id="name"
              label="Church Name"
              value={form.name}
              onChange={set('name')}
              placeholder="St. Mary Coptic Orthodox Church"
              required
              disabled={loading}
            />

            <FormField
              id="location"
              label="City / Region"
              value={form.location}
              onChange={set('location')}
              placeholder="Cairo, Egypt"
              disabled={loading}
            />

            <FormField
              id="address"
              label="Full Address"
              value={form.address}
              onChange={set('address')}
              placeholder="123 Street Name, District"
              disabled={loading}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                id="phone"
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+20 100 123 4567"
                disabled={loading}
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="church@example.com"
                disabled={loading}
              />
            </div>

            <FormField
              id="maxChildren"
              label="Max Students"
              type="number"
              value={form.maxChildren}
              onChange={set('maxChildren')}
              placeholder="100"
              hint="Maximum number of enrolled students allowed"
              disabled={loading}
            />

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
                {loading ? 'Saving...' : isEdit ? 'Update Church' : 'Create Church'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/churches')}
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
