import { requestApi } from './api';
import type {
  ApiResponse,
  AuthResponseData,
  FarmerUser,
  LoginPayload,
  RegisterPayload,
  SendOtpPayload,
  VerifyOtpPayload,
} from '@/interfaces';

/**
 * Pure modular function to authenticate a farmer via backend API.
 * Validates that the account possesses the FARMER role.
 */
export async function loginFarmerApi(
  payload: LoginPayload
): Promise<ApiResponse<AuthResponseData>> {
  const result = await requestApi<AuthResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: payload.identifier.trim(),
      password: payload.password,
    }),
  });

  if (!result.success || !result.data) {
    return result;
  }

  // Strict Farmer check - Reject non-farmer roles
  if (result.data.user.role !== 'FARMER') {
    return {
      success: false,
      message:
        'Access denied: This application is exclusively for farmers. Mandi operators and admins cannot log in here.',
      code: 'UNAUTHORIZED_ROLE',
    };
  }

  return result;
}

/**
 * Pure modular function to register a new farmer.
 * Strictly forces role to 'FARMER'.
 */
export async function registerFarmerApi(
  payload: Omit<RegisterPayload, 'role'>
): Promise<ApiResponse<AuthResponseData>> {
  const body: RegisterPayload = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
    password: payload.password,
    role: 'FARMER', // Strictly locked to FARMER role only
  };

  return requestApi<AuthResponseData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Pure modular function to verify a 6-digit OTP code for a farmer account.
 */
export async function verifyOtpFarmerApi(
  payload: VerifyOtpPayload
): Promise<ApiResponse<AuthResponseData>> {
  const result = await requestApi<AuthResponseData>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      identifier: payload.identifier.trim().toLowerCase(),
      code: payload.code.trim(),
      type: payload.type || 'EMAIL_VERIFICATION',
    }),
  });

  if (!result.success || !result.data) {
    return result;
  }

  if (result.data.user && result.data.user.role !== 'FARMER') {
    return {
      success: false,
      message: 'Access denied: Verified profile is not a farmer account.',
      code: 'UNAUTHORIZED_ROLE',
    };
  }

  return result;
}

/**
 * Pure modular function to dispatch or resend an OTP code.
 */
export async function sendOtpFarmerApi(
  payload: SendOtpPayload
): Promise<ApiResponse<{ message: string }>> {
  return requestApi<{ message: string }>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({
      identifier: payload.identifier.trim().toLowerCase(),
      type: payload.type || 'EMAIL_VERIFICATION',
    }),
  });
}

/**
 * Pure modular function to retrieve currently authenticated farmer profile.
 */
export async function getCurrentFarmerApi(
  token: string
): Promise<ApiResponse<{ user: FarmerUser }>> {
  const result = await requestApi<{ user: FarmerUser }>(
    '/auth/me',
    {
      method: 'GET',
    },
    token
  );

  if (!result.success || !result.data) {
    return result;
  }

  if (result.data.user.role !== 'FARMER') {
    return {
      success: false,
      message: 'Access denied: Profile is not registered as a farmer.',
      code: 'UNAUTHORIZED_ROLE',
    };
  }

  return result;
}
