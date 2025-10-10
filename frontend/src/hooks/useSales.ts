// Sales hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { orderKeys, storeKeys, salesKeys } from '@/services/queryKeys';
import type { 
  GetOrdersRequest,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  GetStoresRequest,
  CreateStoreRequest
} from '@/types/api/index';
import type { Order, Store } from '@/types/models';

// ============================================================================
// ORDER QUERIES
// ============================================================================

// Get orders with pagination and filters
export function useOrders(params?: GetOrdersRequest) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const response = await dataService.order.getOrders(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch orders');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get single order by ID
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await dataService.order.getOrder(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch order');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get recent orders
export function useRecentOrders(limit: number = 10) {
  return useOrders({ 
    page: 1,
    limit, 
    sortBy: 'createdAt', 
    sortOrder: 'desc' 
  });
}

// Get orders by status
export function useOrdersByStatus(status: string) {
  return useOrders({ page: 1, status, limit: 100 });
}

// Get user orders
export function useUserOrders(userId: string) {
  return useOrders({ page: 1, userId, limit: 100 });
}

// ============================================================================
// ORDER MUTATIONS
// ============================================================================

// Create new order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const response = await dataService.order.createOrder(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create order');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: salesKeys.revenue() });
    },
    onError: (error) => {
      console.error('Create order failed:', error);
    },
  });
}

// Update order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) => {
      const response = await dataService.order.updateOrderStatus(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update order status');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update specific order in cache
      queryClient.setQueryData(orderKeys.detail(variables.id), data);
      
      // Invalidate order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Update order status failed:', error);
    },
  });
}

// Cancel order
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.order.cancelOrder(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel order');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Cancel order failed:', error);
    },
  });
}

// ============================================================================
// STORE QUERIES
// ============================================================================

// Get stores with pagination and filters
export function useStores(params?: GetStoresRequest) {
  return useQuery({
    queryKey: storeKeys.list(params),
    queryFn: async () => {
      const response = await dataService.store.getStores(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch stores');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single store by ID
export function useStore(id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: async () => {
      const response = await dataService.store.getStore(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get nearby stores
export function useNearbyStores(lat: number, lng: number, radius: number = 10) {
  return useQuery({
    queryKey: storeKeys.nearby(lat, lng),
    queryFn: async () => {
      // Backend doesn't support geospatial filters yet; fallback to active stores
      const response = await dataService.store.getStores({ page: 1, limit: 50, isActive: true });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nearby stores');
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// STORE MUTATIONS
// ============================================================================

// Create new store
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoreRequest) => {
      const response = await dataService.store.createStore(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create store');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate store queries
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
    onError: (error) => {
      console.error('Create store failed:', error);
    },
  });
}

// Update store
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateStoreRequest> }) => {
      const response = await dataService.store.updateStore(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update store');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update specific store in cache
      queryClient.setQueryData(storeKeys.detail(variables.id), data);
      
      // Invalidate store queries
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
    onError: (error) => {
      console.error('Update store failed:', error);
    },
  });
}

// Delete store
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.store.deleteStore(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete store');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate store queries
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete store failed:', error);
    },
  });
}

// ============================================================================
// SALES UTILITIES
// ============================================================================

// Get sales revenue
export function useSalesRevenue(period: string = '30d') {
  return useQuery({
    queryKey: salesKeys.revenue(),
    queryFn: async () => {
      // This would typically come from analytics service
      // For now, we'll calculate from orders
      const response = await dataService.order.getOrders({ 
        page: 1,
        limit: 1000
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch sales revenue');
      }
      
      const orders = response.data.data;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const completedOrders = orders.filter(order => order.status === 'delivered');
      const completedRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        totalRevenue,
        completedRevenue,
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        averageOrderValue: totalRevenue / orders.length,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get top products
export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: salesKeys.topProducts(),
    queryFn: async () => {
      // This would typically come from analytics service
      // For now, we'll return mock data
      return [
        { id: '1', name: 'Vanilla Ice Cream', sales: 1250, revenue: 6250 },
        { id: '2', name: 'Chocolate Ice Cream', sales: 980, revenue: 4900 },
        { id: '3', name: 'Strawberry Ice Cream', sales: 750, revenue: 3750 },
        { id: '4', name: 'Mint Chocolate Chip', sales: 650, revenue: 3250 },
        { id: '5', name: 'Cookies & Cream', sales: 580, revenue: 2900 },
      ];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get sales trends
export function useSalesTrends(period: string = '30d') {
  return useQuery({
    queryKey: salesKeys.trends(),
    queryFn: async () => {
      // This would typically come from analytics service
      // For now, we'll return mock data
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 365;
      const trends = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trends.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 1000) + 500,
          orders: Math.floor(Math.random() * 50) + 20,
        });
      }
      
      return trends;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get sales reports
export function useSalesReports(period: string = '30d') {
  return useQuery({
    queryKey: salesKeys.reports(),
    queryFn: async () => {
      // This would typically come from analytics service
      // For now, we'll return mock data
      return {
        period,
        totalRevenue: 45000,
        totalOrders: 1250,
        averageOrderValue: 36,
        topStore: 'Downtown Location',
        growthRate: 12.5,
        refundRate: 2.1,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get store analytics
export function useStoreAnalytics(storeId: string) {
  return useQuery({
    queryKey: storeKeys.analytics(storeId),
    queryFn: async () => {
      const response = await dataService.store.getStoreAnalytics(storeId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store analytics');
      }
      return response.data;
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get store menu
export function useStoreMenu(storeId: string) {
  return useQuery({
    queryKey: storeKeys.menu(storeId),
    queryFn: async () => {
      const response = await dataService.store.getStoreMenu(storeId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store menu');
      }
      return response.data;
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get store inventory
export function useStoreInventory(storeId: string) {
  return useQuery({
    queryKey: storeKeys.inventory(storeId),
    queryFn: async () => {
      const response = await dataService.store.getStoreInventory(storeId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store inventory');
      }
      return response.data;
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
