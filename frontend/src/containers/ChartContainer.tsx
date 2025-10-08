import React, { useState, useCallback } from "react";

import { AlertCircle, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ChartCard } from "@/components/presentational/ChartCard";
import { LoadingSpinner } from "@/components/presentational/LoadingSpinner";
import { Button } from "@/components/ui/button";
// Removed unused imports
import { useChartData, ChartConfig } from "@/hooks/useChartData";
import { analyticsService, ChartDataPoint } from "@/services/analyticsService";

export interface ChartContainerProps {
  title: string;
  chartType: "line" | "bar" | "area" | "pie";
  dataKey: string;
  role: string;
  timeRange?: "7d" | "30d" | "90d" | "1y";
  color?: string;
  className?: string;
}

export function ChartContainer({
  title,
  chartType,
  dataKey,
  role,
  timeRange = "30d",
  color = "#8884d8",
  className = "",
}: ChartContainerProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config: ChartConfig = {
    type: chartType,
    dataKey,
    color,
  };

  const {
    filteredData,
    chartConfig,
    isLoading,
    error: chartError,
    handleRefresh,
    handleExport,
    // Removed unused destructuring
  } = useChartData({ data, config, timeRange });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const chartData = await analyticsService.getChartData(
        chartType,
        role,
        timeRange,
      );
      setData(chartData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch chart data",
      );
    } finally {
      setLoading(false);
    }
  }, [chartType, role, timeRange]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefreshData = useCallback(async () => {
    await handleRefresh();
    await fetchData();
  }, [handleRefresh, fetchData]);

  const handleExportData = useCallback(
    (format: "json" | "csv") => {
      handleExport(format);
    },
    [handleExport],
  );

  const renderChart = () => {
    if (loading || isLoading) {
      return <LoadingSpinner size="lg" text="Loading chart..." />;
    }

    if (error || chartError) {
      return (
        <div className="flex items-center justify-center h-64 text-red-600">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <div className="text-lg font-medium">Error loading chart</div>
            <div className="text-sm text-gray-500 mt-1">
              {error || chartError}
            </div>
            <Button
              onClick={handleRefreshData}
              className="mt-4"
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium">No data available</div>
            <div className="text-sm">
              Try adjusting your filters or time range
            </div>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: filteredData,
      margin: chartConfig.margin,
    };

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${index * 45}, 70%, 50%)`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-lg font-medium">Unsupported chart type</div>
              <div className="text-sm">
                Chart type &ldquo;{chartType}&rdquo; is not supported
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <ChartCard
      title={title}
      data={filteredData}
      dataKey={dataKey}
      type={chartType}
      color={color}
      isLoading={loading || isLoading}
      error={error || chartError}
      onRefresh={handleRefreshData}
      onExport={handleExportData}
      className={className}
    >
      {renderChart()}
    </ChartCard>
  );
}
