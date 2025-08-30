import type { Request, Response, NextFunction } from "express";

export const isClerk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.user.role === "Clerk") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Only clerks can access this" });
  }
};
export const isPatron = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.user.role === "Patron") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Forbidden: Only patrons can access this route" });
  }
};
