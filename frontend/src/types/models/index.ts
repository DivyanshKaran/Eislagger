// Data models and entity types

import type React from "react";

import type {
  BaseEntity,
  UserRole,
  Status,
  Priority,
} from "../common";

// Re-export common types
export type { BaseEntity, Timestamped, UserRole, Status, Priority } from "../common";

// User model
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: Status;
  avatar?: string;
  phone?: string;
  address?: string;
  preferences?: UserPreferences;
}

export type Theme = "light" | "dark" | "system";

export interface UserPreferences {
  theme: Theme;
  notifications: NotificationSettings;
  language: string;
  timezone: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

// Message model
export interface Message extends BaseEntity {
  senderId: string;
  senderRole: UserRole;
  receiverId?: string;
  receiverRole?: UserRole;
  text: string;
  read: boolean;
  messageType: "text" | "image" | "file" | "system";
  metadata?: Record<string, unknown>;
}

// Email model
export interface Email extends BaseEntity {
  folder: string;
  subject: string;
  senderId: string;
  receiverId: string;
  content: string;
  tags: string[];
  unread: boolean;
  starred: boolean;
  important: boolean;
  priority: Priority;
  attachments?: EmailAttachment[];
  metadata?: Record<string, unknown>;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

// Notification model
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: Priority;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export type NotificationType =
  | "order_update"
  | "payment_received"
  | "stock_alert"
  | "system_maintenance"
  | "promotion"
  | "review_request"
  | "general";

// Product/Flavor model
export interface Flavor extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: NutritionalInfo;
  images: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  stock: number;
  tags: string[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
}

// Order model
export interface Order extends BaseEntity {
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderItem {
  flavorId: string;
  quantity: number;
  price: number;
  size: "small" | "regular" | "large";
  customizations?: string[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Store model
export interface Store extends BaseEntity {
  name: string;
  address: Address;
  phone: string;
  email: string;
  managerId: string;
  hours: StoreHours;
  services: StoreService[];
  isActive: boolean;
  capacity: number;
  currentOccupancy: number;
}

export interface StoreHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export type StoreService =
  | "dine_in"
  | "takeout"
  | "delivery"
  | "drive_through"
  | "catering"
  | "events";

// Analytics models
export interface AnalyticsData {
  period: string;
  metrics: Record<string, number>;
  trends: TrendData[];
  breakdown: Record<string, number>;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

// KPI model
export interface KPIData {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  target?: number;
  unit: string;
  description?: string;
  category: string;
  priority: Priority;
  lastUpdated: string;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  trend?: number[];
  period?: string;
  progress?: number;
}

// Chart data models
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

// Table models
export interface TableColumn<T = unknown> {
  key: keyof T;
  title: string;
  dataIndex: keyof T;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filterable?: boolean;
  width?: number;
  align?: "left" | "center" | "right";
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (record: T) => void;
  rowKey?: keyof T;
}

// Search and filter models
// SearchParams is defined in common

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

// Form models
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  required?: boolean;
  placeholder?: string;
  options?: FilterOption[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern";
  value?: string | number;
  message: string;
}
