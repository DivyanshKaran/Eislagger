"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useStore, useStoreInventory } from "@/hooks/useStores";
import { useOrders } from "@/hooks/useOrders";
import type { Store as StoreType } from "@/types/models";

import {
  DollarSign,
  Store,
  Package,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClerkDashboard() {
  const { user } = useAuth();
  
  // Mock shop ID for demonstration - in real app this would come from user's shop assignment
  const currentShopId = "1";

  // Use the new hooks for data fetching
  const { data: shop, isLoading: shopLoading, error: shopError } = useStore(currentShopId);
  const { data: inventory = [], isLoading: inventoryLoading } = useStoreInventory(currentShopId);
  const { data: recentOrdersResponse, isLoading: ordersLoading } = useOrders({ 
    page: 1,
    limit: 10,
    // Add shop filter when backend supports it
  });
  const recentOrders = recentOrdersResponse?.data || [];

  const isLoading = shopLoading || inventoryLoading || ordersLoading;
  const error = shopError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to load dashboard data"}
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate KPIs
  const todaySales = recentOrders.reduce((sum, order) => sum + order.total, 0);
  const avgTransactionValue = recentOrders.length > 0 
    ? todaySales / recentOrders.length 
    : 0;
  const lowStockItems = inventory.filter(item => item.stock < item.minQuantity).length;
  const outOfStockItems = inventory.filter(item => item.quantity <= 0).length;

  const kpis = [
    {
      title: "Today's Sales",
      value: `$${todaySales.toFixed(2)}`,
      change: "+12%",
      changeType: "increase" as const,
      icon: <DollarSign className="w-6 h-6" />,
      subtitle: "This shift",
    },
    {
      title: "Avg Transaction",
      value: `$${avgTransactionValue.toFixed(2)}`,
      change: "+5%",
      changeType: "increase" as const,
      icon: <TrendingUp className="w-6 h-6" />,
      subtitle: "ATV increased",
    },
    {
      title: "Items Sold",
      value: recentOrders.reduce((sum, order) => 
        sum + order.items.reduce((itemsSum, item) => itemsSum + item.quantity, 0), 0).toString(),
      change: "+8%",
      changeType: "increase" as const,
      icon: <ShoppingCart className="w-6 h-6" />,
      subtitle: "Today",
    },
    {
      title: "Low Stock",
      value: lowStockItems.toString(),
      change: lowStockItems > 0 ? "needs attention" : "all good",
      changeType: lowStockItems > 0 ? "decrease" as const : "increase" as const,
      icon: <Package className="w-6 h-6" />,
      subtitle: "inventory alert",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            {shop.name} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here&apos;s your shop overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">

            
            <Clock className="w-4 h-4 mr-2" />
            Shifts Management
          </Button>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Process Sale
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      {(lowStockItems > 0 || outOfStockItems > 0) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Inventory Alert:</strong> {lowStockItems} items are running low, 
            {outOfStockItems > 0 && ` ${outOfStockItems} items are out of stock`}. 
            Consider placing a purchase order.
          </AlertDescription>
        </Alert>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`${
                  kpi.changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}>
                  {kpi.change}
                </span>{" "}
                {kpi.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Shop Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{shop.name}</h3>
              <p className="text-sm text-muted-foreground">{shop.address.city}, {shop.address.state}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  $0
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold">
                  0
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">0.0</span>
                  <span className="text-sm text-muted-foreground">
                    (0 reviews)
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Services</p>
                <div className="flex gap-1">
                  {shop.services.map((service: string) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">#{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.items.length} item(s) • 
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${transaction.total.toFixed(2)}</p>
                    <Badge variant={
                      transaction.status === "delivered" ? "default" : "secondary"
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No transactions yet today
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Current Inventory Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-green-400"></div>
                  <div>
                    <h3 className="font-semibold">{item.flavorName}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className={`text-lg font-bold ${
                      item.isLowStock ? "text-orange-500" : "text-green-600"
                    }`}>
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-bold">${item.pricePerUnit}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      item.isAvailable ? "default" : "secondary"
                    }>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {item.isAvailable ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {item.isLowStock && (
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}