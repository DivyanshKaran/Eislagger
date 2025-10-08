export interface AnalyticsData {
  id: string;
  type: "kpi" | "chart" | "table" | "insight";
  title: string;
  data: unknown;
  metadata: {
    lastUpdated: string;
    source: string;
    version: string;
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  target?: number;
  unit: string;
  category: string;
  priority: "high" | "medium" | "low";
}

export interface TableData {
  columns: Array<{
    key: string;
    title: string;
    type: "string" | "number" | "date" | "boolean";
    sortable?: boolean;
    filterable?: boolean;
  }>;
  rows: Array<Record<string, any>>;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

class AnalyticsService {
  private baseUrl: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : "";
    return `${endpoint}${paramString}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = true,
  ): Promise<T> {
    const cacheKey = this.getCacheKey(
      endpoint,
      options.body ? JSON.parse(options.body as string) : undefined,
    );

    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (this.isCacheValid(cached.timestamp)) {
        return cached.data as T;
      }
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      if (useCache) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.warn(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getKPIMetrics(
    role: string,
    timeRange: string = "30d",
  ): Promise<KPIMetric[]> {
    try {
      return await this.makeRequest<KPIMetric[]>(
        `/analytics/${role}/kpi?range=${timeRange}`,
      );
    } catch (error) {
      return this.getMockKPIMetrics(role, timeRange);
    }
  }

  async getChartData(
    chartType: string,
    role: string,
    timeRange: string = "30d",
  ): Promise<ChartDataPoint[]> {
    try {
      return await this.makeRequest<ChartDataPoint[]>(
        `/analytics/${role}/charts/${chartType}?range=${timeRange}`,
      );
    } catch (error) {
      return this.getMockChartData(chartType, timeRange);
    }
  }

  async getTableData(
    tableType: string,
    role: string,
    filters?: Record<string, any>,
  ): Promise<TableData> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
      }

      const endpoint = `/analytics/${role}/tables/${tableType}?${queryParams.toString()}`;
      return await this.makeRequest<TableData>(endpoint);
    } catch (error) {
      return this.getMockTableData(tableType, role);
    }
  }

  async generateInsights(role: string, dataType: string): Promise<string[]> {
    try {
      return await this.makeRequest<string[]>(
        `/analytics/${role}/insights?type=${dataType}`,
      );
    } catch (error) {
      return this.getMockInsights(role, dataType);
    }
  }

  async exportAnalytics(
    role: string,
    format: "json" | "csv" | "pdf" = "json",
    dataType?: string,
  ): Promise<Blob> {
    try {
      const endpoint = dataType
        ? `/analytics/${role}/export?format=${format}&type=${dataType}`
        : `/analytics/${role}/export?format=${format}`;

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.warn("Export failed:", error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Mock data methods
  private getMockKPIMetrics(role: string, timeRange: string): KPIMetric[] {
    const baseMetrics: KPIMetric[] = [
      {
        id: "orders",
        title: "Total Orders",
        value: 1234,
        change: 12.5,
        changeType: "increase",
        target: 1500,
        unit: "orders",
        category: "Sales",
        priority: "high",
      },
      {
        id: "revenue",
        title: "Revenue",
        value: 45678,
        change: 8.2,
        changeType: "increase",
        target: 50000,
        unit: "$",
        category: "Financial",
        priority: "high",
      },
    ];

    // Role-specific metrics
    switch (role) {
      case "patron":
        return [
          ...baseMetrics,
          {
            id: "favorites",
            title: "Favorite Flavors",
            value: 8,
            change: 2,
            changeType: "increase",
            target: 10,
            unit: "flavors",
            category: "Preferences",
            priority: "medium",
          },
        ];

      case "manufacturer":
        return [
          ...baseMetrics,
          {
            id: "production",
            title: "Production Units",
            value: 2456,
            change: 15.3,
            changeType: "increase",
            target: 3000,
            unit: "units",
            category: "Production",
            priority: "high",
          },
        ];

      case "executive":
        return [
          ...baseMetrics,
          {
            id: "market-share",
            title: "Market Share",
            value: 23.4,
            change: 2.1,
            changeType: "increase",
            target: 25,
            unit: "%",
            category: "Market",
            priority: "high",
          },
        ];

      case "clerk":
        return [
          ...baseMetrics,
          {
            id: "transactions",
            title: "Transactions",
            value: 89,
            change: 5.2,
            changeType: "increase",
            target: 100,
            unit: "transactions",
            category: "Operations",
            priority: "medium",
          },
        ];

      default:
        return baseMetrics;
    }
  }

  private getMockChartData(
    chartType: string,
    timeRange: string,
  ): ChartDataPoint[] {
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

  private getMockTableData(tableType: string, role: string): TableData {
    const baseColumns = [
      { key: "id", title: "ID", type: "string" as const, sortable: true },
      {
        key: "name",
        title: "Name",
        type: "string" as const,
        sortable: true,
        filterable: true,
      },
      { key: "value", title: "Value", type: "number" as const, sortable: true },
      { key: "date", title: "Date", type: "date" as const, sortable: true },
    ];

    const baseRows = [
      { id: "1", name: "Item 1", value: 100, date: "2024-01-01" },
      { id: "2", name: "Item 2", value: 200, date: "2024-01-02" },
      { id: "3", name: "Item 3", value: 300, date: "2024-01-03" },
    ];

    return {
      columns: baseColumns,
      rows: baseRows,
      pagination: {
        page: 1,
        pageSize: 10,
        total: baseRows.length,
      },
    };
  }

  private getMockInsights(role: string, dataType: string): string[] {
    const baseInsights = [
      "Sales have increased by 12.5% compared to last month",
      "Revenue growth is trending positively",
      "Customer satisfaction scores are above target",
    ];

    // Role-specific insights
    switch (role) {
      case "patron":
        return [
          ...baseInsights,
          "Your favorite flavor is Vanilla",
          "You order most frequently on weekends",
        ];

      case "manufacturer":
        return [
          ...baseInsights,
          "Production efficiency is at 95%",
          "Quality control metrics are within target range",
        ];

      case "executive":
        return [
          ...baseInsights,
          "Market share is growing steadily",
          "Competitive analysis shows strong positioning",
        ];

      case "clerk":
        return [
          ...baseInsights,
          "Transaction processing time is optimal",
          "Customer service ratings are high",
        ];

      default:
        return baseInsights;
    }
  }
}

export const analyticsService = new AnalyticsService();
