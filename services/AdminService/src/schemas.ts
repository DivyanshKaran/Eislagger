import { z } from "zod";

const USER_ROLES = ["Executive", "Manufacturer", "Clerk", "Patron"] as const;

/**
 * Schema for updating a user's role.
 * Validates `userId` in params and `role` in the body.
 */
export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid({ message: "Invalid user ID format" }),
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
 * Schema for deleting a user.
 * Validates `userId` in params.
 */
export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid({ message: "Invalid user ID format" }),
  }),
});

/**
 * Schema for filtering audit logs.
 * Validates optional query parameters.
 */
export const getAuditLogsSchema = z.object({
  query: z
    .object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      serviceName: z.string().min(3).optional(),
      userId: z.string().uuid().optional(),
    })
    .optional(),
});

/**
 * Schema for creating a new broadcast.
 * Validates the message and target audience in the body.
 */
export const createBroadcastSchema = z.object({
  body: z.object({
    message: z
      .string({ required_error: "Message is required" })
      .min(10, { message: "Message must be at least 10 characters long" }),
    target: z.enum([...USER_ROLES, "All"], {
      errorMap: () => ({
        message: `Target must be 'All' or one of: ${USER_ROLES.join(", ")}`,
      }),
    }),
  }),
});
