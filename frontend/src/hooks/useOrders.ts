// Order management hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { orderKeys } from '@/services/queryKeys';
import type { 
  GetOrdersRequest, 
  CreateOrderRequest, 
  UpdateOrderStatusRequest
} from '@/types/api/index';
import type { Order } from '@/types/models';

// ============================================================================
// ORDER QUERIES
// ============================================================================

// Get all orders with filters
export function useOrders(params?: GetOrdersRequest) {
  const defaultParams = { page: 1, limit: 20, ...params };
  return useQuery({
    queryKey: orderKeys.list(defaultParams),
    queryFn: async () => {
      const response = await dataService.order.getOrders(defaultParams);
      // GetOrdersResponse extends PaginatedResponse<Order>, so it has data directly
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute (orders change frequently)
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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get orders by user ID
export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: orderKeys.user(userId),
    queryFn: async () => {
      const response = await dataService.order.getOrders({ page: 1, limit: 20, userId });
      // GetOrdersResponse extends PaginatedResponse<Order>, so it has data directly
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get orders by status
export function useOrdersByStatus(status: string) {
  return useQuery({
    queryKey: orderKeys.status(status),
    queryFn: async () => {
      const response = await dataService.order.getOrders({ page: 1, limit: 20, status });
      // GetOrdersResponse extends PaginatedResponse<Order>, so it has data directly
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get pending orders
export function usePendingOrders() {
  return useOrdersByStatus('pending');
}

// Get confirmed orders
export function useConfirmedOrders() {
  return useOrdersByStatus('confirmed');
}

// Get preparing orders
export function usePreparingOrders() {
  return useOrdersByStatus('preparing');
}

// Get ready orders
export function useReadyOrders() {
  return useOrdersByStatus('ready');
}

// ============================================================================
// ORDER MUTATIONS
// ============================================================================

// Create order mutation
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
    onSuccess: (newOrder) => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      // Add the new order to the cache
      queryClient.setQueryData(orderKeys.detail(String(newOrder.id)), newOrder);
      
      // Invalidate user orders if applicable
      if (newOrder.userId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.user(newOrder.userId) });
      }
      
      // Invalidate status-specific queries
      queryClient.invalidateQueries({ queryKey: orderKeys.status(newOrder.status) });
    },
    onError: (error) => {
      console.error('Create order failed:', error);
    },
  });
}

// Update order status mutation
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
    onSuccess: (updatedOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(String(updatedOrder.id)), updatedOrder);
      
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      // Invalidate status-specific queries
      queryClient.invalidateQueries({ queryKey: orderKeys.status(updatedOrder.status) });
      
      // Invalidate user orders if applicable
      if (updatedOrder.userId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.user(updatedOrder.userId) });
      }
    },
    onError: (error) => {
      console.error('Update order status failed:', error);
    },
  });
}

// Cancel order mutation
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.order.cancelOrder(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel order');
      }
      return id;
    },
    onSuccess: (cancelledId) => {
      // Remove the order from cache
      queryClient.removeQueries({ queryKey: orderKeys.detail(cancelledId) });
      
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      // Invalidate all status queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error) => {
      console.error('Cancel order failed:', error);
    },
  });
}

// Quick status update mutations (optimistic updates)
export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.order.updateOrderStatus(id, { status: 'confirmed' });
      if (!response.success) {
        throw new Error(response.error || 'Failed to confirm order');
      }
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(id));
      
      if (previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), {
          ...previousOrder,
          status: 'confirmed',
        });
      }
      
      return { previousOrder };
    },
    onError: (err, id, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousOrder);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useMarkOrderPreparing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.order.updateOrderStatus(id, { status: 'preparing' });
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark order as preparing');
      }
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(id));
      
      if (previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), {
          ...previousOrder,
          status: 'preparing',
        });
      }
      
      return { previousOrder };
    },
    onError: (err, id, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousOrder);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useMarkOrderReady() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.order.updateOrderStatus(id, { status: 'ready' });
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark order as ready');
      }
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(id));
      
      if (previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), {
          ...previousOrder,
          status: 'ready',
        });
      }
      
      return { previousOrder };
    },
    onError: (err, id, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousOrder);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useMarkOrderDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.order.updateOrderStatus(id, { status: 'delivered' });
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark order as delivered');
      }
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(id));
      
      if (previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), {
          ...previousOrder,
          status: 'delivered',
        });
      }
      
      return { previousOrder };
    },
    onError: (err, id, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousOrder);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

// ============================================================================
// ORDER UTILITIES
// ============================================================================

// Get orders by date range
export function useOrdersByDateRange(dateFrom: string, dateTo: string) {
  return useOrders({ page: 1, limit: 20, dateFrom, dateTo });
}

// Get recent orders
export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: [...orderKeys.all, 'recent', limit],
    queryFn: async () => {
      const response = await dataService.order.getOrders({ 
        page: 1,
        limit: limit,
        // Add sorting by date desc and limit
      });
      // GetOrdersResponse extends PaginatedResponse<Order>, so it has data.data
      return response.data.data.slice(0, limit);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
