import { ChartDataPoint } from "../services/analyticsService";

export interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "radar" | "scatter";
  dataKey: string;
  color: string;
  strokeWidth?: number;
  fill?: string;
  radius?: number;
}

export interface ChartColors {
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  error: string;
}

export const CHART_COLORS: ChartColors = {
  primary: "#8884d8",
  secondary: "#82ca9d",
  tertiary: "#ffc658",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

export const PIE_CHART_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#ffff00",
];

export function formatChartValue(
  value: number,
  type: "currency" | "percentage" | "number" = "number",
): string {
  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);

    case "percentage":
      return `${value.toFixed(1)}%`;

    case "number":
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
}

export function getChartConfig(
  type: ChartConfig["type"],
  dataKey: string,
  color?: string,
): ChartConfig {
  const baseConfig: ChartConfig = {
    type,
    dataKey,
    color: color || CHART_COLORS.primary,
  };

  switch (type) {
    case "line":
      return {
        ...baseConfig,
        strokeWidth: 2,
      };

    case "bar":
      return {
        ...baseConfig,
        radius: 4,
      };

    case "area":
      return {
        ...baseConfig,
        strokeWidth: 2,
        fill: color || CHART_COLORS.primary,
      };

    case "pie":
      return {
        ...baseConfig,
        radius: 80,
      };

    default:
      return baseConfig;
  }
}

export function calculateTrend(
  data: ChartDataPoint[],
  dataKey: string,
): {
  direction: "up" | "down" | "stable";
  percentage: number;
  value: number;
} {
  if (data.length < 2) {
    return { direction: "stable", percentage: 0, value: 0 };
  }

  const firstValue =
    typeof data[0][dataKey] === "number" ? data[0][dataKey] as number : 0;
  const lastValue =
    typeof data[data.length - 1][dataKey] === "number"
      ? data[data.length - 1][dataKey] as number
      : 0;
  const difference = lastValue - firstValue;
  const percentage = firstValue !== 0 ? (difference / firstValue) * 100 : 0;

  let direction: "up" | "down" | "stable" = "stable";
  if (Math.abs(percentage) > 1) {
    direction = percentage > 0 ? "up" : "down";
  }

  return {
    direction,
    percentage: Math.abs(percentage),
    value: difference,
  };
}

export function getDataSummary(
  data: ChartDataPoint[],
  dataKey: string,
): {
  total: number;
  average: number;
  min: number;
  max: number;
  count: number;
} {
  if (!data || data.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0, count: 0 };
  }

  const values = data.map((item) => {
    const value = item[dataKey];
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
}

export function filterDataByTimeRange(
  data: ChartDataPoint[],
  timeRange: "7d" | "30d" | "90d" | "1y",
): ChartDataPoint[] {
  if (!data || data.length === 0) return [];

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
}

export function generateMockData(
  type: "sales" | "revenue" | "orders" | "customers",
  timeRange: "7d" | "30d" | "90d" | "1y" = "30d",
): ChartDataPoint[] {
  const dataPoints =
    timeRange === "7d"
      ? 7
      : timeRange === "30d"
        ? 30
        : timeRange === "90d"
          ? 90
          : 365;
  const data: ChartDataPoint[] = [];

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (dataPoints - i - 1));

    let value: number;
    switch (type) {
      case "sales":
        value = Math.floor(Math.random() * 1000) + 500;
        break;
      case "revenue":
        value = Math.floor(Math.random() * 10000) + 5000;
        break;
      case "orders":
        value = Math.floor(Math.random() * 100) + 20;
        break;
      case "customers":
        value = Math.floor(Math.random() * 50) + 10;
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }

    data.push({
      name: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value,
      date: date.toISOString(),
    });
  }

  return data;
}

export function exportChartData(
  data: ChartDataPoint[],
  format: "json" | "csv" = "json",
  filename?: string,
): void {
  if (!data || data.length === 0) return;

  let exportData: string;
  let mimeType: string;
  let defaultFilename: string;

  if (format === "csv") {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value,
        )
        .join(","),
    );
    exportData = [headers, ...rows].join("\n");
    mimeType = "text/csv";
    defaultFilename = "chart_data.csv";
  } else {
    exportData = JSON.stringify(data, null, 2);
    mimeType = "application/json";
    defaultFilename = "chart_data.json";
  }

  const blob = new Blob([exportData], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || defaultFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getResponsiveChartDimensions(containerWidth: number): {
  width: number;
  height: number;
} {
  const aspectRatio = 16 / 9;
  const maxWidth = Math.min(containerWidth, 800);
  const width = maxWidth;
  const height = Math.round(width / aspectRatio);

  return { width, height };
}

export function createGradientDefs(colors: string[]): string {
  return colors
    .map(
      (color, index) => `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
    )
    .join(", ");
}

export function getChartAnimationConfig(duration: number = 1000): {
  animationBegin: number;
  animationDuration: number;
  animationEasing: string;
} {
  return {
    animationBegin: 0,
    animationDuration: duration,
    animationEasing: "ease-out",
  };
}
