import type { Request, Response, NextFunction } from "express";
import axios from "axios";

declare global {
  namespace Express {
    interface Request {
      user?: object;
    }
  }
}

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3002";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "A valid Bearer token is required for authentication",
    });
  }

  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/api/v1/auth/verify`,
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    // console.log(response);
    if (response.status === 200 && response.data.user.id) {
      console.log(response.data);
      req.user = response.data;
      next();
    } else {
      console.error("Authentication Error: ", response.data);
      return res.status(401).json({
        error: "Forbidden",
        message: "Your Authentication token is invalid or has expired",
      });
    }
  } catch (error) {
    console.error("Authentication Error: ", error);
    return res.status(401).json({
      error: "Forbidden",
      message: "Your Authentication token is invalid or has expired",
    });
  }
}
