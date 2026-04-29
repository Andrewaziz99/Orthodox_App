"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopbar from '@/components/admin/AdminTopbar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  approveChurch,
  bulkApproveChurches,
  bulkDeleteChurches,
  deleteChurch,
  getChurches,
  rejectChurch,
  type Church,
} from '@/lib/api/churches';
import { Building2, ChevronLeft, ChevronRight, PlusCircle, Search } from 'lucide-react';

const PAGE_SIZE = 10;

type ConfirmState =
  | { kind: 'delete-one'; ids: string[]; title: string; description: string; confirmText: string; variant: 'danger' }
  | { kind: 'approve-one'; ids: string[]; title: string; description: string; confirmText: string; variant: 'success' }
  | { kind: 'reject-one'; ids: string[]; title: string; description: string; confirmText: string; variant: 'danger' }
  | { kind: 'bulk-delete'; ids: string[]; title: string; description: string; confirmText: string; variant: 'danger' }
  | { kind: 'bulk-approve'; ids: string[]; title: string; description: string; confirmText: string; variant: 'success' }
  | null;

export default function ChurchesListPage() {
  const router = useRouter();
  const [churches, setChurches] = useState<Church[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1, hasNextPage: false, hasPreviousPage: false });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
    const load = async () => {
      setLoading(true);
      try {
        const response = await getChurches({ page, limit: PAGE_SIZE, search: query });
        setChurches(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Failed to load churches', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, query]);

  const selectedCount = selectedIds.length;
  const allCurrentSelected = useMemo(
    () => churches.length > 0 && churches.every((church) => selectedIds.includes(church.id)),
    [churches, selectedIds],
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(churches.map((church) => church.id));
  };

  const refreshCurrentPage = async () => {
    const response = await getChurches({ page, limit: PAGE_SIZE, search: query });
    setChurches(response.data);
    setMeta(response.meta);
    setSelectedIds([]);
  };

  const openConfirm = (state: ConfirmState) => setConfirmState(state);

  const runConfirmAction = async () => {
    if (!confirmState) return;

    setWorking(true);
    try {
      switch (confirmState.kind) {
        case 'delete-one':
          await deleteChurch(confirmState.ids[0]);
          break;
        case 'approve-one':
          await approveChurch(confirmState.ids[0]);
          break;
        case 'reject-one':
          await rejectChurch(confirmState.ids[0]);
          break;
        case 'bulk-delete':
          await bulkDeleteChurches(confirmState.ids);
          break;
        case 'bulk-approve':
          await bulkApproveChurches(confirmState.ids);
          break;
      }

      await refreshCurrentPage();
    } catch (error) {
      console.error('Church action failed', error);
      alert('Action failed. Please try again.');
    } finally {
      setWorking(false);
      setConfirmState(null);
    }
  };

  const statusBadge = (status: Church['status']) => {
    const classes =
      status === 'active'
        ? 'bg-green-100 text-green-700'
        : status === 'pending'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-red-100 text-red-700';

    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes}`}>{status}</span>;
  };

  return (
    <>
      <AdminTopbar title="Churches" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Churches</h1>
            <p className="mt-1 text-sm text-gray-500">
              {meta.total} total churches
              {selectedCount > 0 ? ` • ${selectedCount} selected` : ''}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
                placeholder="Search churches..."
                className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm outline-none ring-0 focus:border-blue-500 sm:w-72"
              />
            </div>

            <button
              onClick={() => router.push('/admin/churches/new')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              Add Church
            </button>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm font-medium text-blue-900">{selectedCount} selected</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  openConfirm({
                    kind: 'bulk-approve',
                    ids: selectedIds,
                    title: 'Approve selected churches?',
                    description: `This will approve ${selectedCount} church${selectedCount === 1 ? '' : 'es'}.`,
                    confirmText: 'Approve selected',
                    variant: 'success',
                  })
                }
                className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Approve Selected
              </button>
              <button
                onClick={() =>
                  openConfirm({
                    kind: 'bulk-delete',
                    ids: selectedIds,
                    title: 'Delete selected churches?',
                    description: `This will permanently delete ${selectedCount} church${selectedCount === 1 ? '' : 'es'}.`,
                    confirmText: 'Delete selected',
                    variant: 'danger',
                  })
                }
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <input
                      type="checkbox"
                      checked={allCurrentSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                      Loading churches...
                    </td>
                  </tr>
                ) : churches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                      No churches found.
                    </td>
                  </tr>
                ) : (
                  churches.map((church) => (
                    <tr key={church.id} className={selectedIds.includes(church.id) ? 'bg-blue-50/60' : ''}>
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(church.id)}
                          onChange={() => toggleSelected(church.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{church.name}</p>
                            <p className="text-xs text-gray-500">{church.location || 'No location'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle text-sm text-gray-700">{church.email || '—'}</td>
                      <td className="px-4 py-4 align-middle text-sm text-gray-700">{church.phone || '—'}</td>
                      <td className="px-4 py-4 align-middle">{statusBadge(church.status)}</td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center justify-end gap-2 text-sm">
                          {church.status === 'pending' ? (
                            <>
                              <button
                                onClick={() =>
                                  openConfirm({
                                    kind: 'approve-one',
                                    ids: [church.id],
                                    title: 'Approve church?',
                                    description: `Approve ${church.name}?`,
                                    confirmText: 'Approve',
                                    variant: 'success',
                                  })
                                }
                                className="rounded-lg bg-green-50 px-3 py-2 font-medium text-green-700 hover:bg-green-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  openConfirm({
                                    kind: 'reject-one',
                                    ids: [church.id],
                                    title: 'Reject church?',
                                    description: `Reject ${church.name}?`,
                                    confirmText: 'Reject',
                                    variant: 'danger',
                                  })
                                }
                                className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-700 hover:bg-red-100"
                              >
                                Reject
                              </button>
                            </>
                          ) : null}
                          <button
                            onClick={() => router.push(`/admin/churches/${church.id}`)}
                            className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              openConfirm({
                                kind: 'delete-one',
                                ids: [church.id],
                                title: 'Delete church?',
                                description: `Delete ${church.name}? This cannot be undone.`,
                                confirmText: 'Delete',
                                variant: 'danger',
                              })
                            }
                            className="rounded-lg bg-gray-50 px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing {meta.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={!meta.hasPreviousPage || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="min-w-10 text-center text-sm font-medium text-gray-700">
                {page} / {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNextPage || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title ?? ''}
        description={confirmState?.description}
        confirmText={confirmState?.confirmText}
        variant={confirmState?.variant}
        busy={working}
        onConfirm={runConfirmAction}
        onCancel={() => setConfirmState(null)}
      />
    </>
  );
}
