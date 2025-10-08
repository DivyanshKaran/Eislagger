import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-that-is-long";
// console.log(JWT_SECRET);
interface UserPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload | undefined;
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required: No token provided"
      }
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // console.log(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production");
    // console.log(token);
    const user = jwt.verify(token, process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production") as UserPayload;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Authentication failed: Invalid or expired token",
        },
        timestamp: new Date().toISOString()
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication failed: Invalid or expired token"
      }
    });
  }
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

export const hasAdminRole = (...allowedRoles: string[]) => {
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

