import { z, ZodError, type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

// Factory schemas
export const getFactorySchema = z.object({
  params: z.object({
    factoryId: z.string().uuid("Invalid factory ID"),
  }),
});

export const updateFactoryBudgetSchema = z.object({
  params: z.object({
    factoryId: z.string().uuid("Invalid factory ID"),
  }),
  body: z.object({
    budget: z.number().min(0, "Budget must be positive"),
  }),
});

export const getFactoryAnalyticsSchema = z.object({
  params: z.object({
    factoryId: z.string().uuid("Invalid factory ID"),
  }),
  query: z.object({
    period: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
  }),
});

// Stock item schemas
export const createStockItemSchema = z.object({
  params: z.object({
    factoryId: z.string().uuid("Invalid factory ID"),
  }),
  body: z.object({
    flavorId: z.string().uuid("Invalid flavor ID"),
    batchNumber: z.string().min(1, "Batch number is required"),
    quantity: z.number().positive("Quantity must be positive"),
    cost: z.number().positive("Cost must be positive"),
    expiryDate: z.string().datetime("Invalid expiry date"),
    qualityGrade: z.enum(["A", "B", "C", "F"]).optional(),
    notes: z.string().optional(),
  }),
});

export const getStockItemsSchema = z.object({
  params: z.object({
    factoryId: z.string().uuid("Invalid factory ID"),
  }),
  query: z.object({
    status: z.string().optional(),
    qualityGrade: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const updateStockItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid("Invalid stock item ID"),
  }),
  body: z.object({
    quantity: z.number().positive().optional(),
    cost: z.number().positive().optional(),
    qualityGrade: z.enum(["A", "B", "C", "F"]).optional(),
    approvalStatus: z.enum(["Pending", "Approved", "Rejected", "Hold"]).optional(),
    status: z.enum(["Produced", "QualityControl", "Approved", "Shipped", "Delivered", "Rejected", "Expired"]).optional(),
    notes: z.string().optional(),
  }),
});

export const deleteStockItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid("Invalid stock item ID"),
  }),
});

export const updateStockItemExpirySchema = z.object({
  params: z.object({
    itemId: z.string().uuid("Invalid stock item ID"),
  }),
  body: z.object({
    expiryDate: z.string().datetime("Invalid expiry date"),
    notificationSettings: z.object({
      enabled: z.boolean().optional(),
      daysBeforeExpiry: z.number().min(1).optional(),
    }).optional(),
  }),
});

// Flavor schemas
export const createFlavorSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Flavor name must be at least 2 characters"),
    description: z.string().optional(),
    category: z.enum(["Classic", "Chocolate", "International", "Premium", "Seasonal", "SugarFree", "Vegan"]),
    baseFlavor: z.string().min(1, "Base flavor is required"),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    caloriesPer100g: z.number().positive().optional(),
    fatPer100g: z.number().positive().optional(),
    sugarPer100g: z.number().positive().optional(),
    basePrice: z.number().positive("Base price must be positive"),
    productionCost: z.number().positive("Production cost must be positive"),
    imageUrl: z.string().url().optional(),
  }),
});

export const getFlavorSchema = z.object({
  params: z.object({
    flavorId: z.string().uuid("Invalid flavor ID"),
  }),
});

export const updateFlavorSchema = z.object({
  params: z.object({
    flavorId: z.string().uuid("Invalid flavor ID"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    category: z.enum(["Classic", "Chocolate", "International", "Premium", "Seasonal", "SugarFree", "Vegan"]).optional(),
    baseFlavor: z.string().optional(),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    caloriesPer100g: z.number().positive().optional(),
    fatPer100g: z.number().positive().optional(),
    sugarPer100g: z.number().positive().optional(),
    basePrice: z.number().positive().optional(),
    productionCost: z.number().positive().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteFlavorSchema = z.object({
  params: z.object({
    flavorId: z.string().uuid("Invalid flavor ID"),
  }),
});

export const getFlavorsSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    isActive: z.string().optional(),
    manufacturerId: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

// Invoice schemas
export const createInvoiceSchema = z.object({
  body: z.object({
    factoryId: z.string().uuid("Invalid factory ID"),
    shopId: z.string().uuid("Invalid shop ID").optional(),
    items: z.array(z.object({
      stockItemId: z.string().uuid("Invalid stock item ID"),
      quantity: z.number().positive("Quantity must be positive"),
    })).min(1, "At least one item is required"),
    dueDate: z.string().datetime("Invalid due date").optional(),
    notes: z.string().optional(),
  }),
});

export const getInvoiceSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid("Invalid invoice ID"),
  }),
});

export const updateInvoiceStatusSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid("Invalid invoice ID"),
  }),
  body: z.object({
    status: z.enum(["Draft", "Pending", "Sent", "Paid", "Overdue", "Cancelled"]),
  }),
});

export const getInvoicesSchema = z.object({
  query: z.object({
    status: z.string().optional(),
    factoryId: z.string().optional(),
    shopId: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

// Supplier schemas
export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Supplier name must be at least 2 characters"),
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    specialties: z.array(z.string()).optional(),
    rating: z.number().min(1).max(5).optional(),
    taxId: z.string().optional(),
    paymentTerms: z.string().optional(),
  }),
});

export const getSupplierSchema = z.object({
  params: z.object({
    supplierId: z.string().uuid("Invalid supplier ID"),
  }),
});

export const updateSupplierSchema = z.object({
  params: z.object({
    supplierId: z.string().uuid("Invalid supplier ID"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
    address: z.string().min(5).optional(),
    specialties: z.array(z.string()).optional(),
    rating: z.number().min(1).max(5).optional(),
    taxId: z.string().optional(),
    paymentTerms: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getSuppliersSchema = z.object({
  query: z.object({
    specialties: z.string().optional(),
    isActive: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

// Validation middleware
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request data
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });

      // Replace the request data with validated data
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed",
            validationErrors,
          },
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Error during validation",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
      });
    }
  };
};

// Error handler middleware for async route handlers
// Removed unused asyncHandler helper
