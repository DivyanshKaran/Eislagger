"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useProfile, useLogin, useRegister, useLogout, useUpdateProfile, useChangePassword } from "@/hooks/useAuth";
import { setAuthTokenOnAllClients, authService } from "@/services/DataService";
import { tokenManager } from "./api-client";

// Types
import type { User, UserRole } from "@/types";

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
}

interface AuthError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  updateProfile: (data: { fullName?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!user.id;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      const token = tokenManager.getToken();
      if (token && !tokenManager.isTokenExpired(token)) {
        authService.getProfile().then((response) => {
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            tokenManager.removeToken();
          }
        }).catch(() => {
          tokenManager.removeToken();
        });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      tokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data && response.data.token) {
        tokenManager.setToken(response.data.token);
        setUser(response.data.user);
        
        // Set auth token for API client
        const { authApi } = await import("./api-client");
        authApi.setAuthToken(response.data.token);
        
        return { success: true, user: response.data.user };
      } else {
        return {
          success: false,
          error: response.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role || 'Patron'
      });
      
      if (response.success && response.data && response.data.token) {
        tokenManager.setToken(response.data.token);
        setUser(response.data.user);
        
        // Set auth token for API client
        const { authApi } = await import("./api-client");
        authApi.setAuthToken(response.data.token);
        
        return { success: true, user: response.data.user };
      } else {
        return {
          success: false,
          error: response.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenManager.removeToken();
      setUser(null);
      
      // Clear auth token from API client
      const { authApi } = await import("./api-client");
      authApi.setAuthToken(null);
      
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    data: { fullName?: string; phone?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Profile update failed",
        };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Profile update failed",
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Password change failed",
        };
      }
    } catch (error) {
      console.error("Password change error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password change failed",
      };
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Profile refresh error:", error);
    }
  };

  // Update user data when profile changes
  const updateUserData = (userData: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return null;
    }

    return <Component {...props} />;
  };
}

// Hook for role-based access control
export function useRole(requiredRole: UserRole) {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Executive has access to everything
  if (user.role === "executive") return true;
  
  // Check specific role
  return user.role === requiredRole;
}

// Hook for checking multiple roles
export function useRoles(...roles: UserRole[]) {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Executive has access to everything
  if (user.role === "executive") return true;
  
  // Check if user role is in the required roles
  return roles.includes(user.role);
}
