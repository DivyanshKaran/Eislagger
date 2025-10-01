import { useState, useCallback } from 'react';
import { KPIData } from './useDashboardData';

export interface UseKPICardProps {
  kpi: KPIData;
  onExpand?: (id: number) => void;
  onCollapse?: (id: number) => void;
}

export function useKPICard({ kpi, onExpand, onCollapse }: UseKPICardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(prev => {
      const newExpanded = !prev;
      
      if (newExpanded) {
        onExpand?.(kpi.id);
      } else {
        onCollapse?.(kpi.id);
      }
      
      return newExpanded;
    });
  }, [kpi.id, onExpand, onCollapse]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call for refreshing KPI data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would call a service to refresh the specific KPI
    } catch (error) {
      console.error('Failed to refresh KPI:', error);
    } finally {
      setIsLoading(false);
    }
  }, [kpi.id]);

  const handleDownload = useCallback(() => {
    // Generate and download KPI report
    const reportData = {
      title: kpi.title,
      value: kpi.value,
      change: kpi.change,
      trend: kpi.trend,
      period: kpi.period,
      target: kpi.target,
      progress: kpi.progress,
      category: kpi.category,
      priority: kpi.priority,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kpi.title.toLowerCase().replace(/\s+/g, '_')}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [kpi]);

  const getProgressColor = useCallback((progress: number) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const formatTrendData = useCallback((trend: number[]) => {
    return trend.map((value, index) => ({
      day: `Day ${index + 1}`,
      value,
    }));
  }, []);

  return {
    isExpanded,
    isLoading,
    handleToggleExpanded,
    handleRefresh,
    handleDownload,
    getProgressColor,
    getPriorityColor,
    formatTrendData,
  };
}
