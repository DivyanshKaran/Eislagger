// API request/response types

import type {
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  SearchParams,
} from "../common";
import type {
  User,
  Message,
  Email,
  Notification,
  Flavor,
  Order,
  Store,
  AnalyticsData,
  KPIData,
  ChartData,
} from "../models";

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface AuthResponse extends ApiResponse<LoginResponse> {}

export interface GetProfileResponse extends ApiResponse<User> {}

// User API
export interface GetUsersRequest extends PaginationParams {
  role?: string;
  status?: string;
  search?: string;
}

export interface GetUsersResponse extends PaginatedResponse<User> {}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  preferences?: Record<string, unknown>;
}

export interface UpdateUserResponse extends ApiResponse<User> {}

// Message API
export interface GetMessagesRequest extends PaginationParams {
  conversationId?: string;
  userId?: string;
  unreadOnly?: boolean;
}

export interface GetMessagesResponse extends PaginatedResponse<Message> {}

export interface SendMessageRequest {
  receiverId: string;
  text: string;
  messageType?: "text" | "image" | "file";
  metadata?: Record<string, unknown>;
}

export interface SendMessageResponse extends ApiResponse<Message> {}

// Email API
export interface GetEmailsRequest extends PaginationParams {
  folder?: string;
  unreadOnly?: boolean;
  starredOnly?: boolean;
  importantOnly?: boolean;
  search?: string;
}

export interface GetEmailsResponse extends PaginatedResponse<Email> {}

export interface SendEmailRequest {
  receiverId: string;
  subject: string;
  content: string;
  priority?: "low" | "medium" | "high";
  attachments?: File[];
}

export interface SendEmailResponse extends ApiResponse<Email> {}

export interface UpdateEmailRequest {
  starred?: boolean;
  important?: boolean;
  unread?: boolean;
  folder?: string;
}

export interface UpdateEmailResponse extends ApiResponse<Email> {}

// Notification API
export interface GetNotificationsRequest extends PaginationParams {
  unreadOnly?: boolean;
  type?: string;
}

export interface GetNotificationsResponse
  extends PaginatedResponse<Notification> {}

export interface MarkNotificationReadRequest {
  notificationId: string;
}

export interface MarkNotificationReadResponse
  extends ApiResponse<{ success: boolean }> {}

// Flavor API
export interface GetFlavorsRequest extends PaginationParams {
  category?: string;
  available?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface GetFlavorsResponse extends PaginatedResponse<Flavor> {}

export interface GetFlavorResponse extends ApiResponse<Flavor> {}

export interface CreateFlavorRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: Record<string, number>;
  images: File[];
  tags: string[];
}

export interface CreateFlavorResponse extends ApiResponse<Flavor> {}

export interface UpdateFlavorRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: Record<string, number>;
  tags?: string[];
  isAvailable?: boolean;
  stock?: number;
}

export interface UpdateFlavorResponse extends ApiResponse<Flavor> {}

// Order API
export interface GetOrdersRequest extends PaginationParams {
  status?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetOrdersResponse extends PaginatedResponse<Order> {}

export interface CreateOrderRequest {
  items: Array<{
    flavorId: string;
    quantity: number;
    size: "small" | "regular" | "large";
    customizations?: string[];
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: string;
  notes?: string;
}

export interface CreateOrderResponse extends ApiResponse<Order> {}

export interface UpdateOrderStatusRequest {
  status: string;
  notes?: string;
}

export interface UpdateOrderStatusResponse extends ApiResponse<Order> {}

// Store API
export interface GetStoresRequest extends PaginationParams {
  isActive?: boolean;
  city?: string;
  state?: string;
}

export interface GetStoresResponse extends PaginatedResponse<Store> {}

export interface GetStoreResponse extends ApiResponse<Store> {}

export interface CreateStoreRequest {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  managerId: string;
  hours: Record<string, { open: string; close: string; isClosed: boolean }>;
  services: string[];
  capacity: number;
}

export interface CreateStoreResponse extends ApiResponse<Store> {}

// Analytics API
export interface GetAnalyticsRequest {
  period: "day" | "week" | "month" | "quarter" | "year";
  startDate?: string;
  endDate?: string;
  metrics?: string[];
  groupBy?: string;
}

export interface GetAnalyticsResponse extends ApiResponse<AnalyticsData> {}

export interface GetKPIsRequest {
  category?: string;
  period?: string;
  includeTargets?: boolean;
}

export interface GetKPIsResponse extends ApiResponse<KPIData[]> {}

export interface GetChartDataRequest {
  chartType: "line" | "bar" | "pie" | "area";
  period: string;
  metrics: string[];
  groupBy?: string;
}

export interface GetChartDataResponse extends ApiResponse<ChartData> {}

// Dashboard API
export interface GetDashboardDataRequest {
  role: string;
  period?: string;
  includeCharts?: boolean;
  includeKPIs?: boolean;
}

export interface DashboardData {
  kpis: KPIData[];
  charts: ChartData[];
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
  alerts: Array<{
    id: string;
    type: "warning" | "error" | "info";
    message: string;
    action?: string;
    timestamp: string;
  }>;
}

export interface GetDashboardDataResponse extends ApiResponse<DashboardData> {}

// Search API
export interface GlobalSearchRequest {
  query: string;
  types?: string[];
  limit?: number;
}

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface GlobalSearchResponse extends ApiResponse<SearchResult[]> {}

// File upload API
export interface UploadFileRequest {
  file: File;
  category: "avatar" | "product" | "document" | "attachment";
  metadata?: Record<string, unknown>;
}

export interface UploadFileResponse
  extends ApiResponse<{
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
  }> {}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  validationErrors?: ValidationError[];
}
