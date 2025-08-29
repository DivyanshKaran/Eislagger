import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the authenticated user has an 'Executive' (admin) role.
 * This middleware must be placed *after* the `isAuthenticated` middleware in the route chain.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // This check relies on `isAuthenticated` having already run and attached the user object.
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "Executive") {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is restricted to administrators" });
  }

  next();
};
