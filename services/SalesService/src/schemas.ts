import { z } from "zod";

// Shop schemas
export const createShopSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Shop name must be at least 2 characters"),
    location: z.string().min(5, "Location must be at least 5 characters"),
    address: z.string().optional(),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number").optional(),
    email: z.string().email("Invalid email address").optional(),
    managerId: z.string().uuid("Invalid manager ID").optional(),
    hours: z.record(z.object({
      open: z.string().regex(/^\d{2}:\d{2}$/, "Hour must be in HH:MM format"),
      close: z.string().regex(/^\d{2}:\d{2}$/, "Hour must be in HH:MM format"),
      isClosed: z.boolean().optional(),
    })).optional(),
    services: z.array(z.string()).optional(),
    capacity: z.number().int().min(1).max(1000).optional(),
  }),
});

export const updateShopSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    location: z.string().min(5).optional(),
    address: z.string().optional(),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
    email: z.string().email().optional(),
    managerId: z.string().uuid().optional(),
    hours: z.record(z.object({
      open: z.string().regex(/^\d{2}:\d{2}$/),
      close: z.string().regex(/^\d{2}:\d{2}$/),
      isClosed: z.boolean().optional(),
    })).optional(),
    services: z.array(z.string()).optional(),
    capacity: z.number().int().min(1).max(1000).optional(),
    status: z.enum(["Active", "Inactive", "Maintenance", "Closed"]).optional(),
  }),
});

export const getShopSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
});

export const deleteShopSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
});

// Menu and Inventory schemas
export const getShopMenuSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
});

export const getShopInventorySchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
});

// Transaction schemas
export const transactionItemSchema = z.object({
  flavorId: z.string().min(1, "Flavor ID is required"),
  flavorName: z.string().min(1, "Flavor name is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  customizations: z.array(z.string()).optional(),
});

export const createPosTransactionSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
  body: z.object({
    items: z.array(transactionItemSchema).min(1, "At least one item is required"),
    clerkId: z.string().min(1, "Clerk ID is required"),
    patronId: z.string().optional(),
    customerInfo: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    }).optional(),
    paymentMethod: z.enum(["cash", "card", "digital_wallet"]).optional(),
    discountAmount: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(1).optional(),
  }),
});

export const getShopTransactionsSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  }),
});

// Purchase Order schemas
export const purchaseOrderItemSchema = z.object({
  flavorId: z.string().min(1, "Flavor ID is required"),
  flavorName: z.string().min(1, "Flavor name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

export const createPurchaseOrderSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
  body: z.object({
    items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
    clerkId: z.string().min(1, "Clerk ID is required"),
    notes: z.string().optional(),
    priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional(),
  }),
});

export const getShopOrdersSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
  query: z.object({
    status: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

// Review schemas
export const createReviewSchema = z.object({
  body: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
    patronId: z.string().optional(),
    customerName: z.string().optional(),
    customerEmail: z.string().email().optional(),
    rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
    title: z.string().min(5).max(100).optional(),
    comment: z.string().min(10).max(1000).optional(),
    service: z.number().int().min(1).max(5).optional(),
    quality: z.number().int().min(1).max(5).optional(),
    cleanliness: z.number().int().min(1).max(5).optional(),
  }),
});

export const getShopReviewsSchema = z.object({
  params: z.object({
    shopId: z.string().uuid("Invalid shop ID"),
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
    minRating: z.string().regex(/^[1-5]$/).transform(Number).optional(),
  }),
});

// Shop analytics schema
// Removed unused getShopAnalyticsSchema

// Removed unused updateShopStockSchema

// Removed unused addShopStockSchema

// Validation middleware
// Removed unused validateShopManager helper