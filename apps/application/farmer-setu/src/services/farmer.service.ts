import { requestApi } from './api';
import type {
  ApiResponse,
  FarmerFullProfileResponse,
  UpdateFarmerProfilePayload,
  CreateBookingPayload,
  MandiItem,
} from '@/interfaces';

/**
 * Fetches the authenticated farmer's full profile and KYC details from backend.
 */
export async function getFarmerProfileApi(
  token: string
): Promise<ApiResponse<FarmerFullProfileResponse>> {
  return requestApi<FarmerFullProfileResponse>(
    '/farmer/profile',
    {
      method: 'GET',
    },
    token
  );
}

/**
 * Updates farmer KYC identity details (Address, DOB, ID proof, Avatar).
 */
export async function updateFarmerProfileApi(
  token: string,
  payload: UpdateFarmerProfilePayload
): Promise<ApiResponse<FarmerFullProfileResponse>> {
  return requestApi<FarmerFullProfileResponse>(
    '/farmer/profile',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token
  );
}

/**
 * Fetches real approved mandis from database backend.
 */
export async function getApprovedMandisApi(
  token?: string
): Promise<ApiResponse<{ mandis: MandiItem[] }>> {
  return requestApi<{ mandis: MandiItem[] }>(
    '/mandi/list',
    {
      method: 'GET',
    },
    token
  );
}

/**
 * Creates a gate arrival slot booking for the farmer (requires isProfileComplete).
 */
export async function createFarmerBookingApi(
  token: string,
  payload: CreateBookingPayload
): Promise<ApiResponse<{ booking: any }>> {
  return requestApi<{ booking: any }>(
    '/farmer/bookings',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token
  );
}

/**
 * Fetches all past and active bookings for the logged-in farmer.
 */
export async function getFarmerBookingsApi(
  token: string
): Promise<ApiResponse<{ bookings: any[] }>> {
  return requestApi<{ bookings: any[] }>(
    '/farmer/bookings',
    {
      method: 'GET',
    },
    token
  );
}
