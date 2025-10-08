import React from "react";

import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { KPIData } from "@/types";
import {
  getKPIPriorityColor,
  getProgressColor,
  getProgressBarColor,
  getKPIIconName,
} from "@/utils/dashboardUtils";

export interface KPICardProps {
  kpi: KPIData;
  isExpanded?: boolean;
  isLoading?: boolean;
  onToggleExpanded?: () => void;
  onRefresh?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function KPICard({
  kpi,
  isExpanded = false,
  isLoading = false,
  onToggleExpanded,
  onRefresh,
  onDownload,
  className = "",
}: KPICardProps) {
  const priorityColor = getKPIPriorityColor(kpi.priority);
  const progressColor = getProgressColor(kpi.progress || 0);
  const progressBarColor = getProgressBarColor(kpi.progress || 0);
  const iconName = getKPIIconName(kpi.title);

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              {kpi.icon || <span className="text-2xl">{iconName}</span>}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                {kpi.title}
              </h3>
              <Badge className={`text-xs ${priorityColor}`}>
                {kpi.priority}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onToggleExpanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpanded}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Main Value and Change */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {kpi.value}
            </div>
            <div className="flex items-center gap-1">
              {kpi.changeType === "increase" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  kpi.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {kpi.change}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span className={progressColor}>{kpi.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${progressBarColor}`}
                style={{ width: `${kpi.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Target: {kpi.target}</span>
              <span>{kpi.period}</span>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Category and Priority */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Category: <span className="font-medium">{kpi.category}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Priority:{" "}
                  <span className="font-medium capitalize">{kpi.priority}</span>
                </div>
              </div>

              {/* Trend Chart */}
              {kpi.trend && kpi.trend.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Trend</span>
                  </div>
                  <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                    <div className="flex items-end justify-between h-full gap-1">
                      {(kpi.trend || []).map((value, index) => {
                        const maxValue = Math.max(...(kpi.trend || []));
                        const height = (value / maxValue) * 100;
                        return (
                          <div
                            key={index}
                            className={`flex-1 ${progressBarColor} rounded-t transition-all duration-300`}
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
