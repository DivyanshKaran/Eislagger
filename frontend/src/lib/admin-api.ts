// Admin Service API client for frontend integration

import type { ApiResponse } from "@/types/common";
import { adminApi } from "./api-client";

// Types for admin data
export interface UserSnapshot {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Executive" | "Manufacturer" | "Clerk" | "Patron";
  isActive: boolean;
  lastLoginAt?: string;
  totalLogins: number;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userRole?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  oldValues?: any;
  newValues?: any;
  status: "SUCCESS" | "FAILURE" | "WARNING";
  message?: string;
  tags: string[];
  createdAt: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: "GENERAL" | "SECURITY" | "PERFORMANCE" | "FEATURE_FLAGS" | "INTEGRATION" | "UI_THEMES";
  isSensitive: boolean;
  isEditable: boolean;
  version: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemBroadcast {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "MAINTENANCE" | "ANNOUNCEMENT" | "PROMOTION";
  targetRoles: string[];
  targetUsers: string[];
  scheduledAt?: string;
  expiresAt?: string;
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  isActive: boolean;
  views: number;
  acknowledgments: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemMetric {
  id: string;
  service: string;
  metric: string;
  value: number;
  timestamp: string;
  tags?: any;
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "FAILED";
  affectedServices: string[];
  notifyUsers: boolean;
  advanceNotice: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityEvent {
  id: string;
  eventType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  endpoint?: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "FALSE_POSITIVE" | "ESCALATED";
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  layout: Record<string, any>;
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceReport {
  period: {
    from: string;
    to: string;
  };
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalActions: number;
    securityEvents: number;
    dataAccess: number;
    dataModifications: number;
    complianceSummary: {
      lastFullBackup: string;
      lastSecurityAudit: string;
      activeMaintenanceWindows: number;
    };
  };
}

export interface ServiceHealth {
  name: string;
  healthy: boolean;
  responseTime?: number;
  status?: number;
  data?: any;
  error?: string;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  recentUsers: number;
  roleDistribution: Array<{ role: string; _count: { role: number } }>;
  topRevenueUsers: Array<{
    name: string;
    role: string;
    totalRevenue: number;
    totalOrders: number;
  }>;
  conversionRate: number;
}

// Admin Service API methods
export const adminService = {
  // User Management
  getAllUsers: (params?: {
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ users: UserSnapshot[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    return adminApi.get(endpoint);
  },

  changeUserRole: (userId: string, role: string): Promise<ApiResponse<{ userSnapshot: UserSnapshot }>> =>
    adminApi.put(`/admin/users/${userId}/role`, { role }),

  changeUserStatus: (userId: string, status: boolean): Promise<ApiResponse<{ userSnapshot: UserSnapshot }>> =>
    adminApi.put(`/admin/users/${userId}/status`, { status }),

  deleteUser: (userId: string): Promise<ApiResponse<any>> =>
    adminApi.delete(`/admin/users/${userId}`),

  getUserAnalytics: (): Promise<ApiResponse<{ analytics: UserAnalytics }>> =>
    adminApi.get("/admin/users/analytics"),

  // System Monitoring
  getSystemHealth: (): Promise<ApiResponse<{
    health: {
      overall: boolean;
      services: ServiceHealth[];
      timestamp: string;
      uptime: number;
    };
  }>> =>
    adminApi.get("/admin/system/health"),

  getSystemMetrics: (params?: {
    period?: "1h" | "24h" | "7d";
  }): Promise<ApiResponse<{
    metrics: {
      period: string;
      timeRange: { from: string; to: string };
      systemMetrics: SystemMetric[];
      auditActivity: Array<{ action: string; _count: { action: number } }>;
      securityEvents: number;
      performance: {
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
      };
    };
  }>> => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/system/metrics?${queryString}` : '/admin/system/metrics';
    return adminApi.get(endpoint);
  },

  getSystemLogs: (params?: {
    level?: string;
    service?: string;
    limit?: number;
    offset?: number;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<{ logs: any[]; pagination?: any }>> => {
    const queryParams = new URLSearchParams();
    if (params?.level) queryParams.append('level', params.level);
    if (params?.service) queryParams.append('service', params.service);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/system/logs?${queryString}` : '/admin/system/logs';
    return adminApi.get(endpoint);
  },

  clearSystemLogs: (data: {
    olderThan?: "7d" | "30d" | "90d";
  }): Promise<ApiResponse<{ deletedCount: number }>> =>
    adminApi.post("/admin/system/logs/clear", data),

  // Audit & Compliance
  getAuditLogs: (params?: {
    action?: string;
    resource?: string;
    userId?: string;
    from?: string;
    to?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ auditLogs: AuditLog[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    if (params?.action) queryParams.append('action', params.action);
    if (params?.resource) queryParams.append('resource', params.resource);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/audit-logs?${queryString}` : '/admin/audit-logs';
    return adminApi.get(endpoint);
  },

  searchAuditLogs: (data: {
    searchCriteria: {
      dateRange?: { from: string; to: string };
      users?: string[];
      actions?: string[];
      resources?: string[];
      statuses?: string[];
      keywords?: string[];
    };
    limit?: number;
  }): Promise<ApiResponse<{ auditLogs: AuditLog[]; searchCriteria: any; count: number }>> =>
    adminApi.post("/admin/audit-logs/search", data),

  generateComplianceReport: (): Promise<ApiResponse<{ report: ComplianceReport; generatedAt: string }>> =>
    adminApi.get("/admin/compliance/report"),

  // System Configuration
  getSystemConfig: (): Promise<ApiResponse<{ configuration: Record<string, any[]> }>> =>
    adminApi.get("/admin/config"),

  updateSystemConfig: (configs: Record<string, any>): Promise<ApiResponse<{
    updatedConfigs: SystemConfig[];
    message: string;
  }>> =>
    adminApi.put("/admin/config", { configs }),

  getAvailableThemes: (): Promise<ApiResponse<{
    themes: Array<{
      id: string;
      name: string;
      displayName: string;
      description?: string;
      isDefault: boolean;
    }>;
  }>> =>
    adminApi.get("/admin/config/themes"),

  scheduleMaintenance: (data: {
    title: string;
    description?: string;
    scheduledStart: string;
    scheduledEnd: string;
    affectedServices: string[];
    notifyUsers?: boolean;
    advanceNotice?: number;
  }): Promise<ApiResponse<{ maintenanceWindow: MaintenanceWindow; message: string }>> =>
    adminApi.post("/admin/config/maintenance", data),

  // Broadcasts & Announcements
  createBroadcast: (data: {
    title: string;
    message: string;
    type: "INFO" | "WARNING" | "MAINTENANCE" | "ANNOUNCEMENT" | "PROMOTION";
    targetRoles?: string[];
    targetUsers?: string[];
    scheduledAt?: string;
    expiresAt?: string;
  }): Promise<ApiResponse<{ broadcast: SystemBroadcast; message: string }>> =>
    adminApi.post("/admin/broadcasts", data),

  getBroadcasts: (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ broadcasts: SystemBroadcast[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/broadcasts?${queryString}` : '/admin/broadcasts';
    return adminApi.get(endpoint);
  },

  updateBroadcastStatus: (id: string, status: string): Promise<ApiResponse<{
    broadcast: SystemBroadcast;
    message: string;
  }>> =>
    adminApi.put(`/admin/broadcasts/${id}/status`, { status }),

  // Health Check
  healthCheck: (): Promise<ApiResponse<any>> =>
    adminApi.get("/admin/health"),
};

// Hooks for React components
export const useAdminData = () => {
  const fetchUsers = async (params?: {
    search?: string;
    role?: string;
    status?: string;
  }) => {
    try {
      const response = await adminService.getAllUsers(params);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  };

  const fetchAuditLogs = async (params?: {
    action?: string;
    resource?: string;
    userId?: string;
  }) => {
    try {
      const response = await adminService.getAuditLogs(params);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return null;
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const response = await adminService.getSystemHealth();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching system health:", error);
      return null;
    }
  };

  const fetchSystemMetrics = async () => {
    try {
      const response = await adminService.getSystemMetrics();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      return null;
    }
  };

  const fetchSystemConfig = async () => {
    try {
      const response = await adminService.getSystemConfig();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching system config:", error);
      return null;
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const response = await adminService.getBroadcasts();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching broadcasts:", error);
      return null;
    }
  };

  const generateComplianceReport = async () => {
    try {
      const response = await adminService.generateComplianceReport();
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error generating compliance report:", error);
      return null;
    }
  };

  return {
    fetchUsers,
    fetchAuditLogs,
    fetchSystemHealth,
    fetchSystemMetrics,
    fetchSystemConfig,
    fetchBroadcasts,
    generateComplianceReport,
  };
};

export default adminService;

