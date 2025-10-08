"use client";

import React, { useState, useEffect } from "react";
import {
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
  Star,
  Eye,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
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

// Executive analytics data
const revenueData = [
  { month: "Jan", revenue: 280000, profit: 52000, market: 35 },
  { month: "Feb", revenue: 310000, profit: 61000, market: 38 },
  { month: "Mar", revenue: 350000, profit: 72000, market: 42 },
  { month: "Apr", revenue: 290000, profit: 58000, market: 40 },
  { month: "May", revenue: 380000, profit: 78000, market: 45 },
  { month: "Jun", revenue: 420000, profit: 85000, market: 48 },
];

const regionalData = [
  { region: "North America", revenue: 1250000, marketShare: 32, growth: 8.5 },
  { region: "Europe", revenue: 980000, marketShare: 28, growth: 12.3 },
  { region: "Asia-Pacific", revenue: 870000, marketShare: 24, growth: 15.7 },
  { region: "Latin America", revenue: 450000, marketShare: 16, growth: 6.8 },
];

const performanceData = [
  { metric: "Revenue Growth", value: "18.5%", target: "15%", status: "exceeded" },
  { metric: "Market Share", value: "47.2%", target: "45%", status: "exceeded" },
  { metric: "Customer Acquisition", value: "2,847", target: "2,500", status: "met" },
  { metric: "Operational Efficiency", value: "87%", target: "85%", status: "exceeded" },
];

const strategicDecisions = [
  { id: "SD-001", title: "Q3 Market Expansion", type: "Strategic", status: "Approved", impact: "High", date: "Today" },
  { id: "SD-002", title: "Supply Chain Optimization", type: "Operational", status: "In Review", impact: "Medium", date: "Yesterday" },
  { id: "SD-003", title: "Technology Upgrade", type: "Technology", status: "Approved", impact: "High", date: "3 days ago" },
];

const pieData = [
  { name: "Research & Development", value: 35, color: "#8b5cf6" },
  { name: "Marketing", value: 25, color: "#a855f7" },
  { name: "Operations", value: 30, color: "#c084fc" },
  { name: "Administration", value: 10, color: "#ddd6fe" },
];

export default function ExecutiveAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("6M");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#executive-analytics-styles")) {
      const style = document.createElement("style");
      style.id = "executive-analytics-styles";
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
        
        {/* Executive Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Executive Analytics</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Strategic business intelligence and performance metrics</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                <Target className="w-4 h-4 mr-2" />
                Set KPIs
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>

          {/* Enhanced Time Range Selector */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {["1Q", "6M", "1Y", "3Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedTimeRange === range
                      ? "bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {range === "1Q" ? "Quarter" : range === "6M" ? "6 Months" : range === "1Y" ? "1 Year" : "3 Years"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="border-purple-200 dark:border-purple-800">
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-purple-200 dark:border-purple-800">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+18.5%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">₹3.2M</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Quarterly Revenue</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Target: ₹2.8M ↗️</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+6.3%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">47.2%</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Market Share</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Leading position</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-violet-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+15.2%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">2,847</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">New Customers</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">This quarter</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+2.2%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:id-white mb-1">87%</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Efficiency</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Operations metric</p>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Revenue Trends Chart */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:id-white">Revenue & Profit Trends</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Profit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Market Share</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueExcelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
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
                  stroke="#8b5cf6"
                  fill="url(#revenueExcelGradient)"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="market"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Performance */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Regional Performance</h3>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Q2 2024</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regionalData}>
                <XAxis dataKey="region" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {regionalData.slice(0, 2).map((region, index) => (
                <div key={region.region} className="bg-purple-50/50 dark:bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{region.region}</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">₹{region.revenue.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Growth: +{region.growth}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics & Strategic Decisions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Performance Dashboard */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Performance Dashboard</h3>
            
            {/* Circular Progress Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {performanceData.slice(0, 2).map((item, index) => (
                <div key={item.metric} className="text-center">
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
                        strokeDashoffset={item.status === 'exceeded' ? "30" : item.status === 'met' ? "60" : "90"}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-in-out ${
                          item.status === 'exceeded' ? 'text-emerald-600 dark:text-emerald-400' :
                          item.status === 'met' ? 'text-purple-600 dark:text-purple-400' :
                          'text-orange-600 dark:text-orange-400'
                        }`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-800 dark:text-white">{item.value}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.metric}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'exceeded' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                    item.status === 'met' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {item.status === 'exceeded' ? 'Exceeded' : item.status === 'met' ? 'Met' : 'Target'}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bars */}
            <div className="space-y-6">
              {performanceData.slice(2).map((item, index) => (
                <div key={item.metric}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${
                        item.status === 'exceeded' ? 'text-emerald-600' :
                        item.status === 'met' ? 'text-purple-600' :
                        'text-orange-600'
                      }`}>
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-medium">{item.value}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-1000 ease-in-out ${
                      item.status === 'exceeded' ? 'bg-gradient-to-r from-emerald-500 to-purple-600' :
                      item.status === 'met' ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                      'bg-gradient-to-r from-orange-500 to-red-600'
                    }`} style={{width: '87%'}}></div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Target: {item.target}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Decisions */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Strategic Decisions</h3>
              <button className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                <Eye className="w-4 h-4" />
                View All
              </button>
            </div>
            <div className="space-y-4">
              {strategicDecisions.map((decision) => (
                <div key={decision.id} className="flex items-center justify-between p-4 bg-purple-50/50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 text-white font-bold text-xs">{decision.type.charAt(0)}</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{decision.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{decision.date}</p>
                      <span className={`text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-700 dark:text-purple-300`}>
                        {decision.impact} Impact
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      decision.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      decision.status === 'In Review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {decision.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Allocation & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Budget Allocation */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Budget Allocation</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
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
              <div className="flex flex-col gap-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-800 dark:text-white">Revenue Target Achieved</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">18.5% growth vs 15% target</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-purple-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-slate-800 dark:text-white">Market Competition</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monitor competitor pricing strategies</p>
              </div>
            </div>
          </div>

          {/* Executive Actions */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Executive Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto p-4 bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white">
                <div className="text-center">
                  <Target className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Set Strategy</span>
                </div>
              </Button>
              
              <Button className="h-auto p-auto-4 bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white">
                <div className="text-center">
                  <Download className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Export Data</span>
                </div>
              </Button>
              
              <Button className="h-auto p-4 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white">
                <div className="text-center">
                  <Award className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Approval</span>
                </div>
              </Button>
              
              <Button className="h-auto p-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white">
                <div className="text-center">
                  <Globe className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Expansion</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Regional Overview Table */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Regional Performance Overview</h3>
            <Button variant="outline" className="border-purple-200 dark:border-purple-800">
              <ArrowRight className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Region</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Market Share</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Growth</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((region, index) => (
                  <tr key={region.region} className="border-b border-slate-100/50 dark:border-slate-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{region.region}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">₹{region.revenue.toLocaleString()}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{region.marketShare}%</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{region.growth}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        region.growth > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                        region.growth > 5 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                      }`}>
                        {region.growth > 10 ? 'High Growth' : region.growth > 5 ? 'Good Growth' : 'Steady'}
                      </span>
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