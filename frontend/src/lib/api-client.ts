// Centralized API client for microservices
import type { ApiResponse } from "@/types/common";
import type { ApiErrorResponse } from "@/types/api/index";

// API Configuration
const API_BASE_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3002/api/v1",
  sales: process.env.NEXT_PUBLIC_SALES_SERVICE_URL || "http://localhost:3004/api/v1",
  inventory: process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL || "http://localhost:3003/api/v1",
  admin: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || "http://localhost:3001/api/v1",
  communications: process.env.NEXT_PUBLIC_COMMUNICATIONS_SERVICE_URL || "http://localhost:3005/api/v1",
  analytics: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || "http://localhost:3006/api/v1",
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(service: keyof typeof API_BASE_URLS) {
    // console.log(service,API_BASE_URLS[service]);
    this.baseUrl = API_BASE_URLS[service];
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        'Authorization': `Bearer ${token}`,
      };
      console.log(token);
    } else {
      const { 'Authorization': _, ...headers } = this.defaultHeaders as Record<string, string>;
      this.defaultHeaders = headers;
    }
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      console.log(response);
      
      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        switch (response.status) {
          case HTTP_STATUS.UNAUTHORIZED:
            // Token might be expired, clear it
            tokenManager.removeToken();
            break;
          case HTTP_STATUS.CONFLICT:
            // Resource already exists
            break;
        }

        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses (204 No Content)
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return {
          success: true,
          data: null as T,
          message: 'Operation completed successfully',
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed:`, error);
      
      // Network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  // Upload file method
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const { 'Content-Type': _, ...headersWithoutContentType } =
      this.defaultHeaders as Record<string, string>;

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: headersWithoutContentType,
    });
  }
}

// Service-specific API clients
export const authApi = new ApiClient('auth');
export const salesApi = new ApiClient('sales');
export const inventoryApi = new ApiClient('inventory');
export const adminApi = new ApiClient('admin');
export const communicationsApi = new ApiClient('communications');
export const analyticsApi = new ApiClient('analytics');

// Group all clients for easier token management
const allApiClients = [
  authApi,
  salesApi,
  inventoryApi,
  adminApi,
  communicationsApi,
  analyticsApi,
];

// Function to set token on all API clients
export const setAuthTokenOnAllClients = (token: string | null) => {
  for (const client of allApiClients) {
    client.setAuthToken(token);
  }
};

// Authentication API methods
export const authService = {
  login: (email: string, password: string) =>
    authApi.post('/auth/login', { email, password }),
    
  register: (data: { fullName: string; email: string; password: string; role?: string }) =>
    authApi.post('/auth/register', data),
    
  logout: () => authApi.post('/auth/logout'),
    
  getProfile: () => authApi.get('/auth/me'),
    
  verifyEmail: () => authApi.post('/auth/verify'),
    
  updateProfile: (data: { fullName?: string; phone?: string }) =>
    authApi.put('/auth/profile', data),
    
  changePassword: (currentPassword: string, newPassword: string) =>
    authApi.put('/auth/change-password', { currentPassword, newPassword }),
};

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    setAuthTokenOnAllClients(token); // Ensure all clients are updated when token is set
  },
  
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    setAuthTokenOnAllClients(null); // Ensure all clients are cleared
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

// Initialize auth token from storage
const initialToken = tokenManager.getToken();
if (initialToken && !tokenManager.isTokenExpired(initialToken)) {
  setAuthTokenOnAllClients(initialToken);
} else if (initialToken) {
  tokenManager.removeToken(); // This will also clear the token from all clients
}

export default ApiClient;
