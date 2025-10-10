import { Router } from "express";
import {
  getAllUsers,
  changeUserRole,
  changeUserStatus,
  deleteUser,
  getUserAnalytics,
  getSystemHealth,
  getSystemMetrics,
  getSystemLogs,
  clearSystemLogs,
  getAuditLogs,
  searchAuditLogs,
  generateComplianceReport,
  getSystemConfig,
  updateSystemConfig,
  getAvailableThemes,
  createTheme,
  updateTheme,
  scheduleMaintenance,
  createBroadcast,
  getBroadcasts,
  updateBroadcastStatus,
  getUserMachines,
  resolveSecurityEvent,
} from "../controllers/admin.controller.ts";
import { isAuthenticated, isExecutive, hasAdminRole } from "../middleware/auth.ts";
import { validate, rateLimit } from "../schemas.ts";
import {
  getAllUsersSchema,
  changeUserRoleSchema,
  changeUserStatusSchema,
  deleteUserSchema,
  getSystemMetricsSchema,
  getSystemLogsSchema,
  clearSystemLogsSchema,
  getAuditLogsSchema,
  searchAuditLogsSchema,
  updateSystemConfigSchema,
  createThemeSchema,
  updateThemeSchema,
  scheduleMaintenanceSchema,
  createBroadcastSchema,
  getBroadcastsSchema,
  updateBroadcastStatusSchema,
  resolveSecurityEventSchema,
} from "../schemas.ts";

const router = Router();

// Apply rate limiting to all routes
router.use(rateLimit(100, 60000)); // 100 requests per minute

// --- USER MANAGEMENT ROUTES ---

/**
 * @route   GET /users
 * @desc    List all users with pagination and filters
 * @access  Private (Admin only)
 */
router.get("/users", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(getAllUsersSchema), getAllUsers);

/**
 * @route   PUT /users/:userId/role
 * @desc    Change user role (Executive only)
 * @access  Private (Executive only)
 */
router.put("/users/:userId/role", isAuthenticated, isExecutive, validate(changeUserRoleSchema), changeUserRole);

/**
 * @route   PUT /users/:userId/status
 * @desc    Activate/deactivate user
 * @access  Private (Admin only)
 */
router.put("/users/:userId/status", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(changeUserStatusSchema), changeUserStatus);

/**
 * @route   DELETE /users/:userId
 * @desc    Soft delete user
 * @access  Private (Executive only)
 */
router.delete("/users/:userId", isAuthenticated, isExecutive, validate(deleteUserSchema), deleteUser);

/**
 * @route   GET /users/analytics
 * @desc    Get user analytics summary
 * @access  Private (Admin only)
 */
router.get("/users/analytics", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), getUserAnalytics);

/**
 * @route   GET /users/machines
 * @desc    List user machines by recent activity (approximation)
 * @access  Private (Admin only)
 */
router.get("/users/machines", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), getUserMachines);

// --- SYSTEM MONITORING ROUTES ---

/**
 * @route   GET /system/health
 * @desc    Check health of all services
 * @access  Private (Admin only)
 */
router.get("/system/health", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), getSystemHealth);

/**
 * @route   GET /system/metrics
 * @desc    Get system performance metrics
 * @access  Private (Admin only)
 */
router.get("/system/metrics", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(getSystemMetricsSchema), getSystemMetrics);

/**
 * @route   GET /system/logs
 * @desc    Get application logs
 * @access  Private (Admin only)
 */
router.get("/system/logs", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(getSystemLogsSchema), getSystemLogs);

/**
 * @route   POST /system/logs/clear
 * @desc    Clear old logs
 * @access  Private (Executive only)
 */
router.post("/system/logs/clear", isAuthenticated, isExecutive, validate(clearSystemLogsSchema), clearSystemLogs);

// --- AUDIT & COMPLIANCE ROUTES ---

/**
 * @route   GET /audit-logs
 * @desc    Get audit trail
 * @access  Private (Admin only)
 */
router.get("/audit-logs", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(getAuditLogsSchema), getAuditLogs);

/**
 * @route   POST /audit-logs/search
 * @desc    Advanced audit search
 * @access  Private (Executive only)
 */
router.post("/audit-logs/search", isAuthenticated, isExecutive, validate(searchAuditLogsSchema), searchAuditLogs);

/**
 * @route   GET /compliance/report
 * @desc    Generate compliance report
 * @access  Private (Executive only)
 */
router.get("/compliance/report", isAuthenticated, isExecutive, generateComplianceReport);

// --- SYSTEM CONFIGURATION ROUTES ---

/**
 * @route   GET /config
 * @desc    Get system configuration
 * @access  Private (Admin only)
 */
router.get("/config", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), getSystemConfig);

/**
 * @route   PUT /config
 * @desc    Update system configuration (sensitive configs require Executive)
 * @access  Private (Admin only)
 */
router.put("/config", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(updateSystemConfigSchema), updateSystemConfig);

/**
 * @route   GET /config/themes
 * @desc    Get available themes
 * @access  Public
 */
router.get("/config/themes", getAvailableThemes);

/**
 * @route   POST /config/themes
 * @desc    Create a new theme
 * @access  Private (Executive only)
 */
router.post("/config/themes", isAuthenticated, isExecutive, validate(createThemeSchema), createTheme);

/**
 * @route   PUT /config/themes/:themeId
 * @desc    Update an existing theme
 * @access  Private (Executive only)
 */
router.put("/config/themes/:themeId", isAuthenticated, isExecutive, validate(updateThemeSchema), updateTheme);

/**
 * @route   POST /config/maintenance
 * @desc    Schedule maintenance window
 * @access  Private (Executive only)
 */
router.post("/config/maintenance", isAuthenticated, isExecutive, validate(scheduleMaintenanceSchema), scheduleMaintenance);

// --- BROADCASTS & ANNOUNCEMENTS ROUTES ---

/**
 * @route   POST /broadcasts
 * @desc    Create system-wide broadcast
 * @access  Private (Admin only)
 */
router.post("/broadcasts", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(createBroadcastSchema), createBroadcast);

/**
 * @route   GET /broadcasts
 * @desc    List all broadcasts
 * @access  Private (Admin only)
 */
router.get("/broadcasts", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(getBroadcastsSchema), getBroadcasts);

/**
 * @route   PUT /broadcasts/:id/status
 * @desc    Update broadcast status
 * @access  Private (Admin only)
 */
router.put("/broadcasts/:id/status", isAuthenticated, hasAdminRole("Executive", "Manufacturer"), validate(updateBroadcastStatusSchema), updateBroadcastStatus);

// --- SECURITY EVENTS ---
/**
 * @route   PUT /security/events/:eventId
 * @desc    Update/resolve a security event
 * @access  Private (Executive only)
 */
router.put("/security/events/:eventId", isAuthenticated, isExecutive, validate(resolveSecurityEventSchema), resolveSecurityEvent);

export default router;

