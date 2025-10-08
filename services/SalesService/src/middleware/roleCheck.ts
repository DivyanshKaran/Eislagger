import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the authenticated user has an 'Executive' role.
 * This middleware must be placed *after* the `isAuthenticated` middleware in the route chain.
 */
export const isExecutive = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  }

  if (req.user.role !== "Executive") {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to Executive role"
      }
    });
  }

  next();
};

/**
 * Middleware to check if the authenticated user has an 'Clerk' role.
 */
export const isClerk = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  }

  if (req.user.role !== "Clerk") {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to Clerk role"
      }
    });
  }

  next();
};

/**
 * Middleware to check if the authenticated user has a 'Patron' role.
 */
export const isPatron = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  }

  if (req.user.role !== "Patron") {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to Patron role"
      }
    });
  }

  next();
};

/**
 * Middleware to check if the authenticated user has a 'Manufacturer' role.
 */
export const isManufacturer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  }

  if (req.user.role !== "Manufacturer") {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to Manufacturer role"
      }
    });
  }

  next();
};

/**
 * Middleware to check if the authenticated user has access to multiple roles.
 */
export const hasRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required"
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access restricted to: ${allowedRoles.join(", ")}`
        }
      });
    }

    next();
  };
};

/**
 * Middleware to check if the user is a shop manager or has executive access.
 */
export const isShopManagerOrExecutive = (req: Request, res: Response, next: NextFunction) => {
  // This would need to connect to the database to check shop manager
  // For now, we'll check if they're an Executive
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  }

  if (req.user.role === "Executive") {
    return next();
  }

  // TODO: Add shop manager check here
  return res.status(403).json({
    success: false,
    error: {
      code: "FORBIDDEN",
      message: "Access restricted to Shop Managers or Executive"
    }
  });
};