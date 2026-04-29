/**
 * Users API Service
 * User management CRUD operations
 */

import { api } from './client';
import type { PaginatedResponse } from './pagination';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'super_admin' | 'church_admin' | 'servant' | 'child';
  churchId?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: 'super_admin' | 'church_admin' | 'servant' | 'child';
  churchId?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'super_admin' | 'church_admin' | 'servant' | 'child';
  status?: 'pending' | 'active' | 'inactive' | 'suspended';
  churchId?: string;
}

/**
 * Get all users (admin only)
 */
export async function getUsers(
  query: UserListQuery = {}
): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.role) params.set('role', query.role);
  if (query.status) params.set('status', query.status);
  if (query.churchId) params.set('churchId', query.churchId);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return api.get<PaginatedResponse<User>>(`/users${suffix}`);
}

/**
 * Get user by ID
 */
export async function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

/**
 * Create new user (admin only)
 */
export async function createUser(data: CreateUserRequest): Promise<User> {
  return api.post<User>('/users', data);
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<User> {
  return api.patch<User>(`/users/${id}`, data);
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(id: string): Promise<void> {
  return api.delete<void>(`/users/${id}`);
}

export async function bulkDeleteUsers(ids: string[]): Promise<{ deleted: number }> {
  return api.delete<{ deleted: number }>('/users/bulk', {
    body: JSON.stringify({ ids }),
  });
}

export async function bulkActivateUsers(ids: string[]): Promise<{ updated: number }> {
  return api.patch<{ updated: number }>('/users/bulk/status', {
    ids,
    status: 'active',
  });
}

/**
 * Get users by church ID
 */
export async function getUsersByChurch(churchId: string): Promise<User[]> {
  const response = await getUsers({ page: 1, limit: 1000, churchId });
  return response.data;
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  const response = await getUsers({ page: 1, limit: 1000, role: role as any });
  return response.data;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await getUsers({ page: 1, limit: 1000 });
  return response.data;
}