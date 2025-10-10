"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  Store,
  TrendingUp,
  Package,
  Truck,
  Gift,
  Calendar,
  Award,
  MapPin,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Star as StarIcon,
  Download,
  RefreshCw,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { usePatronDashboard, useRecentOrders, useUserOrders, useSalesTrendsData } from "@/hooks";
import { useAuth } from "@/lib/auth-context";

// Custom styles for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(1); }
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
  
  @keyframes wiggle {
    0%, 7% { transform: rotate(0deg); }
    15% { transform: rotate(-15deg); }
    20% { transform: rotate(10deg); }
    25% { transform: rotate(-10deg); }
    30% { transform: rotate(10deg); }
    35% { transform: rotate(-10deg); }
    40%, 100% { transform: rotate(0deg); }
  }
  
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
  .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
  .animate-wiggle { animation: wiggle 1s ease-in-out; }
`;

// Sample data
const orderTrends = [
  { name: "Jan", orders: 12, amount: 1200 },
  { name: "Feb", orders: 18, amount: 1800 },
  { name: "Mar", orders: 15, amount: 1500 },
  { name: "Apr", orders: 25, amount: 2500 },
  { name: "May", orders: 22, amount: 2200 },
  { name: "Jun", orders: 30, amount: 3000 },
  { name: "Jul", orders: 28, amount: 2800 },
];

const favoriteFlavors = [
  { name: "Vanilla", value: 35, color: "#8b5cf6" },
  { name: "Chocolate", value: 25, color: "#ec4899" },
  { name: "Strawberry", value: 20, color: "#f59e0b" },
  { name: "Mint Chip", value: 15, color: "#10b981" },
  { name: "Cookies & Cream", value: 5, color: "#ef4444" },
];

const storePerformance = [
  { name: "Downtown Store", ratings: 4.8, orders: 145 },
  { name: "Mall Location", ratings: 4.6, orders: 132 },
  { name: "Airport Store", ratings: 4.4, orders: 89 },
  { name: "Beach Location", ratings: 4.9, orders: 167 },
];

const recentOrders = [
  {
    id: "#1234",
    flavor: "Triple Chocolate Delight",
    store: "Downtown Store",
    date: "2024-01-15",
    status: "delivered",
    amount: "₹299",
    rating: 5,
  },
  {
    id: "#1235",
    flavor: "Strawberry Swirl",
    store: "Mall Location",
    date: "2024-01-14",
    status: "ready",
    amount: "₹199",
    rating: 0,
  },
  {
    id: "#1236",
    flavor: "Vanilla Paradise",
    store: "Beach Location",
    date: "2024-01-13",
    status: "completed",
    amount: "₹149",
    rating: 5,
  },
];

export default function PatronDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const { user } = useAuth();
  
  // Fetch dashboard data from backend
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = usePatronDashboard();
  const { data: recentOrdersData, isLoading: ordersLoading } = useRecentOrders(5);
  const { data: salesTrendsData, isLoading: trendsLoading } = useSalesTrendsData(timeRange);

  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#patron-dashboard-styles")) {
      const style = document.createElement("style");
      style.id = "patron-dashboard-styles";
      style.innerHTML = customStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Show loading state
  if (dashboardLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{dashboardError.message}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "ready": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="relative z-10 p-6">
        
        {/* Header Section */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Welcome Back, {user?.name || 'Ice Cream Lover'}! 🍦
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Discover your sweet journey and favorite flavors
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 border-purple-200 dark:border-purple-800">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-2 border border-purple-200/50 dark:border-purple-800/40">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-purple-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-700"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                {recentOrdersData?.length || 0}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Orders</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">This {timeRange}</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-pink-600">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">15</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">8</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Favorite Flavors</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">In your collection</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">4</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                ₹{Array.isArray(salesTrendsData) ? salesTrendsData.reduce((sum, trend) => sum + trend.revenue, 0) : 0}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Spent</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">This {timeRange}</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <StarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">42</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Reviews Written</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Helpful feedback</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Trends Chart */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Order Trends</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your ordering pattern</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-purple-200 dark:border-purple-800">
                  <Eye className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={Array.isArray(salesTrendsData) ? salesTrendsData : orderTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      border: '1px solid rgb(147, 51, 234)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#ec4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Favorite Flavors Chart */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Favorite Flavors</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your taste preferences</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-purple-200 dark:border-purple-800">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={favoriteFlavors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {favoriteFlavors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Performance */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Store Performance</h3>
            <div className="space-y-4">
              {storePerformance.map((store, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50/50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{store.name}</h4>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{store.ratings}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    {store.orders} orders
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {(recentOrdersData || recentOrders).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-purple-50/50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        {order.flavor || order.items?.[0]?.name || 'Ice Cream Order'}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {order.store || order.storeName || 'Store'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      ₹{order.amount || order.totalAmount || 0}
                    </span>
                    {order.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{order.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}