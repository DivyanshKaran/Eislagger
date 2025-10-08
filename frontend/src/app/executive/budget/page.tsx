"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  CreditCard,
  Calculator,
  Building2,
  Wallet,
  Receipt,
  Scale,
  Bell,
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

// Executive budget data
const budgetData = [
  { 
    category: "Research & Development",
    allocated: 2500000,
    spent: 2100000,
    percentage: 84,
    q4_target: 2200000,
    growth: 12.5,
    status: "on_track"
  },
  { 
    category: "Marketing & Sales",
    allocated: 1800000,
    spent: 1650000,
    percentage: 92,
    q4_target: 1700000,
    growth: 8.3,
    status: "on_track"
  },
  { 
    category: "Operations",
    allocated: 3200000,
    spent: 3400000,
    percentage: 106,
    q4_target: 3000000,
    growth: -5.2,
    status: "over_budget"
  },
  { 
    category: "Technology & IT",
    allocated: 1200000,
    spent: 980000,
    percentage: 82,
    q4_target: 1100000,
    growth: 15.7,
    status: "under_budget"
  },
  {
    category: "Administration",
    allocated: 900000,
    spent: 870000,
    percentage: 97,
    q4_target: 850000,
    growth: 3.1,
    status: "on_track"
  },
];

const monthlyBudgetData = [
  { month: "Jan", allocated: 1950000, spent: 1820000, projected: 1980000 },
  { month: "Feb", allocated: 1950000, spent: 1890000, projected: 2010000 },
  { month: "Mar", allocated: 1950000, spent: 1960000, projected: 2050000 },
  { month: "Apr", allocated: 1950000, spent: 2030000, projected: 2100000 },
  { month: "May", allocated: 1950000, spent: 2080000, projected: 2120000 },
  { month: "Jun", allocated: 1950000, spent: 2150000, projected: 2180000 },
];

const expenseCategories = [
  { name: "R&D Investment", value: 35, color: "#8b5cf6", trend: "+12%" },
  { name: "Sales Operations", value: 28, color: "#a855f7", trend: "+8%" },
  { name: "Technology", value: 22, color: "#c084fc", trend: "+16%" },
  { name: "Administration", value: 15, color: "#ddd6fe", trend: "+3%" },
];

const budgetAlerts = [
  { id: 1, type: "over_budget", category: "Operations", message: "Operations budget exceeded by 6%", severity: "high" },
  { id: 2, type: "approval_needed", category: "Marketing", message: "Q4 campaign requires executive approval", severity: "medium" },
  { id: 3, type: "under_budget", category: "Technology", message: "Available budget for Q4 expansion", severity: "low" },
];

const upcomingDecisions = [
  { id: "BD-001", title: "Q4 Technology Infrastructure", amount: 450000, status: "pending", priority: "high" },
  { id: "BD-002", title: "Marketing Campaign Extension", amount: 320000, status: "approved", priority: "medium" },
  { id: "BD-003", title: "R&D Equipment Upgrade", amount: 680000, status: "review", priority: "high" },
];

export default function ExecutiveBudgetPage() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q4");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#executive-budget-styles")) {
      const style = document.createElement("style");
      style.id = "executive-budget-styles";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "over_budget": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "under_budget": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "low": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredBudgetData = selectedCategory === "all" 
    ? budgetData 
    : budgetData.filter(item => item.status === selectedCategory);

  return (
    <div className="relative">
      <div className="relative z-10">
        
        {/* Executive Budget Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Budget Management</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Financial oversight and strategic budget allocation</p>
              </div>
            </div>
            <div className="flex gap-3">
                  <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                    <Target className="w-4 h-4 mr-2" />
                    Set Targets
                  </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Request Budget
              </Button>
            </div>
          </div>

          {/* Quarter Selector */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedQuarter === quarter
                      ? "bg-gradient-to-r from-purple-600 to-v violet-700 text-white shadow-lg"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {quarter}
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

        {/* Executive Budget KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+5.3%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{formatCurrency(9600000)}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Budget</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Annual allocation</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+8.1%</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{formatCurrency(9000000)}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Budget Utilized</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">93.8% allocation</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Attention</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">1</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Over Budget</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Need immediate review</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scale className="w-7 h-7 text-white"/>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Healthy</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{formatCurrency(600000)}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Available</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">End of quarter</p>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Monthly Budget Trends */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Monthly Budget Trends</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Allocated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">Projected</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={monthlyBudgetData}>
                <defs>
                  <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
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
                <Line
                  type="monotone"
                  dataKey="allocated"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#10b981"
                  fill="url(#budgetGradient)"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Categories */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Expense Categories</h3>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Q4 2024</span>
              </div>
            </div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseCategories.map((entry, index) => (
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
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {expenseCategories.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{item.name}</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Alerts & Upcoming Decisions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Budget Alerts */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Budget Alerts</h3>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Bell className="w-4 h-4" />
                <span className="text-sm">{budgetAlerts.length}</span>
              </div>
            </div>
            <div className="space-y-4">
              {budgetAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">{alert.category}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Decisions */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Upcoming Decisions</h3>
              <button className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                <ArrowRight className="w-4 h-4" />
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingDecisions.map((decision) => (
                <div key={decision.id} className="flex items-center justify-between p-4 bg-purple-50/50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-xs">{decision.id}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{decision.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{formatCurrency(decision.amount)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        decision.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        decision.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}>
                        {decision.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      decision.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      decision.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
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

        {/* Budget Categories Performance */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-800/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Budget Category Performance</h3>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Categories</option>
                <option value="on_track">On Track</option>
                <option value="over_budget">Over Budget</option>
                <option value="under_budget">Under Budget</option>
              </select>
              <Button variant="outline" className="border-purple-200 dark:border-purple-800">
                <Receipt className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Allocated</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Spent</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">% Used</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Growth</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgetData.map((item, index) => (
                  <tr key={item.category} className="border-b border-slate-100/50 dark:border-slate-700/30">
                    <td className="p-4">
                          <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${
                          item.category === 'Research & Development' ? 'from-purple-500 to-violet-600' :
                          item.category === 'Marketing & Sales' ? 'from-violet-500 to-purple-600' :
                          item.category === 'Operations' ? 'from-emerald-500 to-purple-600' :
                          item.category === 'Technology & IT' ? 'from-blue-500 to-purple-600' :
                          'from-slate-500 to-purple-600'
                        } rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-medium text-sm">{index + 1}</span>
                        </div>
                            <span className="font-medium text-slate-800 dark:text-white">{item.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatCurrency(item.allocated)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatCurrency(item.spent)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all ${
                            item.percentage > 100 ? 'bg-gradient-to-r from-red-500 to-orange-600' :
                            item.percentage > 90 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                            'bg-gradient-to-r from-emerald-500 to-purple-600'
                          }`} style={{width: `${Math.min(item.percentage, 100)}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {item.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm ${item.growth > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status === 'on_track' ? 'On Track' :
                         item.status === 'over_budget' ? 'Over Budget' :
                         item.status === 'under_budget' ? 'Under Budget' : item.status}
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