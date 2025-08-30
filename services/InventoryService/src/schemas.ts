import { z } from 'zod';

export const updateFactoryBudgetSchema = z.object({
  body: z.object({
    budget: z.number().min(0),
  }),
});

export const createFactoryStockItemSchema = z.object({
  body: z.object({
    flavor: z.string(),
    quantity: z.number().min(0),
  }),
});

export const getFactorySchema = z.object({
  params: z.object({
    factoryId: z.string(),
  }),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    shopId: z.number(),
    items: z.array(z.object({
      flavor: z.string(),
      quantity: z.number().min(1),
    })),
  }),
});

export const getInvoiceSchema = z.object({
  params: z.object({
    invoiceId: z.string(),
  }),
});