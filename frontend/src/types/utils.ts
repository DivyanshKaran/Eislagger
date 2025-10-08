// Utility types for reducing duplication

import type { UserRole, Status, Priority, Size, Color } from "./common";
import type {
  User,
  Message,
  Email,
  Notification,
  Flavor,
  Order,
  Store,
  KPIData,
  BaseEntity,
  Timestamped,
} from "./models";
import type { RequiredFields } from "./common";

// Entity utility types
export type CreateEntity<T extends BaseEntity> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateEntity<T extends BaseEntity> = Partial<
  Omit<T, "id" | "createdAt" | "updatedAt">
>;
export type EntityId<T extends BaseEntity> = T["id"];

// User utility types
export type CreateUser = CreateEntity<User>;
export type UpdateUser = UpdateEntity<User>;
export type UserId = EntityId<User>;
export type UserSummary = Pick<
  User,
  "id" | "name" | "email" | "role" | "status" | "avatar"
>;
export type UserProfile = Pick<
  User,
  "id" | "name" | "email" | "phone" | "address" | "preferences"
>;

// Message utility types
export type CreateMessage = CreateEntity<Message>;
export type UpdateMessage = UpdateEntity<Message>;
export type MessageId = EntityId<Message>;
export type MessageSummary = Pick<Message, "id" | "senderId" | "text" | "read">;
export type UnreadMessage = RequiredFields<Message, "read"> & { read: false };

// Email utility types
export type CreateEmail = CreateEntity<Email>;
export type UpdateEmail = UpdateEntity<Email>;
export type EmailId = EntityId<Email>;
export type EmailSummary = Pick<
  Email,
  "id" | "subject" | "senderId" | "unread" | "starred"
>;
export type UnreadEmail = RequiredFields<Email, "unread"> & { unread: true };
export type StarredEmail = RequiredFields<Email, "starred"> & { starred: true };

// Notification utility types
export type CreateNotification = CreateEntity<Notification>;
export type UpdateNotification = UpdateEntity<Notification>;
export type NotificationId = EntityId<Notification>;
export type NotificationSummary = Pick<
  Notification,
  "id" | "type" | "title" | "read" | "priority"
>;
export type UnreadNotification = RequiredFields<Notification, "read"> & {
  read: false;
};

// Flavor utility types
export type CreateFlavor = CreateEntity<Flavor>;
export type UpdateFlavor = UpdateEntity<Flavor>;
export type FlavorId = EntityId<Flavor>;
export type FlavorSummary = Pick<
  Flavor,
  "id" | "name" | "price" | "category" | "rating" | "isAvailable"
>;
export type AvailableFlavor = RequiredFields<
  Flavor,
  "isAvailable" | "stock"
> & {
  isAvailable: true;
  stock: number;
};

// Order utility types
export type CreateOrder = CreateEntity<Order>;
export type UpdateOrder = UpdateEntity<Order>;
export type OrderId = EntityId<Order>;
export type OrderSummary = Pick<
  Order,
  "id" | "userId" | "total" | "status" | "createdAt"
>;
// OrderItem is defined in models
export type PendingOrder = RequiredFields<Order, "status"> & {
  status: "pending";
};
export type CompletedOrder = RequiredFields<Order, "status"> & {
  status: "delivered";
};

// Store utility types
export type CreateStore = CreateEntity<Store>;
export type UpdateStore = UpdateEntity<Store>;
export type StoreId = EntityId<Store>;
export type StoreSummary = Pick<
  Store,
  "id" | "name" | "address" | "phone" | "isActive"
>;
export type ActiveStore = RequiredFields<Store, "isActive"> & {
  isActive: true;
};

// KPI utility types
export type CreateKPI = Omit<KPIData, "id" | "lastUpdated">;
export type UpdateKPI = Partial<Omit<KPIData, "id" | "lastUpdated">>;
export type KPIId = KPIData["id"];
export type KPISummary = Pick<
  KPIData,
  "id" | "title" | "value" | "change" | "changeType" | "unit"
