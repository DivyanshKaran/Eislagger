// Inventory Service API client for frontend integration

import type ApiResponse  from "./api-client";
import { inventoryApi } from "./api-client";

// Types for inventory data
export interface Factory {
  id: string;
  name: string;
  location: string;
  address: string;
  managerId?: string;
  capacity: number;
  budget: number;
  status: "Active" | "Maintenance" | "Inactive" | "Closed";
  totalProduced: number;
  efficiencyRating?: number;
  createdAt: string;
  updatedAt: string;
  metrics?: {
    totalStockItems: number;
    totalInvoices: number;
    totalStockQuantity: number;
    approvedItemsRatio: number;
  };
}

export interface StockItem {
  id: string;
  factoryId: string;
  flavorId: string;
  factory: { name: string };
  flavor: {
    name: string;
    category: string;
    imageUrl?: string;
  };
  batchNumber: string;
  quantity: number;
  cost: number;
  productionDate: string;
  expiryDate: string;
  isExpired: boolean;
  qualityGrade: "A" | "B" | "C" | "F";
  approvalStatus: "Pending" | "Approved" | "Rejected" | "Hold";
  status: "Produced" | "QualityControl" | "Approved" | "Shipped" | "Delivered" | "Rejected" | "Expired";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flavor {
  id: string;
  name: string;
  description?: string;
  category: "Classic" | "Chocolate" | "International" | "Premium" | "Seasonal" | "SugarFree" | "Vegan";
  baseFlavor: string;
  ingredients: string[];
  allergens: string[];
  caloriesPer100g?: number;
  fatPer100g?: number;
  sugarPer100g?: number;
  basePrice: number;
  productionCost: number;
  imageUrl?: string;
  isActive: boolean;
  manufacturerId?: string;
  createdAt: string;
  updatedAt: string;
  statistics?: {
    totalStockQuantity: number;
    activeStockItems: number;
    totalFactories: number;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  factoryId: string;
  factory: { name: string };
  shopId?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  status: "Draft" | "Pending" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  dueDate?: string;
  paymentDate?: string;
  notes?: string;
  poReference?: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  stockItemId: string;
  stockItem: {
    id: string;
    batchNumber: string;
    flavor: {
      name: string;
      category: string;
    };
  };
  flavorId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address: string;
  specialties: string[];
  rating?: number;
  taxId?: string;
  paymentTerms?: string;
  isActive: boolean;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory Service API methods
export const inventoryService = {
  // Factory Management
  getAllFactories: (params?: {
    status?: string;
    managerId?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.managerId) queryParams.append('managerId', params.managerId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/factories?${queryString}` : '/inventory/factories';
    return inventoryApi.get(endpoint);
  },

  getFactory: (factoryId: string) =>
    inventoryApi.get(`/inventory/factories/${factoryId}`),

  updateFactoryBudget: (factoryId: string, budget: number) =>
    inventoryApi.put(`/inventory/factories/${factoryId}/budget`, { budget }),

  getFactoryAnalytics: (factoryId: string, period?: string) =>
    inventoryApi.get(`/inventory/factories/${factoryId}/analytics?period=${period}`),

  // Stock Management
  createStockItem: (factoryId: string, data: {
    flavorId: string;
    batchNumber: string;
    quantity: number;
    cost: number;
    expiryDate: string;
    qualityGrade?: "A" | "B" | "C" | "F";
    notes?: string;
  }) =>
    inventoryApi.post(`/inventory/factories/${factoryId}/stock-items`, data),

  getFactoryStockItems: (factoryId: string, params?: {
    status?: string;
    qualityGrade?: string;
    limit?: number;
    offset?: number;
  }) =>
    inventoryApi.get(`/inventory/factories/${factoryId}/stock-items`),

  updateStockItem: (itemId: string, data: {
    quantity?: number;
    cost?: number;
    qualityGrade?: "A" | "B" | "C" | "F";
    approvalStatus?: "Pending" | "Approved" | "Rejected" | "Hold";
    status?: "Produced" | "QualityControl" | "Approved" | "Shipped" | "Delivered" | "Rejected" | "Expired";
    notes?: string;
  }) =>
    inventoryApi.put(`/inventory/stock-items/${itemId}`, data),

  deleteStockItem: (itemId: string) =>
    inventoryApi.delete(`/inventory/stock-items/${itemId}`),

  updateStockItemExpiry: (itemId: string, data: {
    expiryDate: string;
    notificationSettings?: {
      enabled?: boolean;
      daysBeforeExpiry?: number;
    };
  }) =>
    inventoryApi.post(`/inventory/stock-items/${itemId}/expiry`, data),

  // Flavor Catalog
  getAllFlavors: (params?: {
    category?: string;
    isActive?: boolean;
    manufacturerId?: string;
    limit?: number;
    offset?: number;
  }) =>
    inventoryApi.get("/inventory/flavors"),

  createFlavor: (data: {
    name: string;
    description?: string;
    category: "Classic" | "Chocolate" | "International" | "Premium" | "Seasonal" | "SugarFree" | "Vegan";
    baseFlavor: string;
    ingredients?: string[];
    allergens?: string[];
    caloriesPer100g?: number;
    fatPer100g?: number;
    sugarPer100g?: number;
    basePrice: number;
    productionCost: number;
    imageUrl?: string;
  }) =>
    inventoryApi.post("/inventory/flavors", data),

  getFlavor: (flavorId: string) =>
    inventoryApi.get(`/inventory/flavors/${flavorId}`),

  updateFlavor: (flavorId: string, data: Partial<Flavor>) =>
    inventoryApi.put(`/inventory/flavors/${flavorId}`, data),

  deleteFlavor: (flavorId: string) =>
    inventoryApi.delete(`/inventory/flavors/${flavorId}`),

  // Invoice Management
  createInvoice: (data: {
    factoryId: string;
    shopId?: string;
    items: Array<{
      stockItemId: string;
      quantity: number;
    }>;
    dueDate?: string;
    notes?: string;
  }) =>
    inventoryApi.post("/inventory/invoices", data),

  getInvoice: (invoiceId: string) =>
    inventoryApi.get(`/inventory/invoices/${invoiceId}`),

  updateInvoiceStatus: (invoiceId: string, status: string) =>
    inventoryApi.put(`/inventory/invoices/${invoiceId}/status`, { status }),

  getAllInvoices: (params?: {
    status?: string;
    factoryId?: string;
    shopId?: string;
    limit?: number;
    offset?: number;
  }) =>
    inventoryApi.get("/inventory/invoices"),

  // Supplier Management
  getAllSuppliers: (params?: {
    specialties?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }) =>
    inventoryApi.get("/inventory/suppliers"),

  createSupplier: (data: {
    name: string;
    companyName?: string;
    contactPerson?: string;
    email: string;
    phone?: string;
    address: string;
    specialties?: string[];
    rating?: number;
    taxId?: string;
    paymentTerms?: string;
  }) =>
    inventoryApi.post("/inventory/suppliers", data),

  updateSupplier: (supplierId: string, data: Partial<Supplier>) =>
    inventoryApi.put(`/inventory/suppliers/${supplierId}`, data),

  // Health Check
  healthCheck: () =>
    inventoryApi.get("/inventory/health"),
};

// Hooks for React components
export const useInventoryData = () => {
  const fetchFactories = async () => {
    try {
      const response = await inventoryService.getAllFactories();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching factories:", error);
      return null;
    }
  };

  const fetchFlavors = async (category?: string) => {
    try {
      const response = await inventoryService.getAllFlavors({ category });
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching flavors:", error);
      return null;
    }
  };

  const fetchStockItems = async (factoryId: string) => {
    try {
      const response = await inventoryService.getFactoryStockItems(factoryId);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching stock items:", error);
      return null;
    }
  };

  return {
    fetchFactories,
    fetchFlavors,
    fetchStockItems,
  };
};

export default inventoryService;
