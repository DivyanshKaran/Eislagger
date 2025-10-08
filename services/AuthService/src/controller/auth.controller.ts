import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.ts";

// Removed development console logs

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-super-secret-refresh-key-change-in-production";
//
// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const createToken = (userId: string, role: string): string => {
  //
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Register a new user
export const register = async (req: any, res: any) => {
  try {
    const { fullName:name, email, password,role } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "USER_EXISTS",
          message: "User with this email already exists"
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: role, // Default role
        profile: {
          create: {
            name,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = createToken(user.id, user.role);

    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      user: userResponse,
      token,
      expiresIn: "24h",
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error registering user",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Login user
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        }
      });
    }

    const token = createToken(user.id, user.role);

    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: user.role,
    };

    res.json({
      success: true,
      user: userResponse,
      token,
      expiresIn: "24h",
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error logging in",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Get current user
export const getMe = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token required"
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found"
        }
      });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      user: userResponse,
    });

  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error fetching user profile",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Logout user
export const logout = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error logging out",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Verify token
export const verifyToken = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      user: req.user,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("VerifyToken error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error verifying token",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Refresh token
export const refreshToken = async (req: any, res: any) => {
  try {
    const token = createToken(req.user.id, req.user.role);

    res.json({
      success: true,
      token,
      expiresIn: "24h",
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("RefreshToken error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error refreshing token",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Forgot password
export const forgotPassword = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      message: "Password reset functionality coming soon",
    });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error processing password reset",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Reset password
export const resetPassword = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      message: "Password reset functionality coming soon",
    });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error resetting password",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Update profile
export const updateProfile = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { fullName:name, phone } = req.body;
    // console.log(name, phone);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            ...(name && { name}),
            ...(phone && { phoneNumber: phone }),
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: user.role,
      phone: user.profile?.phoneNumber,
    };

    res.json({
      success: true,
      user: userResponse,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating profile",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Change password
export const changePassword = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User not found" }
      });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_CURRENT_PASSWORD", message: "Current password is incorrect" }
      });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("ChangePassword error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error changing password",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req: any, res: any) => {
  try {
    const { limit = 20, offset = 0, role } = req.query;

    const where = {};
    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
      },
      skip: Number(offset),
      take: Number(limit) as any,
      orderBy: { createdAt: "desc" }
    });

    const userResponse = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      role: user.role,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      users: userResponse,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: users.length === Number(limit),
      },
    });

  } catch (error) {
    console.error("GetAllUsers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error fetching users",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req: any, res: any) => {
  try {
    const { userId } = req.params as { userId: string };
    const { role } = req.body as { role: "Executive" | "Manufacturer" | "Clerk" | "Patron" };

    const user = await prisma.user.update({ where: { id: userId }, data: { role } });

    res.json({
      success: true,
      message: "User role updated successfully",
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("UpdateUserRole error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating user role",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: any, res: any) => {
  try {
    const { userId } = req.params as { userId: string };

    await prisma.user.delete({ where: { id: userId } });
    // UserProfile will cascade delete per schema

    res.status(204).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error deleting user",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  verifyToken,
  refreshToken,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
