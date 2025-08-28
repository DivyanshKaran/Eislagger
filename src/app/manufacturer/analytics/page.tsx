"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Factory,
  Package,
  Truck,
  DollarSign,
  Filter,
  Download,
  Target,
  Search,
  Globe,
  Star,
  Award,
  Trophy,
  TrendingUp as TrendingUpIcon,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart,
  PieChart as PieChartIcon,
  MapPin,
  Thermometer,
  Gauge,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  
  .search-input {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.3);
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    background: rgba(255, 255, 255, 0.95);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .dark .search-input {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(71, 85, 105, 0.3);
  }
  
  .dark .search-input:focus {
    background: rgba(30, 41, 59, 0.95);
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

export default function AnalyticsPage() {
  const kpiStats = [
    {
      title: "Production Efficiency",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: <Factory className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      subtitle: "Manufacturing productivity",
    },
    {
      title: "Inventory Turnover",
      value: "8.5x",
      change: "+0.3x",
      changeType: "positive" as const,
      icon: <Package className="w-6 h-6" />,
      color: "from-sky-500 to-sky-600",
      subtitle: "Stock rotation rate",
    },
    {
      title: "Delivery Success Rate",
      value: "98.7%",
      change: "+0.5%",
      changeType: "positive" as const,
      icon: <Truck className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      subtitle: "On-time deliveries",
    },
    {
      title: "Revenue Growth",
      value: "22.3%",
      change: "+3.2%",
      changeType: "positive" as const,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-blue-600 to-cyan-600",
      subtitle: "Monthly growth",
    },
  ];

  const topProducts = [
    {
      name: "Vanilla Ice Cream",
      production: "2,500L",
      revenue: "$12,500",
      growth: "+15.2%",
      trend: "up",
      icon: "🍦",
      color: "from-blue-500 to-sky-500",
      marketShare: 28,
    },
    {
      name: "Chocolate Ice Cream",
      production: "2,200L",
      revenue: "$11,000",
      growth: "+12.8%",
      trend: "up",
      icon: "🍫",
      color: "from-sky-500 to-indigo-500",
      marketShare: 25,
    },
    {
      name: "Strawberry Ice Cream",
      production: "1,800L",
      revenue: "$9,000",
      growth: "+8.5%",
      trend: "up",
      icon: "🍓",
      color: "from-indigo-500 to-purple-500",
      marketShare: 20,
    },
    {
      name: "Mint Chocolate Chip",
      production: "1,500L",
      revenue: "$7,500",
      growth: "+5.2%",
      trend: "down",
      icon: "🌿",
      color: "from-purple-500 to-pink-500",
      marketShare: 18,
    },
  ];

  const monthlyData = [
    {
      month: "Jan",
      production: 12000,
      revenue: 45000,
      deliveries: 145,
      quality: 94.2,
    },
    {
      month: "Feb",
      production: 13500,
      revenue: 52000,
      deliveries: 162,
      quality: 95.1,
    },
    {
      month: "Mar",
      production: 14200,
      revenue: 58000,
      deliveries: 178,
      quality: 96.3,
    },
    {
      month: "Apr",
      production: 13800,
      revenue: 55000,
      deliveries: 165,
      quality: 94.8,
    },
    {
      month: "May",
      production: 15600,
      revenue: 62000,
      deliveries: 189,
      quality: 97.2,
    },
    {
      month: "Jun",
      production: 16800,
      revenue: 68000,
      deliveries: 201,
      quality: 98.1,
    },
  ];

  const qualityMetrics = [
    {
      name: "Temperature Control",
      value: 98.5,
      target: 95,
      unit: "%",
      status: "excellent",
    },
    { name: "pH Level", value: 6.8, target: 7.0, unit: "", status: "good" },
    {
      name: "Viscosity",
      value: 92.3,
      target: 90,
      unit: "cP",
      status: "excellent",
    },
    {
      name: "Fat Content",
      value: 12.5,
      target: 12,
      unit: "%",
      status: "excellent",
    },
  ];

  const recentAchievements = [
    {
      title: "Best Quality Award",
      description: "Industry recognition",
      icon: <Trophy className="w-5 h-5" />,
      color: "text-yellow-600",
      date: "2 days ago",
    },
    {
      title: "Efficiency Milestone",
      description: "95% production efficiency",
      icon: <Target className="w-5 h-5" />,
      color: "text-blue-600",
      date: "1 week ago",
    },
    {
      title: "Safety Record",
      description: "365 days accident-free",
      icon: <Award className="w-5 h-5" />,
      color: "text-green-600",
      date: "2 weeks ago",
    },
  ];

  const marketShareData = [
    { name: "Vanilla", value: 28, color: "#3B82F6" },
    { name: "Chocolate", value: 25, color: "#8B5CF6" },
    { name: "Strawberry", value: 20, color: "#EC4899" },
    { name: "Mint", value: 18, color: "#10B981" },
    { name: "Others", value: 9, color: "#F59E0B" },
  ];

  const performanceMetrics = [
    { name: "Production", value: 94, color: "#3B82F6" },
    { name: "Quality", value: 98, color: "#10B981" },
    { name: "Efficiency", value: 92, color: "#F59E0B" },
    { name: "Safety", value: 96, color: "#EF4444" },
    { name: "Delivery", value: 89, color: "#8B5CF6" },
  ];

  const regionalData = [
    { region: "North", sales: 45000, growth: "+12%", color: "#3B82F6" },
    { region: "South", sales: 38000, growth: "+8%", color: "#8B5CF6" },
    { region: "East", sales: 52000, growth: "+15%", color: "#10B981" },
    { region: "West", sales: 41000, growth: "+10%", color: "#F59E0B" },
  ];

  const alerts = [
    {
      type: "warning",
      message: "Temperature fluctuation detected in Warehouse B",
      time: "2 hours ago",
      icon: <Thermometer className="w-4 h-4" />,
    },
    {
      type: "success",
      message: "Quality target exceeded for Vanilla production",
      time: "4 hours ago",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      type: "info",
      message: "New efficiency record achieved",
      time: "1 day ago",
      icon: <Target className="w-4 h-4" />,
    },
  ];

  const getChangeIcon = (changeType: string) => {
    return changeType === "positive" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800";
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800";
      default:
        return "bg-slate-50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800";
    }
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
                Analytics Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Comprehensive insights into your manufacturing operations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search analytics..."
                  className="pl-12 w-72 search-input text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
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
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiStats.map((stat, index) => (
            <Card
              key={index}
              className="professional-card animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(stat.changeType)}
                    <span
                      className={`text-sm font-bold ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Production Trend */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Production Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="productionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="production"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#productionGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Analysis */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <TrendingUpIcon className="w-5 h-5 text-white" />
                </div>
                Revenue Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Multi-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enhanced Top Products */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <Star className="w-5 h-5 text-white" />
                </div>
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{product.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {product.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {product.production} • {product.revenue}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          product.trend === "up"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        } font-medium`}
                      >
                        {product.growth}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        Market Share: {product.marketShare}%
                      </span>
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div
                          className="h-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full"
                          style={{ width: `${product.marketShare}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quality Metrics */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {metric.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {metric.value}
                          {metric.unit}
                        </span>
                        <Badge
                          className={`${getStatusColor(metric.status)} text-xs`}
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-sky-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (metric.value / metric.target) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                      <span>
                        {Math.round((metric.value / metric.target) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Achievements */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600">
                  <Award className="w-5 h-5 text-white" />
                </div>
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                        <div className={achievement.color}>
                          {achievement.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        {achievement.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Market Share Pie Chart */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <PieChartIcon className="w-5 h-5 text-white" />
                </div>
                Market Share Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Radar Chart */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600">
                  <Gauge className="w-5 h-5 text-white" />
                </div>
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="name" stroke="#6B7280" />
                  <PolarRadiusAxis stroke="#6B7280" />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Delivery Performance & Regional Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enhanced Delivery Performance */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                Delivery Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="deliveries"
                    fill="url(#deliveryGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="deliveryGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#F97316"
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional Sales Performance */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                Regional Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalData.map((region, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: region.color }}
                        ></div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {region.region}
                        </h4>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {region.growth}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${region.sales.toLocaleString()}
                      </span>
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Alerts & Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Alerts */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                Real-time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${getAlertColor(
                      alert.type
                    )} transition-all duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                        {alert.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {alert.message}
                        </p>
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {alert.time}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality vs Production Composed Chart */}
          <Card className="professional-card animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-600">
                  <BarChart className="w-5 h-5 text-white" />
                </div>
                Quality vs Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis yAxisId="left" stroke="#3B82F6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="production"
                    fill="#3B82F6"
                    opacity={0.7}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="quality"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
