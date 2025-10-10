// React Query keys for caching and invalidation
import type { 
  GetUsersRequest,
  GetMessagesRequest,
  GetEmailsRequest,
  GetNotificationsRequest,
  GetFlavorsRequest,
  GetOrdersRequest,
  GetStoresRequest,
  GetAnalyticsRequest,
  GetKPIsRequest,
  GetChartDataRequest,
  GetDashboardDataRequest,
  GlobalSearchRequest
} from '@/types/api/index';

// ============================================================================
// AUTH QUERY KEYS
// ============================================================================
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  register: () => [...authKeys.all, 'register'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
};

// ============================================================================
// USER QUERY KEYS
// ============================================================================
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: GetUsersRequest) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// ============================================================================
// MESSAGE QUERY KEYS
// ============================================================================
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (params?: GetMessagesRequest) => [...messageKeys.lists(), params] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messageKeys.conversations(), id] as const,
  onlineUsers: () => [...messageKeys.all, 'online'] as const,
};

// ============================================================================
// EMAIL QUERY KEYS
// ============================================================================
export const emailKeys = {
  all: ['emails'] as const,
  lists: () => [...emailKeys.all, 'list'] as const,
  list: (params?: GetEmailsRequest) => [...emailKeys.lists(), params] as const,
  details: () => [...emailKeys.all, 'detail'] as const,
  detail: (id: string) => [...emailKeys.details(), id] as const,
  unread: () => [...emailKeys.all, 'unread'] as const,
  starred: () => [...emailKeys.all, 'starred'] as const,
  category: (category: string) => [...emailKeys.all, 'category', category] as const,
};

// ============================================================================
// NOTIFICATION QUERY KEYS
// ============================================================================
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: GetNotificationsRequest) => [...notificationKeys.lists(), params] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
  recent: () => [...notificationKeys.all, 'recent'] as const,
  type: (type: string) => [...notificationKeys.all, 'type', type] as const,
};

// ============================================================================
// FLAVOR QUERY KEYS
// ============================================================================
export const flavorKeys = {
  all: ['flavors'] as const,
  lists: () => [...flavorKeys.all, 'list'] as const,
  list: (params?: GetFlavorsRequest) => [...flavorKeys.lists(), params] as const,
  details: () => [...flavorKeys.all, 'detail'] as const,
  detail: (id: string) => [...flavorKeys.details(), id] as const,
  categories: () => [...flavorKeys.all, 'categories'] as const,
  popular: () => [...flavorKeys.all, 'popular'] as const,
  search: (term: string) => [...flavorKeys.all, 'search', term] as const,
};

// ============================================================================
// ORDER QUERY KEYS
// ============================================================================
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params?: GetOrdersRequest) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  recent: () => [...orderKeys.all, 'recent'] as const,
  status: (status: string) => [...orderKeys.all, 'status', status] as const,
  user: (userId: string) => [...orderKeys.all, 'user', userId] as const,
};

// ============================================================================
// STORE QUERY KEYS
// ============================================================================
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (params?: GetStoresRequest) => [...storeKeys.lists(), params] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  menu: (id: string) => [...storeKeys.detail(id), 'menu'] as const,
  inventory: (id: string) => [...storeKeys.detail(id), 'inventory'] as const,
  analytics: (id: string) => [...storeKeys.detail(id), 'analytics'] as const,
  nearby: (lat: number, lng: number) => [...storeKeys.all, 'nearby', lat, lng] as const,
  reviews: (id: string) => [...storeKeys.detail(id), 'reviews'] as const,
};

// ============================================================================
// ANALYTICS QUERY KEYS
// ============================================================================
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (params?: GetDashboardDataRequest) => [...analyticsKeys.all, 'dashboard', params] as const,
  kpis: (params?: GetKPIsRequest) => [...analyticsKeys.all, 'kpis', params] as const,
  charts: (params?: GetChartDataRequest) => [...analyticsKeys.all, 'charts', params] as const,
  reports: (params?: GetAnalyticsRequest) => [...analyticsKeys.all, 'reports', params] as const,
  sales: () => [...analyticsKeys.all, 'sales'] as const,
  inventory: () => [...analyticsKeys.all, 'inventory'] as const,
  users: () => [...analyticsKeys.all, 'users'] as const,
  trends: (period: string) => [...analyticsKeys.all, 'trends', period] as const,
};

