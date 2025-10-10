// Domain-specific DataService with typed methods for all entities
import HttpClient from './httpClient';
import type { ApiResponse, PaginatedResponse } from '@/types/common';
import type {
  // Auth API types
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthResponse,
  GetProfileResponse,
  
  // User API types
  GetUsersRequest,
  GetUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  
  // Message API types
  GetMessagesRequest,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  
  // Email API types
  GetEmailsRequest,
  GetEmailsResponse,
  SendEmailRequest,
  SendEmailResponse,
  UpdateEmailRequest,
  UpdateEmailResponse,
  
  // Notification API types
  GetNotificationsRequest,
  GetNotificationsResponse,
  MarkNotificationReadRequest,
  MarkNotificationReadResponse,
  
  // Flavor API types
  GetFlavorsRequest, 
  GetFlavorsResponse, 
  GetFlavorResponse,
  CreateFlavorRequest, 
  CreateFlavorResponse, 
  UpdateFlavorRequest, 
  UpdateFlavorResponse,
  
  // Order API types
  GetOrdersRequest,
  GetOrdersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  
  // Store API types
  GetStoresRequest, 
  GetStoresResponse, 
  GetStoreResponse,
  CreateStoreRequest, 
  CreateStoreResponse,
  
  // Analytics API types
  GetAnalyticsRequest,
  GetAnalyticsResponse,
  GetKPIsRequest,
  GetKPIsResponse,
  GetChartDataRequest,
  GetChartDataResponse,
  GetDashboardDataRequest,
  GetDashboardDataResponse,
  
  // Search API types
  GlobalSearchRequest,
  GlobalSearchResponse,
  
  // File upload API types
  UploadFileRequest,
  UploadFileResponse,
} from '@/types/api/index';

import type {
  User,
  Message,
  Email,
  Notification,
  Flavor,
  Order,
  Store,
  KPIData,
  ChartData,
} from '@/types/models';
import type { DashboardData, SearchResult } from '@/types/api/index';

// API Configuration
const API_BASE_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3002/api/v1",
  sales: process.env.NEXT_PUBLIC_SALES_SERVICE_URL || "http://localhost:3004/api/v1",
  inventory: process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL || "http://localhost:3003/api/v1",
  admin: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || "http://localhost:3001/api/v1",
  communications: process.env.NEXT_PUBLIC_COMMUNICATIONS_SERVICE_URL || "http://localhost:3005/api/v1",
  analytics: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || "http://localhost:3006/api/v1",
};

// Initialize HTTP clients for each service
const authClient = new HttpClient({ baseUrl: API_BASE_URLS.auth });
const salesClient = new HttpClient({ baseUrl: API_BASE_URLS.sales });
const inventoryClient = new HttpClient({ baseUrl: API_BASE_URLS.inventory });
const adminClient = new HttpClient({ baseUrl: API_BASE_URLS.admin });
const communicationsClient = new HttpClient({ baseUrl: API_BASE_URLS.communications });
const analyticsClient = new HttpClient({ baseUrl: API_BASE_URLS.analytics });

// Group all clients for token management
const allClients = [
  authClient,
  salesClient,
  inventoryClient,
  adminClient,
  communicationsClient,
  analyticsClient,
];

// Function to set token on all clients
export const setAuthTokenOnAllClients = (token: string | null) => {
  for (const client of allClients) {
    client.setAuthToken(token);
  }
};

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================
export const authService = {
  // Login
  login: (data: LoginRequest): Promise<AuthResponse> =>
    authClient.post<LoginRequest, LoginResponse>('/auth/login', data),
    
  // Register
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    authClient.post<RegisterRequest, LoginResponse>('/auth/register', data),
    
  // Logout
  logout: (): Promise<AuthResponse> =>
    authClient.post('/auth/logout'),
    
  // Get current user profile
  getProfile: (): Promise<GetProfileResponse> =>
    authClient.get<User>('/auth/me'),
    
  // Verify email
  verifyEmail: (): Promise<AuthResponse> =>
    authClient.post('/auth/verify'),
    
  // Update profile
  updateProfile: (data: UpdateUserRequest): Promise<UpdateUserResponse> =>
    authClient.put<UpdateUserRequest, User>('/auth/profile', data),
    
  // Change password
  changePassword: (currentPassword: string, newPassword: string): Promise<AuthResponse> =>
    authClient.put('/auth/change-password', { currentPassword, newPassword }),
};

