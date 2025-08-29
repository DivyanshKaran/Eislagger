import { Router } from "express";
import { z } from "zod";

import { isAuthenticated } from "../middleware/auth.ts";
import { isAdmin } from "../middleware/isAdmin.ts";
import { validate } from "../middleware/validate.ts";

import {
  createBroadcastSchema,
  deleteUserSchema,
  getAuditLogsSchema,
  updateUserRoleSchema,
} from "../schemas.ts";
import adminController from "../controllers/admin.controller.ts";

const router = Router();

// Base path for these routes would be /api/v1/admin

/**
 * @route   GET /users
 * @desc    Get a list of all users on the platform
 * @access  Private (Admin)
 */
router.get("/users", isAuthenticated, isAdmin, adminController.getAllUsers);

/**
 * @route   PUT /users/:userId/role
 * @desc    Update a user's role
 * @access  Private (Admin)
 */
router.put(
  "/users/:userId/role",
  isAuthenticated,
  isAdmin,
  validate(updateUserRoleSchema),
  adminController.updateUserRole
);

/**
 * @route   DELETE /users/:userId
 * @desc    Delete or deactivate a user
 * @access  Private (Admin)
 */
router.delete(
  "/users/:userId",
  isAuthenticated,
  isAdmin,
  validate(deleteUserSchema),
  adminController.deleteUser
);

/**
 * @route   GET /system/health
 * @desc    Check the health status of all microservices
 * @access  Private (Admin)
 */
router.get(
  "/system/health",
  isAuthenticated,
  isAdmin,
  adminController.getSystemHealth
);

/**
 * @route   GET /audit-logs
 * @desc    Get platform-wide audit logs with optional filtering
 * @access  Private (Admin)
 */
router.get(
  "/audit-logs",
  isAuthenticated,
  isAdmin,
  validate(getAuditLogsSchema),
  adminController.getAuditLogs
);

/**
 * @route   POST /broadcasts
 * @desc    Create a system-wide broadcast message
 * @access  Private (Admin)
 */
router.post(
  "/broadcasts",
  isAuthenticated,
  isAdmin,
  validate(createBroadcastSchema),
  adminController.createBroadcast
);

export default router;
