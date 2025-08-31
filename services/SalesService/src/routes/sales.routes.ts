import { Router } from "express";
import {
  getAllShops,
  createShop,
  getShop,
  updateShop,
  deleteShop,
  getShopMenu,
  getShopInventory,
  createPosTransaction,
  createPurchaseOrder,
  createFeedback,
} from "../controllers/sales.controller.ts";
import { isAuthenticated } from "../middleware/auth.ts";
import { isClerk, isPatron } from "../middleware/roleCheck.ts";
import { validate } from "../middleware/validate.ts";
import {
  getShopSchema,
  getShopMenuSchema,
  getShopInventorySchema,
  createPosTransactionSchema,
  createPurchaseOrderSchema,
  createFeedbackSchema,
  createShopSchema,
  updateShopSchema,
  deleteShopSchema,
} from "../schemas.ts";

const router = Router();

// Shop Routes
router.get("/shops", getAllShops);
router.post("/shops", isAuthenticated, /* isAdmin, */ validate(createShopSchema), createShop);
router.get("/shops/:shopId", validate(getShopSchema), getShop);
router.put("/shops/:shopId", isAuthenticated, /* isAdmin, */ validate(updateShopSchema), updateShop);
router.delete("/shops/:shopId", isAuthenticated, /* isAdmin, */ validate(deleteShopSchema), deleteShop);

// Get the publicly visible menu with prices for patrons. (Public access)
router.get(
  "/shops/:shopId/menu",
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
  isAuthenticated,
  isClerk,
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