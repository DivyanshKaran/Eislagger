import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// User management schemas
export const getAllUsersSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    role: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const changeUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum(["Executive", "Manufacturer", "Clerk", "Patron"], {
      errorMap: () => ({ message: "Role must be Executive, Manufacturer, Clerk, or Patron" })
    }),
  }),
});

export const changeUserStatusSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    status: z.boolean({
      errorMap: () => ({ message: "Status must be true or false" })
    }),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
});

// System monitoring schemas
export const getSystemMetricsSchema = z.object({
  query: z.object({
    period: z.enum(["1h", "24h", "7d"]).optional(),
  }),
});

export const getSystemLogsSchema = z.object({
  query: z.object({
    level: z.string().optional(),
    service: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),
});

export const clearSystemLogsSchema = z.object({
  body: z.object({
    olderThan: z.enum(["7d", "30d", "90d"]).optional(),
  }),
});

// Audit and compliance schemas
export const getAuditLogsSchema = z.object({
  query: z.object({
    action: z.string().optional(),
    resource: z.string().optional(),
    userId: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    status: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const searchAuditLogsSchema = z.object({
  body: z.object({
    searchCriteria: z.object({
      dateRange: z.object({
        from: z.string().datetime(),
        to: z.string().datetime(),
      }).optional(),
      users: z.array(z.string()).optional(),
      actions: z.array(z.string()).optional(),
      resources: z.array(z.string()).optional(),
      statuses: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
    }),
    limit: z.number().min(1).max(1000).optional(),
  }),
});

// System configuration schemas
export const updateSystemConfigSchema = z.object({
  body: z.object({
    configs: z.record(z.string(), z.any()),
  }),
});

// Theme schemas
export const createThemeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Theme name must be at least 2 characters"),
    displayName: z.string().min(2, "Display name must be at least 2 characters"),
    description: z.string().optional(),
    colors: z.record(z.string(), z.string()),
    fonts: z.record(z.string(), z.string()),
    layout: z.record(z.string(), z.any()),
    isDefault: z.boolean().optional(),
  }),
});

export const updateThemeSchema = z.object({
  params: z.object({
    themeId: z.string().uuid("Invalid theme ID"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    displayName: z.string().min(2).optional(),
    description: z.string().optional(),
    colors: z.record(z.string(), z.string()).optional(),
    fonts: z.record(z.string(), z.string()).optional(),
    layout: z.record(z.string(), z.any()).optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Maintenance window schemas
export const scheduleMaintenanceSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().optional(),
    scheduledStart: z.string().datetime("Invalid start date"),
    scheduledEnd: z.string().datetime("Invalid end date"),
    affectedServices: z.array(z.enum(["AUTH_SERVICE", "SALES_SERVICE", "INVENTORY_SERVICE", "ADMIN_SERVICE", "COMMUNICATIONS_SERVICE", "ANALYTICS_SERVICE", "FILE_UPLOAD_SERVICE"])),
    notifyUsers: z.boolean().optional(),
    advanceNotice: z.number().min(1).max(168, "Advance notice must be between 1 and 168 hours").optional(),
  }).refine((data) => new Date(data.scheduledStart) < new Date(data.scheduledEnd), {
    message: "Scheduled start must be before scheduled end",
    path: ["scheduledEnd"],
  }),
});

// Broadcast schemas
export const createBroadcastSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    type: z.enum(["INFO", "WARNING", "MAINTENANCE", "ANNOUNCEMENT", "PROMOTION"]),
    targetRoles: z.array(z.enum(["Executive", "Manufacturer", "Clerk", "Patron"])).optional(),
    targetUsers: z.array(z.string().uuid()).optional(),
    scheduledAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
  }).refine((data) => {
    // At least one target method must be specified
    return data.targetRoles?.length || data.targetUsers?.length;
  }, {
    message: "At least one target (roles or users) must be specified",
    path: ["targetRoles"],
  }).refine((data) => {
    // If expiresAt is specified, it must be after scheduledAt
    if (data.scheduledAt && data.expiresAt) {
      return new Date(data.expiresAt) > new Date(data.scheduledAt);
    }
    return true;
  }, {
    message: "Expiration date must be after scheduled date",
    path: ["expiresAt"],
  }),
});

export const getBroadcastsSchema = z.object({
  query: z.object({
    status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "EXPIRED", "CANCELLED"]).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const updateBroadcastStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid broadcast ID"),
  }),
  body: z.object({
    status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "EXPIRED", "CANCELLED"]),
  }),
});

// Security event schemas
export const resolveSecurityEventSchema = z.object({
  params: z.object({
    eventId: z.string().uuid("Invalid security event ID"),
  }),
  body: z.object({
    status: z.enum(["INVESTIGATING", "RESOLVED", "FALSE_POSITIVE", "ESCALATED"]),
    notes: z.string().optional(),
  }),
});

// Validation middleware
export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request data
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });

      // Replace the request data with validated data
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;

      next();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationErrors = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed",
            validationErrors,
          },
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Error during validation",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
      });
    }
  };
};

// Error handler middleware for async route handlers
// Removed unused asyncHandler helper

// Rate limiting middleware
export const rateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || req.user?.id || 'anonymous';
    const now = Date.now();
    
    const clientRequests = requests.get(clientId);
    
    if (!clientRequests || now > clientRequests.resetTime) {
      // Reset window for this client
      requests.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }
    
    if (clientRequests.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        },
      });
    }
    
    clientRequests.count++;
    next();
  };
};

