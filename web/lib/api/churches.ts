/**
 * Churches API Service
 * CRUD operations for church management
 */

import { api } from './client';
import type { PaginatedResponse } from './pagination';

export interface Church {
  id: string;
  name: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'active' | 'rejected';
  maxChildren?: number;
  subscriptionStartDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChurchRequest {
  name: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  maxChildren?: number;
}

export interface UpdateChurchRequest extends Partial<CreateChurchRequest> {
  status?: 'pending' | 'active' | 'rejected';
}

export interface ChurchListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'active' | 'rejected';
}

/**
 * Get all churches (admin only)
 */
export async function getChurches(
  query: ChurchListQuery = {}
): Promise<PaginatedResponse<Church>> {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return api.get<PaginatedResponse<Church>>(`/churches${suffix}`);
}

/**
 * Get church by ID
 */
export async function getChurch(id: string): Promise<Church> {
  return api.get<Church>(`/churches/${id}`);
}

/**
 * Create new church (super admin only)
 */
export async function createChurch(data: CreateChurchRequest): Promise<Church> {
  return api.post<Church>('/churches', data);
}

/**
 * Update church
 */
export async function updateChurch(
  id: string,
  data: UpdateChurchRequest
): Promise<Church> {
  return api.patch<Church>(`/churches/${id}`, data);
}

/**
 * Delete church (super admin only)
 */
export async function deleteChurch(id: string): Promise<void> {
  return api.delete<void>(`/churches/${id}`);
}

export async function bulkDeleteChurches(ids: string[]): Promise<{ deleted: number }> {
  return api.delete<{ deleted: number }>('/churches/bulk', {
    body: JSON.stringify({ ids }),
  });
}

export async function bulkApproveChurches(ids: string[]): Promise<{ updated: number }> {
  return api.patch<{ updated: number }>('/churches/bulk/status', {
    ids,
    status: 'active',
  });
}

/**
 * Approve church registration
 */
export async function approveChurch(id: string): Promise<Church> {
  return updateChurch(id, { status: 'active' });
}

/**
 * Reject church registration
 */
export async function rejectChurch(id: string): Promise<Church> {
  return updateChurch(id, { status: 'rejected' });
}

export async function getAllChurches(): Promise<Church[]> {
  const response = await getChurches({ page: 1, limit: 1000 });
  return response.data;
}