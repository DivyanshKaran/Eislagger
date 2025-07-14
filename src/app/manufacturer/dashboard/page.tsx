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
  Package,
  DollarSign,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Eye,
  Ship,
  Trash2,
  Plus,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

export default function ManufacturerDashboard() {
  return (
    <AppShell role="manufacturer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Factory Dashboard
            </h1>
            <p className="text-muted-foreground">
              Sweet Dreams Creamery Factory - Production Hub
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-eis-secondary to-eis-accent hover:from-eis-secondary/90 hover:to-eis-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              New Batch
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-eis-primary/10 to-eis-secondary/10 border-eis-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Stock Produced Today
              </CardTitle>
              <Package className="h-4 w-4 text-eis-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,450L</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-eis-secondary/10 to-eis-accent/10 border-eis-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Budget Remaining
              </CardTitle>
              <DollarSign className="h-4 w-4 text-eis-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹7,700</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">80%</span> of allocation used
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-eis-accent/10 to-eis-primary/10 border-eis-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Deliveries in Transit
              </CardTitle>
              <Truck className="h-4 w-4 text-eis-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">3</span> arriving today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-eis-warm/10 to-eis-cool/10 border-eis-warm/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Rejected Deliveries
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-eis-warm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2.3%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-0.5%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Utilization Chart */}
        <Card className="bg-gradient-to-br from-eis-primary/5 to-eis-secondary/5 border-eis-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-eis-primary" />
              Budget Utilization
            </CardTitle>
            <CardDescription>
              Current budget usage and allocation status
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  {/* Used budget (61.5% = 12,300/20,000) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - 0.615)}`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-foreground">
                    ₹12,300
                  </div>
                  <div className="text-sm text-muted-foreground">
                    / ₹20,000 used
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last top-up: June 25
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-sm">Used (61.5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm">Remaining (38.5%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Batch Status Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-eis-secondary" />
                    Batch Status
                  </CardTitle>
                  <CardDescription>
                    Current stock batches and their status
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: "A123",
                    flavor: "Choco Fudge",
                    quantity: "100L",
                    expiry: "15 Jul",
                    status: "in-stock",
                    daysLeft: 8,
                  },
                  {
                    id: "B456",
                    flavor: "Mango Swirl",
                    quantity: "50L",
                    expiry: "12 Jul",
                    status: "shipped",
                    daysLeft: 5,
                  },
                  {
                    id: "C789",
                    flavor: "Vanilla Bean",
                    quantity: "75L",
                    expiry: "20 Jul",
                    status: "expired",
                    daysLeft: -2,
                  },
                  {
                    id: "D012",
                    flavor: "Strawberry Delight",
                    quantity: "120L",
                    expiry: "18 Jul",
                    status: "in-stock",
                    daysLeft: 11,
                  },
                  {
                    id: "E345",
                    flavor: "Mint Chocolate",
                    quantity: "80L",
                    expiry: "14 Jul",
                    status: "shipped",
                    daysLeft: 7,
                  },
                ].map((batch) => (
                  <div
                    key={batch.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      batch.status === "expired"
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        : batch.status === "shipped"
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : batch.daysLeft <= 3
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                        : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-foreground">
                        #{batch.id}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {batch.flavor}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {batch.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {batch.expiry}
                        </div>
                        <div
                          className={`text-xs ${
                            batch.daysLeft < 0
                              ? "text-red-600"
                              : batch.daysLeft <= 3
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {batch.daysLeft < 0
                            ? `${Math.abs(batch.daysLeft)} days expired`
                            : batch.daysLeft === 0
                            ? "Expires today"
                            : `${batch.daysLeft} days left`}
                        </div>
                      </div>
                      <Badge
                        variant={
                          batch.status === "expired"
                            ? "destructive"
                            : batch.status === "shipped"
                            ? "info"
                            : batch.daysLeft <= 3
                            ? "warning"
                            : "success"
                        }
                      >
                        {batch.status === "in-stock"
                          ? "In Stock"
                          : batch.status === "shipped"
                          ? "Shipped"
                          : "Expired"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {batch.status === "in-stock" && (
                          <Button size="sm" variant="outline">
                            <Ship className="h-3 w-3" />
                          </Button>
                        )}
                        {batch.status === "shipped" && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        {batch.status === "expired" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-eis-warm" />
                Alerts Feed
              </CardTitle>
              <CardDescription>
                Current issues and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    type: "critical",
                    message: "Batch #C789 has expired",
                    time: "2 hours ago",
                    icon: <XCircle className="h-4 w-4 text-red-500" />,
                  },
                  {
                    type: "warning",
                    message: "Delivery to Store #B02 delayed",
                    time: "4 hours ago",
                    icon: <Clock className="h-4 w-4 text-orange-500" />,
                  },
                  {
                    type: "info",
                    message: "Budget 80% used",
                    time: "6 hours ago",
                    icon: <Info className="h-4 w-4 text-blue-500" />,
                  },
                  {
                    type: "success",
                    message: "New batch #F678 ready for shipping",
                    time: "8 hours ago",
                    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                  },
                  {
                    type: "warning",
                    message: "Batch #D012 expires in 3 days",
                    time: "1 day ago",
                    icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                      alert.type === "critical"
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        : alert.type === "warning"
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                        : alert.type === "info"
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    }`}
                  >
                    {alert.icon}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Status Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-eis-accent" />
                  Delivery Status (Last 7 Days)
                </CardTitle>
                <CardDescription>
                  Track shipment progress and delivery performance
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Group by Store
                </Button>
                <Button variant="outline" size="sm">
                  Group by Flavor
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Delivery Timeline */}
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-medium text-foreground mb-2">
                        {day}
                      </div>
                      <div className="space-y-1">
                        {/* Delivered */}
                        <div
                          className="h-4 bg-green-400 rounded-sm"
                          style={{ height: `${Math.random() * 20 + 10}px` }}
                        ></div>
                        {/* In Transit */}
                        <div
                          className="h-4 bg-yellow-400 rounded-sm"
                          style={{ height: `${Math.random() * 15 + 5}px` }}
                        ></div>
                        {/* Failed */}
                        <div
                          className="h-4 bg-red-400 rounded-sm"
                          style={{ height: `${Math.random() * 8 + 2}px` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.floor(Math.random() * 15 + 5)} batches
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span className="text-sm">Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span className="text-sm">In Transit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span className="text-sm">Failed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
