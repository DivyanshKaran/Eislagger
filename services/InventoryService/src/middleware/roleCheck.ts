import type { Request, Response, NextFunction } from "express";

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
