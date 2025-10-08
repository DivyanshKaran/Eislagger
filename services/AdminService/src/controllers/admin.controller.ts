import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import winston from "winston";
import { sendEvent } from "../kafka/kafka.ts";
import { updateUserRoleInAuth, deleteUserInAuth, getUserBasicFromAuth } from "../lib/authClient.ts";

const prisma = new PrismaClient();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Helper to generate compliance report data
const generateComplianceReportData = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return {
    period: {
      from: thirtyDaysAgo.toISOString(),
      to: new Date().toISOString()
    },
    summary: {
      totalUsers: await prisma.userSnapshot.count(),
      activeUsers: await prisma.userSnapshot.count({ where: { isActive: true } }),
      totalActions: await prisma.auditLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      securityEvents: await prisma.securityEvent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      dataAccess: await prisma.auditLog.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          action: { in: ['READ', 'EXPORT', 'ACCESS'] }
        }
      }),
      dataModifications: await prisma.auditLog.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          action: { in: ['CREATE', 'UPDATE', 'DELETE'] }
        }
      }),
      complianceSummary: {
        lastFullBackup: new Date().toISOString(),
        lastSecurityAudit: new Date().toISOString(),
        activeMaintenanceWindows: await prisma.maintenanceWindow.count({
          where: {
            status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
          }
        })
      }
    }
  };
};

// --- USER MANAGEMENT ---

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { 
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20, 
      offset = 0 
    } = req.query;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (role) where.role = role;
    if (status !== undefined) where.isActive = status === 'true';

    const [users, totalCount] = await Promise.all([
      prisma.userSnapshot.findMany({
        where,
        orderBy: { [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.userSnapshot.count({ where }),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    logger.error("GetAllUsers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting users",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["Executive", "Manufacturer", "Clerk", "Patron"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ROLE",
          message: "Invalid role specified",
        },
      });
    }

    // Call AuthService first
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    const authRes = await updateUserRoleInAuth(userId, role, token);
    if (!authRes.ok) {
      return res.status(502).json({ success: false, error: authRes.error });
    }

    // Sync snapshot from Auth
    const userBasic = await getUserBasicFromAuth(userId, token);
    const userSnapshot = await prisma.userSnapshot.upsert({
      where: { userId },
      update: { role, email: userBasic.data?.email || undefined, name: userBasic.data?.name || undefined, updatedAt: new Date() },
      create: {
        userId,
        role,
        email: userBasic.data?.email || '',
        name: userBasic.data?.name || 'Unknown',
        isActive: true,
        totalLogins: 0,
        totalOrders: 0,
        totalRevenue: 0,
      }
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'ROLE_CHANGE',
        resource: 'USER',
        resourceId: userId,
        newValues: { role },
        oldValues: { role: userSnapshot.role },
        status: 'SUCCESS',
        message: `User role changed from ${userSnapshot.role} to ${role}`,
        tags: ['ADMIN', 'USER_MANAGEMENT'],
      },
    });

    res.json({
      success: true,
      userSnapshot,
      message: "User role updated successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "USER_ROLE_CHANGED",
      message: {
        userId,
        oldRole: userSnapshot.role,
        newRole: role,
        changedBy: req.user?.id,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error("ChangeUserRole error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error changing user role",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (status !== true && status !== false) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS",
          message: "Status must be true or false",
        },
      });
    }

    const userSnapshot = await prisma.userSnapshot.findUnique({
      where: { userId },
    });

    if (!userSnapshot) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    const updatedUser = await prisma.userSnapshot.update({
      where: { userId },
      data: { 
        isActive: status, 
        updatedAt: new Date() 
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'STATUS_CHANGE',
        resource: 'USER',
        resourceId: userId,
        newValues: { isActive: status },
        oldValues: { isActive: userSnapshot.isActive },
        status: 'SUCCESS',
        message: `User status changed to ${status ? 'active' : 'inactive'}`,
        tags: ['ADMIN', 'USER_MANAGEMENT'],
      },
    });

    res.json({
      success: true,
      userSnapshot: updatedUser,
      message: `User ${status ? 'activated' : 'deactivated'} successfully`,
    });

  } catch (error) {
    logger.error("ChangeUserStatus error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error changing user status",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userSnapshot = await prisma.userSnapshot.findUnique({
      where: { userId },
    });

    if (!userSnapshot) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    // Call AuthService to delete
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    const authDelete = await deleteUserInAuth(userId, token);
    if (!authDelete.ok) {
      return res.status(502).json({ success: false, error: authDelete.error });
    }

    // Soft delete by deactivating local snapshot
    await prisma.userSnapshot.update({
      where: { userId },
      data: { 
        isActive: false, 
        updatedAt: new Date(),
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'DELETE',
        resource: 'USER',
        resourceId: userId,
        status: 'SUCCESS',
        message: `User soft deleted by admin`,
        tags: ['ADMIN', 'USER_MANAGEMENT', 'SOFT_DELETE'],
      },
    });

    res.status(204).json({
      success: true,
      message: "User soft deleted successfully",
    });

  } catch (error) {
    logger.error("DeleteUser error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error deleting user",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.userSnapshot.count();
    const activeUsers = await prisma.userSnapshot.count({ where: { isActive: true } });
    
    const roleDistribution = await prisma.userSnapshot.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const recentUsers = await prisma.userSnapshot.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const topRevenueUsers = await prisma.userSnapshot.findMany({
      orderBy: { totalRevenue: 'desc' },
      take: 5,
      select: {
        name: true,
        role: true,
        totalRevenue: true,
        totalOrders: true,
      },
    });

    res.json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        recentUsers,
        roleDistribution,
        topRevenueUsers,
        conversionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      },
    });

  } catch (error) {
    logger.error("GetUserAnalytics error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting user analytics",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// List user machines across services (stub using snapshots/metrics until dedicated source exists)
export const getUserMachines = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    const where: any = {};
    if (userId) where.userId = userId;

    // For now, approximate "machines" as recent sessions/activity per user from audit logs
    const recentActivity = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { userId: true, userAgent: true, ipAddress: true, createdAt: true }
    });

    // Group unique machine signatures per user
    const userIdToMachines: Record<string, Array<{ ipAddress: string | null; userAgent: string | null; lastSeen: string }>> = {};
    for (const entry of recentActivity) {
      const key = entry.userId || 'unknown';
      if (!userIdToMachines[key]) userIdToMachines[key] = [];
      const signature = `${entry.ipAddress || ''}|${entry.userAgent || ''}`;
      const existing = userIdToMachines[key].find(m => `${m.ipAddress || ''}|${m.userAgent || ''}` === signature);
      if (existing) {
        if (new Date(existing.lastSeen) < entry.createdAt) existing.lastSeen = entry.createdAt.toISOString();
      } else {
        userIdToMachines[key].push({
          ipAddress: entry.ipAddress || null,
          userAgent: entry.userAgent || null,
          lastSeen: entry.createdAt.toISOString(),
        });
      }
    }

    res.json({ success: true, machines: userIdToMachines });
  } catch (error) {
    logger.error("GetUserMachines error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Error getting user machines", details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined }
    });
  }
};

