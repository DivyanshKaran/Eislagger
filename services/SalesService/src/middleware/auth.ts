import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// In a real application, this secret should be stored securely in environment variables.
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-that-is-long";
const JWT_EXPIRES_IN = "1d";

// Define the structure of the JWT payload
interface UserPayload {
  id: string;
  role: string;
}

// Extend the Express Request type to include the optional 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload | undefined;
    }
  }
}

/**
 * Middleware to verify the JWT from the Authorization header.
 * If the token is valid, it decodes the payload and attaches it to the request object.
 */
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
    // Verify the token using the secret key
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Authentication failed: Invalid or expired token",
        }
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

export const signToken = (user: { id: string; role: string }) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};