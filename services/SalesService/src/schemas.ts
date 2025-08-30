import { z } from "zod";

export const getShopSchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
});

export const getShopMenuSchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
});

export const getShopInventorySchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
});

export const createPosTransactionSchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
  body: z.object({
    items: z
      .array(
        z.object({
          flavor: z.string({ error: "Flavor is required" }),
          quantity: z
            .number({ error: "Quantity is required" })
            .min(1, { message: "Quantity must be at least 1" }),
        })
      )
      .nonempty({ message: "Items cannot be empty" }),
  }),
});

export const createPurchaseOrderSchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
  body: z.object({
    items: z
      .array(
        z.object({
          flavor: z.string({ error: "Flavor is required" }),
          quantity: z
            .number({ error: "Quantity is required" })
            .min(1, { message: "Quantity must be at least 1" }),
        })
      )
      .nonempty({ message: "Items cannot be empty" }),
  }),
});

export const createFeedbackSchema = z.object({
  body: z.object({
    shopId: z.number({ error: "Shop ID is required" }),
    rating: z
      .number({ error: "Rating is required" })
      .min(1, { message: "Rating must be at least 1" })
      .max(5, { message: "Rating must be at most 5" }),
    comment: z.string().optional(),
  }),
});
