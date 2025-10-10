// Dashboard hooks with React Query
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { dashboardKeys } from '@/services/queryKeys';
import type { 
  GetDashboardDataRequest,
  GetKPIsRequest,
  GetChartDataRequest,
  GetAnalyticsRequest
} from '@/types/api/index';
import type { DashboardData } from '@/types/api/index';
import type { KPIData, ChartData } from '@/types/models';

// ============================================================================
// DASHBOARD QUERIES
// ============================================================================

// Get dashboard data for a specific role
export function useDashboardData(role: string, params?: GetDashboardDataRequest) {
  return useQuery({
    queryKey: dashboardKeys.stats(role),
    queryFn: async () => {
      const requestParams = params || { role };
      const response = await dataService.analytics.getDashboardData(requestParams);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

// Get KPIs for dashboard
export function useKPIs(params?: GetKPIsRequest) {
  return useQuery({
    queryKey: dashboardKeys.stats('kpis'),
    queryFn: async () => {
      const response = await dataService.analytics.getKPIs(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch KPIs');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get chart data for dashboard
export function useChartData(params: GetChartDataRequest) {
  return useQuery({
    queryKey: dashboardKeys.stats('charts'),
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

// Get analytics reports
export function useAnalyticsReports(params?: GetAnalyticsRequest) {
  return useQuery({
    queryKey: dashboardKeys.stats('reports'),
    queryFn: async () => {
      const requestParams: GetAnalyticsRequest = params || { period: 'month' };
      const response = await dataService.analytics.getAnalytics(requestParams);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch analytics reports');
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// ROLE-SPECIFIC DASHBOARD HOOKS
// ============================================================================

// Patron dashboard data
export function usePatronDashboard() {
  return useDashboardData('patron', {
    role: 'patron',
    period: 'week',
    includeCharts: true,
    includeKPIs: true,
  });
}

// Clerk dashboard data
export function useClerkDashboard() {
  return useDashboardData('clerk', {
    role: 'clerk',
    period: 'week',
    includeCharts: true,
    includeKPIs: true,
  });
}

// Manufacturer dashboard data
export function useManufacturerDashboard() {
  return useDashboardData('manufacturer', {
    role: 'manufacturer',
    period: 'month',
    includeCharts: true,
    includeKPIs: true,
  });
}

// Executive dashboard data
export function useExecutiveDashboard() {
  return useDashboardData('executive', {
    role: 'executive',
    period: 'month',
    includeCharts: true,
    includeKPIs: true,
  });
}

// ============================================================================
// DASHBOARD UTILITIES
// ============================================================================

// Get recent activity for dashboard
export function useRecentActivity(role: string, limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.recent(role),
    queryFn: async () => {
      // This would typically come from a specific endpoint
      // For now, we'll use the general dashboard data
      const response = await dataService.analytics.getDashboardData({ role, period: 'week' });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch recent activity');
      }
      const activity = response.data.recentActivity || [];
      return activity.slice(0, limit);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get dashboard summary stats
export function useDashboardSummary(role: string) {
  return useQuery({
    queryKey: [...dashboardKeys.stats(role), 'summary'],
    queryFn: async () => {
      const response = await dataService.analytics.getKPIs({
        period: 'week',
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard summary');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get sales trends for dashboard
export function useSalesTrends(period: string = 'month') {
  return useChartData({
    chartType: 'line',
    period,
    metrics: ['sales'],
  });
}

// Get inventory status for dashboard
export function useInventoryStatus() {
  return useQuery({
    queryKey: [...dashboardKeys.stats('inventory'), 'status'],
    queryFn: async () => {
      // This would typically come from inventory service
      // For now, we'll return mock data
      return {
        totalItems: 150,
        lowStock: 12,
        outOfStock: 3,
        expiringSoon: 8,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get user activity for dashboard
export function useUserActivity(period: string = '7d') {
  return useQuery({
    queryKey: [...dashboardKeys.stats('users'), 'activity', period],
    queryFn: async () => {
      // This would typically come from analytics service
      // For now, we'll return mock data
      return {
        totalUsers: 1250,
        activeUsers: 890,
        newUsers: 45,
        returningUsers: 845,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
