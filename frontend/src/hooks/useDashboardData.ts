import { useState, useEffect } from 'react';

export interface KPIData {
  id: number;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend: number[];
  period: string;
  target: string;
  progress: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface DashboardData {
  kpis: KPIData[];
  chartData: ChartData[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    growthRate: number;
  };
}

export type UserRole = 'patron' | 'manufacturer' | 'executive' | 'clerk';

export function useDashboardData(role: UserRole) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call - replace with actual service call
        const mockData = await generateMockData(role);
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const mockData = await generateMockData(role);
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
}

// Mock data generator - replace with actual API calls
async function generateMockData(role: UserRole): Promise<DashboardData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const baseKPIs: KPIData[] = [
    {
      id: 1,
      title: 'Total Orders',
      value: '1,234',
      change: '+12.5%',
      changeType: 'increase',
      icon: null, // Will be set by component
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: [100, 120, 110, 140, 160, 180, 200],
      period: 'Last 7 days',
      target: '1,500',
      progress: 82,
      category: 'Sales',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Revenue',
      value: '$45,678',
      change: '+8.2%',
      changeType: 'increase',
      icon: null,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: [3000, 3200, 3100, 3400, 3600, 3800, 4000],
      period: 'Last 7 days',
      target: '$50,000',
      progress: 91,
      category: 'Financial',
      priority: 'high',
    },
  ];

  const baseChartData: ChartData[] = [
    { name: 'Jan', value: 400, orders: 12, revenue: 1800 },
    { name: 'Feb', value: 300, orders: 15, revenue: 2200 },
    { name: 'Mar', value: 200, orders: 18, revenue: 2800 },
    { name: 'Apr', value: 278, orders: 14, revenue: 2100 },
    { name: 'May', value: 189, orders: 22, revenue: 3200 },
    { name: 'Jun', value: 239, orders: 19, revenue: 2900 },
  ];

  // Role-specific data customization
  switch (role) {
    case 'patron':
      return {
        kpis: [
          ...baseKPIs,
          {
            id: 3,
            title: 'Favorite Flavors',
            value: '8',
            change: '+2',
            changeType: 'increase',
            icon: null,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            trend: [5, 6, 7, 8, 8, 8, 8],
            period: 'This month',
            target: '10',
            progress: 80,
            category: 'Preferences',
            priority: 'medium',
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 1,
          growthRate: 12.5,
        },
      };

    case 'manufacturer':
      return {
        kpis: [
          ...baseKPIs,
          {
            id: 3,
            title: 'Production Units',
            value: '2,456',
            change: '+15.3%',
            changeType: 'increase',
            icon: null,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            trend: [2000, 2100, 2200, 2300, 2400, 2450, 2456],
            period: 'This month',
            target: '3,000',
            progress: 82,
            category: 'Production',
            priority: 'high',
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 150,
          growthRate: 15.3,
        },
      };

    case 'executive':
      return {
        kpis: [
          ...baseKPIs,
          {
            id: 3,
            title: 'Market Share',
            value: '23.4%',
            change: '+2.1%',
            changeType: 'increase',
            icon: null,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            trend: [20, 21, 22, 22.5, 23, 23.2, 23.4],
            period: 'This quarter',
            target: '25%',
            progress: 94,
            category: 'Market',
            priority: 'high',
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 500,
          growthRate: 8.2,
        },
      };

    case 'clerk':
      return {
        kpis: [
          ...baseKPIs,
          {
            id: 3,
            title: 'Transactions',
            value: '89',
            change: '+5.2%',
            changeType: 'increase',
            icon: null,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            trend: [70, 75, 80, 82, 85, 87, 89],
            period: 'Today',
            target: '100',
            progress: 89,
            category: 'Operations',
            priority: 'medium',
          },
        ],
        chartData: baseChartData,
        summary: {
          totalOrders: 89,
          totalRevenue: 4567,
          totalCustomers: 45,
          growthRate: 5.2,
        },
      };

    default:
      return {
        kpis: baseKPIs,
        chartData: baseChartData,
        summary: {
          totalOrders: 1234,
          totalRevenue: 45678,
          totalCustomers: 100,
          growthRate: 10,
        },
      };
  }
}
