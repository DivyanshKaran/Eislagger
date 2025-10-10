// Notification hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { notificationKeys } from '@/services/queryKeys';
import type { 
  GetNotificationsRequest, 
  MarkNotificationReadRequest 
} from '@/types/api/index';
import type { Notification } from '@/types/models';

// ============================================================================
// NOTIFICATION QUERIES
// ============================================================================

// Get notifications with pagination and filters
export function useNotifications(params?: GetNotificationsRequest) {
  const defaultParams: GetNotificationsRequest = { page: 1, limit: 50, ...(params || {}) } as GetNotificationsRequest;
  return useQuery({
    queryKey: notificationKeys.list(defaultParams),
    queryFn: async () => {
      const response = await dataService.notification.getNotifications(defaultParams);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch notifications');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });
}

// ============================================================================
// NOTIFICATION MUTATIONS
// ============================================================================

// Create notification mutation
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Notification>) => {
      const response = await dataService.notification.createNotification(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create notification');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
    onError: (error) => {
      console.error('Create notification failed:', error);
    },
  });
}

// Mark notification as read mutation
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.notification.markNotificationAsRead(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark notification as read');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
    onError: (error) => {
      console.error('Mark notification as read failed:', error);
    },
  });
}

// Delete notification mutation
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.notification.deleteNotification(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete notification');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete notification failed:', error);
    },
  });
}

// Mark all notifications as read mutation
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await dataService.notification.markAllNotificationsAsRead();
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark all notifications as read');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
    onError: (error) => {
      console.error('Mark all notifications as read failed:', error);
    },
  });
}

// ============================================================================
// NOTIFICATION UTILITIES
// ============================================================================

// Get unread notification count
export function useUnreadNotificationCount() {
  const { data: notificationsResponse } = useNotifications({ page: 1, limit: 1000 } as GetNotificationsRequest);
  
  const unreadCount = notificationsResponse?.data?.filter(notification => !notification.read).length || 0;
  
  return {
    unreadCount,
    isLoading: !notificationsResponse,
  };
}

// Get notifications by type
export function useNotificationsByType(type: string) {
  return useNotifications({ page: 1, type, limit: 50 } as GetNotificationsRequest);
}

// Get recent notifications
export function useRecentNotifications(limit: number = 10) {
  return useNotifications({ page: 1, limit, sortBy: 'createdAt', sortOrder: 'desc' } as GetNotificationsRequest);
}
