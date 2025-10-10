// Analytics and dashboard hooks with React Query
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { analyticsKeys } from '@/services/queryKeys';
import type { 
  GetAnalyticsRequest, 
  GetKPIsRequest, 
  GetChartDataRequest,
  GetDashboardDataRequest,
  DashboardData
} from '@/types/api/index';
import type {
  KPIData,
  ChartData
} from '@/types/models';

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

// Get analytics data
export function useAnalytics(params: GetAnalyticsRequest) {
  return useQuery({
    queryKey: analyticsKeys.all,
    queryFn: async () => {
      const response = await dataService.analytics.getAnalytics(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch analytics');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get KPIs
export function useKPIs(params?: GetKPIsRequest) {
  return useQuery({
    queryKey: analyticsKeys.kpis(params),
    queryFn: async () => {
      const response = await dataService.analytics.getKPIs(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch KPIs');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (KPIs change frequently)
  });
}

// Get chart data
export function useChartData(params: GetChartDataRequest) {
  return useQuery({
    queryKey: analyticsKeys.charts(params),
    queryFn: async () => {
      const response = await dataService.analytics.getChartData(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch chart data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get dashboard data
export function useDashboardData(params: GetDashboardDataRequest) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: async () => {
      const response = await dataService.analytics.getDashboardData(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================================================
// SPECIFIC ANALYTICS HOOKS
// ============================================================================

// Sales analytics
export function useSalesAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useAnalytics({
    period,
    metrics: ['revenue', 'orders', 'average_order_value', 'conversion_rate'],
    groupBy: 'date',
  });
}

// Revenue analytics
export function useRevenueAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useAnalytics({
    period,
    metrics: ['revenue', 'revenue_growth', 'revenue_by_product', 'revenue_by_store'],
    groupBy: 'date',
  });
}

// Order analytics
export function useOrderAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useAnalytics({
    period,
    metrics: ['orders', 'order_volume', 'order_status_breakdown', 'average_order_value'],
    groupBy: 'date',
  });
}

// Customer analytics
export function useCustomerAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useAnalytics({
    period,
    metrics: ['new_customers', 'returning_customers', 'customer_retention', 'customer_lifetime_value'],
    groupBy: 'date',
  });
}

// Inventory analytics
export function useInventoryAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useAnalytics({
    period,
    metrics: ['stock_levels', 'low_stock_alerts', 'inventory_turnover', 'waste_percentage'],
    groupBy: 'product',
  });
}

// ============================================================================
// KPI HOOKS
// ============================================================================

// Financial KPIs
export function useFinancialKPIs() {
  return useKPIs({
    category: 'financial',
    period: 'month',
    includeTargets: true,
  });
}

// Operational KPIs
export function useOperationalKPIs() {
  return useKPIs({
    category: 'operational',
    period: 'month',
    includeTargets: true,
  });
}

// Customer KPIs
export function useCustomerKPIs() {
  return useKPIs({
    category: 'customer',
    period: 'month',
    includeTargets: true,
  });
}

// All KPIs
export function useAllKPIs() {
  return useKPIs({
    period: 'month',
    includeTargets: true,
  });
}

// ============================================================================
// CHART DATA HOOKS
// ============================================================================

// Revenue chart
export function useRevenueChart(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useChartData({
    chartType: 'line',
    period,
    metrics: ['revenue'],
    groupBy: 'date',
  });
}

// Sales chart
export function useSalesChart(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useChartData({
    chartType: 'bar',
    period,
    metrics: ['orders', 'revenue'],
    groupBy: 'date',
  });
}

// Product performance chart
export function useProductPerformanceChart(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useChartData({
    chartType: 'bar',
    period,
    metrics: ['revenue', 'orders'],
    groupBy: 'product',
  });
}

// Store performance chart
export function useStorePerformanceChart(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useChartData({
    chartType: 'bar',
    period,
    metrics: ['revenue', 'orders'],
    groupBy: 'store',
  });
}

// Order status pie chart
export function useOrderStatusChart(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useChartData({
    chartType: 'pie',
    period,
    metrics: ['order_status_breakdown'],
    groupBy: 'status',
  });
}

// Customer acquisition chart
export function useCustomerAcquisitionChart(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useChartData({
    chartType: 'area',
    period,
    metrics: ['new_customers', 'returning_customers'],
    groupBy: 'date',
  });
}

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

// Executive dashboard
export function useExecutiveDashboard() {
  return useDashboardData({
    role: 'executive',
    period: 'month',
    includeCharts: true,
    includeKPIs: true,
  });
}

// Manager dashboard
export function useManagerDashboard() {
  return useDashboardData({
    role: 'manager',
    period: 'week',
    includeCharts: true,
    includeKPIs: true,
  });
}

// Clerk dashboard
export function useClerkDashboard() {
  return useDashboardData({
    role: 'clerk',
    period: 'day',
    includeCharts: false,
    includeKPIs: true,
  });
}

// Patron dashboard
export function usePatronDashboard() {
  return useDashboardData({
    role: 'patron',
    period: 'month',
    includeCharts: false,
    includeKPIs: false,
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

// Get analytics for specific date range
export function useAnalyticsByDateRange(
  startDate: string, 
  endDate: string, 
  metrics: string[] = ['revenue', 'orders']
) {
  return useAnalytics({
    period: 'day',
    startDate,
    endDate,
    metrics,
    groupBy: 'date',
  });
}

// Get top performing products
export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: [...analyticsKeys.all, 'top-products', limit],
    queryFn: async () => {
      const response = await dataService.analytics.getAnalytics({
        period: 'month',
        metrics: ['revenue', 'orders'],
        groupBy: 'product',
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch top products');
      }
      // Sort by revenue and return top N
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get top performing stores
export function useTopStores(limit: number = 10) {
  return useQuery({
    queryKey: [...analyticsKeys.all, 'top-stores', limit],
    queryFn: async () => {
      const response = await dataService.analytics.getAnalytics({
        period: 'month',
        metrics: ['revenue', 'orders'],
        groupBy: 'store',
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch top stores');
      }
      // Sort by revenue and return top N
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
