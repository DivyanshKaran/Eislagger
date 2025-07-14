"use client";

import AppShell from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

export default function ExecutiveDashboard() {
  // KPI Data
  const kpiData = [
    {
      title: "Today's Sales",
      value: "₹2,45,678",
      change: "+12.5%",
      changeType: "positive",
      icon: <DollarSign className="w-5 h-5" />,
      gradient: "gradient-primary",
      subtitle: "8,234 units sold",
    },
    {
      title: "Weekly Growth",
      value: "+18.3%",
      change: "+5.2%",
      changeType: "positive",
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: "gradient-secondary",
      subtitle: "vs last week",
    },
    {
      title: "Top Flavor",
      value: "Choco Fudge",
      change: "32%",
      changeType: "neutral",
      icon: <IceCream className="w-5 h-5" />,
      gradient: "gradient-accent",
      subtitle: "share of sales",
    },
    {
      title: "Active Factories",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: <Factory className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-orchid-light to-highlight",
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
        return "border-coral-light bg-coral-light/10 text-coral-dark";
      case "medium":
        return "border-orchid-light bg-orchid-light/10 text-orchid-dark";
      case "low":
        return "border-cream-light bg-cream-light/10 text-cream-dark";
      case "info":
        return "border-highlight bg-highlight/10 text-highlight-dark";
      default:
        return "border-border bg-muted text-muted-foreground";
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
    <AppShell role="executive">
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Executive Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              CEO Overview - Real-time business insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* KPI Cards - Reduced sizes */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-soft transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {kpi.title}
                    </p>
                    <p className="text-lg font-bold text-foreground mt-1 truncate">
                      {kpi.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {kpi.subtitle}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {kpi.changeType === "positive" ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                      ) : kpi.changeType === "negative" ? (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      ) : null}
                      <span
                        className={`text-xs font-medium ${
                          kpi.changeType === "positive"
                            ? "text-green-500"
                            : kpi.changeType === "negative"
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 ${kpi.gradient} rounded-lg flex items-center justify-center ml-3 flex-shrink-0`}
                  >
                    {kpi.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Sales Trends Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-eis-primary" />
                Sales Trends
              </CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Sales chart placeholder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flavor Popularity Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-eis-secondary" />
                Flavor Popularity
              </CardTitle>
              <CardDescription>Top selling ice cream flavors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Pie chart placeholder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Budget Utilization */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-eis-accent" />
                Budget Utilization
              </CardTitle>
              <CardDescription>Factory budget usage overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.factory}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.budget}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-eis-primary h-2 rounded-full"
                          style={{ width: `${item.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item.utilization}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Stores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="h-5 w-5 text-eis-warm" />
                Top Performing Stores
              </CardTitle>
              <CardDescription>
                Best performing retail locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topStores.map((store, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {store.name}
                        </p>
                        {store.issues && (
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {store.sales}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {store.rating}★
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStockStatusColor(
                        store.stockStatus
                      )}`}
                    >
                      {store.stock}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Feed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-eis-cool" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    alert.severity === "high"
                      ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                      : alert.severity === "medium"
                      ? "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800"
                      : alert.severity === "low"
                      ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800"
                      : "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800"
                  }`}
                >
                  {alert.icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.time}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getSeverityColor(alert.severity)}`}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
