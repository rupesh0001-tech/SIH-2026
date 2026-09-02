import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { ApiResponse } from '@/interfaces';

function getApiBaseUrl(): string {
  // 1. Explicit env override if set
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Web browser: directly connect to backend on localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:4000/api/v1';
  }

  // 3. Expo Go on Physical Mobile Device or Emulator:
  // Dynamically resolve the host IP that Expo CLI is running on
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp) {
      return `http://${hostIp}:4000/api/v1`;
    }
  }

  // 4. Android Emulator fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api/v1';
  }

  // 5. Default machine LAN IP / fallback
  return 'http://10.91.95.157:4000/api/v1';
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Pure modular function for executing API requests.
 */
export async function requestApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;
      return {
        success: false,
        message: errorMessage,
        code: data?.code,
      };
    }

    return {
      success: true,
      message: data?.message,
      data: data?.data ?? data,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : 'Network connection failed. Please verify backend server is reachable.';
    return {
      success: false,
      message: errorMsg,
      code: 'NETWORK_ERROR',
    };
  }
}
