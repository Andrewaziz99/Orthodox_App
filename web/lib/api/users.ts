/**
 * Users API Service
 * User management CRUD operations
 */

import { api } from './client';

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

/**
 * Get all users (admin only)
 */
export async function getUsers(): Promise<User[]> {
  // Backend may return paginated shape: { data: User[], meta: {...} }
  const res = await api.get<any>('/users');
  if (Array.isArray(res)) return res as User[];
  if (res && Array.isArray(res.data)) return res.data as User[];
  return [];
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

/**
 * Get users by church ID
 */
export async function getUsersByChurch(churchId: string): Promise<User[]> {
  const res = await api.get<any>(`/users?churchId=${churchId}`);
  if (Array.isArray(res)) return res as User[];
  if (res && Array.isArray(res.data)) return res.data as User[];
  return [];
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  const res = await api.get<any>(`/users?role=${role}`);
  if (Array.isArray(res)) return res as User[];
  if (res && Array.isArray(res.data)) return res.data as User[];
  return [];
}
