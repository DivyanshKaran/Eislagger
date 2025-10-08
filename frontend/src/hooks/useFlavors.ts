// Flavor management hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { flavorKeys } from '@/services/queryKeys';
import type { 
  GetFlavorsRequest, 
  CreateFlavorRequest, 
  UpdateFlavorRequest
} from '@/types/api';
import type { Flavor } from '@/types/models';

// ============================================================================
// FLAVOR QUERIES
// ============================================================================

// Get all flavors with filters
export function useFlavors(params?: GetFlavorsRequest) {
  return useQuery({
    queryKey: flavorKeys.list(params || {}),
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors(params);
      // GetFlavorsResponse extends PaginatedResponse<Flavor>, so it has data directly
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get single flavor by ID
export function useFlavor(id: string) {
  return useQuery<Flavor>({
    queryKey: flavorKeys.detail(id),
    queryFn: async (): Promise<Flavor> => {
      const response = await dataService.flavor.getFlavor(id);
      // GetFlavorResponse extends ApiResponse<Flavor>, so it has success and data
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch flavor');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get popular flavors
export function usePopularFlavors() {
  return useQuery({
    queryKey: flavorKeys.popular(),
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors({ 
        page: 1,
        limit: 10,
        available: true,
        // Add sorting by popularity/rating
      });
      // GetFlavorsResponse extends PaginatedResponse<Flavor>, so it has data directly
      // Return top 10 by rating
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// FLAVOR MUTATIONS
// ============================================================================

// Create flavor mutation
export function useCreateFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFlavorRequest) => {
      const response = await dataService.flavor.createFlavor(data);
      // CreateFlavorResponse extends ApiResponse<Flavor>, so it has success and data
      if (!response.success) {
        throw new Error(response.error || 'Failed to create flavor');
      }
      return response.data;
    },
    onSuccess: (newFlavor) => {
      // Invalidate flavors list to refetch
      queryClient.invalidateQueries({ queryKey: flavorKeys.lists() });
      
      // Add the new flavor to the cache
      queryClient.setQueryData(flavorKeys.detail(String(newFlavor.id)), newFlavor);
      
      // Update popular flavors if applicable
      queryClient.invalidateQueries({ queryKey: flavorKeys.popular() });
    },
    onError: (error) => {
      console.error('Create flavor failed:', error);
    },
  });
}

// Update flavor mutation
export function useUpdateFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFlavorRequest }) => {
      const response = await dataService.flavor.updateFlavor(id, data);
      // UpdateFlavorResponse extends ApiResponse<Flavor>, so it has success and data
      if (!response.success) {
        throw new Error(response.error || 'Failed to update flavor');
      }
      return response.data;
    },
    onSuccess: (updatedFlavor) => {
      // Update the specific flavor in cache
      queryClient.setQueryData(flavorKeys.detail(String(updatedFlavor.id)), updatedFlavor);
      
      // Invalidate flavors list to refetch
      queryClient.invalidateQueries({ queryKey: flavorKeys.lists() });
      
      // Update popular flavors if applicable
      queryClient.invalidateQueries({ queryKey: flavorKeys.popular() });
    },
    onError: (error) => {
      console.error('Update flavor failed:', error);
    },
  });
}

// Delete flavor mutation
export function useDeleteFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.flavor.deleteFlavor(id);
      // AuthResponse extends ApiResponse, so it has success
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete flavor');
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the flavor from cache
      queryClient.removeQueries({ queryKey: flavorKeys.detail(String(deletedId)) });
      
      // Invalidate flavors list to refetch
      queryClient.invalidateQueries({ queryKey: flavorKeys.lists() });
      
      // Update popular flavors
      queryClient.invalidateQueries({ queryKey: flavorKeys.popular() });
    },
    onError: (error) => {
      console.error('Delete flavor failed:', error);
    },
  });
}

// Toggle flavor availability (optimistic update)
export function useToggleFlavorAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      const response = await dataService.flavor.updateFlavor(id, { isAvailable });
      // UpdateFlavorResponse extends ApiResponse<Flavor>, so it has success and data
      if (!response.success) {
        throw new Error(response.error || 'Failed to toggle flavor availability');
      }
      return response.data;
    },
    onMutate: async ({ id, isAvailable }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: flavorKeys.detail(String(id)) });

      // Snapshot the previous value
      const previousFlavor = queryClient.getQueryData<Flavor>(flavorKeys.detail(String(id)));

      // Optimistically update to the new value
      if (previousFlavor) {
        queryClient.setQueryData(flavorKeys.detail(String(id)), {
          ...previousFlavor,
          isAvailable,
        });
      }

      // Return a context object with the snapshotted value
      return { previousFlavor };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFlavor) {
        queryClient.setQueryData(flavorKeys.detail(String(id)), context.previousFlavor);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: flavorKeys.detail(String(id)) });
      queryClient.invalidateQueries({ queryKey: flavorKeys.lists() });
    },
  });
}

// ============================================================================
// FLAVOR UTILITIES
// ============================================================================

// Get flavors by category
export function useFlavorsByCategory(category: string) {
  return useFlavors({ page: 1, limit: 20, category, available: true });
}

// Search flavors
export function useSearchFlavors(searchTerm: string) {
  return useFlavors({ 
    page: 1,
    limit: 20,
    search: searchTerm,
    available: true 
  });
}

// Get available flavors only
export function useAvailableFlavors() {
  return useFlavors({ page: 1, limit: 20, available: true });
}

// Get flavors by price range
export function useFlavorsByPriceRange(minPrice: number, maxPrice: number) {
  return useFlavors({ 
    page: 1,
    limit: 20,
    minPrice, 
    maxPrice,
    available: true 
  });
}
