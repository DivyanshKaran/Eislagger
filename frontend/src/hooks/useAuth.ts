// Authentication hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { dataService } from '@/services/DataService';
import { authKeys } from '@/services/queryKeys';
import { setAuthTokenOnAllClients } from '@/services/DataService';
import type { LoginRequest, RegisterRequest } from '@/types/api/index';
import type { User } from '@/types/models';

// ============================================================================
// AUTH QUERIES
// ============================================================================

// Get current user profile
export function useProfile() {
  return useQuery<User>({
    queryKey: authKeys.profile(),
    queryFn: async (): Promise<User> => {
      const response = await dataService.auth.getProfile();
      if (!response.success) {
        throw new Error(response.error || 'Failed to get profile');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failures
  });
}

// ============================================================================
// AUTH MUTATIONS
// ============================================================================

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await dataService.auth.login(data);
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Set token on all API clients
      setAuthTokenOnAllClients(data.token);
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      // Redirect based on user role
      const role = data.user.role.toLowerCase();
      router.push(`/${role}`);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await dataService.auth.register(data);
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Set token on all API clients
      setAuthTokenOnAllClients(data.token);
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      // Redirect based on user role
      const role = data.user.role.toLowerCase();
      router.push(`/${role}`);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await dataService.auth.logout();
      if (!response.success) {
        throw new Error(response.error || 'Logout failed');
      }
      return response.data;
    },
    onSuccess: () => {
      // Clear token from all API clients
      setAuthTokenOnAllClients(null);
      
      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
      
      // Clear all query cache
      queryClient.clear();
      
      // Redirect to login
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local state
      setAuthTokenOnAllClients(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
      queryClient.clear();
      router.push('/auth/login');
    },
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { fullName?: string; phone?: string }) => {
      const response = await dataService.auth.updateProfile(data);
      if (!response.success) {
        throw new Error(response.error || 'Profile update failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(), data);
      
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await dataService.auth.changePassword(data.currentPassword, data.newPassword);
      if (!response.success) {
        throw new Error(response.error || 'Password change failed');
      }
      return response.data;
    },
    onError: (error) => {
      console.error('Password change failed:', error);
    },
  });
}

// Verify email mutation
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async () => {
      const response = await dataService.auth.verifyEmail();
      if (!response.success) {
        throw new Error(response.error || 'Email verification failed');
      }
      return response.data;
    },
    onError: (error) => {
      console.error('Email verification failed:', error);
    },
  });
}

// ============================================================================
// AUTH UTILITIES
// ============================================================================

// Check if user is authenticated
export function useIsAuthenticated() {
  const { data: user, isLoading } = useProfile();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

// Get current user role
export function useUserRole() {
  const { data: user } = useProfile();
  return user?.role;
}

// Check if user has specific role
export function useHasRole(role: string) {
  const userRole = useUserRole();
  return userRole?.toLowerCase() === role.toLowerCase();
}
