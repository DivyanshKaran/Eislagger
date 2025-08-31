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
    clerkId: z.string({ error: "Clerk ID is required" }),
    patronId: z.string().optional(),
    items: z
      .array(
        z.object({
          flavorId: z.string({ error: "Flavor ID is required" }),
          quantity: z
            .number({ error: "Quantity is required" })
            .min(1, { message: "Quantity must be at least 1" }),
          flavorName: z.string({ error: "Flavor name is required" }),
          unitPrice: z.number({ error: "Unit price is required" }),
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
    clerkId: z.string({ error: "Clerk ID is required" }),
    items: z
      .array(
        z.object({
          flavorId: z.string({ error: "Flavor ID is required" }),
          quantity: z
            .number({ error: "Quantity is required" })
            .min(1, { message: "Quantity must be at least 1" }),
          unit: z.string({ error: "Unit is required" }),
          flavorName: z.string({ error: "Flavor name is required" }),
        })
      )
      .nonempty({ message: "Items cannot be empty" }),
  }),
});

export const createFeedbackSchema = z.object({
  body: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
    patronId: z.string().optional(),
    rating: z
      .number({ error: "Rating is required" })
      .min(1, { message: "Rating must be at least 1" })
      .max(5, { message: "Rating must be at most 5" }),
    comment: z.string().optional(),
  }),
});

export const createShopSchema = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }),
    location: z.string({ error: "Location is required" }),
  }),
});

export const updateShopSchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
  body: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const deleteShopSchema = z.object({
  params: z.object({
    shopId: z.string({ error: "Shop ID is required" }),
  }),
});