// Main types barrel export

// Re-export all types from subdirectories
// Import types for type guards
import type {
  User,
  Message,
  Email,
  Flavor,
  Order,
  Store,
  Theme,
  Notification,
} from "./models";

export * from "./common";
export * from "./models";
export * from "./api";
export * from "./components";
export * from "./utils";

// Type guards and utility functions
export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj &&
    "role" in obj
  );
};

export const isMessage = (obj: unknown): obj is Message => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "senderId" in obj &&
    "text" in obj &&
    "read" in obj
  );
};

export const isEmail = (obj: unknown): obj is Email => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "subject" in obj &&
    "senderId" in obj &&
    "receiverId" in obj
  );
};

export const isFlavor = (obj: unknown): obj is Flavor => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "price" in obj &&
    "category" in obj
  );
};

export const isOrder = (obj: unknown): obj is Order => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "userId" in obj &&
    "items" in obj &&
    "total" in obj &&
    "status" in obj
  );
};

// Common type predicates
export const isString = (value: unknown): value is string =>
  typeof value === "string";
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Utility type helpers
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

// Branded types for better type safety
export type Brand<T, B> = T & { __brand: B };
export type UserId = Brand<string, "UserId">;
export type EmailId = Brand<string, "EmailId">;
export type MessageId = Brand<string, "MessageId">;
export type FlavorId = Brand<string, "FlavorId">;
export type OrderId = Brand<string, "OrderId">;
export type StoreId = Brand<string, "StoreId">;

// Environment types
export type Environment = "development" | "staging" | "production";
export type LogLevel = "debug" | "info" | "warn" | "error";

// Feature flags
export type FeatureFlag =
  | "enableChat"
  | "enableNotifications"
  | "enableAnalytics"
  | "enableDarkMode"
  | "enableOfflineMode"
  | "enablePWA";

// Configuration types
export interface AppConfig {
  environment: Environment;
  apiUrl: string;
  wsUrl: string;
  features: Record<FeatureFlag, boolean>;
  logging: {
    level: LogLevel;
    enableConsole: boolean;
    enableRemote: boolean;
  };
  analytics: {
    enableTracking: boolean;
    trackingId?: string;
  };
  storage: {
    enableLocalStorage: boolean;
    enableSessionStorage: boolean;
    enableIndexedDB: boolean;
  };
}

// Event types for better type safety
export interface AppEvent {
  type: string;
  payload: unknown;
  timestamp: number;
  source: string;
}

export interface UserEvent extends AppEvent {
  type: "user.login" | "user.logout" | "user.profile.update";
  payload: {
    userId: string;
    userRole: string;
    metadata?: Record<string, unknown>;
  };
}

export interface OrderEvent extends AppEvent {
  type: "order.created" | "order.updated" | "order.cancelled";
  payload: {
    orderId: string;
    userId: string;
    status: string;
    metadata?: Record<string, unknown>;
  };
}

// State management types
export interface AppState {
  user: {
    current: User | null;
    loading: boolean;
    error: string | null;
  };
  auth: {
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
  };
  ui: {
    theme: Theme;
    sidebarCollapsed: boolean;
    notifications: Notification[];
    loading: Record<string, boolean>;
    errors: Record<string, string>;
  };
  data: {
    flavors: Flavor[];
    orders: Order[];
    stores: Store[];
    messages: Message[];
    emails: Email[];
  };
}

// Action types for state management
export type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; payload: { key: string; loading: boolean } }
  | { type: "SET_ERROR"; payload: { key: string; error: string } }
  | { type: "CLEAR_ERROR"; payload: string }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "MARK_NOTIFICATION_READ"; payload: string };

// Hook return types
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refetch: () => Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: React.FormEvent) => void;
  reset: () => void;
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count";
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface PerformanceEntry {
  id: string;
  type: "navigation" | "resource" | "measure" | "paint";
  name: string;
  startTime: number;
  duration: number;
  metadata?: Record<string, unknown>;
}
