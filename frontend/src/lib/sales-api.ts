// Sales Service API client for frontend integration

import type { ApiResponse } from "@/types/common";
import { salesApi } from "./api-client";

// Types for sales data
export interface Shop {
  id: string;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  hours?: Record<string, { open: string; close: string; isClosed?: boolean }>;
  services: string[];
  capacity?: number;
  status: "Active" | "Inactive" | "Maintenance" | "Closed";
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  reviewCount?: number;
  statistics?: {
    totalRevenue: number;
    totalTransactions: number;
    averageRating: number;
    reviewCount: number;
  };
}

export interface ShopStock {
  id: string;
  shopId: string;
  flavorId: string;
  flavorName: string;
  flavorDescription?: string;
  category: string;
  pricePerUnit: number;
  costPerUnit: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  isAvailable: boolean;
  allergies: string[];
  expirationDate?: string;
  stockLevel?: "low" | "normal" | "high";
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  shopId: string;
  transactionNumber: string;
  clerkId: string;
  patronId?: string;
  subtotal: number;
  taxAmount: number;
  discount_amount: number;
  totalAmount: number;
  paymentMethod: "cash" | "card" | "digital_wallet";
  paymentStatus: "Pending" | "Processing" | "Completed" | "Failed" | "Refunded";
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt: string;
  updatedAt: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  stockId: string;
  flavorId: string;
  flavorName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: string[];
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  shopId: string;
  orderNumber: string;
  clerkId: string;
  status: "Pending" | "Submitted" | "Approved" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Rejected";
  priority: "Low" | "Normal" | "High" | "Urgent";
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  fulfilledAt?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  stockId: string;
  flavorId: string;
  flavorName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  createdAt: string;
}

export interface Review {
  id: string;
  shopId: string;
  patronId?: string;
  customerName?: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment?: string;
  service?: number;
  quality?: number;
  cleanliness?: number;
  managerResponse?: string;
  managerResponseDate?: string;
  helpfulVotes: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sales Service API methods
export const salesService = {
  // Shop Management
  getAllShops: (params?: {
    status?: string;
    managerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ shops: Shop[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return salesApi.get(`/sales/shops${queryString ? `?${queryString}` : ''}`);
  },

  getShop: (shopId: string): Promise<ApiResponse<{ shop: Shop }>> =>
    salesApi.get(`/sales/shops/${shopId}`),

  createShop: (data: Partial<Shop>): Promise<ApiResponse<{ shop: Shop }>> =>
    salesApi.post("/sales/shops", data),

  updateShop: (shopId: string, data: Partial<Shop>): Promise<ApiResponse<{ shop: Shop }>> =>
    salesApi.put(`/sales/shops/${shopId}`, data),

  deleteShop: (shopId: string): Promise<ApiResponse<any>> =>
    salesApi.delete(`/sales/shops/${shopId}`),

  // Menu & Inventory
  getShopMenu: (shopId: string): Promise<ApiResponse<{ menu: ShopStock[]; shopId: string }>> =>
    salesApi.get(`/sales/shops/${shopId}/menu`),

  getShopInventory: (shopId: string): Promise<ApiResponse<{
    inventory: ShopStock[];
    shopId: string;
    summary: {
      totalItems: number;
      lowStockItems: number;
      outOfStockItems: number;
    };
  }>> =>
    salesApi.get(`/sales/shops/${shopId}/inventory`),

  // Transactions
  createTransaction: (shopId: string, data: {
    items: Array<{
      flavorId: string;
      flavorName: string;
      quantity: number;
      customization?: string[];
    }>;
    clerkId: string;
    patronId?: string;
    customerInfo?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    paymentMethod?: "cash" | "card" | "digital_wallet";
    discountAmount?: number;
    taxRate?: number;
  }): Promise<ApiResponse<{ transaction: Transaction }>> =>
    salesApi.post(`/sales/shops/${shopId}/pos-transactions`, data),

  getShopTransactions: (shopId: string, params?: {
    limit?: number;
    offset?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{ transactions: Transaction[]; pagination?: any }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return salesApi.get(`/sales/shops/${shopId}/transactions${queryString ? `?${queryString}` : ''}`);
  },

  // Purchase Orders
  createPurchaseOrder: (shopId: string, data: {
    items: Array<{
      flavorId: string;
      flavorName: string;
      quantity: number;
      unit: string;
    }>;
    clerkId: string;
    notes?: string;
    priority?: "Low" | "Normal" | "High" | "Urgent";
  }): Promise<ApiResponse<{ purchaseOrder: PurchaseOrder }>> =>
    salesApi.post(`/sales/shops/${shopId}/purchase-orders`, data),

  getShopOrders: (shopId: string, params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ orders: PurchaseOrder[]; pagination?: any }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return salesApi.get(`/sales/shops/${shopId}/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Reviews
  createReview: (data: {
    shopId: string;
    patronId?: string;
    customerName?: string;
    customerEmail?: string;
    rating: number;
    title?: string;
    comment?: string;
    service?: number;
    quality?: number;
    cleanliness?: number;
  }): Promise<ApiResponse<{ review: Review }>> =>
    salesApi.post("/sales/reviews", data),

  getShopReviews: (shopId: string, params?: {
    limit?: number;
    offset?: number;
    minRating?: number;
  }): Promise<ApiResponse<{
    reviews: Review[];
    shopId: string;
    averageRating: number;
    totalReviews: number;
    pagination?: any;
  }>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return salesApi.get(`/sales/shops/${shopId}/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Health Check
  healthCheck: (): Promise<ApiResponse<any>> =>
    salesApi.get("/sales/health"),
};

// Hooks for React components
export const useSalesData = () => {
  const fetchShops = async () => {
    try {
      const response = await salesService.getAllShops();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching shops:", error);
      return null;
    }
  };

  const fetchShopMenu = async (shopId: string) => {
    try {
      const response = await salesService.getShopMenu(shopId);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching shop menu:", error);
      return null;
    }
  };

  const fetchShopInventory = async (shopId: string) => {
    try {
      const response = await salesService.getShopInventory(shopId);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching shop inventory:", error);
      return null;
    }
  };

  return {
    fetchShops,
    fetchShopMenu,
    fetchShopInventory,
  };
};

export default salesService;
