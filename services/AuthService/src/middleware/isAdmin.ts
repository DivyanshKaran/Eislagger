export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role === "Executive") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Admin access required"
      }
    });
  }
};

