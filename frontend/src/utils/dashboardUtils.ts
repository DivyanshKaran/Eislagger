import type { KPIData } from "@/types";

export interface DashboardConfig {
  theme: "light" | "dark";
  layout: "grid" | "list" | "compact";
  refreshInterval: number;
  autoRefresh: boolean;
  showAnimations: boolean;
}

export interface DashboardMetrics {
  totalKPIs: number;
  activeKPIs: number;
  lastUpdated: Date;
  dataQuality: "excellent" | "good" | "fair" | "poor";
}

export function getDefaultDashboardConfig(): DashboardConfig {
  return {
    theme: "light",
    layout: "grid",
    refreshInterval: 300000, // 5 minutes
    autoRefresh: true,
    showAnimations: true,
  };
}

export function calculateDashboardMetrics(kpis: KPIData[]): DashboardMetrics {
  const now = new Date();
  const activeKPIs = kpis.filter((kpi) => (kpi.progress || 0) > 0).length;

  // Calculate data quality based on KPI completion rates
  const avgProgress =
    kpis.reduce((sum, kpi) => sum + (kpi.progress || 0), 0) / kpis.length;
  let dataQuality: "excellent" | "good" | "fair" | "poor";

  if (avgProgress >= 90) {
    dataQuality = "excellent";
  } else if (avgProgress >= 75) {
    dataQuality = "good";
  } else if (avgProgress >= 50) {
    dataQuality = "fair";
  } else {
    dataQuality = "poor";
  }

  return {
    totalKPIs: kpis.length,
    activeKPIs,
    lastUpdated: now,
    dataQuality,
  };
}

export function getKPIPriorityColor(
  priority: "urgent" | "high" | "medium" | "low",
): string {
  switch (priority) {
    case "urgent":
      return "text-red-700 bg-red-100 border-red-300";
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getProgressColor(progress: number): string {
  if (progress >= 90) return "text-green-600";
  if (progress >= 70) return "text-yellow-600";
  if (progress >= 50) return "text-orange-600";
  return "text-red-600";
}

export function getProgressBarColor(progress: number): string {
  if (progress >= 90) return "bg-green-500";
  if (progress >= 70) return "bg-yellow-500";
  if (progress >= 50) return "bg-orange-500";
  return "bg-red-500";
}

export function formatKPITitle(title: string): string {
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getKPIIconName(fallback: string): string {
  const iconMap: Record<string, string> = {
    orders: "📦",
    revenue: "💰",
    customers: "👥",
    production: "🏭",
    sales: "📈",
    transactions: "💳",
    market: "🌐",
    favorites: "❤️",
  };

  return iconMap[fallback.toLowerCase()] || "📊";
}

export function sortKPIs(
  kpis: KPIData[],
  sortBy: "priority" | "progress" | "title" = "priority",
): KPIData[] {
  return [...kpis].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];

      case "progress":
        return (b.progress || 0) - (a.progress || 0);

      case "title":
        return a.title.localeCompare(b.title);

      default:
        return 0;
    }
  });
}

export function filterKPIs(
  kpis: KPIData[],
  filters: {
    category?: string;
    priority?: string;
    minProgress?: number;
    maxProgress?: number;
  },
): KPIData[] {
  return kpis.filter((kpi) => {
    if (filters.category && kpi.category !== filters.category) return false;
    if (filters.priority && kpi.priority !== filters.priority) return false;
    if (filters.minProgress !== undefined && (kpi.progress || 0) < filters.minProgress)
      return false;
    if (filters.maxProgress !== undefined && (kpi.progress || 0) > filters.maxProgress)
      return false;
    return true;
  });
}

export function getKPICategories(kpis: KPIData[]): string[] {
  const categories = new Set(kpis.map((kpi) => kpi.category));
  return Array.from(categories).sort();
}

export function calculateKPITrends(kpis: KPIData[]): {
  improving: number;
  declining: number;
  stable: number;
} {
  let improving = 0;
  let declining = 0;
  let stable = 0;

  kpis.forEach((kpi) => {
    if (kpi.changeType === "increase") {
      improving++;
    } else if (kpi.changeType === "decrease") {
      declining++;
    } else {
      stable++;
    }
  });

  return { improving, declining, stable };
}

export function generateKPISummary(kpis: KPIData[]): {
  totalValue: string;
  averageProgress: number;
  topPerformer: KPIData | null;
  needsAttention: KPIData[];
} {
  if (kpis.length === 0) {
    return {
      totalValue: "0",
      averageProgress: 0,
      topPerformer: null,
      needsAttention: [],
    };
  }

  const averageProgress =
    kpis.reduce((sum, kpi) => sum + (kpi.progress || 0), 0) / kpis.length;
  const topPerformer = kpis.reduce((best, current) =>
    (current.progress || 0) > (best.progress || 0) ? current : best,
  );
  const needsAttention = kpis.filter((kpi) => (kpi.progress || 0) < 50);

  // Calculate total value (this is a simplified calculation)
  const totalValue = kpis.length.toString();

  return {
    totalValue,
    averageProgress: Math.round(averageProgress * 100) / 100,
    topPerformer,
    needsAttention,
  };
}

export function exportDashboardData(
  kpis: KPIData[],
  format: "json" | "csv" = "json",
  filename?: string,
): void {
  if (!kpis || kpis.length === 0) return;

  let exportData: string;
  let mimeType: string;
  let defaultFilename: string;

  if (format === "csv") {
    const headers = [
      "Title",
      "Value",
      "Change",
      "Progress",
      "Category",
      "Priority",
      "Target",
    ];
    const rows = kpis.map((kpi) => [
      kpi.title,
      kpi.value,
      kpi.change,
      (kpi.progress || 0).toString(),
      kpi.category,
      kpi.priority,
      kpi.target,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    exportData = csvContent;
    mimeType = "text/csv";
    defaultFilename = "dashboard_data.csv";
  } else {
    exportData = JSON.stringify(kpis, null, 2);
    mimeType = "application/json";
    defaultFilename = "dashboard_data.json";
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

export function getDashboardLayoutConfig(layout: "grid" | "list" | "compact"): {
  gridCols: string;
  cardSize: string;
  spacing: string;
} {
  switch (layout) {
    case "grid":
      return {
        gridCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        cardSize: "h-48",
        spacing: "gap-6",
      };

    case "list":
      return {
        gridCols: "grid-cols-1",
        cardSize: "h-32",
        spacing: "gap-4",
      };

    case "compact":
      return {
        gridCols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
        cardSize: "h-24",
        spacing: "gap-3",
      };

    default:
      return {
        gridCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        cardSize: "h-48",
        spacing: "gap-6",
      };
  }
}

export function validateDashboardConfig(
  config: Partial<DashboardConfig>,
): DashboardConfig {
  const defaultConfig = getDefaultDashboardConfig();

  return {
    theme: config.theme || defaultConfig.theme,
    layout: config.layout || defaultConfig.layout,
    refreshInterval: config.refreshInterval || defaultConfig.refreshInterval,
    autoRefresh:
      config.autoRefresh !== undefined
        ? config.autoRefresh
        : defaultConfig.autoRefresh,
    showAnimations:
      config.showAnimations !== undefined
        ? config.showAnimations
        : defaultConfig.showAnimations,
  };
}
