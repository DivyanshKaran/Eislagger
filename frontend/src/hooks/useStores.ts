// Store management hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { storeKeys } from '@/services/queryKeys';
import type { 
  GetStoresRequest, 
  CreateStoreRequest
} from '@/types/api/index';
import type { Store } from '@/types/models';

// ============================================================================
// STORE QUERIES
// ============================================================================

// Get all stores with filters
export function useStores(params?: GetStoresRequest) {
  const defaultParams = { page: 1, limit: 20, ...params };
  return useQuery({
    queryKey: storeKeys.list(defaultParams),
    queryFn: async () => {
      const response = await dataService.store.getStores(defaultParams);
      // GetStoresResponse extends PaginatedResponse<Store>, so it has data directly
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single store by ID
export function useStore(id: string) {
  return useQuery<Store>({
    queryKey: storeKeys.detail(id),
    queryFn: async (): Promise<Store> => {
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

// Get store menu
export function useStoreMenu(storeId: string) {
  return useQuery({
    queryKey: storeKeys.menu(storeId),
    queryFn: async () => {
      const response = await dataService.store.getStoreMenu(storeId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store menu');
      }
      // TODO: Fix API to return proper menu data structure
      return null;
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes (menu doesn't change often)
  });
}

// Get store inventory
export function useStoreInventory(storeId: string) {
  return useQuery<any[]>({
    queryKey: storeKeys.inventory(storeId),
    queryFn: async (): Promise<any[]> => {
      const response = await dataService.store.getStoreInventory(storeId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store inventory');
      }
      // TODO: Fix API to return proper inventory data structure
      return [];
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes (inventory changes frequently)
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
      // TODO: Fix API to return proper analytics data structure
      return null;
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get store reviews
export function useStoreReviews(storeId: string) {
  return useQuery({
    queryKey: storeKeys.reviews(storeId),
    queryFn: async () => {
      // This would need to be implemented in the backend
      // For now, return empty array
      return [];
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// STORE MUTATIONS
// ============================================================================

// Create store mutation (Executive only)
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
    onSuccess: (newStore) => {
      // Invalidate stores list to refetch
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      
      // Add the new store to the cache
      queryClient.setQueryData(storeKeys.detail(String(newStore.id)), newStore);
    },
    onError: (error) => {
      console.error('Create store failed:', error);
    },
  });
}

// Update store mutation (Executive only)
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
    onSuccess: (updatedStore) => {
      // Update the specific store in cache
      queryClient.setQueryData(storeKeys.detail(String(updatedStore.id)), updatedStore);
      
      // Invalidate stores list to refetch
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      
      // Invalidate related data
      queryClient.invalidateQueries({ queryKey: storeKeys.menu(String(updatedStore.id)) });
      queryClient.invalidateQueries({ queryKey: storeKeys.inventory(String(updatedStore.id)) });
      queryClient.invalidateQueries({ queryKey: storeKeys.analytics(String(updatedStore.id)) });
    },
    onError: (error) => {
      console.error('Update store failed:', error);
    },
  });
}

// Delete store mutation (Executive only)
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.store.deleteStore(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete store');
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the store from cache
      queryClient.removeQueries({ queryKey: storeKeys.detail(deletedId) });
      
      // Remove related data
      queryClient.removeQueries({ queryKey: storeKeys.menu(deletedId) });
      queryClient.removeQueries({ queryKey: storeKeys.inventory(deletedId) });
      queryClient.removeQueries({ queryKey: storeKeys.analytics(deletedId) });
      queryClient.removeQueries({ queryKey: storeKeys.reviews(deletedId) });
      
      // Invalidate stores list to refetch
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete store failed:', error);
    },
  });
}

// Toggle store active status (optimistic update)
export function useToggleStoreStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await dataService.store.updateStore(id, { isActive } as any);
      if (!response.success) {
        throw new Error(response.error || 'Failed to toggle store status');
      }
      return response.data;
    },
    onMutate: async ({ id, isActive }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: storeKeys.detail(id) });

      // Snapshot the previous value
      const previousStore = queryClient.getQueryData<Store>(storeKeys.detail(id));

      // Optimistically update to the new value
      if (previousStore) {
        queryClient.setQueryData(storeKeys.detail(id), {
          ...previousStore,
          isActive,
        });
      }

      // Return a context object with the snapshotted value
      return { previousStore };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousStore) {
        queryClient.setQueryData(storeKeys.detail(id), context.previousStore);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
}

// ============================================================================
// STORE UTILITIES
// ============================================================================

// Get active stores only
export function useActiveStores() {
  return useStores({ page: 1, limit: 20, isActive: true });
}

// Get stores by city
export function useStoresByCity(city: string) {
  return useStores({ page: 1, limit: 20, city, isActive: true });
}

// Get stores by state
export function useStoresByState(state: string) {
  return useStores({ page: 1, limit: 20, state, isActive: true });
}

// Get nearby stores (would need location data)
export function useNearbyStores(lat: number, lng: number, radius: number = 10) {
  return useQuery({
    queryKey: [...storeKeys.all, 'nearby', lat, lng, radius],
    queryFn: async () => {
      // This would need to be implemented in the backend
      // For now, return all active stores
      const response = await dataService.store.getStores({ page: 1, limit: 20, isActive: true });
      // GetStoresResponse extends PaginatedResponse<Store>, so it has data directly
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get store statistics
export function useStoreStats() {
  return useQuery({
    queryKey: [...storeKeys.all, 'stats'],
    queryFn: async () => {
      const response = await dataService.store.getStores({ page: 1, limit: 20 });
      // GetStoresResponse extends PaginatedResponse<Store>, so it has data.data
      
      const stores = response.data.data;
      return {
        total: stores.length,
        active: stores.filter(store => store.isActive).length,
        inactive: stores.filter(store => !store.isActive).length,
        totalCapacity: stores.reduce((sum, store) => sum + store.capacity, 0),
        totalOccupancy: stores.reduce((sum, store) => sum + store.currentOccupancy, 0),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
