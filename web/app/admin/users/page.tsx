"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopbar from '@/components/admin/AdminTopbar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  bulkActivateUsers,
  bulkDeleteUsers,
  deleteUser,
  getUsers,
  updateUser,
  type User,
} from '@/lib/api/users';
import { ChevronLeft, ChevronRight, PlusCircle, Search, Users as UsersIcon } from 'lucide-react';

const PAGE_SIZE = 10;

type ConfirmState =
  | { kind: 'delete-one'; ids: string[]; title: string; description: string; confirmText: string; variant: 'danger' }
  | { kind: 'activate-one'; ids: string[]; title: string; description: string; confirmText: string; variant: 'success' }
  | { kind: 'suspend-one'; ids: string[]; title: string; description: string; confirmText: string; variant: 'danger' }
  | { kind: 'bulk-delete'; ids: string[]; title: string; description: string; confirmText: string; variant: 'danger' }
  | { kind: 'bulk-activate'; ids: string[]; title: string; description: string; confirmText: string; variant: 'success' }
  | null;

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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
        const response = await getUsers({ page, limit: PAGE_SIZE, search: query });
        setUsers(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Failed to load users', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, query]);

  const selectedCount = selectedIds.length;
  const allCurrentSelected = useMemo(
    () => users.length > 0 && users.every((user) => selectedIds.includes(user.id)),
    [users, selectedIds],
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

    setSelectedIds(users.map((user) => user.id));
  };

  const refreshCurrentPage = async () => {
    const response = await getUsers({ page, limit: PAGE_SIZE, search: query });
    setUsers(response.data);
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
          await deleteUser(confirmState.ids[0]);
          break;
        case 'activate-one':
          await updateUser(confirmState.ids[0], { status: 'active' });
          break;
        case 'suspend-one':
          await updateUser(confirmState.ids[0], { status: 'suspended' });
          break;
        case 'bulk-delete':
          await bulkDeleteUsers(confirmState.ids);
          break;
        case 'bulk-activate':
          await bulkActivateUsers(confirmState.ids);
          break;
      }

      await refreshCurrentPage();
    } catch (error) {
      console.error('User action failed', error);
      alert('Action failed. Please try again.');
    } finally {
      setWorking(false);
      setConfirmState(null);
    }
  };

  const statusBadge = (status: User['status']) => {
    const classes =
      status === 'active'
        ? 'bg-green-100 text-green-700'
        : status === 'inactive'
          ? 'bg-gray-100 text-gray-700'
          : 'bg-red-100 text-red-700';

    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes}`}>{status}</span>;
  };

  return (
    <>
      <AdminTopbar title="Users" />

      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              {meta.total} total users{selectedCount > 0 ? ` • ${selectedCount} selected` : ''}
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
                placeholder="Search users..."
                className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm outline-none focus:border-blue-500 sm:w-72"
              />
            </div>

            <button
              onClick={() => router.push('/admin/users/new')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              <PlusCircle className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-sm font-medium text-green-900">{selectedCount} selected</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  openConfirm({
                    kind: 'bulk-activate',
                    ids: selectedIds,
                    title: 'Activate selected users?',
                    description: `This will activate ${selectedCount} user${selectedCount === 1 ? '' : 's'}.`,
                    confirmText: 'Activate selected',
                    variant: 'success',
                  })
                }
                className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Activate Selected
              </button>
              <button
                onClick={() =>
                  openConfirm({
                    kind: 'bulk-delete',
                    ids: selectedIds,
                    title: 'Delete selected users?',
                    description: `This will permanently delete ${selectedCount} user${selectedCount === 1 ? '' : 's'}.`,
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className={selectedIds.includes(user.id) ? 'bg-green-50/60' : ''}>
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={() => toggleSelected(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <UsersIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle text-sm text-gray-700">{user.email || '—'}</td>
                      <td className="px-4 py-4 align-middle text-sm text-gray-700 capitalize">{user.role.replace('_', ' ')}</td>
                      <td className="px-4 py-4 align-middle">{statusBadge(user.status)}</td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center justify-end gap-2 text-sm">
                          {user.status !== 'active' ? (
                            <button
                              onClick={() =>
                                openConfirm({
                                  kind: 'activate-one',
                                  ids: [user.id],
                                  title: 'Activate user?',
                                  description: `Activate ${user.name}?`,
                                  confirmText: 'Activate',
                                  variant: 'success',
                                })
                              }
                              className="rounded-lg bg-green-50 px-3 py-2 font-medium text-green-700 hover:bg-green-100"
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                openConfirm({
                                  kind: 'suspend-one',
                                  ids: [user.id],
                                  title: 'Suspend user?',
                                  description: `Suspend ${user.name}?`,
                                  confirmText: 'Suspend',
                                  variant: 'danger',
                                })
                              }
                              className="rounded-lg bg-yellow-50 px-3 py-2 font-medium text-yellow-700 hover:bg-yellow-100"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              openConfirm({
                                kind: 'delete-one',
                                ids: [user.id],
                                title: 'Delete user?',
                                description: `Delete ${user.name}? This cannot be undone.`,
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
