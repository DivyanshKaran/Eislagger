// Common utility types and shared definitions

// Base types
export type ID = string | number;

// User roles
export type UserRole = "executive" | "manufacturer" | "clerk" | "patron";

// Status types
export type Status = "online" | "idle" | "dnd" | "offline";
export type Priority = "low" | "medium" | "high" | "urgent";
export type LoadingState = "idle" | "loading" | "success" | "error";

// Common entity properties
export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search parameters
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form states
export interface FormState {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

// Component common props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Size variants
export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type Color =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

// Theme is defined in models/index.ts

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event handlers
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Generic function types
export type AsyncFunction<T = unknown, R = unknown> = (args: T) => Promise<R>;
export type SyncFunction<T = unknown, R = unknown> = (args: T) => R;
