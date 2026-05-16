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

/** Handles both plain array and paginated { data, total } responses */
export async function getChurches(): Promise<Church[]> {
  const res = await api.get<Church[] | { data: Church[]; total: number }>('/churches');
  return Array.isArray(res) ? res : res.data;
}

export async function getChurch(id: string): Promise<Church> {
  return api.get<Church>(`/churches/${id}`);
}

export async function createChurch(data: CreateChurchRequest): Promise<Church> {
  return api.post<Church>('/churches', data);
}

export async function updateChurch(id: string, data: UpdateChurchRequest): Promise<Church> {
  return api.patch<Church>(`/churches/${id}`, data);
}

export async function deleteChurch(id: string): Promise<void> {
  return api.delete<void>(`/churches/${id}`);
}

export async function approveChurch(id: string): Promise<Church> {
  return updateChurch(id, { status: 'active' });
}

export async function rejectChurch(id: string): Promise<Church> {
  return updateChurch(id, { status: 'rejected' });
}
