"use client";

import React, { useState, useEffect } from "react";

import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Globe,
  Target,
  Award,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Star,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { useExecutiveDashboard, useKPIData, useSalesTrendsData, useUserActivity } from "@/hooks";
import { useAuth } from "@/lib/auth-context";

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

// Sample data for executive metrics
const revenueData = [
  { month: "Jan", revenue: 250000, profit: 45000, margin: 18 },
  { month: "Feb", revenue: 280000, profit: 52000, margin: 18.6 },
  { month: "Mar", revenue: 320000, profit: 61000, margin: 19.1 },
  { month: "Apr", revenue: 290000, profit: 53000, margin: 18.3 },
  { month: "May", revenue: 350000, profit: 68000, margin: 19.4 },
  { month: "Jun", revenue: 380000, profit: 75000, margin: 19.7 },
];

const marketShareData = [
  { region: "North", share: 35, growth: 8.2, competitors: 12 },
  { region: "South", share: 28, growth: 12.5 },
  { region: "East", share: 32, growth: 6.8 },
  { region: "West", share: 25, growth: 15.3 },
];

const recentDecisions = [
  { id: "DEC-001", title: "Q3 Expansion Strategy Approval", type: "Strategic", status: "Approved", date: "Today" },
  { id: "DEC-002", title: "Supply Chain Optimization", type: "Operational", status: "Pending", date: "Yesterday" },
  { id: "DEC-003", title: "Market Entry Analysis", type: "Strategic", status: "Review", date: "2 days ago" },
];

export default function ExecutiveDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const { user } = useAuth();
  
  // Fetch dashboard data from backend
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useExecutiveDashboard();
  const { data: kpisData, isLoading: kpisLoading } = useKPIData({ period: selectedPeriod });
  const { data: salesTrendsData, isLoading: trendsLoading } = useSalesTrendsData(selectedPeriod);
  const { data: userActivityData, isLoading: activityLoading } = useUserActivity(selectedPeriod);

  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#executive-dashboard-styles")) {
      const style = document.createElement("style");
      style.id = "executive-dashboard-styles";
      style.innerHTML = customStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Show loading state
  if (dashboardLoading || kpisLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading executive dashboard...</span>
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

  return (
    <div className="relative">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Executive Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Strategic insights and business analytics</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {["1M", "6M", "1Y", "3Y"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? "bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-all">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+15.8%</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">₹3.2M</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Monthly Revenue</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">vs ₹2.8M last month</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+8.4%</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">19.7%</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Profit Margin</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Industry avg: 16.2%</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12.1%</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">127</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Active Stores</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">42 new this quarter</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-violet-700 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+6.3%</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">47.2%</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Market Share</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Leading position</p>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Revenue & Profit Chart */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Revenue & Profit Trends</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">Profit</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
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
                stroke="#8b5cf6"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Market Share Analysis */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Regional Market Share</h3>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Q2 2024</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketShareData}>
              <XAxis 
                dataKey="region" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="share" 
                fill="#8b5cf6" 
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {marketShareData.slice(0, 2).map((region, index) => (
              <div key={region.region} className="bg-purple-50/50 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800 dark:text-white">{region.region} Region</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{region.share}%</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Growth: +{region.growth}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Strategic Decisions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Recent Strategic Decisions</h3>
            <button className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
              <Eye className="w-4 h-4" />
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentDecisions.map((decision) => (
              <div key={decision.id} className="flex items-center justify-between p-4 bg-purple-50/50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{decision.type.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">{decision.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{decision.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    decision.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                    decision.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {decision.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Performance Metrics</h3>

          {/* Circular Progress Indicators */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-purple-200 dark:text-purple-800"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="201"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                    onChange={() => {}}
                    className="text-purple-600 dark:text-purple-400 transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">70%</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Market Growth</p>
            </div>

            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-purple-200 dark:text-purple-800"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="201"
                    strokeDashoffset="80"
                    strokeLinecap="round"
                    className="text-emerald-600 dark:text-emerald-400 transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">60%</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Customer Satisfaction</p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Operational Efficiency</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">87%</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full" style={{width: '87%'}}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Revenue Growth</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">92%</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-violet-600 h-2 rounded-full" style={{width: '92%'}}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Market Expansion</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">76%</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full" style={{width: '76%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Visual Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer Insights */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Customer Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">New Customers</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">This Month</p>
                </div>
              </div>
              <span className="font-bold text-purple-600 dark:text-purple-400">2,847</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Satisfaction Rate</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Average Rating</p>
                </div>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">4.8/5</span>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-green-800 dark:text-green-400 mb-1">Low Risk</h4>
              <p className="text-sm text-green-700 dark:text-green-300">Operations Status</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">Medium Risk</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Supply Chain</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-auto p-4 bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white">
              <div className="text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Schedule Meeting</span>
              </div>
            </Button>
            
            <Button className="h-auto p-4 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white">
              <div className="text-center">
                <Download className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Generate Report</span>
              </div>
            </Button>
            
            <Button className="h-auto p-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Set Goals</span>
              </div>
            </Button>
            
            <Button className="h-auto p-4 bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white">
              <div className="text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Analyze Trends</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
