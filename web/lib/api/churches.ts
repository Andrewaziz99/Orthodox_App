/**
 * Churches API Service
 * CRUD operations for church management
 */

import { api } from './client';

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

/**
 * Get all churches (admin only)
 */
export async function getChurches(): Promise<Church[]> {
  return api.get<Church[]>('/churches');
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