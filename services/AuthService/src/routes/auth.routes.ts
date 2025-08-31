import { Router } from "express";
import { validate } from "../middleware/validate.ts";
import { isAuthenticated } from "../middleware/auth.ts";
import { isAdmin } from "../middleware/isAdmin.ts";
import {
  registerSchema,
  loginSchema,
  updateUserRoleSchema,
  deleteUserSchema,
} from "../schemas.ts";
import authController from "../controller/auth.controller.ts";

const router = Router();

// Base path for these routes would be /api/v1/auth

// --- Public Routes ---

/**
 * @route   POST /register
 * @desc    Register a new user (Patron by default)
 * @access  Public
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * @route   POST /login
 * @desc    Authenticate a user and get a JWT
 * @access  Public
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @route   POST /logout
 * @desc    Logs out the user (conceptual endpoint)
 * @access  Private
 */
router.post("/logout", isAuthenticated, authController.logout);

// --- Protected Routes ---

/**
 * @route   GET /me
 * @desc    Get the profile of the currently authenticated user
 * @access  Private
 */
router.get("/me", isAuthenticated, authController.getMe);

/**
 * @route   GET /verify
 * @desc    Verify a JWT and return the user payload
 * @access  Private
 */
router.post("/verify", isAuthenticated, authController.verifyToken);

// --- Internal Routes for Admin Service ---
// These routes would be further protected in a real environment to only allow
// service-to-service communication (e.g., via an API Gateway and secret keys).

/**
 * @route   GET /users
 * @desc    Get all users (for Admin Service)
 * @access  Private (Admin)
 */
router.get("/users", isAuthenticated, isAdmin, authController.getAllUsers);

/**
 * @route   PUT /users/:userId/role
 * @desc    Update a user's role (for Admin Service)
 * @access  Private (Admin)
 */
router.put(
  "/users/:userId/role",
  isAuthenticated,
  isAdmin,
  validate(updateUserRoleSchema),
  authController.updateUserRole
);

/**
 * @route   DELETE /users/:userId
 * @desc    Delete a user (for Admin Service)
 * @access  Private (Admin)
 */
router.delete(
  "/users/:userId",
  isAuthenticated,
  isAdmin,
  validate(deleteUserSchema),
  authController.deleteUser
);

/**
 * @route   GET /health
 * @desc    Health check endpoint for the Auth Service
 * @access  Public
 */
router.get("/health", (req, res) =>
  res.status(200).json({ status: "Operational" })
);

export default router;
