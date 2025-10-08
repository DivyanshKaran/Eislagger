import React from "react";

import {
  RefreshCw,
  Download,
  Settings,
  Bell,
  User,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";
import { DashboardMetrics } from "@/utils/dashboardUtils";

export interface DashboardHeaderProps {
  role: UserRole;
  title: string;
  subtitle?: string;
  metrics?: DashboardMetrics;
  lastUpdated?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
  className?: string;
}

export function DashboardHeader({
  role,
  title,
  subtitle,
  metrics,
  lastUpdated,
  isLoading = false,
  onRefresh,
  onExport,
  onSettings,
  onNotifications,
  className = "",
}: DashboardHeaderProps) {
  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case "patron":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "manufacturer":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "executive":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
      case "clerk":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "patron":
        return "🛒";
      case "manufacturer":
        return "🏭";
      case "executive":
        return "👔";
      case "clerk":
        return "🏪";
      default:
        return "👤";
    }
  };

  const formatLastUpdated = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getDataQualityColor = (quality: string): string => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "fair":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "poor":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title and Role */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getRoleIcon(role)}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <Badge className={`text-xs font-medium ${getRoleColor(role)}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          </div>

          {/* Right Section - Actions and Metrics */}
          <div className="flex items-center gap-4">
            {/* Metrics */}
            {metrics && (
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{metrics.totalKPIs} KPIs</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{metrics.activeKPIs} active</span>
                </div>
                <Badge
                  className={`text-xs ${getDataQualityColor(metrics.dataQuality)}`}
                >
                  {metrics.dataQuality}
                </Badge>
              </div>
            )}

            {/* Last Updated */}
            {lastUpdated && (
              <div className="hidden lg:flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Updated {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="h-8 px-3"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              )}

              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="h-8 px-3"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}

              {onNotifications && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNotifications}
                  className="h-8 w-8 p-0 relative"
                >
                  <Bell className="h-4 w-4" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              )}

              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Metrics */}
        {metrics && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{metrics.totalKPIs} KPIs</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{metrics.activeKPIs} active</span>
                </div>
              </div>
              <Badge
                className={`text-xs ${getDataQualityColor(metrics.dataQuality)}`}
              >
                {metrics.dataQuality}
              </Badge>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Calendar className="h-3 w-3" />
                <span>Updated {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
