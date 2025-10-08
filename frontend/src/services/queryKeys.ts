// Standardized query keys for React Query
// This ensures consistent cache invalidation and prevents key mismatches

// Base query key factory
const createQueryKey = (entity: string, ...params: (string | number | boolean | null | undefined)[]) => {
  return [entity, ...params.filter(p => p !== undefined && p !== null)];
};

// ============================================================================
// AUTH QUERY KEYS
// ============================================================================
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
};

// ============================================================================
// USER QUERY KEYS
// ============================================================================
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// ============================================================================
// MESSAGE QUERY KEYS
// ============================================================================
export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messageKeys.conversations(), id] as const,
  messages: (conversationId: string) => [...messageKeys.conversation(conversationId), 'messages'] as const,
  onlineUsers: () => [...messageKeys.all, 'online-users'] as const,
};

// ============================================================================
// EMAIL QUERY KEYS
// ============================================================================
export const emailKeys = {
  all: ['emails'] as const,
  lists: () => [...emailKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...emailKeys.lists(), filters] as const,
  details: () => [...emailKeys.all, 'detail'] as const,
  detail: (id: string) => [...emailKeys.details(), id] as const,
  folders: () => [...emailKeys.all, 'folders'] as const,
  folder: (folder: string) => [...emailKeys.folders(), folder] as const,
};

// ============================================================================
// NOTIFICATION QUERY KEYS
// ============================================================================
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...notificationKeys.lists(), filters] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
  count: () => [...notificationKeys.all, 'count'] as const,
};

// ============================================================================
// FLAVOR QUERY KEYS
// ============================================================================
export const flavorKeys = {
  all: ['flavors'] as const,
  lists: () => [...flavorKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...flavorKeys.lists(), filters] as const,
  details: () => [...flavorKeys.all, 'detail'] as const,
  detail: (id: string) => [...flavorKeys.details(), id] as const,
  categories: () => [...flavorKeys.all, 'categories'] as const,
  popular: () => [...flavorKeys.all, 'popular'] as const,
};

// ============================================================================
// ORDER QUERY KEYS
// ============================================================================
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  user: (userId: string) => [...orderKeys.all, 'user', userId] as const,
  status: (status: string) => [...orderKeys.all, 'status', status] as const,
};

// ============================================================================
// STORE QUERY KEYS
// ============================================================================
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  menu: (id: string) => [...storeKeys.detail(id), 'menu'] as const,
  inventory: (id: string) => [...storeKeys.detail(id), 'inventory'] as const,
  analytics: (id: string) => [...storeKeys.detail(id), 'analytics'] as const,
  reviews: (id: string) => [...storeKeys.detail(id), 'reviews'] as const,
};

// ============================================================================
// ANALYTICS QUERY KEYS
// ============================================================================
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (role: string) => [...analyticsKeys.all, 'dashboard', role] as const,
  kpis: (filters?: Record<string, any>) => [...analyticsKeys.all, 'kpis', filters] as const,
  charts: (type: string, filters?: Record<string, any>) => [...analyticsKeys.all, 'charts', type, filters] as const,
  reports: () => [...analyticsKeys.all, 'reports'] as const,
  report: (id: string) => [...analyticsKeys.reports(), id] as const,
};

// ============================================================================
// SEARCH QUERY KEYS
// ============================================================================
export const searchKeys = {
  all: ['search'] as const,
  global: (query: string, filters?: Record<string, any>) => [...searchKeys.all, 'global', query, filters] as const,
  suggestions: (query: string) => [...searchKeys.all, 'suggestions', query] as const,
};

// ============================================================================
// FILE QUERY KEYS
// ============================================================================
export const fileKeys = {
  all: ['files'] as const,
  uploads: () => [...fileKeys.all, 'uploads'] as const,
  attachments: (conversationId: string) => [...fileKeys.all, 'attachments', conversationId] as const,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Helper to invalidate all queries for an entity
export const invalidateEntityQueries = (entity: string) => {
  return [entity];
};

// Helper to invalidate all list queries for an entity
export const invalidateListQueries = (entity: string) => {
  return [entity, 'list'];
};

// Helper to invalidate all detail queries for an entity
export const invalidateDetailQueries = (entity: string) => {
  return [entity, 'detail'];
};

// Helper to create optimistic update keys
export const createOptimisticKey = (baseKey: readonly unknown[], optimisticId: string) => {
  return [...baseKey, 'optimistic', optimisticId];
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
};

export default queryKeys;
