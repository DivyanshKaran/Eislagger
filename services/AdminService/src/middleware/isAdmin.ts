import type { Request, Response, NextFunction } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.user.role === "Executive") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};
