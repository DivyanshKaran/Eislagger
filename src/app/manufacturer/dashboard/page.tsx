"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Factory,
  Truck,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  Search,
  Filter,
  Download,
  Activity,
  Clock,
  Thermometer,
  Gauge,
  Zap,
  Shield,
  Users,
  Calendar,
  Target,
  Award,
  RefreshCw,
  Eye,
  Settings,
  Bell,
  FileText,
  PieChart,
  LineChart,
  TrendingUpIcon,
  MapPin,
  Star,
  BarChart,
  ScatterChart,
  Radar,
  Layers,
  Cpu,
  Database,
  Wifi,
  Battery,
  Volume2,
  Lightbulb,
  Droplets,
  Wind,
  Leaf,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";

// Professional pastel blue theme styles
const customStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
  
  .professional-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(147, 197, 253, 0.2);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .professional-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  .dark .professional-card {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
`;

// Enhanced mock data with more variety
const productionTrendData = [
  {
    month: "Jan",
    production: 8500,
    deliveries: 120,
    efficiency: 92,
    quality: 98,
    energy: 85,
    waste: 2.1,
  },
  {
    month: "Feb",
    production: 9200,
    deliveries: 135,
    efficiency: 94,
    quality: 97,
    energy: 88,
    waste: 1.8,
  },
  {
    month: "Mar",
    production: 10500,
    deliveries: 150,
    efficiency: 96,
    quality: 99,
    energy: 92,
    waste: 1.5,
  },
  {
    month: "Apr",
    production: 9800,
    deliveries: 140,
    efficiency: 93,
    quality: 96,
    energy: 87,
    waste: 2.3,
  },
  {
    month: "May",
    production: 11200,
    deliveries: 165,
    efficiency: 95,
    quality: 98,
    energy: 90,
    waste: 1.7,
  },
  {
    month: "Jun",
    production: 12450,
    deliveries: 180,
    efficiency: 97,
    quality: 99,
    energy: 94,
    waste: 1.2,
  },
];

const productDistributionData = [
  { name: "Vanilla Base", value: 35, color: "#3b82f6", growth: "+12%" },
  { name: "Chocolate Mix", value: 28, color: "#1d4ed8", growth: "+8%" },
  { name: "Strawberry", value: 18, color: "#60a5fa", growth: "+15%" },
  { name: "Mint Extract", value: 12, color: "#93c5fd", growth: "+5%" },
  { name: "Caramel", value: 7, color: "#dbeafe", growth: "+20%" },
];

const weeklyProductionData = [
  {
    day: "Mon",
    production: 1800,
    target: 2000,
    efficiency: 90,
    temperature: 4.2,
    humidity: 65,
  },
  {
    day: "Tue",
    production: 2100,
    target: 2000,
    efficiency: 105,
    temperature: 4.0,
    humidity: 63,
  },
  {
    day: "Wed",
    production: 1950,
    target: 2000,
    efficiency: 97.5,
    temperature: 4.5,
    humidity: 68,
  },
  {
    day: "Thu",
    production: 2200,
    target: 2000,
    efficiency: 110,
    temperature: 3.8,
    humidity: 62,
  },
  {
    day: "Fri",
    production: 2400,
    target: 2000,
    efficiency: 120,
    temperature: 4.1,
    humidity: 64,
  },
  {
    day: "Sat",
    production: 1600,
    target: 1500,
    efficiency: 106.7,
    temperature: 4.3,
    humidity: 66,
  },
  {
    day: "Sun",
    production: 1200,
    target: 1200,
    efficiency: 100,
    temperature: 4.0,
    humidity: 65,
  },
];

const factoryPerformanceData = [
  {
    factory: "Factory A",
    production: 4200,
    efficiency: 96,
    status: "optimal",
    temperature: 4.2,
    humidity: 65,
    energy: 92,
    uptime: 98.5,
  },
  {
    factory: "Factory B",
    production: 3800,
    efficiency: 92,
    status: "good",
    temperature: 4.5,
    humidity: 68,
    energy: 88,
    uptime: 95.2,
  },
  {
    factory: "Factory C",
    production: 4450,
    efficiency: 98,
    status: "optimal",
    temperature: 3.8,
    humidity: 62,
    energy: 95,
    uptime: 99.1,
  },
  {
    factory: "Factory D",
    production: 3200,
    efficiency: 88,
    status: "maintenance",
    temperature: 5.1,
    humidity: 72,
    energy: 82,
    uptime: 89.3,
  },
];

const qualityMetricsData = [
  {
    metric: "Temperature Control",
    value: 98.5,
    target: 95,
    status: "excellent",
    trend: "+2.1%",
  },
  {
    metric: "Humidity Levels",
    value: 92.3,
    target: 90,
    status: "good",
    trend: "+1.8%",
  },
  {
    metric: "Batch Consistency",
    value: 96.8,
    target: 95,
    status: "excellent",
    trend: "+3.2%",
  },
  {
    metric: "Packaging Quality",
    value: 99.1,
    target: 98,
    status: "excellent",
    trend: "+0.9%",
  },
  {
    metric: "Hygiene Standards",
    value: 100,
    target: 99,
    status: "excellent",
    trend: "+1.0%",
  },
];

const energyConsumptionData = [
  { hour: "00:00", energy: 65, temperature: 4.0, efficiency: 85 },
  { hour: "04:00", energy: 45, temperature: 3.8, efficiency: 90 },
  { hour: "08:00", energy: 85, temperature: 4.2, efficiency: 88 },
  { hour: "12:00", energy: 95, temperature: 4.5, efficiency: 92 },
  { hour: "16:00", energy: 88, temperature: 4.3, efficiency: 89 },
  { hour: "20:00", energy: 75, temperature: 4.1, efficiency: 87 },
];

const environmentalMetricsData = [
  { metric: "Energy Efficiency", value: 94.2, target: 90, unit: "%" },
  { metric: "Water Usage", value: 85.7, target: 80, unit: "L/h" },
  { metric: "Waste Reduction", value: 92.8, target: 85, unit: "%" },
  { metric: "Carbon Footprint", value: 78.3, target: 75, unit: "kg CO2" },
  { metric: "Recycling Rate", value: 96.5, target: 90, unit: "%" },
];

const upcomingDeliveriesData = [
  {
    store: "Store #15",
    product: "Vanilla Ice Cream",
    quantity: "500L",
    time: "2:00 PM",
    status: "preparing",
    priority: "high",
    distance: "12.5 km",
  },
  {
    store: "Store #23",
    product: "Chocolate Mix",
    quantity: "300L",
    time: "3:30 PM",
    status: "ready",
    priority: "medium",
    distance: "8.2 km",
  },
  {
    store: "Store #8",
    product: "Strawberry",
    quantity: "400L",
    time: "4:15 PM",
    status: "preparing",
    priority: "high",
    distance: "15.7 km",
  },
  {
    store: "Store #12",
    product: "Mint Extract",
    quantity: "250L",
    time: "5:00 PM",
    status: "scheduled",
    priority: "low",
    distance: "6.8 km",
  },
];

const maintenanceScheduleData = [
  {
    equipment: "Production Line A",
    type: "Routine",
    date: "2024-01-15",
    status: "scheduled",
    priority: "medium",
    duration: "4 hours",
    technician: "John Smith",
  },
  {
    equipment: "Cooling System B",
    type: "Preventive",
    date: "2024-01-18",
    status: "in-progress",
    priority: "high",
    duration: "6 hours",
    technician: "Sarah Johnson",
  },
  {
    equipment: "Packaging Machine C",
    type: "Emergency",
    date: "2024-01-12",
    status: "completed",
    priority: "critical",
    duration: "8 hours",
    technician: "Mike Wilson",
  },
  {
    equipment: "Quality Control Lab",
    type: "Calibration",
    date: "2024-01-20",
    status: "scheduled",
    priority: "low",
    duration: "2 hours",
    technician: "Lisa Brown",
  },
];

export default function ManufacturerDashboardPage() {
  const [search, setSearch] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  const kpiData = [
    {
      title: "Total Production",
      value: "12,450L",
      change: "+15.2%",
      changeType: "positive" as const,
      icon: <Factory className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      subtitle: "This month",
      trend: "↗️",
    },
    {
      title: "Inventory Value",
      value: "$45,230",
      change: "+8.5%",
      changeType: "positive" as const,
      icon: <Package className="w-6 h-6" />,
      color: "from-sky-500 to-sky-600",
      subtitle: "Current stock",
      trend: "↗️",
    },
    {
      title: "Deliveries",
      value: "156",
      change: "+12",
      changeType: "positive" as const,
      icon: <Truck className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      subtitle: "This week",
      trend: "↗️",
    },
    {
      title: "Revenue",
      value: "$89,450",
      change: "+22.1%",
      changeType: "positive" as const,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-blue-600 to-indigo-600",
      subtitle: "Monthly total",
      trend: "↗️",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "production",
      title: "Vanilla Ice Cream Production Complete",
      description: "2,500L of vanilla base produced successfully",
      time: "2 hours ago",
      status: "completed",
      icon: <Factory className="w-4 h-4" />,
      priority: "high",
    },
    {
      id: 2,
      type: "delivery",
      title: "Delivery to Store #15",
      description: "500L of chocolate ice cream delivered",
      time: "4 hours ago",
      status: "completed",
      icon: <Truck className="w-4 h-4" />,
      priority: "medium",
    },
    {
      id: 3,
      type: "alert",
      title: "Low Stock Alert",
      description: "Mint extract running low (150L remaining)",
      time: "6 hours ago",
      status: "warning",
      icon: <AlertTriangle className="w-4 h-4" />,
      priority: "high",
    },
    {
      id: 4,
      type: "maintenance",
      title: "Equipment Maintenance",
      description: "Production line B maintenance completed",
      time: "1 day ago",
      status: "completed",
      icon: <CheckCircle className="w-4 h-4" />,
      priority: "medium",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "scheduled":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";
      case "in-progress":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === "positive" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="relative z-10 p-6">
        {/* Professional Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Manufacturer Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Welcome back! Here's your comprehensive production overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search production data..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 w-72 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <Card
              key={index}
              className="professional-card animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${kpi.color} text-white shadow-lg`}
                  >
                    {kpi.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(kpi.changeType)}
                    <span
                      className={`text-sm font-bold ${
                        kpi.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {kpi.change}
                    </span>
                    <span className="text-2xl">{kpi.trend}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {kpi.title}
                  </h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {kpi.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Production Trend Chart */}
          <Card className="lg:col-span-2 professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Production Trend Analysis
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                    onClick={() => setSelectedTimeframe("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                    onClick={() => setSelectedTimeframe("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                    onClick={() => setSelectedTimeframe("quarter")}
                  >
                    Quarter
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={productionTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.2)"
                  />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "8px",
                      color: "#1e293b",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="production"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="deliveries"
                    stackId="2"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Product Distribution */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                Product Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={productDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {productDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "8px",
                      color: "#1e293b",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-3">
                {productDistributionData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-900 dark:text-white font-bold">
                        {item.value}%
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-sm">
                        {item.growth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Environmental Dashboard */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                Environmental Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {environmentalMetricsData.map((metric, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {metric.metric}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {metric.value}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 ml-1">
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(
                            (metric.value / metric.target) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-slate-600 dark:text-slate-400">
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        {metric.value >= metric.target
                          ? "✓ Achieved"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy Consumption Chart */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Energy Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RechartsLineChart data={energyConsumptionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.2)"
                  />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "8px",
                      color: "#1e293b",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#f59e0b"
                    strokeWidth={4}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                    name="Energy Usage (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    name="Efficiency (%)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Bottom Section - Removed Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Recent Activities */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Recent Activities
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-sm">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {activity.time}
                          </p>
                          <Badge
                            className={`${getStatusColor(
                              activity.status
                            )} font-medium`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Factory Performance */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <Factory className="w-5 h-5 text-white" />
                </div>
                Factory Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {factoryPerformanceData.map((factory, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {factory.factory}
                      </span>
                      <Badge
                        className={`${
                          factory.status === "optimal"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : factory.status === "good"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        } font-medium`}
                      >
                        {factory.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Production:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {factory.production}L
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Efficiency:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {factory.efficiency}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Uptime:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {factory.uptime}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                          style={{ width: `${factory.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Upcoming Deliveries */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                Upcoming Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeliveriesData.map((delivery, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {delivery.store}
                      </span>
                      <Badge
                        className={`${getStatusColor(
                          delivery.status
                        )} font-medium`}
                      >
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {delivery.product} - {delivery.quantity}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-500">
                        {delivery.time}
                      </span>
                      <span className="text-slate-500 dark:text-slate-500">
                        {delivery.distance}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Badge
                        className={`${
                          delivery.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : delivery.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        } text-xs`}
                      >
                        {delivery.priority} priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