// ============================================================================
// USER SERVICE
// ============================================================================
export const userService = {
  // Get all users (admin only)
  getUsers: (params?: GetUsersRequest): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return adminClient.get<PaginatedResponse<User>>(endpoint);
  },
    
  // Get user by ID
  getUser: (id: string): Promise<ApiResponse<User>> =>
    adminClient.get<User>(`/users/${id}`),
    
  // Create user (admin only)
  createUser: (data: RegisterRequest): Promise<ApiResponse<User>> =>
    adminClient.post<RegisterRequest, User>('/users', data),
    
  // Update user
  updateUser: (id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> =>
    adminClient.put<UpdateUserRequest, User>(`/users/${id}`, data),
    
  // Delete user (admin only)
  deleteUser: (id: string): Promise<AuthResponse> =>
    adminClient.delete(`/users/${id}`),
};

// ============================================================================
// MESSAGE SERVICE
// ============================================================================
export const messageService = {
  // Get messages
  getMessages: (params?: GetMessagesRequest): Promise<ApiResponse<PaginatedResponse<Message>>> =>
    communicationsClient.get<PaginatedResponse<Message>>('/chat/conversations'),
    
  // Get conversation messages
  getConversationMessages: (conversationId: string): Promise<ApiResponse<PaginatedResponse<Message>>> =>
    communicationsClient.get<PaginatedResponse<Message>>(`/chat/conversations/${conversationId}/messages`),
    
  // Send message
  sendMessage: (conversationId: string, data: SendMessageRequest): Promise<SendMessageResponse> =>
    communicationsClient.post<SendMessageRequest, Message>(`/chat/conversations/${conversationId}/messages`, data),
    
  // Mark message as read
  markMessageAsRead: (messageId: string): Promise<AuthResponse> =>
    communicationsClient.post(`/chat/messages/${messageId}/read`),
    
  // Get online users
  getOnlineUsers: (): Promise<ApiResponse<User[]>> =>
    communicationsClient.get<User[]>('/chat/online-users'),
};

// ============================================================================
// EMAIL SERVICE
// ============================================================================
export const emailService = {
  // Get emails
  getEmails: (params?: GetEmailsRequest): Promise<ApiResponse<PaginatedResponse<Email>>> =>
    communicationsClient.get<PaginatedResponse<Email>>('/emails'),
    
  // Get email by ID
  getEmail: (id: string): Promise<ApiResponse<Email>> =>
    communicationsClient.get<Email>(`/emails/${id}`),
    
  // Send email
  sendEmail: (data: SendEmailRequest): Promise<SendEmailResponse> =>
    communicationsClient.post<SendEmailRequest, Email>('/emails', data),
    
  // Update email (mark as read, star, etc.)
  updateEmail: (id: string, data: UpdateEmailRequest): Promise<UpdateEmailResponse> =>
    communicationsClient.put<UpdateEmailRequest, Email>(`/emails/${id}`, data),
    
  // Mark email as read
  markEmailAsRead: (id: string): Promise<AuthResponse> =>
    communicationsClient.put(`/emails/${id}/read`),
    
  // Star/unstar email
  starEmail: (id: string): Promise<AuthResponse> =>
    communicationsClient.put(`/emails/${id}/star`),
    
  // Reply to email
  replyToEmail: (id: string, content: string): Promise<SendEmailResponse> =>
    communicationsClient.post(`/emails/${id}/reply`, { content }),
};

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================
export const notificationService = {
  // Get notifications
  getNotifications: (params?: GetNotificationsRequest): Promise<ApiResponse<PaginatedResponse<Notification>>> =>
    communicationsClient.get<PaginatedResponse<Notification>>('/notifications'),
    
  // Create notification
  createNotification: (data: Partial<Notification>): Promise<ApiResponse<Notification>> =>
    communicationsClient.post<Partial<Notification>, Notification>('/notifications', data),
    
  // Mark notification as read
  markNotificationAsRead: (id: string): Promise<MarkNotificationReadResponse> =>
    communicationsClient.put<MarkNotificationReadRequest, { success: boolean }>(`/notifications/${id}/read`, { notificationId: id }),
    
  // Delete notification
  deleteNotification: (id: string): Promise<AuthResponse> =>
    communicationsClient.delete(`/notifications/${id}`),
    
  // Mark all notifications as read
  markAllNotificationsAsRead: (): Promise<AuthResponse> =>
    communicationsClient.post('/notifications/mark-all'),
};

// ============================================================================
// FLAVOR SERVICE
// ============================================================================
export const flavorService = {
  // Get all flavors
  getFlavors: (params?: GetFlavorsRequest): Promise<ApiResponse<PaginatedResponse<Flavor>>> =>
    inventoryClient.get<PaginatedResponse<Flavor>>('/flavors'),
    
  // Get flavor by ID
  getFlavor: (id: string): Promise<ApiResponse<Flavor>> =>
    inventoryClient.get<Flavor>(`/flavors/${id}`),
    
  // Create flavor (manufacturer/admin only)
  createFlavor: (data: CreateFlavorRequest): Promise<CreateFlavorResponse> =>
    inventoryClient.post<CreateFlavorRequest, Flavor>('/flavors', data),
    
  // Update flavor
  updateFlavor: (id: string, data: UpdateFlavorRequest): Promise<UpdateFlavorResponse> =>
    inventoryClient.put<UpdateFlavorRequest, Flavor>(`/flavors/${id}`, data),
    
  // Delete flavor (manufacturer/admin only)
  deleteFlavor: (id: string): Promise<AuthResponse> =>
    inventoryClient.delete(`/flavors/${id}`),
};

