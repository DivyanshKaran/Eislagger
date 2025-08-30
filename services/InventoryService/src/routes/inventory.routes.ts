import { Router } from "express";

import { isAuthenticated } from "../middleware/auth.ts";
import { isAdmin, isManufacturer } from "../middleware/roleCheck.ts";
import { validate } from "../middleware/validate.ts";

import {
  updateFactoryBudgetSchema,
  createFactoryStockItemSchema,
  getFactorySchema,
  createInvoiceSchema,
  getInvoiceSchema,
} from "../schemas.ts";
import {
  getFactory,
  updateFactoryBudget,
  createFactoryStockItem,
  getFlavors,
  createInvoice,
  getInvoice,
} from "../controllers/inventory.controller.ts";

const router = Router();

// Get a factory's details, including its stock and budget. (Executive and Manufacturer both)
router.get(
  "/factories/:factoryId",
  isAuthenticated,
  isManufacturer,
  validate(getFactorySchema),
  getFactory
);

// Allocate or update a factory's budget.(Executive only)
router.put(
  "/factories/:factoryId/budget",
  isAuthenticated,
  isAdmin,
  validate(updateFactoryBudgetSchema),
  updateFactoryBudget
);

// Register newly produced ice cream stock.(Manufacturer only)
router.post(
  "/factories/:factoryId/stock-items",
  isAuthenticated,
  isManufacturer,
  validate(createFactoryStockItemSchema),
  createFactoryStockItem
);

// Get a list of all available flavors. (Any authenticated user)
router.get("/flavors", isAuthenticated, getFlavors);

// Note: Invoice routes are often internal and triggered by events from the Sales Service.
//So below routes are just to implement functionality for now

// Create an invoice for a shop based on a purchase order.
router.post(
  "/invoices",
  isAuthenticated,
  validate(createInvoiceSchema),
  createInvoice
);

// Retrieve details for a specific invoice.
router.get(
  "/invoices/:invoiceId",
  isAuthenticated,
  validate(getInvoiceSchema),
  getInvoice
);

export default router;
