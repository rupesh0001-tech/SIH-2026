export type UserRole = 'FARMER' | 'MANDI_OPERATOR' | 'ADMIN';

export interface FarmerUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'FARMER';
}

export interface SendOtpPayload {
  identifier: string;
  type?: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'LOGIN_OTP';
}

export interface VerifyOtpPayload {
  identifier: string;
  code: string;
  type?: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'LOGIN_OTP';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponseData {
  user: FarmerUser;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

import type { FarmerProfileData, UpdateFarmerProfilePayload } from './farmer.interface';

export interface AuthContextType {
  user: FarmerUser | null;
  farmerProfile: FarmerProfileData | null;
  farmerCode: string | null;
  isProfileComplete: boolean;
  token: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: Omit<RegisterPayload, 'role'>) => Promise<boolean>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<boolean>;
  sendOtp: (payload: SendOtpPayload) => Promise<boolean>;
  refreshFarmerProfile: () => Promise<void>;
  updateProfile: (payload: UpdateFarmerProfilePayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

