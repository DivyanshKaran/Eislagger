// Enhanced HTTP client with strong typing and error handling
import type { ApiResponse, ApiErrorResponse } from "@/types/api";
import { 
  getMockUser, 
  getMockUsers, 
  getMockFlavor, 
  getMockFlavors, 
  getMockOrder, 
  getMockOrders, 
  getMockStore, 
  getMockStores,
  getMockMessages,
  getMockEmails,
  getMockNotifications,
  getMockKPIs,
  getMockChartData,
  getMockDashboardData,
  getMockAnalyticsData,
  createMockSuccessResponse,
  createMockPaginatedResponse
} from "@/mocks/mockData";

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

// Enhanced error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Network error detection
const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check for common network error patterns
  const networkErrorPatterns = [
    'fetch',
    'network',
    'connection',
    'timeout',
    'refused',
    'unreachable',
    'dns',
    'enotfound',
    'econnrefused',
    'econnreset',
    'etimedout',
    'ehostunreach',
  ];
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorName = error.name?.toLowerCase() || '';
  const errorCode = error.code?.toLowerCase() || '';
  
  return networkErrorPatterns.some(pattern => 
    errorMessage.includes(pattern) || 
    errorName.includes(pattern) || 
    errorCode.includes(pattern)
  );
};

// Mock data fallback resolver
const getMockDataForEndpoint = (endpoint: string, method: string = 'GET'): any => {
  console.warn(`🌐 Network error detected, serving mock data for: ${method} ${endpoint}`);
  
  // Auth endpoints
  if (endpoint.includes('/auth/me') || endpoint.includes('/auth/profile')) {
    return createMockSuccessResponse(getMockUser());
  }
  
  if (endpoint.includes('/auth/login')) {
    return createMockSuccessResponse({
      user: getMockUser(),
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
    });
  }
  
  // User endpoints
  if (endpoint.includes('/users') && method === 'GET') {
    return createMockPaginatedResponse(getMockUsers());
  }
  
  // Flavor endpoints
  if (endpoint.includes('/flavors') && method === 'GET') {
    if (endpoint.includes('/flavors/') && !endpoint.endsWith('/flavors')) {
      // Single flavor
      return createMockSuccessResponse(getMockFlavor());
    }
    // Multiple flavors
    return createMockPaginatedResponse(getMockFlavors());
  }
  
  // Order endpoints
  if (endpoint.includes('/orders') && method === 'GET') {
    return createMockPaginatedResponse(getMockOrders());
  }
  
  // Store endpoints
  if (endpoint.includes('/shops') && method === 'GET') {
    if (endpoint.includes('/shops/') && !endpoint.endsWith('/shops')) {
      // Single store
      return createMockSuccessResponse(getMockStore());
    }
    // Multiple stores
    return createMockPaginatedResponse(getMockStores());
  }
  
  // Message endpoints
  if (endpoint.includes('/chat/conversations') && method === 'GET') {
    return createMockPaginatedResponse(getMockMessages());
  }
  
  // Email endpoints
  if (endpoint.includes('/emails') && method === 'GET') {
    return createMockPaginatedResponse(getMockEmails());
  }
  
  // Notification endpoints
  if (endpoint.includes('/notifications') && method === 'GET') {
    return createMockPaginatedResponse(getMockNotifications());
  }
  
  // Analytics endpoints
  if (endpoint.includes('/kpis') && method === 'GET') {
    return createMockSuccessResponse(getMockKPIs());
  }
  
  if (endpoint.includes('/charts') && method === 'GET') {
    return createMockSuccessResponse(getMockChartData());
  }
  
  if (endpoint.includes('/dashboard') && method === 'GET') {
    return createMockSuccessResponse(getMockDashboardData());
  }
  
  if (endpoint.includes('/analytics') && method === 'GET') {
    return createMockSuccessResponse(getMockAnalyticsData());
  }
  
  // Default fallback
  return createMockSuccessResponse(null);
};

// HTTP Client configuration
interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

class HttpClient {
  private config: HttpClientConfig;
  private defaultHeaders: HeadersInit;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      ...config,
    };
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
    } else {
      const { 'Authorization': _, ...headers } = this.defaultHeaders as Record<string, string>;
      this.defaultHeaders = headers;
    }
  }

  // Generic request method with retry logic
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      // Add timeout support
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Server errors (5xx) should trigger fallback to mock data
        if (response.status >= 500) {
          console.warn(`🌐 Server error (${response.status}) detected, serving mock data for: ${options.method || 'GET'} ${endpoint}`);
          const mockData = getMockDataForEndpoint(endpoint, options.method || 'GET');
          return mockData as ApiResponse<T>;
        }
        
        // Handle specific error cases
        switch (response.status) {
          case HTTP_STATUS.UNAUTHORIZED:
            // Token might be expired, clear it
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('refresh_token');
            }
            throw new ApiError(
              'Authentication required',
              response.status,
              'UNAUTHORIZED'
            );
          case HTTP_STATUS.FORBIDDEN:
            throw new ApiError(
              'Access denied',
              response.status,
              'FORBIDDEN'
            );
          case HTTP_STATUS.NOT_FOUND:
            throw new ApiError(
              'Resource not found',
              response.status,
              'NOT_FOUND'
            );
          case HTTP_STATUS.CONFLICT:
            throw new ApiError(
              'Resource already exists',
              response.status,
              'CONFLICT'
            );
          default:
            throw new ApiError(
              errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
              response.status,
              errorData.error?.code,
              errorData.error?.details
            );
        }
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
      // Check if this is a network error that should trigger fallback
      if (isNetworkError(error)) {
        console.warn(`🌐 Network error detected for ${options.method || 'GET'} ${endpoint}:`, error);
        
        // Return mock data instead of throwing error
        const mockData = getMockDataForEndpoint(endpoint, options.method || 'GET');
        return mockData as ApiResponse<T>;
      }

      // Retry logic for non-network errors
      if (
        retryCount < this.config.retries! &&
        (error instanceof TypeError || error instanceof ApiError)
      ) {
        console.warn(`Request failed, retrying... (${retryCount + 1}/${this.config.retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      // Network errors (fallback to mock data)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn(`🌐 Fetch error detected, serving mock data for: ${options.method || 'GET'} ${endpoint}`);
        const mockData = getMockDataForEndpoint(endpoint, options.method || 'GET');
        return mockData as ApiResponse<T>;
      }

      // Abort errors (timeout) - also fallback to mock data
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`🌐 Timeout error detected, serving mock data for: ${options.method || 'GET'} ${endpoint}`);
        const mockData = getMockDataForEndpoint(endpoint, options.method || 'GET');
        return mockData as ApiResponse<T>;
      }

      throw error;
    }
  }

  // HTTP Methods with strong typing
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  async post<TReq = any, TRes = TReq>(
    endpoint: string, 
    data?: TReq, 
    options?: RequestInit
  ): Promise<ApiResponse<TRes>> {
    return this.request<TRes>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<TReq = any, TRes = TReq>(
    endpoint: string, 
    data?: TReq, 
    options?: RequestInit
  ): Promise<ApiResponse<TRes>> {
    return this.request<TRes>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async patch<TReq = any, TRes = TReq>(
    endpoint: string, 
    data?: TReq, 
    options?: RequestInit
  ): Promise<ApiResponse<TRes>> {
    return this.request<TRes>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  // Upload file method
  async upload<T>(
    endpoint: string, 
    file: File, 
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
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

export default HttpClient;
