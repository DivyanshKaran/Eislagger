import { z } from "zod";

const USER_ROLES = ["Executive", "Manufacturer", "Clerk", "Patron"] as const;

/**
 * Schema for user registration.
 */
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    role: z.enum(USER_ROLES).optional(), // Role is optional, defaults to 'Patron' in controller
  }),
});

/**
 * Schema for user login.
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

/**
 * Schema for updating a user's role (used by admin).
 */
export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string({ required_error: "User ID is required" }),
  }),
  body: z.object({
    role: z.enum(USER_ROLES, {
      errorMap: () => ({
        message: `Role must be one of: ${USER_ROLES.join(", ")}`,
      }),
    }),
  }),
});

/**
 * Schema for deleting a user (used by admin).
 */
export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string({ required_error: "User ID is required" }),
  }),
});
