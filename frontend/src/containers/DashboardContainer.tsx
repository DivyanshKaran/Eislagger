import React, { useState, useCallback } from "react";

import { AlertCircle, RefreshCw } from "lucide-react";

import { DashboardHeader } from "@/components/presentational/DashboardHeader";
import { KPICard } from "@/components/presentational/KPICard";
import { LoadingGrid } from "@/components/presentational/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { UserRole } from "@/types";
// Removed unused import
import { dashboardService } from "@/services/dashboardService";
import {
  calculateDashboardMetrics,
  getDashboardLayoutConfig,
} from "@/utils/dashboardUtils";

export interface DashboardContainerProps {
  role: UserRole;
  title: string;
  subtitle?: string;
  layout?: "grid" | "list" | "compact";
  className?: string;
}

export function DashboardContainer({
  role,
  title,
  subtitle,
  layout = "grid",
  className = "",
}: DashboardContainerProps) {
  const { data, loading, error, refreshData } = useDashboardData(role);
  const [expandedKPIs, setExpandedKPIs] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData]);

  const handleKPIToggle = useCallback((kpiId: string) => {
    setExpandedKPIs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(kpiId)) {
        newSet.delete(kpiId);
      } else {
        newSet.add(kpiId);
      }
      return newSet;
    });
  }, []);

  // Removed unused functions

  const handleExport = useCallback(async () => {
    try {
      const blob = await dashboardService.exportDashboardData(role, "json");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${role}_dashboard_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [role]);

  const layoutConfig = getDashboardLayoutConfig(layout);
  const metrics = data ? calculateDashboardMetrics(data.kpis) : undefined;

  if (loading && !data) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        <DashboardHeader
          role={role}
          title={title}
          subtitle={subtitle}
          isLoading={true}
        />
        <div className="p-6">
          <LoadingGrid count={6} text="Loading dashboard data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        <DashboardHeader role={role} title={title} subtitle={subtitle} />
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Failed to load dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        <DashboardHeader role={role} title={title} subtitle={subtitle} />
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No data available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Unable to load dashboard data at this time.
              </p>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <DashboardHeader
        role={role}
        title={title}
        subtitle={subtitle}
        metrics={metrics}
        lastUpdated={new Date()}
        isLoading={isRefreshing}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <div className="p-6">
        <div
          className={`grid ${layoutConfig.gridCols} ${layoutConfig.spacing}`}
        >
          {data.kpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              isExpanded={expandedKPIs.has(kpi.id)}
              isLoading={false}
              onToggleExpanded={() => handleKPIToggle(kpi.id)}
              onRefresh={() => handleRefresh()}
              onDownload={() => handleExport()}
              className={layoutConfig.cardSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
