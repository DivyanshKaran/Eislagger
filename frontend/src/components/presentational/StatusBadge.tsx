import React from "react";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Pause,
  Play,
  Loader,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Priority, LoadingState, Size } from "@/types";

export type StatusType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "pending"
  | "active"
  | "inactive"
  | "loading"
  | "completed"
  | "failed"
  | "cancelled"
  | "scheduled"
  | "in-progress"
  | "on-hold"
  | "delivered"
  | "shipped"
  | "processing"
  | "ready"
  | "maintenance"
  | "optimal"
  | "good"
  | "fair"
  | "poor";

export interface StatusBadgeProps {
  status: StatusType | string;
  showIcon?: boolean;
  size?: Size;
  className?: string;
}

export function StatusBadge({
  status,
  showIcon = true,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<
      string,
      {
        color: string;
        icon?: React.ReactNode;
        label: string;
      }
    > = {
      // Success states
      success: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Success",
      },
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Completed",
      },
      delivered: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Delivered",
      },
      ready: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Ready",
      },
      optimal: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Optimal",
      },

      // Error states
      error: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        icon: <XCircle className="w-3 h-3" />,
        label: "Error",
      },
      failed: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        icon: <XCircle className="w-3 h-3" />,
        label: "Failed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        icon: <XCircle className="w-3 h-3" />,
        label: "Cancelled",
      },
      poor: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        icon: <XCircle className="w-3 h-3" />,
        label: "Poor",
      },

      // Warning states
      warning: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Warning",
      },
      "on-hold": {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
        icon: <Pause className="w-3 h-3" />,
        label: "On Hold",
      },
      fair: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Fair",
      },

      // Info states
      info: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Info",
      },
      pending: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      scheduled: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
        icon: <Clock className="w-3 h-3" />,
        label: "Scheduled",
      },

      // Active states
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <Play className="w-3 h-3" />,
        label: "Active",
      },
      "in-progress": {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
        icon: <Play className="w-3 h-3" />,
        label: "In Progress",
      },
      processing: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
        icon: <Play className="w-3 h-3" />,
        label: "Processing",
      },

      // Inactive states
      inactive: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
        icon: <Pause className="w-3 h-3" />,
        label: "Inactive",
      },

      // Loading state
      loading: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
        icon: <Loader className="w-3 h-3 animate-spin" />,
        label: "Loading",
      },

      // Shipping states
      shipped: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Shipped",
      },

      // Maintenance state
      maintenance: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Maintenance",
      },

      // Good state
      good: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Good",
      },
    };

    return (
      statusMap[status.toLowerCase()] || {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: status,
      }
    );
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1.5",
    lg: "text-base px-3 py-2",
    xl: "text-lg px-4 py-2.5",
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} ${className}`}>
      {showIcon && config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
