import { Router } from "express";
import { validate } from "../middleware/validate.ts";
import { isAuthenticated } from "../middleware/auth.ts";
import { isAdmin } from "../middleware/isAdmin.ts";
import {
  registerSchema,
  loginSchema,
  updateUserRoleSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../schemas.ts";
import authController from "../controller/auth.controller.ts";

const router = Router();

// Public Routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", authController.forgotPassword);

// Protected Routes
router.post("/logout", isAuthenticated, authController.logout);
router.get("/me", isAuthenticated, authController.getMe);
router.post("/verify", isAuthenticated, authController.verifyToken);
router.post("/refresh", isAuthenticated, authController.refreshToken);
router.post("/reset-password", authController.resetPassword);
router.put("/profile", isAuthenticated, validate(updateProfileSchema), authController.updateProfile);
router.put("/change-password", isAuthenticated, validate(changePasswordSchema), authController.changePassword);

// Admin Routes
router.get("/users", isAuthenticated, isAdmin, authController.getAllUsers);
router.put("/users/:userId/role", isAuthenticated, isAdmin, validate(updateUserRoleSchema), authController.updateUserRole);
router.delete("/users/:userId", isAuthenticated, isAdmin, authController.deleteUser);

// Health Check
router.get("/health", (req, res) =>
  res.status(200).json({
    success: true,
    status: "Operational",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  })
);

export default router;

