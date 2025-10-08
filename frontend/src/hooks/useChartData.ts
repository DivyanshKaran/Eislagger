import { useState, useCallback, useMemo } from "react";

import { ChartData } from "./useDashboardData";

export interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "radar" | "scatter";
  dataKey: string;
  color: string;
  strokeWidth?: number;
  fill?: string;
  radius?: number;
}

export interface UseChartDataProps {
  data: ChartData[];
  config: ChartConfig;
  timeRange?: "7d" | "30d" | "90d" | "1y";
}

export function useChartData({
  data,
  config,
  timeRange = "30d",
}: UseChartDataProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Filter data based on time range
    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case "7d":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        filterDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter((item) => {
      if (item.date && typeof item.date === "string") {
        return new Date(item.date) >= filterDate;
      }
      return true; // If no date field, return all data
    });
  }, [data, timeRange]);

  const chartConfig = useMemo(() => {
    const baseConfig = {
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      colors: {
        primary: config.color || "#8884d8",
        secondary: "#82ca9d",
        tertiary: "#ffc658",
      },
    };

    switch (config.type) {
      case "line":
        return {
          ...baseConfig,
          strokeWidth: config.strokeWidth || 2,
          dot: { r: 4 },
          activeDot: { r: 6 },
        };
      case "bar":
        return {
          ...baseConfig,
          barSize: 20,
          radius: config.radius || [4, 4, 0, 0],
        };
      case "area":
        return {
          ...baseConfig,
          strokeWidth: config.strokeWidth || 2,
          fill: config.fill || config.color || "#8884d8",
          fillOpacity: 0.6,
        };
      case "pie":
        return {
          ...baseConfig,
          innerRadius: 60,
          outerRadius: 80,
          paddingAngle: 5,
        };
      default:
        return baseConfig;
    }
  }, [config]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for refreshing chart data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real implementation, this would call a service to refresh the chart data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh chart data",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExport = useCallback(
    (format: "json" | "csv" = "json") => {
      if (!filteredData || filteredData.length === 0) return;

      let exportData: string;
      let filename: string;
      let mimeType: string;

      if (format === "csv") {
        const headers = Object.keys(filteredData[0]).join(",");
        const rows = filteredData.map((item) =>
          Object.values(item)
            .map((value) =>
              typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value,
            )
            .join(","),
        );
        exportData = [headers, ...rows].join("\n");
        filename = `chart_data_${timeRange}.csv`;
        mimeType = "text/csv";
      } else {
        exportData = JSON.stringify(filteredData, null, 2);
        filename = `chart_data_${timeRange}.json`;
        mimeType = "application/json";
      }

      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [filteredData, timeRange],
  );

  const getDataSummary = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        count: 0,
      };
    }

    const values = filteredData.map((item) => {
      const value = item[config.dataKey];
      return typeof value === "number" ? value : 0;
    });
    const total = values.reduce((sum, value) => sum + value, 0);
    const average = values.length > 0 ? total / values.length : 0;
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;

    return {
      total,
      average: Math.round(average * 100) / 100,
      min,
      max,
      count: values.length,
    };
  }, [filteredData, config.dataKey]);

  return {
    filteredData,
    chartConfig,
    isLoading,
    error,
    handleRefresh,
    handleExport,
    getDataSummary,
  };
}
