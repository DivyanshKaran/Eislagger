"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  User,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Custom styles for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }
`;

export default function ExecutiveBudgetPage() {
  const [search, setSearch] = useState("");

  // Mock budget data
  const budgetData = [
    {
      category: "Production",
      allocated: 2500000,
      spent: 2100000,
      remaining: 400000,
      percentage: 84,
      trend: "positive",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      category: "Marketing",
      allocated: 800000,
      spent: 720000,
      remaining: 80000,
      percentage: 90,
      trend: "warning",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      category: "Operations",
      allocated: 1200000,
      spent: 980000,
      remaining: 220000,
      percentage: 82,
      trend: "positive",
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      category: "R&D",
      allocated: 600000,
      spent: 450000,
      remaining: 150000,
      percentage: 75,
      trend: "positive",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "positive":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "warning":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      case "negative":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    return "bg-green-500";
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
                <span className="text-2xl">💰</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Budget Management
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Financial planning & resource allocation
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl mx-8">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder="Search budgets, categories, reports..."
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

            {/* Budget Overview Cards */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Budget Overview
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {budgetData.map((item, index) => (
                  <Card
                    key={index}
                    className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border border-pink-200/50 dark:border-slate-700/50 hover:scale-105 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                            {item.category}
                          </p>
                          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
                            ₹{(item.spent / 100000).toFixed(1)}L
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            of ₹{(item.allocated / 100000).toFixed(1)}L
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                  item.percentage
                                )}`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-800 dark:text-white">
                              {item.percentage}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Badge
                              className={`text-xs ${getTrendColor(item.trend)}`}
                            >
                              ₹{(item.remaining / 100000).toFixed(1)}L remaining
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300 ml-4 flex-shrink-0">
                          {item.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Budget Planning Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Budget Planning
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                      Quarterly Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            Q1 2024
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Jan - Mar
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">
                            ₹12.5M
                          </p>
                          <p className="text-xs text-green-600">+8.5% vs Q4</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            Q2 2024
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Apr - Jun
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">
                            ₹13.2M
                          </p>
                          <p className="text-xs text-green-600">+5.6% vs Q1</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                      Budget Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            Marketing budget at 90%
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Consider reallocation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            R&D under budget
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            25% remaining
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Advanced Features
                </h2>
              </div>
              <Card className="rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    Advanced Budget Planning
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Advanced financial planning tools, automated budget
                    tracking, and AI-powered forecasting coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
