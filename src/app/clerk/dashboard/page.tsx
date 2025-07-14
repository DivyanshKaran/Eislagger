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
  Receipt,
  IceCream,
  AlertTriangle,
  Package,
  TrendingUp,
  Clock,
  MapPin,
  Bell,
  User,
  Settings,
  Plus,
  Eye,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Download,
  Filter,
  MessageSquare,
  Mail,
  BarChart3,
  Store,
  Thermometer,
  Zap,
  Info,
} from "lucide-react";
import { useState } from "react";

export default function ClerkDashboard() {
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);

  // Sample data
  const flavorStock = [
    {
      id: 1,
      name: "Mango Swirl",
      inStock: 12,
      unit: "L",
      expiryDate: "Jul 5, 2024",
      status: "Good",
      statusColor: "success",
      action: null,
    },
    {
      id: 2,
      name: "Choco Burst",
      inStock: 4,
      unit: "L",
      expiryDate: "Jul 6, 2024",
      status: "Low Stock",
      statusColor: "warning",
      action: "Restock",
    },
    {
      id: 3,
      name: "Raspberry Delight",
      inStock: 0,
      unit: "L",
      expiryDate: "—",
      status: "Out of Stock",
      statusColor: "destructive",
      action: "Urgent",
    },
    {
      id: 4,
      name: "Vanilla Dream",
      inStock: 8,
      unit: "L",
      expiryDate: "Jul 3, 2024",
      status: "Expiring Soon",
      statusColor: "warning",
      action: "Restock",
    },
    {
      id: 5,
      name: "Blueberry Blast",
      inStock: 15,
      unit: "L",
      expiryDate: "Jul 8, 2024",
      status: "Good",
      statusColor: "success",
      action: null,
    },
    {
      id: 6,
      name: "Strawberry Fields",
      inStock: 6,
      unit: "L",
      expiryDate: "Jul 7, 2024",
      status: "Low Stock",
      statusColor: "warning",
      action: "Restock",
    },
  ];

  const topFlavors = [
    {
      name: "Choco Burst",
      percentage: 32,
      color: "from-amber-400 to-orange-500",
    },
    {
      name: "Mango Swirl",
      percentage: 28,
      color: "from-yellow-400 to-orange-400",
    },
    {
      name: "Vanilla Dream",
      percentage: 20,
      color: "from-gray-300 to-gray-400",
    },
    {
      name: "Raspberry Delight",
      percentage: 12,
      color: "from-pink-400 to-red-400",
    },
    { name: "Others", percentage: 8, color: "from-blue-400 to-purple-500" },
  ];

  const alerts = [
    {
      id: 1,
      type: "critical",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      message: "Raspberry Delight out of stock",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "warning",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      message: "Vanilla Dream expiring in 2 days",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "info",
      icon: <Truck className="h-4 w-4 text-blue-500" />,
      message: "Factory delivery delayed by 2 hours",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "success",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      message: "Choco Burst restock completed",
      time: "3 hours ago",
    },
    {
      id: 5,
      type: "warning",
      icon: <Thermometer className="h-4 w-4 text-orange-500" />,
      message: "Freezer temperature slightly high",
      time: "4 hours ago",
    },
  ];

  const hourlySales = [
    { hour: "10 AM", sales: 1200, units: 8 },
    { hour: "11 AM", sales: 1800, units: 12 },
    { hour: "12 PM", sales: 2400, units: 16 },
    { hour: "1 PM", sales: 2100, units: 14 },
    { hour: "2 PM", sales: 1600, units: 11 },
    { hour: "3 PM", sales: 1900, units: 13 },
    { hour: "4 PM", sales: 2200, units: 15 },
    { hour: "5 PM", sales: 2800, units: 19 },
    { hour: "6 PM", sales: 3200, units: 22 },
    { hour: "7 PM", sales: 2600, units: 18 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low Stock":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border-red-200";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-orange-200 bg-orange-50 dark:bg-orange-900/20";
      case "info":
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/20";
      case "success":
        return "border-green-200 bg-green-50 dark:bg-green-900/20";
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <AppShell role="clerk">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Store Dashboard 🏪
            </h1>
            <p className="text-muted-foreground">
              Bangalore Central Store - Sweet Dreams Creamery
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-eis-accent to-eis-primary hover:from-eis-accent/90 hover:to-eis-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-eis-primary/10 to-eis-secondary/10 border-eis-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Sales Today
              </CardTitle>
              <Receipt className="h-4 w-4 text-eis-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹18,400</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from yesterday
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                148 scoops sold
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-eis-secondary/10 to-eis-accent/10 border-eis-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Top Flavor
              </CardTitle>
              <IceCream className="h-4 w-4 text-eis-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                Choco Burst
              </div>
              <p className="text-xs text-muted-foreground">
                32% of total sales
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                47 scoops today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-eis-accent/10 to-eis-primary/10 border-eis-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-eis-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
              <div className="mt-2 text-xs text-muted-foreground">
                1 out of stock
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-eis-warm/10 to-eis-cool/10 border-eis-warm/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Total Stock Left
              </CardTitle>
              <Package className="h-4 w-4 text-eis-warm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">45L</div>
              <p className="text-xs text-muted-foreground">
                Across all flavors
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                ~2 days supply
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Sales Chart */}
        <Card className="bg-gradient-to-br from-eis-primary/5 to-eis-secondary/5 border-eis-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-eis-primary" />
              Daily Sales Trend
            </CardTitle>
            <CardDescription>
              Hourly sales performance for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    ₹18,400
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total sales today
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">+15%</div>
                  <div className="text-xs text-muted-foreground">
                    vs yesterday
                  </div>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2">
                {hourlySales.map((data, index) => (
                  <div
                    key={data.hour}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div className="text-xs text-muted-foreground text-center">
                      ₹{data.sales}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-eis-primary to-eis-secondary rounded-t-sm min-h-[4px]"
                      style={{ height: `${(data.sales / 3200) * 100}%` }}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {data.hour}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Peak hours: 5-7 PM
                </span>
                <span className="text-muted-foreground">
                  Average: ₹1,840/hour
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Flavor Stock Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-eis-secondary" />
                    Flavor Stock Status
                  </CardTitle>
                  <CardDescription>
                    Current inventory levels and expiry dates
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flavorStock.map((flavor) => (
                  <div
                    key={flavor.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-border/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-eis-secondary to-eis-accent rounded-lg flex items-center justify-center text-white font-bold">
                        {flavor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {flavor.name}
                          </span>
                          <Badge className={getStatusColor(flavor.status)}>
                            {flavor.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {flavor.inStock}
                          {flavor.unit} in stock
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Expires: {flavor.expiryDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {flavor.action && (
                        <Button
                          size="sm"
                          variant={
                            flavor.action === "Urgent"
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() => setSelectedFlavor(flavor.name)}
                        >
                          {flavor.action === "Urgent" ? (
                            <>
                              <Zap className="h-3 w-3 mr-1" />
                              Urgent
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Restock
                            </>
                          )}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Flavors Pie Chart */}
          <Card className="bg-gradient-to-br from-eis-warm/5 to-eis-cool/5 border-eis-warm/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-eis-warm" />
                Top Flavors Today
              </CardTitle>
              <CardDescription>Sales distribution by flavor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Donut Chart */}
                    <svg
                      className="w-48 h-48 transform -rotate-90"
                      viewBox="0 0 120 120"
                    >
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      {/* Choco Burst (32%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - 0.32)}`}
                        strokeLinecap="round"
                      />
                      {/* Mango Swirl (28%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - 0.28)}`}
                        strokeLinecap="round"
                        transform={`rotate(${0.32 * 360} 60 60)`}
                      />
                      {/* Vanilla Dream (20%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - 0.2)}`}
                        strokeLinecap="round"
                        transform={`rotate(${(0.32 + 0.28) * 360} 60 60)`}
                      />
                      {/* Raspberry Delight (12%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - 0.12)}`}
                        strokeLinecap="round"
                        transform={`rotate(${(0.32 + 0.28 + 0.2) * 360} 60 60)`}
                      />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-lg font-bold text-foreground">
                        Choco Burst
                      </div>
                      <div className="text-sm text-muted-foreground">32%</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {topFlavors.map((flavor, index) => (
                    <div
                      key={flavor.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 bg-gradient-to-r ${flavor.color} rounded-full`}
                        ></div>
                        <span className="text-sm text-foreground">
                          {flavor.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {flavor.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Feed */}
        <Card className="bg-gradient-to-br from-eis-accent/5 to-eis-primary/5 border-eis-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-eis-accent" />
              Store Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${getAlertColor(
                    alert.type
                  )} hover:shadow-sm transition-all duration-300`}
                >
                  {alert.icon}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {alert.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.time}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Floating Restock Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="bg-gradient-to-r from-eis-accent to-eis-primary hover:from-eis-accent/90 hover:to-eis-primary/90 shadow-lg rounded-full w-14 h-14 p-0"
            onClick={() => setSelectedFlavor("general")}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
