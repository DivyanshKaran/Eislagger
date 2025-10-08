import { useState, useEffect } from "react";

import type { UserRole, KPIData } from "@/types";
import { getRoleDashboard } from "@/lib/analytics-api";

export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface DashboardData {
  kpis: KPIData[];
  chartData: ChartData[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    growthRate: number;
  };
}

// UserRole is imported from types

export function useDashboardData(role: UserRole) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (role === "executive" || role === "manufacturer" || role === "clerk" || role === "patron") {
          const result = await getRoleDashboard(role);
          if (result.success && result.data) {
            const mapped = mapDashboardFromApi(result.data, role);
            setData(mapped);
          } else {
            const mockData = await generateMockData(role);
            setData(mockData);
            if (result.error?.message) setError(result.error.message);
          }
        } else {
          const mockData = await generateMockData(role);
          setData(mockData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (role === "executive" || role === "manufacturer" || role === "clerk" || role === "patron") {
        const result = await getRoleDashboard(role);
        if (result.success && result.data) {
          const mapped = mapDashboardFromApi(result.data, role);
          setData(mapped);
        } else {
          const mockData = await generateMockData(role);
          setData(mockData);
          if (result.error?.message) setError(result.error.message);
        }
      } else {
        const mockData = await generateMockData(role);
        setData(mockData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
}

function mapDashboardFromApi(apiData: any, role: UserRole): DashboardData {
  const kpis: KPIData[] = (apiData?.summary?.kpis || []).map((kpi: any) => ({
    id: String(kpi.id),
    title: String(kpi.name),
    value: Number(kpi.currentValue ?? 0),
    change: (() => {
      const trend = (apiData?.summary?.metrics || []).find((m: any) => m.key === kpi.name)?.trend;
      const pct = trend && typeof trend.percentage === 'number' ? Math.abs(trend.percentage) : 0;
      return Number(pct.toFixed(1));
    })(),
    changeType: (() => {
      const trend = (apiData?.summary?.metrics || []).find((m: any) => m.key === kpi.name)?.trend;
      if (!trend || typeof trend.direction !== 'string') return "neutral";
      return trend.direction === 'up' ? "increase" : "decrease";
    })(),
    icon: null,
    color: role === "executive"
      ? "text-indigo-600"
      : role === "manufacturer"
      ? "text-orange-600"
      : role === "clerk"
      ? "text-pink-600"
      : "text-purple-600",
    bgColor: role === "executive"
      ? "bg-indigo-50"
      : role === "manufacturer"
      ? "bg-orange-50"
      : role === "clerk"
      ? "bg-pink-50"
      : "bg-purple-50",
    // Backend provides a trend object; we don't map to numeric series here
    trend: undefined,
    period: String(apiData?.period || "last_30d"),
    target: kpi.targetValue != null ? Number(kpi.targetValue) : undefined,
    progress: kpi.targetValue && kpi.currentValue
      ? Math.min(100, Math.round((Number(kpi.currentValue) / Number(kpi.targetValue)) * 100))
      : undefined,
    category: String(
      kpi.importance
        || (role === "executive"
              ? "Executive"
              : role === "manufacturer"
              ? "Production"
              : role === "clerk"
              ? "Operations"
              : "Preferences")
    ),
    priority: "high",
    unit: "",
    lastUpdated: String(apiData?.timestamp || new Date().toISOString()),
  }));

  const chartData: ChartData[] = (apiData?.summary?.metrics || []).map((m: any) => ({
    name: String(m.key),
    value: Number(m.value ?? 0),
  }));

  const summary = {
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    growthRate: 0,
  };

  return { kpis, chartData, summary };
}

// Mock data generator - replace with actual API calls
async function generateMockData(role: UserRole): Promise<DashboardData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const baseKPIs: KPIData[] = [
    {
      id: "1",
      title: "Total Orders",
      value: 1234,
      change: 12.5,
      changeType: "increase" as const,
      icon: null, // Will be set by component
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: [100, 120, 110, 140, 160, 180, 200],
      period: "Last 7 days",
      target: 1500,
      progress: 82,
      category: "Sales",
      priority: "high",
      unit: "orders",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Revenue",
      value: 45678,
      change: 8.2,
      changeType: "increase" as const,
      icon: null,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: [3000, 3200, 3100, 3400, 3600, 3800, 4000],
      period: "Last 7 days",
      target: 50000,
      progress: 91,
      category: "Financial",
      priority: "high",
      unit: "USD",
      lastUpdated: new Date().toISOString(),
    },
  ];

  const baseChartData: ChartData[] = [
    { name: "Jan", value: 400, orders: 12, revenue: 1800 },
    { name: "Feb", value: 300, orders: 15, revenue: 2200 },
    { name: "Mar", value: 200, orders: 18, revenue: 2800 },
    { name: "Apr", value: 278, orders: 14, revenue: 2100 },
    { name: "May", value: 189, orders: 22, revenue: 3200 },
    { name: "Jun", value: 239, orders: 19, revenue: 2900 },
  ];

  // Role-specific data customization
  switch (role) {
    case "patron":
      return {
        kpis: [
          ...baseKPIs,
          {
            id: "3",
            title: "Favorite Flavors",
            value: 8,
            change: 2,
            changeType: "increase" as const,
            icon: null,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            trend: [5, 6, 7, 8, 8, 8, 8],
            period: "This month",
            target: 10,
            progress: 80,
            category: "Preferences",
            priority: "medium",
            unit: "flavors",
            lastUpdated: new Date().toISOString(),
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 1,
          growthRate: 12.5,
        },
      };

    case "manufacturer":
      return {
        kpis: [
          ...baseKPIs,
          {
            id: "3",
            title: "Production Units",
            value: 2456,
            change: 15.3,
            changeType: "increase" as const,
            icon: null,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            trend: [2000, 2100, 2200, 2300, 2400, 2450, 2456],
            period: "This month",
            target: 3000,
            progress: 82,
            category: "Production",
            priority: "high",
            unit: "units",
            lastUpdated: new Date().toISOString(),
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 150,
          growthRate: 15.3,
        },
      };

    case "executive":
      return {
        kpis: [
          ...baseKPIs,
          {
            id: "3",
            title: "Market Share",
            value: 23.4,
            change: 2.1,
            changeType: "increase" as const,
            icon: null,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            trend: [20, 21, 22, 22.5, 23, 23.2, 23.4],
            period: "This quarter",
            target: 25,
            progress: 94,
            category: "Market",
            priority: "high",
            unit: "%",
            lastUpdated: new Date().toISOString(),
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 500,
          growthRate: 8.2,
        },
      };

    case "clerk":
      return {
        kpis: [
          ...baseKPIs,
          {
            id: "3",
            title: "Transactions",
            value: 89,
            change: 5.2,
            changeType: "increase" as const,
            icon: null,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            trend: [70, 75, 80, 82, 85, 87, 89],
            period: "Today",
            target: 100,
            progress: 89,
            category: "Operations",
            priority: "medium",
            unit: "transactions",
            lastUpdated: new Date().toISOString(),
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 89,
          totalRevenue: 4567,
          totalCustomers: 45,
          growthRate: 5.2,
        },
      };

    default:
      return {
        kpis: baseKPIs,
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 100,
          growthRate: 10,
        },
      };
  }
}