// ============================================================================
// SEARCH QUERY KEYS
// ============================================================================
export const searchKeys = {
  all: ['search'] as const,
  global: (params?: GlobalSearchRequest) => [...searchKeys.all, 'global', params] as const,
  suggestions: (term: string) => [...searchKeys.all, 'suggestions', term] as const,
  history: () => [...searchKeys.all, 'history'] as const,
};

// ============================================================================
// FILE QUERY KEYS
// ============================================================================
export const fileKeys = {
  all: ['files'] as const,
  upload: () => [...fileKeys.all, 'upload'] as const,
  chatAttachments: (conversationId: string) => [...fileKeys.all, 'chat', conversationId] as const,
};

// ============================================================================
// CART QUERY KEYS
// ============================================================================
export const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  total: () => [...cartKeys.all, 'total'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
};

// ============================================================================
// DASHBOARD QUERY KEYS
// ============================================================================
export const dashboardKeys = {
  all: ['dashboard'] as const,
  patron: () => [...dashboardKeys.all, 'patron'] as const,
  clerk: () => [...dashboardKeys.all, 'clerk'] as const,
  manufacturer: () => [...dashboardKeys.all, 'manufacturer'] as const,
  executive: () => [...dashboardKeys.all, 'executive'] as const,
  stats: (role: string) => [...dashboardKeys.all, 'stats', role] as const,
  recent: (role: string) => [...dashboardKeys.all, 'recent', role] as const,
};

// ============================================================================
// INVENTORY QUERY KEYS
// ============================================================================
export const inventoryKeys = {
  all: ['inventory'] as const,
  stock: () => [...inventoryKeys.all, 'stock'] as const,
  items: () => [...inventoryKeys.all, 'items'] as const,
  suppliers: () => [...inventoryKeys.all, 'suppliers'] as const,
  invoices: () => [...inventoryKeys.all, 'invoices'] as const,
  lowStock: () => [...inventoryKeys.all, 'low-stock'] as const,
  expiring: () => [...inventoryKeys.all, 'expiring'] as const,
  // Helpers for details/lists consistency used in hooks
  detail: (id: string) => [...inventoryKeys.all, 'detail', id] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
};

// ============================================================================
// SALES QUERY KEYS
// ============================================================================
export const salesKeys = {
  all: ['sales'] as const,
  transactions: () => [...salesKeys.all, 'transactions'] as const,
  revenue: () => [...salesKeys.all, 'revenue'] as const,
  topProducts: () => [...salesKeys.all, 'top-products'] as const,
  trends: () => [...salesKeys.all, 'trends'] as const,
  reports: () => [...salesKeys.all, 'reports'] as const,
};

// ============================================================================
// COMMUNICATION QUERY KEYS
// ============================================================================
export const communicationKeys = {
  all: ['communication'] as const,
  messages: () => [...communicationKeys.all, 'messages'] as const,
  emails: () => [...communicationKeys.all, 'emails'] as const,
  notifications: () => [...communicationKeys.all, 'notifications'] as const,
  announcements: () => [...communicationKeys.all, 'announcements'] as const,
};

// Export all keys for easy access
export const queryKeys = {
  auth: authKeys,
  user: userKeys,
  message: messageKeys,
  email: emailKeys,
  notification: notificationKeys,
  flavor: flavorKeys,
  order: orderKeys,
  store: storeKeys,
  analytics: analyticsKeys,
  search: searchKeys,
  file: fileKeys,
  cart: cartKeys,
  dashboard: dashboardKeys,
  inventory: inventoryKeys,
  sales: salesKeys,
  communication: communicationKeys,
};