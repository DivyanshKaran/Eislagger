import { analyticsApi as apiClient } from "@/lib/api-client";

// Types
interface DashboardData {
  summary: {
    kpis: Array<{
      id: string;
      name: string;
      currentValue: number;
      targetValue: number;
      benchmarkValue: number;
      importance: string;
      status: string;
    }>;
    insights: string[];
  };
}

interface SalesAnalytics {
  period: { startDate: string; endDate: string };
  salesData: Array<any>;
  productPerformance: Array<any>;
  summary: {
    totalRevenue: number;
    totalQuantity: number;
    avgOrderValue: number;
  };
}

interface InventoryAnalytics {
  inventory: {
    summary: any;
    insights: string[];
  };
}

interface LocationAnalytics {
  locations: {
    summary: any;
    performance: any;
  };
}

// Analytics API functions

// Dashboard Analytics
export const getRoleDashboard = async (role: string, period?: string) => {
  try {
    const periodParam = period || 'last_30d';
    const response = await apiClient.get(`/dashboard/${role}?period=${periodParam}`);
    return {
      success: true,
      data: (response.data as any).data as DashboardData
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getKPIMetrics = async () => {
  try {
    const response = await apiClient.get('/dashboard/kpis');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getRealTimeDashboard = async () => {
  try {
    const response = await apiClient.get('/dashboard/real-time');
    return {
      success: true,
      data: (response.data as any).data,
      cached: (response.data as any).cached,
      timestamp: (response.data as any).timestamp
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

// Sales Analytics
export const getSalesAnalytics = async (params?: {
  period?: string;
  shopId?: string;
  productId?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.shopId) queryParams.append('shopId', params.shopId);
    if (params?.productId) queryParams.append('productId', params.productId);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sales?${queryString}` : '/sales';
    const response = await apiClient.get(endpoint);
    return {
      success: true,
      data: (response.data as any).analytics as SalesAnalytics
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getSalesTrends = async (params?: {
  period?: string;
  shopId?: string;
  trendType?: string;
}) => {
  try {
    const response = await apiClient.get('/sales/trends', {});
    return {
      success: true,
      data: (response.data as any).trends
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getProductPerformance = async (params?: {
  period?: string;
  category?: string;
}) => {
  try {
    const response = await apiClient.get('/sales/products', {});
    return {
      success: true,
      data: {
        products: (response.data as any).products,
        summary: (response.data as any).summary
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getRevenueAnalytics = async (params?: {
  period?: string;
  shopId?: string;
}) => {
  try {
    const response = await apiClient.get('/revenue', {});
    return {
      success: true,
      data: (response.data as any).revenue
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

// Inventory Analytics
export const getInventoryAnalytics = async (params?: {
  period?: string;
  factoryId?: string;
}) => {
  try {
    const response = await apiClient.get('/inventory', {});
    return {
      success: true,
      data: (response.data as any).inventory as InventoryAnalytics
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getInventoryTurnover = async (params?: {
  period?: string;
  factoryId?: string;
}) => {
  try {
    const response = await apiClient.get('/inventory/turnover', {});
    return {
      success: true,
      data: {
        turnover: (response.data as any).turnover,
        analysis: (response.data as any).analysis
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getWasteAnalysis = async (params?: {
  period?: string;
  factoryId?: string;
}) => {
  try {
    const response = await apiClient.get('/inventory/waste', {});
    return {
      success: true,
      data: (response.data as any).wasteAnalysis
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getSupplierPerformance = async () => {
  try {
    const response = await apiClient.get('/suppliers');
    return {
      success: true,
      data: (response.data as any).suppliers
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

// Location Analytics
export const getLocationAnalytics = async (params?: {
  period?: string;
}) => {
  try {
    const response = await apiClient.get('/locations', {});
    return {
      success: true,
      data: (response.data as any).locations as LocationAnalytics
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getLocationMapData = async () => {
  try {
    const response = await apiClient.get('/locations/map');
    return {
      success: true,
      data: {
        mapData: (response.data as any).mapData,
        bounds: (response.data as any).bounds
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getLocationHeatmap = async (params?: {
  metric?: string;
  period?: string;
}) => {
  try {
    const response = await apiClient.get('/locations/heatmap', {});
    return {
      success: true,
      data: (response.data as any).heatmap
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

// Custom Reports
export const generateCustomReport = async (reportConfig: {
  reportName: string;
  reportType: string;
  queryConfig: any;
  chartConfig?: any;
}) => {
  try {
    const response = await apiClient.post('/reports/generate', reportConfig);
    return {
      success: true,
      data: {
        report: (response.data as any).report,
        executionId: (response.data as any).executionId
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getReport = async (reportId: string) => {
  try {
    const response = await apiClient.get(`/reports/${reportId}`);
    return {
      success: true,
      data: (response.data as any).report
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const scheduleReport = async (scheduleConfig: {
  reportId: string;
  scheduleConfig: any;
  deliveryMethod: string;
  deliveryConfig?: any;
}) => {
  try {
    const response = await apiClient.post('/reports/schedule', scheduleConfig);
    return {
      success: true,
      data: (response.data as any).subscription
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

export const getScheduledReports = async () => {
  try {
    const response = await apiClient.get('/reports/scheduled');
    return {
      success: true,
      data: (response.data as any).scheduledReports
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    };
  }
};

// Analytics Service Status
export const getAnalyticsServiceHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || { code: 'SERVICE_UNAVAILABLE', message: 'Analytics service unavailable' },
    };
  }
};

const analyticsApi = {
  // Dashboard
  getRoleDashboard,
  getKPIMetrics,
  getRealTimeDashboard,
  
  // Sales Analytics
  getSalesAnalytics,
  getSalesTrends,
  getProductPerformance,
  getRevenueAnalytics,
  
  // Inventory Analytics
  getInventoryAnalytics,
  getInventoryTurnover,
  getWasteAnalysis,
  getSupplierPerformance,
  
  // Location Analytics
  getLocationAnalytics,
  getLocationMapData,
  getLocationHeatmap,
  
  // Custom Reports
  generateCustomReport,
  getReport,
  scheduleReport,
  getScheduledReports,
  
  // Health
  getAnalyticsServiceHealth,
};

export default analyticsApi;
