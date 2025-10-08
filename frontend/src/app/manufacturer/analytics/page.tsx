"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
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
  AreaChart,
  Area,
  ComposedChart,
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

export default function ManufacturerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  // Key metrics
  const metrics = [
    {
      title: "Total Production",
      value: "75,420",
      change: "+18.3%",
      changeType: "positive" as const,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-600",
      subtitle: "Units this month",
    },
    {
      title: "Efficiency Rate",
      value: "94.7%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-600",
      subtitle: "Overall efficiency",
    },
    {
      title: "Cost per Unit",
      value: "$2.34",
      change: "-8.5%",
      changeType: "positive" as const,
      icon: <TrendingDown className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      subtitle: "Reduction achieved",
    },
    {
      title: "Quality Index",
      value: "98.2%",
      change: "+1.2%",
      changeType: "positive" as const,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-purple-600",
      subtitle: "Defect-free rate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="relative z-10 p-6">
        {/* Professional Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
                    Analytics Dashboard
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    Comprehensive manufacturing analytics and performance insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="professional-card p-6 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30' : metric.color.includes('blue') ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} shadow-lg`}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    metric.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {metric.title}
                </h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {metric.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Production vs Efficiency Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="professional-card p-8 animate-fade-in-scale">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              Production vs Efficiency Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { month: "Jan", production: 2100, efficiency: 94 },
                  { month: "Feb", production: 2350, efficiency: 96 },
                  { month: "Mar", production: 2450, efficiency: 95 },
                  { month: "Apr", production: 2550, efficiency: 97 },
                  { month: "May", production: 2650, efficiency: 95 },
                  { month: "Jun", production: 2750, efficiency: 97 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
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
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="professional-card p-8 animate-fade-in-scale">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              Cost Analysis Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { category: "Materials", cost: 18500, percentage: 52 },
                  { category: "Labor", cost: 10200, percentage: 29 },
                  { category: "Overhead", cost: 4800, percentage: 14 },
                  { category: "Packaging", cost: 1800, percentage: 5 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="category"
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
                <Bar
                  dataKey="cost"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}