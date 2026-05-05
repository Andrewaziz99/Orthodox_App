/**
 * Authentication API Service
 * Handles login, OTP, and user authentication
 */

import { api } from './client';
import { clearSession } from '../auth/session';
import { AuthUser } from '../auth/session';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
}

export interface OtpSendRequest {
  phone: string;
}

export interface OtpVerifyRequest {
  phone: string;
  code: string;
}

export interface UserProfileResponse extends AuthUser {
  createdAt: string;
  updatedAt: string;
}

/**
 * Login with email and password (Super Admin)
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', data, { requiresAuth: false });
}

/**
 * Send OTP to phone number
 */
export async function sendOtp(data: OtpSendRequest): Promise<{ message: string }> {
  return api.post('/auth/otp/send', data, { requiresAuth: false });
}

/**
 * Verify OTP code
 */
export async function verifyOtp(data: OtpVerifyRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/otp/verify', data, { requiresAuth: false });
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<UserProfileResponse> {
  return api.get<UserProfileResponse>('/auth/me');
}

/**
 * Logout (client-side, clears token)
 */
export async function logout(): Promise<void> {
  clearSession();
  return Promise.resolve();
}