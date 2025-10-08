// Component prop types and interfaces

import type { ReactNode } from "react";

import type {
  BaseComponentProps,
  Size,
  Color,
  // Theme is defined in models
  LoadingState,
  Optional,
  RequiredFields,
} from "../common";
import type {
  User,
  Message,
  Email,
  Notification,
  Flavor,
  Order,
  KPIData,
  TableColumn,
  TableProps,
} from "../models";

// Base component props
export interface BaseProps extends BaseComponentProps {
  id?: string;
  "data-testid"?: string;
}

// Loading component props
export interface LoadingSpinnerProps extends BaseProps {
  size?: Size;
  text?: string;
  fullScreen?: boolean;
}

export interface SkeletonProps extends BaseProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "rectangular" | "circular";
  animation?: "pulse" | "wave" | "none";
}

// Button component props
export interface ButtonProps extends BaseProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: ReactNode;
}

// Input component props
export interface InputProps extends BaseProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// Card component props
export interface CardProps extends BaseProps {
  variant?: "default" | "outlined" | "elevated";
  padding?: Size;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends BaseProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface CardContentProps extends BaseProps {}

export interface CardFooterProps extends BaseProps {
  justify?: "start" | "center" | "end" | "between";
}

// Badge component props
export interface BadgeProps extends BaseProps {
  variant?: Color;
  size?: Size;
  dot?: boolean;
  children: ReactNode;
}

// Avatar component props
export interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  size?: Size;
  fallback?: string;
  status?: "online" | "offline" | "away" | "busy";
}

// Modal/Dialog component props
export interface ModalProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
}

// Dropdown component props
export interface DropdownProps extends BaseProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

export interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: DropdownItem[];
}

// Form component props
export interface FormProps extends BaseProps {
  onSubmit: (values: Record<string, unknown>) => void;
  initialValues?: Record<string, unknown>;
  validationSchema?: Record<string, unknown>;
  loading?: boolean;
}

export interface FormFieldProps extends BaseProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

// Table component props
export interface DataTableProps<T = unknown> extends BaseProps, TableProps<T> {
  loading?: boolean;
  emptyText?: string;
  rowSelection?: {
    type: "checkbox" | "radio";
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
}

// Chart component props
export interface ChartProps extends BaseProps {
  type: "line" | "bar" | "pie" | "area" | "scatter";
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }>;
  };
  options?: Record<string, unknown>;
  height?: number;
  responsive?: boolean;
}

// KPI Card component props
export interface KPICardProps extends BaseProps {
  kpi: KPIData;
  isExpanded?: boolean;
  isLoading?: boolean;
  onToggleExpanded?: () => void;
  onRefresh?: () => void;
  onDownload?: () => void;
}

// Dashboard component props
export interface DashboardProps extends BaseProps {
  role: string;
  title?: string;
  subtitle?: string;
  layout?: "grid" | "list";
  showFilters?: boolean;
  showSearch?: boolean;
}

// Sidebar component props
export interface SidebarProps extends BaseProps {
  role: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  theme?: "light" | "dark" | "system";
  onThemeToggle?: () => void;
}

export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: string;
  disabled?: boolean;
  children?: SidebarItem[];
}

// Navigation component props
export interface NavbarProps extends BaseProps {
  user?: User;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

// Chat component props
export interface ChatProps extends BaseProps {
  conversationId?: string;
  participants: User[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onLoadMore?: () => void;
  loading?: boolean;
}

export interface MessageBubbleProps extends BaseProps {
  message: Message;
  sender: User;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

// Email component props
export interface EmailListProps extends BaseProps {
  emails: Email[];
  selectedEmails: string[];
  onSelectEmail: (emailId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onMarkAsRead: (emailIds: string[]) => void;
  onMarkAsUnread: (emailIds: string[]) => void;
  onDelete: (emailIds: string[]) => void;
  loading?: boolean;
}

export interface EmailItemProps extends BaseProps {
  email: Email;
  selected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onDelete: () => void;
  onStar: () => void;
}

// Notification component props
export interface NotificationListProps extends BaseProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: string) => void;
  loading?: boolean;
}

export interface NotificationItemProps extends BaseProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

// Product/Flavor component props
export interface FlavorCardProps extends BaseProps {
  flavor: Flavor;
  onAddToCart?: (flavorId: string, quantity: number) => void;
  onAddToFavorites?: (flavorId: string) => void;
  onRemoveFromFavorites?: (flavorId: string) => void;
  isFavorite?: boolean;
  showActions?: boolean;
}

export interface FlavorDetailProps extends BaseProps {
  flavor: Flavor;
  reviews?: Array<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  similarFlavors?: Flavor[];
  onAddToCart: (quantity: number, size: string) => void;
  onAddToFavorites: () => void;
  onRemoveFromFavorites: () => void;
  isFavorite: boolean;
}

// Order component props
export interface OrderListProps extends BaseProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
  loading?: boolean;
}

export interface OrderItemProps extends BaseProps {
  order: Order;
  onView: () => void;
  onCancel: () => void;
  onReorder: () => void;
  showActions?: boolean;
}

// Store component props
export interface StoreListProps extends BaseProps {
  stores: import("../models").Store[];
  onSelectStore: (storeId: string) => void;
  selectedStoreId?: string;
  loading?: boolean;
}

export interface StoreCardProps extends BaseProps {
  store: import("../models").Store;
  selected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

// Search component props
export interface SearchProps extends BaseProps {
  placeholder?: string;
  value?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

// Filter component props
export interface FilterProps extends BaseProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
  onReset: () => void;
  options: Record<
    string,
    Array<{
      label: string;
      value: string | number;
      count?: number;
    }>
  >;
}

// Pagination component props
export interface PaginationProps extends BaseProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

// Error boundary props
export interface ErrorBoundaryProps extends BaseProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

// Lazy loading props
export interface LazyWrapperProps extends BaseProps {
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingType?:
    | "spinner"
    | "skeleton-card"
    | "skeleton-table"
    | "skeleton-chart";
  loadingText?: string;
  loadingSize?: Size;
}

// Theme provider props
export interface ThemeProviderProps extends BaseProps {
  attribute?: string;
  defaultTheme?: "light" | "dark" | "system";
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// Utility component props
export interface TooltipProps extends BaseProps {
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click" | "focus";
  disabled?: boolean;
}

export interface PopoverProps extends BaseProps {
  content: ReactNode;
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "top" | "bottom" | "left" | "right";
}

// Status component props
export interface StatusBadgeProps extends BaseProps {
  status: string;
  showIcon?: boolean;
  size?: Size;
}

// Star rating component props
export interface StarRatingProps extends BaseProps {
  rating: number;
  maxRating?: number;
  size?: Size;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
  label?: string;
}
