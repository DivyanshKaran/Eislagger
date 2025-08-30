import { z } from "zod";

export const getFactorySchema = z.object({
  params: z.object({
    factoryId: z.string().uuid({ message: "Invalid factory ID format" }),
  }),
});

export const updateFactoryBudgetSchema = z.object({
  params: z.object({
    factoryId: z.string().uuid({ message: "Invalid factory ID format" }),
  }),
  body: z.object({
    budget: z
      .number({ error: "Budget is required" })
      .min(0, { message: "Budget must be a positive number" }),
  }),
});

export const createFactoryStockItemSchema = z.object({
  params: z.object({
    factoryId: z.string().uuid({ message: "Invalid factory ID format" }),
  }),
  body: z.object({
    flavorId: z.string({ error: "Flavor name is required" }),
    quantity: z
      .number({ error: "Quantity is required" })
      .min(0, { message: "Quantity must be a positive number" }),
    unit: z.string({ error: "Unit is required" }),
    productionCost: z
      .number({ error: "Production cost is required" })
      .min(0, { message: "Production cost must be a positive number" }),
    expiryDate: z.string({ error: "Expiry date is required in string format" }),
    batchId: z.string({ error: "Batch ID is required" }),
  }),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    purchaseOrderId: z.string({
      error: "Purchase Order ID is required",
    }),
    shopId: z.string({ error: "Shop ID is required" }),
    totalAmount: z
      .number({ error: "Total amount is required" })
      .min(0, { message: "Total amount must be a positive number" }),
    status: z
      .enum(["Pending", "Paid", "Overdue"], {
        error: "Status is required",
      })
      .optional(),
    items: z
      .array(
        z.object({
          flavorName: z.string({ error: "Flavor name is required" }),
          quantity: z
            .number({ error: "Quantity is required" })
            .min(1, { message: "Quantity must be at least 1" }),
          unitPrice: z
            .number({ error: "Unit price is required" })
            .min(0, { message: "Unit price must be a positive number" }),
          totalPrice: z
            .number({ error: "Total price is required" })
            .min(0, { message: "Total price must be a positive number" }),
        })
      )
      .nonempty({ message: "Invoice must have at least one item" }),
  }),
});

export const getInvoiceSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid({ message: "Invalid invoice ID format" }),
  }),
});
