import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import type { ApiResponse } from '@/interfaces';

function getApiBaseUrl(): string {
  // 1. Explicit environment override
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Web browser: localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:4000/api/v1';
  }

  // 3. Dynamically resolve host from Expo debugger/bundler
  const rawHost =
    Constants.expoConfig?.hostUri ||
    (Constants as Record<string, any>).expoGoConfig?.debuggerHost ||
    (Constants as Record<string, any>).manifest?.debuggerHost ||
    (Constants as Record<string, any>).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as Record<string, any>).manifest2?.extra?.expoClient?.hostUri ||
    Constants.experienceUrl;

  if (typeof rawHost === 'string' && rawHost.length > 0) {
    // Clean up exp:// or http:// prefixes and extract host
    const cleanHost = rawHost.replace(/^(exp|http|https):\/\//, '');
    const hostIp = cleanHost.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:4000/api/v1`;
    }
  }

  // 4. Android Emulator only (not physical device)
  if (Platform.OS === 'android' && !Device.isDevice) {
    return 'http://10.0.2.2:4000/api/v1';
  }

  // 5. Default to the development machine LAN IP for physical phones on local Wi-Fi
  return 'http://10.91.95.157:4000/api/v1';
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Pure modular function for executing API requests with timeout and error handling.
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
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
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timed out. Please check if the backend server is running and reachable.',
        code: 'TIMEOUT_ERROR',
      };
    }

    const errorMsg =
      err instanceof Error
        ? err.message
        : 'Network connection failed. Please verify backend server is reachable.';
    return {
      success: false,
      message: `${errorMsg} (Connecting to: ${API_BASE_URL})`,
      code: 'NETWORK_ERROR',
    };
  }
}
