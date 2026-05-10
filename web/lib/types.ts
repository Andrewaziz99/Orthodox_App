/**
 * Type Definitions
 * Shared types for authentication and API
 */

// User Roles
export type UserRole = 'super_admin' | 'church_admin' | 'servant' | 'child';

// User Status
export type UserStatus = 'active' | 'inactive' | 'suspended';

// Church Status
export type ChurchStatus = 'pending' | 'active' | 'rejected';

// Auth User
export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  churchId?: string;
}

// User Entity
export interface User extends AuthUser {
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Church Entity
export interface Church {
  id: string;
  name: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: ChurchStatus;
  maxChildren?: number;
  subscriptionStartDate?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface LoginResponse {
  access_token: string;
  role: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
