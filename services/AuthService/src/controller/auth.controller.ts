import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.ts";

import { signToken } from "../middleware/auth.ts";

// --- Controller Logic ---

// Register a new user.

const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role = "Patron" } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        profile: {
          create: {
            fullName,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Don't send the password back
    const { passwordHash: _, ...userResponse } = newUser;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Authenticate a user and provide a JWT.

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// Conceptual logout endpoint.

const logout = (req: Request, res: Response) => {
  // In a stateless JWT setup, logout is typically handled client-side by deleting the token.
  // A server-side implementation could involve a token blocklist (e.g., in Redis).
  res
    .status(200)
    .json({ message: "Logged out successfully. Please discard your token." });
};

// Get the current user's profile.

const getMe = async (req: Request, res: Response) => {
  // The `isAuthenticated` middleware has already verified the token and attached the user payload.
  if (!req.user) {
    return res.status(404).json({ message: "User not present" });
  }

  const userFromDb = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profile: true },
  });

  if (!userFromDb) {
    return res.status(404).json({ message: "User not found" });
  }
  const { passwordHash, ...userResponse } = userFromDb;
  res.status(200).json({ user: userResponse });
};

// --- Admin-facing Controllers ---

const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { profile: true },
  });
  const usersWithoutPasswords = users.map((u) => {
    const { passwordHash, ...user } = u;
    return user;
  });
  res.status(200).json({ users: usersWithoutPasswords });
};

const updateUserRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: { profile: true },
    });
    const { passwordHash, ...userResponse } = updatedUser;
    res.status(200).json({ message: "User role updated", user: userResponse });
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(204).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

const verifyToken = (req: Request, res: Response) => {
  // If this point is reached, the `isAuthenticated` middleware has successfully validated the token.
  // The decoded user payload is available in `req.user`.
  res.status(200).json({
    message: "Token is valid",
    user: req.user,
  });
};

const authController = {
  register,
  login,
  logout,
  getMe,
  getAllUsers,
  updateUserRole,
  deleteUser,
  verifyToken,
};

export default authController;
