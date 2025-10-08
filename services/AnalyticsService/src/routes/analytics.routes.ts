import express from "express";
import * as analyticsController from "../controllers/analytics.controller.ts";
import { isAuthenticated } from "../middleware/auth.ts";

const router = express.Router();

// Dashboard Data Routes
router.get('/dashboard/:role', analyticsController.getRoleSpecificDashboard);
router.get('/dashboard/kpis', analyticsController.getKPIMetrics);
router.get('/dashboard/real-time', analyticsController.getRealTimeDashboard);

// Sales Analytics Routes
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/sales/trends', analyticsController.getSalesTrends);
router.get('/sales/products', analyticsController.getProductPerformance);
router.get('/revenue', analyticsController.getRevenueAnalytics);

// Inventory Analytics Routes
router.get('/inventory', analyticsController.getInventoryAnalytics);
router.get('/inventory/turnover', analyticsController.getInventoryTurnover);
router.get('/inventory/waste', analyticsController.getWasteAnalysis);
router.get('/suppliers', analyticsController.getSupplierPerformance);

// Location Analytics Routes
router.get('/locations', analyticsController.getLocationAnalytics);
router.get('/locations/map', analyticsController.getLocationMapData);
router.get('/locations/heatmap', analyticsController.getLocationHeatmap);

// Custom Reports Routes
router.post('/reports/generate', isAuthenticated, analyticsController.generateCustomReport);
router.get('/reports/:reportId', isAuthenticated, analyticsController.getReport);
router.post('/reports/schedule', isAuthenticated, analyticsController.scheduleReport);
router.get('/reports/scheduled', isAuthenticated, analyticsController.getScheduledReports);

export default router;

