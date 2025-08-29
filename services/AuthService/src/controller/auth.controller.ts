import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { signToken } from "../middleware/auth.ts";

// --- Mock Database and Configuration ---
// In a real application, this would come from a database and environment variables.
let mockUsers: any[] = []; // In-memory user store

// --- Controller Logic ---

// Register a new user.

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = "Patron" } = req.body;

    const existingUser = mockUsers.find((user) => user.email === email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
    };

    mockUsers.push(newUser);

    // Don't send the password back
    const { password: _, ...userResponse } = newUser;

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

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
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

const getMe = (req: Request, res: Response) => {
  // The `isAuthenticated` middleware has already verified the token and attached the user payload.
  if (!req.user) {
    return res.status(404).json({ message: "User not present" });
  }

  const userFromDb = mockUsers.find((u) => u.id === req.user.id);
  if (!userFromDb) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password, ...userResponse } = userFromDb;
  res.status(200).json({ user: userResponse });
};

// --- Admin-facing Controllers ---

const getAllUsers = (req: Request, res: Response) => {
  const usersWithoutPasswords = mockUsers.map((u) => {
    const { password, ...user } = u;
    return user;
  });
  res.status(200).json({ users: usersWithoutPasswords });
};

const updateUserRole = (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;
  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  mockUsers[userIndex].role = role;
  const { password, ...updatedUser } = mockUsers[userIndex];
  res.status(200).json({ message: "User role updated", user: updatedUser });
};

const deleteUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  mockUsers.splice(userIndex, 1);
  res.status(204).send();
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
