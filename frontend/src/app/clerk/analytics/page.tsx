"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Star,
  Eye,
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";

import { Button } from "@/components/ui/button";

// Enhanced sample data
const revenueData = [
  { name: "Mon", revenue: 2400, orders: 40, visitors: 280 },
  { name: "Tue", revenue: 1398, orders: 25, visitors: 190 },
  { name: "Wed", revenue: 9800, orders: 65, visitors: 420 },
  { name: "Thu", revenue: 3908, orders: 45, visitors: 320 },
  { name: "Fri", revenue: 4800, orders: 55, visitors: 380 },
  { name: "Sat", revenue: 3800, orders: 42, visitors: 310 },
  { name: "Sun", revenue: 4300, orders: 38, visitors: 290 },
];

const productData = [
  { name: "Vanilla Dream", sales: 45, revenue: 3200, rating: 4.8 },
  { name: "Choco Burst", sales: 52, revenue: 4100, rating: 4.6 },
  { name: "Mango Swirl", sales: 38, revenue: 2300, rating: 4.9 },
  { name: "Strawberry Delight", sales: 29, revenue: 1900, rating: 4.5 },
  { name: "Hazelnut Heaven", sales: 33, revenue: 2800, rating: 4.7 },
];

const pieData = [
  { name: "Cash", value: 65, color: "#ec4899" },
  { name: "Card", value: 30, color: "#a855f7" },
  { name: "Digital", value: 5, color: "#3b82f6" },
];

const recentOrders = [
  { id: "#001", customer: "John D.", amount: 45.50, status: "Completed", time: "2 min ago", rating: 5 },
  { id: "#002", customer: "Sarah M.", amount: 32.00, status: "Pending", time: "5 min ago", rating: 4 },
  { id: "#003", customer: "Mike R.", amount: 58.75, status: "Completed", time: "8 min ago", rating: 5 },
  { id: "#004", customer: "Lisa K.", amount: 41.25, status: "Processing", time: "12 min ago", rating: 4 },
];

const customerInsights = [
  { metric: "Customer Satisfaction", value: "4.8/5", trend: "+0.3", color: "emerald" },
  { metric: "Repeat Customers", value: "78%", trend: "+5.2%", color: "purple" },
  { metric: "Average Basket Size", value: "₹72", trend: "+12%", color: "pink" },
];

export default function ClerkAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#clerk-analytics-styles")) {
      const style = document.createElement("style");
      style.id = "clerk-analytics-styles";
      style.innerHTML = `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotate 20s linear infinite; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="relative">
      <div className="relative z-10">
        
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Store Analytics</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Track your store performance and sales metrics</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-pink-200 dark:border-pink-800">
                <Target className="w-4 h-4 mr-2" />
                Set Goals
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Campaign
              </Button>
            </div>
          </div>

          {/* Enhanced Time Range Selector */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {["1d", "7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedTimeRange === range
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {range === "1d" ? "Today" : range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="border-pink-200 dark:border-pink-800">
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-pink-200 dark:border-pink-800">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+12.3%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">₹8,912</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Revenue</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">From all sales channels</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+8.7%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">128</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Orders</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Completed today</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+15.2%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">95</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Customers</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">New visitors today</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-medium">-3.1%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">₹69</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Avg. Order Value</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Trending downward</p>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Interactive Revenue Chart */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Revenue & Orders</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Orders</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  fill="url(#chartGradient)"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Pie Chart */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Payment Methods</h3>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Star className="w-4 h-4" />
                <span className="text-sm">Most Popular</span>
              </div>
            </div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Insights & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Customer Satisfaction Insights */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Customer Insights</h3>
            <div className="space-y-4">
              {customerInsights.map((item, index) => (
                <div key={item.metric} className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${
                      item.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                      item.color === 'purple' ? 'from-purple-500 to-pink-600' :
                      'from-pink-500 to-purple-600'
                    } rounded-lg flex items-center justify-center`}>
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{item.metric}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 dark:text-white">{item.value}</span>
                    <div className={`text-xs ${item.color === 'emerald' ? 'text-emerald-600' : item.color === 'purple' ? 'text-purple-600' : 'text-pink-600'}`}>
                      {item.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-pink-50/50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{order.id}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{order.customer}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{order.time}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800 dark:text-white">₹{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto p-4 bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white">
                <div className="text-center">
                  <Award className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Boost Sales</span>
                </div>
              </Button>
              
              <Button className="h-auto p-4 bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-700 hover:to-p ink-800 text-white">
                <div className="text-center">
                  <Eye className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Analytics</span>
                </div>
              </Button>
              
              <Button className="h-auto p-4 bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white">
                <div className="text-center">
                  <Target className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Goals</span>
                </div>
              </Button>
              
              <Button className="h-auto p-4 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white">
                <div className="text-center">
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Campaign</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Products Table */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-pink-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Top Products Performance</h3>
            <Button variant="outline" className="border-pink-200 dark:border-pink-800">
              <ArrowRight className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Sales</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Rating</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Trend</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((product, index) => (
                  <tr key={product.name} className="border-b border-slate-100/50 dark:border-slate-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{product.sales}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">₹{product.revenue}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">{product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{Math.floor(Math.random() * 20) + 5}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}