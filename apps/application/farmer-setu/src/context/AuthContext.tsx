import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import type {
  AuthContextType,
  FarmerUser,
  LoginPayload,
  RegisterPayload,
} from '@/interfaces';
import { loginFarmerApi, registerFarmerApi } from '@/services/auth.service';

const TOKEN_STORAGE_KEY = 'kisan_setu_auth_token';
const USER_STORAGE_KEY = 'kisan_setu_user_profile';

function loadStoredAuth(): { user: FarmerUser | null; token: string | null } {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
      if (storedToken && storedUser) {
        return {
          token: storedToken,
          user: JSON.parse(storedUser) as FarmerUser,
        };
      }
    } catch {
      // Storage access failed, ignore
    }
  }
  return { user: null, token: null };
}

function persistStoredAuth(user: FarmerUser | null, token: string | null): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      if (user && token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Storage write failed, ignore
    }
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarmerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Rehydrate on initial mount
  useEffect(() => {
    const initial = loadStoredAuth();
    if (initial.token && initial.user && initial.user.role === 'FARMER') {
      setUser(initial.user);
      setToken(initial.token);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const response = await loginFarmerApi(payload);
    setIsLoading(false);

    if (!response.success || !response.data) {
      setError(response.message || 'Login failed. Please check your credentials.');
      return false;
    }

    const { user: authenticatedUser, accessToken } = response.data;
    setUser(authenticatedUser);
    setToken(accessToken);
    persistStoredAuth(authenticatedUser, accessToken);
    return true;
  }, []);

  const register = useCallback(
    async (payload: Omit<RegisterPayload, 'role'>): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      const response = await registerFarmerApi(payload);
      setIsLoading(false);

      if (!response.success || !response.data) {
        setError(response.message || 'Registration failed. Please verify your details.');
        return false;
      }

      const { user: registeredUser, accessToken } = response.data;
      setUser(registeredUser);
      setToken(accessToken);
      persistStoredAuth(registeredUser, accessToken);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    persistStoredAuth(null, null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, token, isLoading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
