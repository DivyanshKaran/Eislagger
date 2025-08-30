import { Router } from "express";
import {
  getShop,
  getShopMenu,
  getShopInventory,
  createPosTransaction,
  createPurchaseOrder,
  createFeedback,
} from "../controllers/sales.controller.ts";
import { isAuthenticated } from "../middleware/auth.ts";
import { isClerk } from "../middleware/roleCheck.ts";
import { isPatron } from "../middleware/roleCheck.ts";
import { validate } from "../middleware/validate.ts";
import {
  getShopSchema,
  getShopMenuSchema,
  getShopInventorySchema,
  createPosTransactionSchema,
  createPurchaseOrderSchema,
  createFeedbackSchema,
} from "../schemas.ts";

const router = Router();

// Get details for a specific retail shop. (Public access)
router.get("/shops/:shopId", isAuthenticated, validate(getShopSchema), getShop);

// Get the publicly visible menu with prices for patrons. (Public access)
router.get(
  "/shops/:shopId/menu",
  isAuthenticated,
  validate(getShopMenuSchema),
  getShopMenu
);

// Get the detailed internal inventory for a clerk. (Clerk only)
router.get(
  "/shops/:shopId/inventory",
  isAuthenticated,
  isClerk,
  validate(getShopInventorySchema),
  getShopInventory
);

// Process a new sale from the Point of Sale system. (Clerk Only)
router.post(
  "/shops/:shopId/pos-transactions",
  isAuthenticated,
  isClerk,
  validate(createPosTransactionSchema),
  createPosTransaction
);

// (Inter-service) Create a purchase order to request stock from the Inventory Service.
router.post(
  "/shops/:shopId/purchase-orders",
  validate(createPurchaseOrderSchema),
  createPurchaseOrder
);

// Allow a patron to submit feedback or a review. (Patron Only)
router.post(
  "/feedback",
  isAuthenticated,
  isPatron,
  validate(createFeedbackSchema),
  createFeedback
);

export default router;
