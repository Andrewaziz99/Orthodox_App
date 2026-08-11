'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AdminTopbar from '@/components/admin/AdminTopbar';
import {
  getChurches,
  reviewChurch,
  type Church,
  type ChurchReviewStatus,
  type ReviewChurchRequest,
} from '@/lib/api/churches';
import { useRequireSuperAdmin } from '@/lib/auth/middleware';
import { handleApiError } from '@/lib/api/client';

const PAGE_SIZE = 10;
const REVIEW_STATUSES: ChurchReviewStatus[] = [
  'pending_review',
  'approved',
  'rejected',
  'needs_more_info',
];

export default function ChurchesListPage() {
  useRequireSuperAdmin();
  const router = useRouter();
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ChurchReviewStatus | ''>('');
  const [page, setPage] = useState(1);

  const loadChurches = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setChurches(await getChurches(status ? { status } : {}));
    } catch (error) {
      setLoadError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    void loadChurches();
  }, [status]);

  const filteredChurches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return churches;
    return churches.filter((church) =>
      [church.name, church.representativeName, church.email, church.phone, church.governorate]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(term)),
    );
  }, [churches, query]);

  const totalPages = Math.max(1, Math.ceil(filteredChurches.length / PAGE_SIZE));
  const pageChurches = filteredChurches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const runReview = async (church: Church, decision: ReviewChurchRequest['decision']) => {
    const review: ReviewChurchRequest = { decision };
    if (decision === 'approved') {
      const value = window.prompt(
        'Maximum children allowed for this church:',
        String(church.expectedChildrenCount ?? church.maxChildrenAllowed ?? 0),
      );
      if (value === null) return;
      const maxChildrenAllowed = Number(value);
      if (!Number.isInteger(maxChildrenAllowed) || maxChildrenAllowed < 0) {
        window.alert('Enter a whole number of zero or more.');
        return;
      }
      review.maxChildrenAllowed = maxChildrenAllowed;
    } else {
      const reason = window.prompt(
        decision === 'rejected' ? 'Reason for rejection:' : 'Information requested from the church:',
      );
      if (!reason?.trim()) return;
      review.rejectionReason = reason.trim();
    }

    setWorkingId(church.id);
    try {
      const updated = await reviewChurch(church.id, review);
      setChurches((current) => current.map((item) => (item.id === church.id ? updated : item)));
      if (updated.activation?.devCode) {
        window.alert(`Church approved. Activation code: ${updated.activation.devCode}`);
      }
    } catch (error) {
      window.alert(handleApiError(error));
    } finally {
      setWorkingId(null);
    }
  };

  const statusBadge = (value: ChurchReviewStatus) => {
    const classes = value === 'approved'
      ? 'bg-green-100 text-green-700'
      : value === 'pending_review'
        ? 'bg-yellow-100 text-yellow-700'
        : value === 'needs_more_info'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-red-100 text-red-700';
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>{value.replaceAll('_', ' ')}</span>;
  };

  return (
    <>
      <AdminTopbar title="Churches" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Church Review Queue</h1>
            <p className="mt-1 text-sm text-gray-500">{filteredChurches.length} churches</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ChurchReviewStatus | '')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">All statuses</option>
              {REVIEW_STATUSES.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); setPage(1); }}
                placeholder="Search churches..."
                className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm focus:border-blue-500 focus:outline-none sm:w-72"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Church', 'Contact', 'Expected Children', 'Status', 'Actions'].map((heading) => (
                    <th key={heading} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${heading === 'Actions' ? 'text-right' : 'text-left'}`}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">Loading churches...</td></tr>
                ) : loadError ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-red-600">{loadError}</td></tr>
                ) : pageChurches.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">No churches found.</td></tr>
                ) : pageChurches.map((church) => (
                  <tr key={church.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Building2 className="h-5 w-5" /></div>
                        <div>
                          <p className="font-medium text-gray-900">{church.name}</p>
                          <p className="text-xs text-gray-500">{[church.area, church.governorate].filter(Boolean).join(', ') || 'No location'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <p>{church.representativeName || 'No representative'}</p>
                      <p className="text-xs text-gray-500">{church.email || church.phone || 'No contact'}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{church.expectedChildrenCount ?? 'Not provided'}</td>
                    <td className="px-4 py-4">{statusBadge(church.status)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 text-sm">
                        {church.status !== 'approved' && (
                          <>
                            <button disabled={workingId === church.id} onClick={() => void runReview(church, 'approved')} className="rounded-lg bg-green-50 px-3 py-2 font-medium text-green-700 hover:bg-green-100 disabled:opacity-50">Approve</button>
                            <button disabled={workingId === church.id} onClick={() => void runReview(church, 'needs_more_info')} className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50">More Info</button>
                            <button disabled={workingId === church.id} onClick={() => void runReview(church, 'rejected')} className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-700 hover:bg-red-100 disabled:opacity-50">Reject</button>
                          </>
                        )}
                        <button onClick={() => router.push(`/admin/churches/${church.id}`)} className="rounded-lg bg-gray-50 px-3 py-2 font-medium text-gray-700 hover:bg-gray-100">Details</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-50"><ChevronLeft className="h-4 w-4" />Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Next<ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
