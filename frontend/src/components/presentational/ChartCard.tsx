import React from "react";

import {
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDataPoint } from "@/services/analyticsService";
import {
  formatChartValue,
  calculateTrend,
  getDataSummary,
} from "@/utils/chartUtils";

export interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  dataKey: string;
  type: "line" | "bar" | "area" | "pie";
  color?: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onExport?: (format: "json" | "csv") => void;
  onSettings?: () => void;
  className?: string;
  children?: React.ReactNode; // For custom chart components
}

export function ChartCard({
  title,
  data,
  dataKey,
  type,
  color = "#8884d8",
  isLoading = false,
  error = null,
  onRefresh,
  onExport,
  onSettings,
  className = "",
  children,
}: ChartCardProps) {
  const trend = calculateTrend(data, dataKey);
  const summary = getDataSummary(data, dataKey);

  const getTrendIcon = () => {
    switch (trend.direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {getTrendIcon()}
                <span className={getTrendColor()}>
                  {trend.direction === "up"
                    ? "+"
                    : trend.direction === "down"
                      ? "-"
                      : ""}
                  {trend.percentage.toFixed(1)}%
                </span>
                <span>vs previous period</span>
              </div>
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
            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport("json")}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
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
      </CardHeader>

      <CardContent className="pt-0">
        {error ? (
          <div className="flex items-center justify-center h-64 text-red-600">
            <div className="text-center">
              <div className="text-lg font-medium">Error loading chart</div>
              <div className="text-sm text-gray-500 mt-1">{error}</div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-500">Loading chart data...</div>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <div className="text-lg font-medium">No data available</div>
              <div className="text-sm">
                Try adjusting your filters or time range
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Container */}
            <div className="h-64 w-full">
              {children || (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Chart component not provided</div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatChartValue(summary.total)}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatChartValue(summary.average)}
                </div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatChartValue(summary.min)}
                </div>
                <div className="text-xs text-gray-500">Min</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatChartValue(summary.max)}
                </div>
                <div className="text-xs text-gray-500">Max</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
