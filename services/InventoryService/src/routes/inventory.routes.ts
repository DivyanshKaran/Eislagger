import { Router } from "express";
import {
  getAllFactories,
  getFactory,
  updateFactoryBudget,
  getFactoryAnalytics,
  createStockItem,
  getFactoryStockItems,
  updateStockItem,
  deleteStockItem,
  updateStockItemExpiry,
  getAllFlavors,
  createFlavor,
  getFlavor,
  updateFlavor,
  deleteFlavor,
  createInvoice,
  getInvoice,
  updateInvoiceStatus,
  getAllInvoices,
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  healthCheck,
} from "../controllers/inventory.controller.ts";
import { isAuthenticated } from "../middleware/auth.ts";
import { isManufacturer, isExecutive, hasRole } from "../middleware/roleCheck.ts";
import { validate } from "../schemas.ts";
import {
  getFactorySchema,
  updateFactoryBudgetSchema,
  getFactoryAnalyticsSchema,
  createStockItemSchema,
  getStockItemsSchema,
  updateStockItemSchema,
  deleteStockItemSchema,
  updateStockItemExpirySchema,
  createFlavorSchema,
  getFlavorSchema,
  updateFlavorSchema,
  deleteFlavorSchema,
  getFlavorsSchema,
  createInvoiceSchema,
  getInvoiceSchema,
  updateInvoiceStatusSchema,
  getInvoicesSchema,
  createSupplierSchema,
  updateSupplierSchema,
  getSuppliersSchema,
} from "../schemas.ts";

const router = Router();

// --- FACTORY MANAGEMENT ROUTES ---

/**
 * @route   GET /factories
 * @desc    List all factories
 * @access  Public
 */
router.get("/factories", getAllFactories);

/**
 * @route   GET /factories/:factoryId
 * @desc    Get factory details
 * @access  Public
 */
router.get("/factories/:factoryId", validate(getFactorySchema), getFactory);

/**
 * @route   PUT /factories/:factoryId/budget
 * @desc    Update factory budget allocation
 * @access  Private (Executive only)
 */
router.put("/factories/:factoryId/budget", isAuthenticated, isExecutive, validate(updateFactoryBudgetSchema), updateFactoryBudget);

/**
 * @route   GET /factories/:factoryId/analytics
 * @desc    Get factory production analytics
 * @access  Public
 */
router.get("/factories/:factoryId/analytics", validate(getFactoryAnalyticsSchema), getFactoryAnalytics);

// --- STOCK MANAGEMENT ROUTES ---

/**
 * @route   POST /factories/:factoryId/stock-items
 * @desc    Register new stock item
 * @access  Private (Manufacturer only)
 */
router.post("/factories/:factoryId/stock-items", isAuthenticated, isManufacturer, validate(createStockItemSchema), createStockItem);

/**
 * @route   GET /factories/:factoryId/stock-items
 * @desc    View factory stock items
 * @access  Public
 */
router.get("/factories/:factoryId/stock-items", validate(getStockItemsSchema), getFactoryStockItems);

/**
 * @route   PUT /stock-items/:itemId
 * @desc    Update stock item
 * @access  Private (Manufacturer only)
 */
router.put("/stock-items/:itemId", isAuthenticated, isManufacturer, validate(updateStockItemSchema), updateStockItem);

/**
 * @route   DELETE /stock-items/:itemId
 * @desc    Remove stock item from inventory
 * @access  Private (Manufacturer only)
 */
router.delete("/stock-items/:itemId", isAuthenticated, isManufacturer, validate(deleteStockItemSchema), deleteStockItem);

/**
 * @route   POST /stock-items/:itemId/expiry
 * @desc    Update stock item expiry notifications
 * @access  Private (Manufacturer only)
 */
router.post("/stock-items/:itemId/expiry", isAuthenticated, isManufacturer, validate(updateStockItemExpirySchema), updateStockItemExpiry);

// --- FLAVOR CATALOG ROUTES ---

/**
 * @route   GET /flavors
 * @desc    List all flavors
 * @access  Public
 */
router.get("/flavors", validate(getFlavorsSchema), getAllFlavors);

/**
 * @route   POST /flavors
 * @desc    Create new flavor
 * @access  Private (Manufacturer only)
 */
router.post("/flavors", isAuthenticated, isManufacturer, validate(createFlavorSchema), createFlavor);

/**
 * @route   GET /flavors/:flavorId
 * @desc    Get flavor details
 * @access  Public
 */
router.get("/flavors/:flavorId", validate(getFlavorSchema), getFlavor);

/**
 * @route   PUT /flavors/:flavorId
 * @desc    Update flavor
 * @access  Private (Manufacturer only)
 */
router.put("/flavors/:flavorId", isAuthenticated, isManufacturer, validate(updateFlavorSchema), updateFlavor);

/**
 * @route   DELETE /flavors/:flavorId
 * @desc    Archive flavor
 * @access  Private (Manufacturer only)
 */
router.delete("/flavors/:flavorId", isAuthenticated, isManufacturer, validate(deleteFlavorSchema), deleteFlavor);

// --- INVOICE MANAGEMENT ROUTES ---

/**
 * @route   POST /invoices
 * @desc    Create invoice for purchase order
 * @access  Private (System/ADMIN)
 */
router.post("/invoices", isAuthenticated, hasRole("Executive", "Manufacturer"), validate(createInvoiceSchema), createInvoice);

/**
 * @route   GET /invoices/:invoiceId
 * @desc    Get invoice details
 * @access  Private (Authorized users)
 */
router.get("/invoices/:invoiceId", isAuthenticated, validate(getInvoiceSchema), getInvoice);

/**
 * @route   PUT /invoices/:invoiceId/status
 * @desc    Update invoice payment status
 * @access  Private (Executive only)
 */
router.put("/invoices/:invoiceId/status", isAuthenticated, isExecutive, validate(updateInvoiceStatusSchema), updateInvoiceStatus);

/**
 * @route   GET /invoices
 * @desc    List invoices with filters
 * @access  Private (Authorized users)
 */
router.get("/invoices", isAuthenticated, validate(getInvoicesSchema), getAllInvoices);

// --- SUPPLIER MANAGEMENT ROUTES ---

/**
 * @route   GET /suppliers
 * @desc    List suppliers
 * @access  Public
 */
router.get("/suppliers", validate(getSuppliersSchema), getAllSuppliers);

/**
 * @route   POST /suppliers
 * @desc    Add new supplier
 * @access  Private (Manufacturer only)
 */
router.post("/suppliers", isAuthenticated, isManufacturer, validate(createSupplierSchema), createSupplier);

/**
 * @route   PUT /suppliers/:supplierId
 * @desc    Update supplier information
 * @access  Private (Manufacturer only)
 */
router.put("/suppliers/:supplierId", isAuthenticated, isManufacturer, validate(updateSupplierSchema), updateSupplier);

// --- SYSTEM ROUTES ---

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", healthCheck);

export default router;
