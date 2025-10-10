import type { DashboardData } from "@/types/api/index";
import type { UserRole } from "@/types";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

class DashboardService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  }

  async getDashboardData(role: UserRole): Promise<DashboardData> {
    try {
      const response = await this.makeRequest<DashboardData>(
        `/dashboard/${role}`,
      );
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn("API call failed, using mock data:", error);
      return this.getMockDashboardData(role);
    }
  }

  async refreshKPIData(kpiId: number, role: UserRole): Promise<any> {
    try {
      const response = await this.makeRequest(
        `/dashboard/${role}/kpi/${kpiId}/refresh`,
        {
          method: "POST",
        },
      );
      return response.data;
    } catch (error) {
      console.warn("KPI refresh failed:", error);
      throw error;
    }
  }

  async getChartData(
    chartType: string,
    role: UserRole,
    timeRange: string = "30d",
  ): Promise<any[]> {
    try {
      const response = await this.makeRequest<any[]>(
        `/dashboard/${role}/charts/${chartType}?range=${timeRange}`,
      );
      return response.data;
    } catch (error) {
      console.warn("Chart data fetch failed:", error);
      return this.getMockChartData(chartType, timeRange);
    }
  }

  async exportDashboardData(
    role: UserRole,
    format: "json" | "csv" = "json",
  ): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.baseUrl}/dashboard/${role}/export?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.warn("Export failed:", error);
      throw error;
    }
  }

  // Mock data methods for development/fallback
  private async getMockDashboardData(role: UserRole): Promise<DashboardData> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const baseKPIs = [
      {
        id: "1",
        title: "Total Orders",
        value: 1234,
        change: 12.5,
        changeType: "increase" as const,
        icon: null,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: [100, 120, 110, 140, 160, 180, 200],
        period: "Last 7 days",
        target: 1500,
        progress: 82,
        category: "Sales",
        priority: "high" as const,
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
        priority: "high" as const,
        unit: "USD",
        lastUpdated: new Date().toISOString(),
      },
    ];

    const baseChartData = [
      { name: "Jan", value: 400, orders: 12, revenue: 1800 },
      { name: "Feb", value: 300, orders: 15, revenue: 2200 },
      { name: "Mar", value: 200, orders: 18, revenue: 2800 },
      { name: "Apr", value: 278, orders: 14, revenue: 2100 },
      { name: "May", value: 189, orders: 22, revenue: 3200 },
      { name: "Jun", value: 239, orders: 19, revenue: 2900 },
    ];

    // Role-specific data
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
              priority: "medium" as const,
              unit: "flavors",
              lastUpdated: new Date().toISOString(),
            },
          ],
          charts: [
            { labels: baseChartData.map(d => d.name), datasets: [ { label: 'Value', data: baseChartData.map(d => d.value) } ] },
          ],
          recentActivity: [],
          alerts: [],
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
              priority: "high" as const,
              unit: "units",
              lastUpdated: new Date().toISOString(),
            },
          ],
          charts: [
            { labels: baseChartData.map(d => d.name), datasets: [ { label: 'Value', data: baseChartData.map(d => d.value) } ] },
          ],
          recentActivity: [],
          alerts: [],
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
              priority: "high" as const,
              unit: "%",
              lastUpdated: new Date().toISOString(),
            },
          ],
          charts: [
            { labels: baseChartData.map(d => d.name), datasets: [ { label: 'Value', data: baseChartData.map(d => d.value) } ] },
          ],
          recentActivity: [],
          alerts: [],
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
              priority: "medium" as const,
              unit: "transactions",
              lastUpdated: new Date().toISOString(),
            },
          ],
          charts: [
            { labels: baseChartData.map(d => d.name), datasets: [ { label: 'Value', data: baseChartData.map(d => d.value) } ] },
          ],
          recentActivity: [],
          alerts: [],
        };

      default:
        return {
          kpis: baseKPIs,
          charts: [
            { labels: baseChartData.map(d => d.name), datasets: [ { label: 'Value', data: baseChartData.map(d => d.value) } ] },
          ],
          recentActivity: [],
          alerts: [],
        };
    }
  }

  private getMockChartData(
    chartType: string,
    timeRange: string,
  ): Record<string, unknown>[] {
    const baseData = [
      { name: "Jan", value: 400, orders: 12, revenue: 1800 },
      { name: "Feb", value: 300, orders: 15, revenue: 2200 },
      { name: "Mar", value: 200, orders: 18, revenue: 2800 },
      { name: "Apr", value: 278, orders: 14, revenue: 2100 },
      { name: "May", value: 189, orders: 22, revenue: 3200 },
      { name: "Jun", value: 239, orders: 19, revenue: 2900 },
    ];

    // Filter based on time range
    switch (timeRange) {
      case "7d":
        return baseData.slice(-1);
      case "30d":
        return baseData.slice(-2);
      case "90d":
        return baseData.slice(-3);
      case "1y":
        return baseData;
      default:
        return baseData;
    }
  }
}

export const dashboardService = new DashboardService();
