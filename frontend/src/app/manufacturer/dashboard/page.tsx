"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Factory,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

export default function ManufacturerDashboardPage() {
  // Production KPIs
  const kpis = [
    {
      title: "Daily Production",
      value: "2,450",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <Factory className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      subtitle: "Units today",
    },
    {
      title: "Production Efficiency",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive" as const,
      header: <TrendingUp className="w-6 h-6" />,
      color: "from-sky-500 to-sky-600",
      subtitle: "Overall efficiency",
    },
    {
      title: "Active Workers",
      value: "48",
      change: "+3",
      changeType: "positive" as const,
      icon: <Users className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      subtitle: "On shift",
    },
    {
      title: "Quality Score",
      value: "98.7%",
      change: "+0.3%",
      changeType: "positive" as const,
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-sky-600",
      subtitle: "Defect-free rate",
    },
  ];

  // Weekly production data
  const weeklyProduction = [
    { day: "Mon", production: 2100, target: 2200 },
    { day: "Tue", production: 2350, target: 2300 },
    { day: "Wed", production: 2450, target: 2400 },
    { day: "Thu", production: 2550, target: 2500 },
    { day: "Fri", production: 2650, target: 2600 },
    { day: "Sat", production: 2800, target: 2700 },
    { day: "Sun", production: 2450, target: 2400 },
  ];

  // Product distribution data
  const productDistribution = [
    { name: "Ice Cream", value: 45, color: "#3b82f6" },
    { name: "Sorbets", value: 25, color: "#06b6d4" },
    { name: "Frozen Yogurt", value: 20, color: "#8b5cf6" },
    { name: "Gelato", value: 10, color: "#10b981" },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      action: "New batch completed",
      product: "Vanilla Ice Cream",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      action: "Quality check passed",
      product: "Chocolate Sorbet",
      timestamp: "4 hours ago",
      status: "completed",
    },
    {
      id: 3,
      action: "Machine maintenance",
      product: "Production Line A",
      timestamp: "6 hours ago",
      status: "maintenance",
    },
    {
      id: 4,
      action: "Staff shift change",
      product: "Evening shift",
      timestamp: "8 hours ago",
      status: "admin",
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
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
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
                Manufacturer Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Production analytics and operational insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search reports..."
                  className="pl-12 w-72 bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                View Reports
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="professional-card p-6 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-4 bg-gradient-to-r ${kpi.color} rounded-xl text-white shadow-lg`}
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
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Production Trends */}
          <div className="professional-card p-8 animate-fade-in-scale">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              Weekly Production Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={weeklyProduction}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#f8fafc",
                    borderRadius: 8,
                    border: "none",
                  }}
                  labelStyle={{ color: "#475569" }}
                />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  isAnimationActive
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#94a3b8", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution */}
          <div className="professional-card p-8 animate-fade-in-scale">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              Product Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {productDistribution.map((product, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: product.color }}
                  ></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {product.name} ({product.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="professional-card p-8 animate-fade-in-scale">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Recent Activities
            </h2>
            <Button
              variant="ghost"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-sky-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {activity.action}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {activity.product}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={`${getStatusColor(
                        activity.status
                      )} font-medium`}
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}