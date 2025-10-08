import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuditEvent {
  action: string;
  resource: string;
  resourceId?: string;
  status?: 'SUCCESS' | 'FAILURE' | 'WARNING';
  message?: string;
  tags?: string[];
  oldValues?: any;
  newValues?: any;
}

export const auditLogger = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Store original methods
  const originalSend = res.send;
  const originalStatus = res.status;
  
  // Override res.status to capture status code
  let statusCode = 200;
  res.status = function(code: number) {
    statusCode = code;
    return originalStatus.call(this, code);
  };

  // Override res.send to capture response
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    
    // Log successful operations
    if (statusCode < 400 && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
      createAuditLog(req, {
        action: getActionFromMethod(req.method),
        resource: getResourceFromPath(req.path),
        resourceId: getResourceIdFromPath(req.path),
        status: 'SUCCESS',
        message: `Operation completed successfully`,
        tags: ['AUDIT', 'ADMIN'],
      }, duration);
    }
    
    return originalSend.call(this, data);
  };

  next();
};

const createAuditLog = async (req: Request, event: AuditEvent, duration: number) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        userRole: req.user?.role,
        sessionId: req.headers['x-session-id'] as string,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        endpoint: `${req.method} ${req.path}`,
        status: event.status as any,
        message: event.message,
        tags: event.tags || [],
        oldValues: event.oldValues,
        newValues: event.newValues,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};

const getActionFromMethod = (method: string): string => {
  switch (method) {
    case 'GET': return 'READ';
    case 'POST': return 'CREATE';
    case 'PUT': return 'UPDATE';
    case 'DELETE': return 'DELETE';
    default: return method;
  }
};

const getResourceFromPath = (path: string): string => {
  if (path.includes('/users')) return 'USER';
  if (path.includes('/system')) return 'SYSTEM';
  if (path.includes('/config')) return 'CONFIG';
  if (path.includes('/broadcasts')) return 'BROADCAST';
  if (path.includes('/audit')) return 'AUDIT_LOG';
  return 'UNKNOWN';
};

const getResourceIdFromPath = (path: string): string | undefined => {
  const matches = path.match(/\/([^\/]+)$/);
  return matches?.[1];
};

export default auditLogger;