// --- SYSTEM MONITORING ---

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    const services = [
      { name: 'auth-service', url: 'http://localhost:3002/api/v1/auth/health' },
      { name: 'sales-service', url: 'http://localhost:3004/api/v1/sales/health' },
      { name: 'inventory-service', url: 'http://localhost:3003/api/v1/inventory/health' },
      { name: 'communications-service', url: 'http://localhost:3005/api/v1/communications/health' },
    ];

    const healthChecks = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await fetch(service.url);
          const data = await response.json();
          return {
            name: service.name,
            healthy: response.ok && data.success,
            responseTime: Date.now(), // Simplified
            status: response.status,
            data
          };
        } catch (error) {
          return {
            name: service.name,
            healthy: false,
            error: 'Connection failed'
          };
        }
      })
    );

    const overallHealth = healthChecks.every(check => 
      check.status === 'fulfilled' && check.value.healthy
    );

    res.json({
      success: true,
      health: {
        overall: overallHealth,
        services: healthChecks.map(check => 
          check.status === 'fulfilled' ? check.value : check
        ),
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });

  } catch (error) {
    logger.error("GetSystemHealth error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error checking system health",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getSystemMetrics = async (req: Request, res: Response) => {
  try {
    const { period = '24h' } = req.query;
    
    // Calculate time range
    let startTime: Date;
    switch (period) {
      case '1h': startTime = new Date(Date.now() - 60 * 60 * 1000); break;
      case '24h': startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); break;
      case '7d': startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); break;
      default: startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // Get system metrics
    const metrics = await prisma.systemMetric.findMany({
      where: {
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Get audit log activity
    const auditActivity = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: { action: true },
      where: { createdAt: { gte: startTime } },
    });

    // Get security events
    const securityEvents = await prisma.securityEvent.count({
      where: { createdAt: { gte: startTime } },
    });

    res.json({
      success: true,
      metrics: {
        period,
        timeRange: { from: startTime.toISOString(), to: new Date().toISOString() },
        systemMetrics: metrics,
        auditActivity,
        securityEvents,
        performance: {
          cpuUsage: metrics.find(m => m.metric === 'CPU_USAGE')?.value || 0,
          memoryUsage: metrics.find(m => m.metric === 'MEMORY_USAGE')?.value || 0,
          diskUsage: metrics.find(m => m.metric === 'DISK_USAGE')?.value || 0,
        }
      },
    });

  } catch (error) {
    logger.error("GetSystemMetrics error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting system metrics",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const { 
      level,
      service,
      limit = 100,
      offset = 0,
      from,
      to 
    } = req.query;

    const where: any = {};
    
    if (level) where.level = level;
    if (service) where.service = service;
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from as string);
      if (to) where.timestamp.lte = new Date(to as string);
    }

    // For now, return audit logs as system logs
    // In production, you'd fetch from actual log files or log aggregator
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true,
        createdAt: true,
        action: true,
        resource: true,
        resourceId: true,
        userId: true,
        userRole: true,
        status: true,
        message: true,
        ipAddress: true,
        userAgent: true,
      },
    });

    res.json({
      success: true,
      logs,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
    });

  } catch (error) {
    logger.error("GetSystemLogs error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting system logs",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const clearSystemLogs = async (req: Request, res: Response) => {
  try {
    const { olderThan = '30d' } = req.body;
    
    let cutoffDate: Date;
    switch (olderThan) {
      case '7d': cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); break;
      case '30d': cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); break;
      case '90d': cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); break;
      default: cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const deletedCount = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    // Log the log clearing action
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'LOG_CLEAR',
        resource: 'SYSTEM',
        status: 'SUCCESS',
        message: `Cleared ${deletedCount.count} log entries older than ${olderThan}`,
        tags: ['ADMIN', 'SYSTEM_MAINTENANCE'],
      },
    });

    res.json({
      success: true,
      deletedCount: deletedCount.count,
      message: `Cleared ${deletedCount.count} log entries`,
    });

  } catch (error) {
    logger.error("ClearSystemLogs error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error clearing system logs",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- AUDIT & COMPLIANCE ---

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const {
      action,
      resource,
      userId,
      from,
      to,
      status,
      limit = 50,
      offset = 0
    } = req.query;

    const where: any = {};
    
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from as string);
      if (to) where.createdAt.lte = new Date(to as string);
    }

    const [auditLogs, totalCount] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      auditLogs,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });

  } catch (error) {
    logger.error("GetAuditLogs error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting audit logs",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const searchAuditLogs = async (req: Request, res: Response) => {
  try {
    const { searchCriteria, limit = 100 } = req.body;

    const where = await buildSearchCriteria(searchCriteria);

    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json({
      success: true,
      auditLogs,
      searchCriteria,
      count: auditLogs.length,
    });

  } catch (error) {
    logger.error("SearchAuditLogs error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error searching audit logs",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Helper function to build search criteria
const buildSearchCriteria = async (criteria: any) => {
  const where: any = {};

  if (criteria.dateRange) {
    where.createdAt = {
      gte: new Date(criteria.dateRange.from),
      lte: new Date(criteria.dateRange.to),
    };
  }

  if (criteria.users?.length) {
    where.userId = { in: criteria.users };
  }

  if (criteria.actions?.length) {
    where.action = { in: criteria.actions };
  }

  if (criteria.resources?.length) {
    where.resource = { in: criteria.resources };
  }

  if (criteria.statuses?.length) {
    where.status = { in: criteria.statuses };
  }

  if (criteria.keywords?.length) {
    const keywordConditions = criteria.keywords.map((keyword: string) => [
      { message: { contains: keyword, mode: 'insensitive' } },
      { tags: { has: keyword } }
    ]).flat();
    
    where.OR = keywordConditions;
  }

  return where;
};

export const generateComplianceReport = async (req: Request, res: Response) => {
  try {
    const report = await generateComplianceReportData();

    // Log report generation
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'COMPLIANCE_REPORT_GENERATED',
        resource: 'SYSTEM',
        status: 'SUCCESS',
        message: 'Compliance report generated successfully',
        tags: ['ADMIN', 'COMPLIANCE'],
      },
    });

    res.json({
      success: true,
      report,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    logger.error("GenerateComplianceReport error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error generating compliance report",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- SYSTEM CONFIGURATION ---

export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    const configs = await prisma.systemConfig.findMany({
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ],
    });

    // Group by category
    const configByCategory = configs.reduce((acc, config) => {
      if (!acc[config.category]) {
        acc[config.category] = [];
      }
      acc[config.category].push({
        key: config.key,
        value: config.isSensitive && req.user?.role !== 'Executive' ? '[HIDDEN]' : config.value,
        description: config.description,
        isEditable: config.isEditable,
        version: config.version,
        updatedAt: config.updatedAt,
        updatedBy: config.updatedBy,
      });
      return acc;
    }, {} as Record<string, any[]>);

    res.json({
      success: true,
      configuration: configByCategory,
    });

  } catch (error) {
    logger.error("GetSystemConfig error:", error);
    res.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting system configuration",
      },
    });
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const { configs } = req.body;

    // Validate that user is Executive for sensitive configs
    const allConfigs = await prisma.systemConfig.findMany();
    const sensitiveKeys = allConfigs.filter(c => c.isSensitive).map(c => c.key);

    const hasSensitiveChanges = Object.keys(configs).some(key => sensitiveKeys.includes(key));
    if (hasSensitiveChanges && req.user?.role !== 'Executive') {
      return res.status(403).json({
        success: false,
        error: {
          code: "INSUFFICIENT_PERMISSIONS",
          message: "Only executives can modify sensitive configuration",
        },
      });
    }

    const updatedConfigs = [];
    for (const [key, value] of Object.entries(configs)) {
      const updated = await prisma.systemConfig.update({
        where: { key },
        data: {
          value,
          version: { increment: 1 },
          updatedBy: req.user?.id,
          updatedAt: new Date(),
        },
      });
      updatedConfigs.push(updated);

      // Log configuration change
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id,
          userRole: req.user?.role,
          action: 'CONFIG_UPDATE',
          resource: 'SYSTEM_CONFIG',
          resourceId: key,
          newValues: { value },
          status: 'SUCCESS',
          message: `System configuration '${key}' updated`,
          tags: ['ADMIN', 'SYSTEM_CONFIG'],
        },
      });
    }

    res.json({
      success: true,
      updatedConfigs,
      message: `${updatedConfigs.length} configuration(s) updated`,
    });

  } catch (error) {
    logger.error("UpdateSystemConfig error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating system configuration",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getAvailableThemes = async (req: Request, res: Response) => {
  try {
    const themes = await prisma.themeConfig.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      themes: themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        displayName: theme.displayName,
        description: theme.description,
        isDefault: theme.isDefault,
      })),
    });

  } catch (error) {
    logger.error("GetAvailableThemes error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting available themes",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const createTheme = async (req: Request, res: Response) => {
  try {
    const { name, displayName, description, colors, fonts, layout, isDefault } = req.body;

    if (isDefault) {
      // Unset existing default
      await prisma.themeConfig.updateMany({ data: { isDefault: false }, where: { isDefault: true } });
    }

    const theme = await prisma.themeConfig.create({
      data: {
        name,
        displayName,
        description,
        colors,
        fonts,
        layout,
        isDefault: !!isDefault,
        createdBy: req.user?.id!,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'THEME_CREATE',
        resource: 'THEME',
        resourceId: theme.id,
        newValues: { name, displayName, isDefault: !!isDefault },
        status: 'SUCCESS',
        message: `Theme ${name} created`,
        tags: ['ADMIN', 'UI_THEMES']
      }
    });

    res.status(201).json({ success: true, theme });
  } catch (error) {
    logger.error('CreateTheme error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error creating theme', details: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined } });
  }
};

