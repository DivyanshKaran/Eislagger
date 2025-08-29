import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * A higher-order function that creates an Express middleware for request validation.
 * It takes a Zod schema and returns a middleware function that will parse and
 * validate the request's body, query parameters, and route parameters against that schema.
 *
 * @param schema The Zod schema to validate against.
 * @returns An Express middleware function.
 */
export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Attempt to parse the request's parts against the provided schema.
      // Zod will throw an error if the validation fails.
      schema.parse({
        body: req.body || {},
        query: req.query,
        params: req.params,
      });

      // If parsing is successful, proceed to the next middleware or route handler.
      next();
    } catch (error) {
      // Catch errors thrown by Zod during validation.
      if (error instanceof ZodError) {
        // Respond with a 400 Bad Request status and a structured error message
        // detailing each validation failure.
        return res.status(400).json({
          message: "Validation failed",
          errors: error,
          // errors: error.errors.map((err) => ({
          //   path: err.path.join("."),
          //   message: err.message,
          // })),
        });
      }

      // Handle any other unexpected errors that might occur during the process.
      return res
        .status(500)
        .json({ message: "An internal error occurred during validation" });
    }
  };