>;
export type HighPriorityKPI = RequiredFields<KPIData, "priority"> & {
  priority: "high";
};

// Component utility types
export type ComponentProps<T> =
  T extends React.ComponentType<infer P> ? P : never;
export type ComponentRef<T> =
  T extends React.ForwardRefExoticComponent<infer P>
    ? P extends { ref?: infer R }
      ? R
      : never
    : never;

// Form utility types
export type FormValues<T> = {
  [K in keyof T]: T[K] extends string | number | boolean | null | undefined
    ? T[K]
    : never;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

// API utility types
export type ApiRequest<T = unknown> = {
  data: T;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};

// ApiResponse is defined in common

export type PaginatedRequest = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, unknown>;
};

// State utility types
export type LoadingStateType<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type AsyncState<T> = LoadingStateType<T> & {
  refetch: () => Promise<void>;
  reset: () => void;
};

// Event utility types
// EventHandler is defined in common
// AsyncEventHandler is defined in common
export type ChangeHandler<T = string> = (value: T) => void;
export type ClickHandler = () => void;

// Filter utility types
// FilterOption is defined in models

export type FilterState<T = Record<string, unknown>> = {
  filters: T;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
};

// Table utility types
// TableColumn is defined in models

export type TableAction<T = unknown> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: (record: T) => boolean;
  visible?: (record: T) => boolean;
};

// Chart utility types
export type ChartDataPoint = {
  name: string;
  value: number;
  [key: string]: unknown;
};

// ChartDataset is defined in models

// ChartData is defined in models

// Theme utility types
export type ThemeColors = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;
};

export type ThemeConfig = {
  colors: ThemeColors;
  spacing: Record<Size, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<Size, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<Size, string>;
  };
  borderRadius: Record<Size, string>;
  shadows: Record<Size, string>;
  transitions: {
    duration: Record<Size, string>;
    easing: Record<string, string>;
  };
};

// Validation utility types
// ValidationRule is defined in models

export type ValidationSchema<T = Record<string, unknown>> = {
  [K in keyof T]?: Array<{
    type: "required" | "email" | "min" | "max" | "pattern";
    value?: string | number;
    message: string;
  }>;
};

// Permission utility types
export type Permission =
  | "read:users"
  | "write:users"
  | "delete:users"
  | "read:orders"
  | "write:orders"
  | "delete:orders"
  | "read:flavors"
  | "write:flavors"
  | "delete:flavors"
  | "read:analytics"
  | "write:analytics"
  | "read:reports"
  | "write:reports";

export type RolePermissions = {
  [K in UserRole]: Permission[];
};

// Feature flag utility types
export type FeatureFlag =
  | "enableChat"
  | "enableNotifications"
  | "enableAnalytics"
  | "enableDarkMode"
  | "enableOfflineMode"
  | "enablePWA"
  | "enableAdvancedSearch"
  | "enableBulkActions"
  | "enableExport"
  | "enableImport";

export type FeatureFlags = {
  [K in FeatureFlag]: boolean;
};

// Error utility types
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND_ERROR"
  | "CONFLICT_ERROR"
  | "RATE_LIMIT_ERROR"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export type AppError = {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  stack?: string;
};

// Performance utility types
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count";
  timestamp: number;
  metadata?: Record<string, unknown>;
};

export type PerformanceEntry = {
  id: string;
  type: "navigation" | "resource" | "measure" | "paint";
  name: string;
  startTime: number;
  duration: number;
  metadata?: Record<string, unknown>;
};

// Storage utility types
export type StorageKey =
  | "user_preferences"
  | "theme_settings"
  | "sidebar_state"
  | "table_filters"
  | "search_history"
  | "recent_items"
  | "draft_messages"
  | "offline_data";

export type StorageValue<T = unknown> = {
  data: T;
  timestamp: number;
  version: string;
  expires?: number;
};

// Cache utility types
export type CacheKey = string;
export type CacheValue<T = unknown> = {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
};

export type CacheOptions = {
  ttl?: number;
  tags?: string[];
  staleWhileRevalidate?: boolean;
  backgroundRefresh?: boolean;
};
