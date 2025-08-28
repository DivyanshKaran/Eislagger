"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  DollarSign,
  Store,
  Factory,
  IceCream,
  AlertTriangle,
  Clock,
  XCircle,
  CheckCircle,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Share2,
  BarChart3,
  PieChart,
  LineChart,
  Search,
  User,
  Filter,
} from "lucide-react";
import { useState } from "react";

// Add custom animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
`;

export default function ExecutiveDashboard() {
  const [search, setSearch] = useState("");

  // KPI Data
  const kpiData = [
    {
      title: "Today's Sales",
      value: "₹2,45,678",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-emerald-400 to-teal-500",
      bgColor:
        "from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20",
      subtitle: "8,234 units sold",
    },
    {
      title: "Weekly Growth",
      value: "+18.3%",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-400 to-indigo-500",
      bgColor:
        "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
      subtitle: "vs last week",
    },
    {
      title: "Top Flavor",
      value: "Choco Fudge",
      change: "32%",
      changeType: "neutral" as const,
      icon: <IceCream className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      bgColor:
        "from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20",
      subtitle: "share of sales",
    },
    {
      title: "Active Factories",
      value: "12",
      change: "+2",
      changeType: "positive" as const,
      icon: <Factory className="w-6 h-6" />,
      color: "from-orange-400 to-red-500",
      bgColor:
        "from-orange-50/80 to-red-50/80 dark:from-orange-950/20 dark:to-red-950/20",
      subtitle: "out of 15 total",
    },
  ];

  // Budget Utilization Data
  const budgetData = [
    { factory: "Mumbai Factory", utilization: 85, budget: "₹45L" },
    { factory: "Delhi Factory", utilization: 72, budget: "₹38L" },
    { factory: "Bangalore Factory", utilization: 91, budget: "₹52L" },
    { factory: "Chennai Factory", utilization: 68, budget: "₹32L" },
    { factory: "Kolkata Factory", utilization: 78, budget: "₹28L" },
  ];

  // Top Stores Data
  const topStores = [
    {
      name: "Bangalore HQ",
      sales: "₹82,450",
      rating: 4.8,
      stock: "Low",
      stockStatus: "warning",
      issues: false,
    },
    {
      name: "Mumbai Central",
      sales: "₹74,320",
      rating: 4.6,
      stock: "Medium",
      stockStatus: "normal",
      issues: false,
    },
    {
      name: "Delhi Mall",
      sales: "₹68,900",
      rating: 4.7,
      stock: "Full",
      stockStatus: "good",
      issues: false,
    },
    {
      name: "Chennai Express",
      sales: "₹61,200",
      rating: 4.4,
      stock: "Low",
      stockStatus: "warning",
      issues: true,
    },
    {
      name: "Kolkata Hub",
      sales: "₹58,750",
      rating: 4.5,
      stock: "Medium",
      stockStatus: "normal",
      issues: false,
    },
  ];

  // Alerts Data
  const alerts = [
    {
      id: 1,
      type: "expiry",
      message: "Vanilla flavor stock expiring in 3 days at Mumbai Central",
      severity: "high",
      time: "2 hours ago",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 2,
      type: "delivery",
      message: "Delayed delivery to Delhi Mall - ETA 2 hours",
      severity: "medium",
      time: "4 hours ago",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: 3,
      type: "inactive",
      message: "Chennai Factory offline for maintenance",
      severity: "low",
      time: "6 hours ago",
      icon: <XCircle className="w-4 h-4" />,
    },
    {
      id: 4,
      type: "success",
      message: "All systems operational at Bangalore HQ",
      severity: "info",
      time: "1 day ago",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50/80 dark:bg-red-950/20 text-red-700 dark:text-red-400";
      case "medium":
        return "border-orange-200 bg-orange-50/80 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400";
      case "low":
        return "border-yellow-200 bg-yellow-50/80 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400";
      case "info":
        return "border-blue-200 bg-blue-50/80 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400";
      default:
        return "border-slate-200 bg-slate-50/80 dark:bg-slate-950/20 text-slate-700 dark:text-slate-400";
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "warning":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      case "normal":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex flex-col h-screen">
        {/* Stunning Glassy Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 border-b border-pink-200/50 dark:border-slate-700/50 px-8 py-6 flex items-center justify-between backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍦</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                CEO Overview - Real-time business insights
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl mx-8">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder="Search dashboard, reports, analytics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 shadow-lg border-0 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 group-hover:shadow-xl"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-pink-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
            <Avatar className="ml-2 ring-2 ring-pink-200 dark:ring-slate-700 hover:ring-pink-400 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 md:p-12 flex flex-col gap-10">
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-pink-200 hover:bg-pink-50 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-pink-200 hover:bg-pink-50 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Key Performance Indicators
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi, index) => (
                  <Card
                    key={index}
                    className={`rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border border-pink-200/50 dark:border-slate-700/50 hover:scale-105 group ${
                      kpi.bgColor ? `bg-gradient-to-br ${kpi.bgColor}` : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                            {kpi.title}
                          </p>
                          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2 truncate">
                            {kpi.value}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">
                            {kpi.subtitle}
                          </p>
                          <div className="flex items-center gap-1 mt-3">
                            {kpi.changeType === "positive" ? (
                              <ArrowUpRight className="w-4 h-4 text-green-500" />
                            ) : kpi.changeType === "negative" ? (
                              <ArrowDownRight className="w-4 h-4 text-red-500" />
                            ) : null}
                            <span
                              className={`text-sm font-medium ${
                                kpi.changeType === "positive"
                                  ? "text-green-500"
                                  : kpi.changeType === "negative"
                                  ? "text-red-500"
                                  : "text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {kpi.change}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-xl shadow-lg bg-gradient-to-br ${kpi.color} text-white group-hover:scale-110 transition-transform duration-300 ml-4 flex-shrink-0`}
                        >
                          {kpi.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Budget Utilization and Top Stores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Budget Utilization */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Budget Utilization
                  </h2>
                </div>
                <Card className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {budgetData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 dark:text-white">
                              {item.factory}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Budget: {item.budget}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.utilization}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-800 dark:text-white min-w-[3rem]">
                              {item.utilization}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Stores */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Top Performing Stores
                  </h2>
                </div>
                <Card className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {topStores.map((store, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 dark:text-white">
                              {store.name}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Sales: {store.sales} • Rating: {store.rating}⭐
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`text-xs ${getStockStatusColor(
                                store.stockStatus
                              )}`}
                            >
                              {store.stock}
                            </Badge>
                            {store.issues && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Recent Alerts
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map((alert, index) => (
                  <Card
                    key={alert.id}
                    className={`rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getSeverityColor(
                      alert.severity
                    )}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                          {alert.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {alert.message}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
