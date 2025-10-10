// Inventory hooks with React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/DataService';
import { inventoryKeys } from '@/services/queryKeys';
import type { 
  GetFlavorsRequest,
  CreateFlavorRequest,
  UpdateFlavorRequest
} from '@/types/api/index';
import type { Flavor } from '@/types/models';

// ============================================================================
// INVENTORY QUERIES
// ============================================================================

// Get all flavors/inventory items
export function useInventoryItems(params?: GetFlavorsRequest) {
  const defaultParams: GetFlavorsRequest = { page: 1, limit: 50, ...(params || {}) };
  return useQuery({
    queryKey: [...inventoryKeys.items(), defaultParams],
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors(defaultParams);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch inventory items');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single flavor/inventory item
export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: [...inventoryKeys.items(), 'detail', id],
    queryFn: async () => {
      const response = await dataService.flavor.getFlavor(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch inventory item');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get low stock items
export function useLowStockItems() {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors({ page: 1, limit: 100, available: true });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch low stock items');
      }
      // Low stock derived from flavor.stock
      const items = response.data.data.filter(item => item.stock < 10);
      return { ...response.data, data: items } as any;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get expiring items
export function useExpiringItems() {
  return useQuery({
    queryKey: inventoryKeys.expiring(),
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors({ page: 1, limit: 100, available: true });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch expiring items');
      }
      // No expiry in Flavor model; return empty set for now
      return { ...response.data, data: [] } as any;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get stock levels
export function useStockLevels() {
  return useQuery({
    queryKey: inventoryKeys.stock(),
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors({ page: 1, limit: 1000 });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch stock levels');
      }
      
      // Calculate stock statistics
      const items = response.data.data;
      const totalItems = items.length;
      const lowStock = items.filter(item => item.stock < 10).length;
      const outOfStock = items.filter(item => item.stock === 0).length;
      const expiringSoon = 0;
      
      return {
        totalItems,
        lowStock,
        outOfStock,
        expiringSoon,
        items,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================================================
// INVENTORY MUTATIONS
// ============================================================================

// Create new inventory item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFlavorRequest) => {
      const response = await dataService.flavor.createFlavor(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create inventory item');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate inventory queries
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock() });
    },
    onError: (error) => {
      console.error('Create inventory item failed:', error);
    },
  });
}

// Update inventory item
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFlavorRequest }) => {
      const response = await dataService.flavor.updateFlavor(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update inventory item');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update specific item in cache
      queryClient.setQueryData(inventoryKeys.detail(variables.id), data);
      
      // Invalidate inventory queries
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock() });
    },
    onError: (error) => {
      console.error('Update inventory item failed:', error);
    },
  });
}

// Delete inventory item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dataService.flavor.deleteFlavor(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete inventory item');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate inventory queries
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock() });
    },
    onError: (error) => {
      console.error('Delete inventory item failed:', error);
    },
  });
}

// ============================================================================
// INVENTORY UTILITIES
// ============================================================================

// Get inventory categories
export function useInventoryCategories() {
  return useQuery({
    queryKey: [...inventoryKeys.all, 'categories'],
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors({ page: 1, limit: 1000 });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories');
      }
      
      // Extract unique categories
      const categories = [...new Set(response.data.data.map(item => item.category))];
      return categories;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get inventory by category
export function useInventoryByCategory(category: string) {
  return useInventoryItems({ page: 1, limit: 100, category });
}

// Search inventory items
export function useSearchInventory(searchTerm: string) {
  return useInventoryItems({ 
    page: 1,
    search: searchTerm, 
    limit: 50 
  });
}

// Get inventory statistics
export function useInventoryStats() {
  return useQuery({
    queryKey: [...inventoryKeys.all, 'stats'],
    queryFn: async () => {
      const response = await dataService.flavor.getFlavors({ page: 1, limit: 1000 });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch inventory stats');
      }
      
      const items = response.data.data;
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
      const averageStock = items.reduce((sum, item) => sum + item.stock, 0) / items.length;
      
      return {
        totalItems: items.length,
        totalValue,
        averageStock: Math.round(averageStock),
        categories: [...new Set(items.map(item => item.category))].length,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get suppliers (mock data for now)
export function useSuppliers() {
  return useQuery({
    queryKey: inventoryKeys.suppliers(),
    queryFn: async () => {
      // This would typically come from inventory service
      // For now, we'll return mock data
      return [
        {
          id: '1',
          name: 'Dairy Suppliers Inc.',
          contact: 'John Smith',
          email: 'john@dairysuppliers.com',
          phone: '+1-555-0123',
          rating: 4.8,
          status: 'active',
        },
        {
          id: '2',
          name: 'Flavor Extracts Co.',
          contact: 'Sarah Johnson',
          email: 'sarah@flavorextracts.com',
          phone: '+1-555-0124',
          rating: 4.6,
          status: 'active',
        },
      ];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get invoices (mock data for now)
export function useInvoices() {
  return useQuery({
    queryKey: inventoryKeys.invoices(),
    queryFn: async () => {
      // This would typically come from inventory service
      // For now, we'll return mock data
      return [
        {
          id: '1',
          supplierId: '1',
          supplierName: 'Dairy Suppliers Inc.',
          amount: 2500.00,
          status: 'paid',
          date: '2024-01-15',
          items: 15,
        },
        {
          id: '2',
          supplierId: '2',
          supplierName: 'Flavor Extracts Co.',
          amount: 1800.00,
          status: 'pending',
          date: '2024-01-20',
          items: 8,
        },
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
