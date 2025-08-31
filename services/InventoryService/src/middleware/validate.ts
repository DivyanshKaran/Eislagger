import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * A higher-order function that takes a Zod schema and returns an Express middleware.
 * This middleware validates the request's params, query, and body against the schema.
 * @param schema The Zod schema to validate against.
 */
export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error);
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      // Handle unexpected errors
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
