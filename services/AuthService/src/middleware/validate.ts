export const validate = (schema: any) => (req: any, res: any, next: any) => {
  // console.log(req.body)
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        issues: result.error.format()
      }
    });
  }
  next();
};

