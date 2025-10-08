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
  getShopTransactions,
  createPurchaseOrder,
  getShopOrders,
  createReview,
  getShopReviews,
  healthCheck,
  getShopAnalytics,
  updateShopStock,
  updateOrderStatus,
  updateReview,
} from "../controllers/sales.controller.ts";
import { isAuthenticated } from "../middleware/auth.ts";
import { isClerk, isPatron, isExecutive } from "../middleware/roleCheck.ts";
import { validate } from "../middleware/validate.ts";
import {
  createShopSchema,
  updateShopSchema,
  getShopSchema,
  deleteShopSchema,
  getShopMenuSchema,
  getShopInventorySchema,
  createPosTransactionSchema,
  getShopTransactionsSchema,
  createPurchaseOrderSchema,
  getShopOrdersSchema,
  createReviewSchema,
} from "../schemas.ts";

const router = Router();

// --- PUBLIC ROUTES ---

/**
 * @route   GET /shops
 * @desc    Get all shops (public access)
 * @access  Public
 */
router.get("/shops", getAllShops);

/**
 * @route   GET /shops/:shopId
 * @desc    Get shop details (public access)
 * @access  Public
 */
router.get("/shops/:shopId", validate(getShopSchema), getShop);

/**
 * @route   GET /shops/:shopId/menu
 * @desc    Get shop menu for customers
 * @access  Public
 */
router.get("/shops/:shopId/menu", validate(getShopMenuSchema), getShopMenu);

/**
 * @route   GET /shops/:shopId/reviews
 * @desc    Get shop reviews
 * @access  Public
 */
router.get("/shops/:shopId/reviews", getShopReviews);

/**
 * @route   GET /shops/:shopId/analytics
 * @desc    Get shop performance metrics
 * @access  Private (Manager+)
 */
router.get("/shops/:shopId/analytics", isAuthenticated, getShopAnalytics);

/**
 * @route   PUT /shops/:shopId/inventory
 * @desc    Update inventory levels
 * @access  Private (Clerk+)
 */
router.put("/shops/:shopId/inventory", isAuthenticated, isClerk, updateShopStock);

/**
 * @route   PUT /orders/:orderId/status
 * @desc    Update order status
 * @access  Private (Clerk+)
 */
router.put("/orders/:orderId/status", isAuthenticated, isClerk, updateOrderStatus);

/**
 * @route   PUT /reviews/:reviewId
 * @desc    Update/delete review
 * @access  Private (Manager/Patron)
 */
router.put("/reviews/:reviewId", isAuthenticated, updateReview);

/**
 * @route   POST /feedback
 * @desc    Submit feedback/feedback (alternative route)
 * @access  Private (Patron)
 */
router.post("/feedback", isAuthenticated, isPatron, validate(createReviewSchema), createReview);

// --- EXECUTIVE ROUTES ---

/**
 * @route   POST /shops
 * @desc    Create new shop (Executive only)
 * @access  Private (Executive)
 */
router.post("/shops", isAuthenticated, isExecutive, validate(createShopSchema), createShop);

/**
 * @route   PUT /shops/:shopId
 * @desc    Update shop (Executive only)
 * @access  Private (Executive)
 */
router.put("/shops/:shopId", isAuthenticated, isExecutive, validate(updateShopSchema), updateShop);

/**
 * @route   DELETE /shops/:shopId
 * @desc    Delete shop (Executive only)
 * @access  Private (Executive)
 */
router.delete("/shops/:shopId", isAuthenticated, isExecutive, validate(deleteShopSchema), deleteShop);

// --- CLERK ROUTES ---

/**
 * @route   GET /shops/:shopId/inventory
 * @desc    Get shop inventory (Clerk only)
 * @access  Private (Clerk)
 */
router.get("/shops/:shopId/inventory", isAuthenticated, isClerk, validate(getShopInventorySchema), getShopInventory);

/**
 * @route   POST /shops/:shopId/pos-transactions
 * @desc    Process POS transaction (Clerk only)
 * @access  Private (Clerk)
 */
router.post("/shops/:shopId/pos-transactions", isAuthenticated, isClerk, validate(createPosTransactionSchema), createPosTransaction);

/**
 * @route   GET /shops/:shopId/transactions
 * @desc    Get shop transactions (Clerk only)
 * @access  Private (Clerk)
 */
router.get("/shops/:shopId/transactions", isAuthenticated, isClerk, validate(getShopTransactionsSchema), getShopTransactions);

/**
 * @route   POST /shops/:shopId/purchase-orders
 * @desc    Create purchase order (Clerk only)
 * @access  Private (Clerk)
 */
router.post("/shops/:shopId/purchase-orders", isAuthenticated, isClerk, validate(createPurchaseOrderSchema), createPurchaseOrder);

/**
 * @route   GET /shops/:shopId/orders
 * @desc    Get shop purchase orders (Clerk only)
 * @access  Private (Clerk)
 */
router.get("/shops/:shopId/orders", isAuthenticated, isClerk, validate(getShopOrdersSchema), getShopOrders);

// --- PATRON ROUTES ---

/**
 * @route   POST /reviews
 * @desc    Submit review/feedback (Patron only)
 * @access  Private (Patron)
 */
router.post("/reviews", isAuthenticated, isPatron, validate(createReviewSchema), createReview);

// --- SYSTEM ROUTES ---

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", healthCheck);

export default router;