export const updateTheme = async (req: Request, res: Response) => {
  try {
    const { themeId } = req.params as { themeId: string };
    const { name, displayName, description, colors, fonts, layout, isDefault, isActive } = req.body;

    if (isDefault === true) {
      await prisma.themeConfig.updateMany({ data: { isDefault: false }, where: { isDefault: true } });
    }

    const updated = await prisma.themeConfig.update({
      where: { id: themeId },
      data: {
        name,
        displayName,
        description,
        colors,
        fonts,
        layout,
        isDefault: isDefault ?? undefined,
        isActive: isActive ?? undefined,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'THEME_UPDATE',
        resource: 'THEME',
        resourceId: themeId,
        newValues: { name, displayName, isDefault, isActive },
        status: 'SUCCESS',
        message: `Theme ${themeId} updated`,
        tags: ['ADMIN', 'UI_THEMES']
      }
    });

    res.json({ success: true, theme: updated });
  } catch (error) {
    logger.error('UpdateTheme error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error updating theme', details: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined } });
  }
};

export const scheduleMaintenance = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      scheduledStart,
      scheduledEnd,
      affectedServices,
      notifyUsers,
      advanceNotice
    } = req.body;

    const maintenanceWindow = await prisma.maintenanceWindow.create({
      data: {
        title,
        description,
        scheduledStart: new Date(scheduledStart),
        scheduledEnd: new Date(scheduledEnd),
        affectedServices,
        notifyUsers,
        advanceNotice,
        createdBy: req.user?.id!,
      },
    });

    // Clear logs for the past clearLogs
    await prisma.systemMetric.create({
      data: {
        service: 'ADMIN_SERVICE',
        metric: 'MAINTENANCE_SCHEDULED',
        value: 1,
        tags: {
          maintenanceId: maintenanceWindow.id,
          duration: new Date(scheduledEnd).getTime() - new Date(scheduledStart).getTime(),
          services: affectedServices,
        },
      },
    });

    res.status(201).json({
      success: true,
      maintenanceWindow,
      message: "Maintenance window scheduled successfully",
    });

    // Send notification event
    await sendEvent({
      topic: "MAINTENANCE_SCHEDULED",
      message: {
        maintenanceId: maintenanceWindow.id,
        title,
        scheduledStart,
        scheduledEnd,
        affectedServices,
        advanceNotice,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error("ScheduleMaintenance error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error scheduling maintenance",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- BROADCASTS & ANNOUNCEMENTS ---

export const createBroadcast = async (req: Request, res: Response) => {
  try {
    const {
      title,
      message,
      type,
      targetRoles,
      targetUsers,
      scheduledAt,
      expiresAt
    } = req.body;

    const broadcast = await prisma.systemBroadcast.create({
      data: {
        title,
        message,
        type,
        targetRoles: targetRoles || [],
        targetUsers: targetUsers || [],
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: req.user?.id!,
      },
    });

    res.status(201).json({
      success: true,
      broadcast,
      message: "Broadcast created successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "BROADCAST_CREATED",
      message: {
        broadcastId: broadcast.id,
        title,
        message,
        type,
        targetRoles,
        scheduledAt,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error("CreateBroadcast error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating broadcast",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getBroadcasts = async (req: Request, res: Response) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const [broadcasts, totalCount] = await Promise.all([
      prisma.systemBroadcast.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.systemBroadcast.count({ where }),
    ]);

    res.json({
      success: true,
      broadcasts,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });

  } catch (error) {
    logger.error("GetBroadcasts error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting broadcasts",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateBroadcastStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const broadcast = await prisma.systemBroadcast.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date(),
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'BROADCAST_STATUS_CHANGE',
        resource: 'BROADCAST',
        resourceId: id,
        newValues: { status },
        status: 'SUCCESS',
        message: `Broadcast status changed to ${status}`,
        tags: ['ADMIN', 'BROADCASTS'],
      },
    });

    res.json({
      success: true,
      broadcast,
      message: "Broadcast status updated successfully",
    });

  } catch (error) {
    logger.error("UpdateBroadcastStatus error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating broadcast status",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- SECURITY EVENTS ---
export const resolveSecurityEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params as { eventId: string };
    const { status, notes } = req.body as { status: 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE' | 'ESCALATED'; notes?: string };

    const updated = await prisma.securityEvent.update({
      where: { id: eventId },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
        resolvedBy: req.user?.id,
        description: notes ? notes : undefined,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        action: 'SECURITY_EVENT_UPDATE',
        resource: 'SECURITY_EVENT',
        resourceId: eventId,
        newValues: { status, notes },
        status: 'SUCCESS',
        message: `Security event ${eventId} marked as ${status}`,
        tags: ['ADMIN', 'SECURITY']
      }
    });

    res.json({ success: true, securityEvent: updated });
  } catch (error) {
    logger.error('ResolveSecurityEvent error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error updating security event', details: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined } });
  }
};

// Removed default export: named exports are used throughout the codebase