// ============================================================================
// ORDER SERVICE
// ============================================================================
export const orderService = {
  // Get orders
  getOrders: (params?: GetOrdersRequest): Promise<ApiResponse<PaginatedResponse<Order>>> =>
    salesClient.get<PaginatedResponse<Order>>('/orders'),
    
  // Get order by ID
  getOrder: (id: string): Promise<ApiResponse<Order>> =>
    salesClient.get<Order>(`/orders/${id}`),
    
  // Create order
  createOrder: (data: CreateOrderRequest): Promise<CreateOrderResponse> =>
    salesClient.post<CreateOrderRequest, Order>('/orders', data),
    
  // Update order status
  updateOrderStatus: (id: string, data: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> =>
    salesClient.put<UpdateOrderStatusRequest, Order>(`/orders/${id}/status`, data),
    
  // Cancel order
  cancelOrder: (id: string): Promise<AuthResponse> =>
    salesClient.delete(`/orders/${id}`),
};

// ============================================================================
// STORE SERVICE
// ============================================================================
export const storeService = {
  // Get all stores
  getStores: (params?: GetStoresRequest): Promise<ApiResponse<PaginatedResponse<Store>>> =>
    salesClient.get<PaginatedResponse<Store>>('/shops'),
    
  // Get store by ID
  getStore: (id: string): Promise<ApiResponse<Store>> =>
    salesClient.get<Store>(`/shops/${id}`),
    
  // Create store (executive only)
  createStore: (data: CreateStoreRequest): Promise<CreateStoreResponse> =>
    salesClient.post<CreateStoreRequest, Store>('/shops', data),
    
  // Update store (executive only)
  updateStore: (id: string, data: Partial<CreateStoreRequest>): Promise<CreateStoreResponse> =>
    salesClient.put<Partial<CreateStoreRequest>, Store>(`/shops/${id}`, data),
    
  // Delete store (executive only)
  deleteStore: (id: string): Promise<AuthResponse> =>
    salesClient.delete(`/shops/${id}`),
    
  // Get store menu
  getStoreMenu: (id: string): Promise<AuthResponse> =>
    salesClient.get(`/shops/${id}/menu`),
    
  // Get store inventory
  getStoreInventory: (id: string): Promise<AuthResponse> =>
    salesClient.get(`/shops/${id}/inventory`),
    
  // Get store analytics
  getStoreAnalytics: (id: string): Promise<AuthResponse> =>
    salesClient.get(`/shops/${id}/analytics`),
};

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================
export const analyticsService = {
  // Get analytics data
  getAnalytics: (params: GetAnalyticsRequest): Promise<GetAnalyticsResponse> =>
    analyticsClient.get('/analytics', {
    }),
    
  // Get KPIs
  getKPIs: (params?: GetKPIsRequest): Promise<GetKPIsResponse> =>
    analyticsClient.get<KPIData[]>('/kpis', {
    }),
    
  // Get chart data
  getChartData: (params: GetChartDataRequest): Promise<GetChartDataResponse> =>
    analyticsClient.get<ChartData>('/charts', {
    }),
    
  // Get dashboard data
  getDashboardData: (params: GetDashboardDataRequest): Promise<GetDashboardDataResponse> =>
    analyticsClient.get<DashboardData>('/dashboard', {
    }),
};

// ============================================================================
// SEARCH SERVICE
// ============================================================================
export const searchService = {
  // Global search
  globalSearch: (params: GlobalSearchRequest): Promise<GlobalSearchResponse> =>
    adminClient.get<SearchResult[]>('/search', {
    }),
};

// ============================================================================
// FILE UPLOAD SERVICE
// ============================================================================
export const fileService = {
  // Upload file
  uploadFile: (data: UploadFileRequest): Promise<UploadFileResponse> =>
    adminClient.upload<{ id: string; url: string; filename: string; size: number; type: string }>('/upload', data.file, data.metadata),
    
  // Upload chat attachment
  uploadChatAttachment: (file: File, conversationId: string): Promise<UploadFileResponse> =>
    communicationsClient.upload<{ id: string; url: string; filename: string; size: number; type: string }>('/upload/chat-attachments', file, { conversationId }),
};

// Export all services
export const dataService = {
  auth: authService,
  user: userService,
  message: messageService,
  email: emailService,
  notification: notificationService,
  flavor: flavorService,
  order: orderService,
  store: storeService,
  analytics: analyticsService,
  search: searchService,
  file: fileService,
};

export default dataService;
