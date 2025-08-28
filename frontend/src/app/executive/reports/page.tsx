"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  User,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  ChevronDown,
  FileText,
  DollarSign,
  Users,
  Package,
  Truck,
  Store,
  Factory,
  Target,
  RefreshCw,
  Plus,
  Eye,
  Star,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import KPIGrid from "@/components/analytics/KPIGrid";
import SummaryStats from "@/components/analytics/SummaryStats";

// Custom styles for animations
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

// Enhanced KPI Data
const kpiData = [
  {
    id: 1,
    title: "Total Revenue",
    value: "₹12,847,235",
    change: "+18.3%",
    changeType: "increase",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-emerald-400 to-teal-500",
    bgColor:
      "from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20",
    trend: [12.5, 13.2, 14.1, 15.8, 16.2, 17.1, 18.3],
    period: "vs last month",
    target: "₹15,000,000",
    progress: 85.6,
    category: "financial",
    priority: "high",
  },
  {
    id: 2,
    title: "Total Orders",
    value: "45,892",
    change: "+12.7%",
    changeType: "increase",
    icon: <Package className="w-6 h-6" />,
    color: "from-blue-400 to-indigo-500",
    bgColor:
      "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
    trend: [38.2, 39.1, 40.5, 42.1, 43.8, 44.9, 45.9],
    period: "vs last month",
    target: "50,000",
    progress: 91.8,
    category: "operational",
    priority: "high",
  },
  {
    id: 3,
    title: "Customer Satisfaction",
    value: "4.8/5.0",
    change: "+0.2",
    changeType: "increase",
    icon: <Star className="w-6 h-6" />,
    color: "from-purple-400 to-pink-500",
    bgColor:
      "from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20",
    trend: [4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8],
    period: "vs last month",
    target: "4.9/5.0",
    progress: 98.0,
    category: "customer",
    priority: "medium",
  },
  {
    id: 4,
    title: "Production Efficiency",
    value: "94.2%",
    change: "+2.1%",
    changeType: "increase",
    icon: <Factory className="w-6 h-6" />,
    color: "from-orange-400 to-red-500",
    bgColor:
      "from-orange-50/80 to-red-50/80 dark:from-orange-950/20 dark:to-red-950/20",
    trend: [89.1, 90.3, 91.5, 92.8, 93.4, 93.9, 94.2],
    period: "vs last month",
    target: "95%",
    progress: 99.2,
    category: "operational",
    priority: "high",
  },
  {
    id: 5,
    title: "Delivery Success Rate",
    value: "98.7%",
    change: "+0.8%",
    changeType: "increase",
    icon: <Truck className="w-6 h-6" />,
    color: "from-green-400 to-emerald-500",
    bgColor:
      "from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20",
    trend: [97.2, 97.5, 97.8, 98.1, 98.3, 98.5, 98.7],
    period: "vs last month",
    target: "99%",
    progress: 99.7,
    category: "operational",
    priority: "medium",
  },
  {
    id: 6,
    title: "Employee Retention",
    value: "92.4%",
    change: "+1.2%",
    changeType: "increase",
    icon: <Users className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-500",
    bgColor:
      "from-cyan-50/80 to-blue-50/80 dark:from-cyan-950/20 dark:to-blue-950/20",
    trend: [89.8, 90.1, 90.7, 91.2, 91.8, 92.1, 92.4],
    period: "vs last month",
    target: "95%",
    progress: 97.3,
    category: "hr",
    priority: "medium",
  },
  {
    id: 7,
    title: "Market Share",
    value: "23.8%",
    change: "+2.4%",
    changeType: "increase",
    icon: <Target className="w-6 h-6" />,
    color: "from-violet-400 to-purple-500",
    bgColor:
      "from-violet-50/80 to-purple-50/80 dark:from-violet-950/20 dark:to-purple-950/20",
    trend: [20.1, 20.8, 21.5, 22.2, 22.9, 23.4, 23.8],
    period: "vs last month",
    target: "25%",
    progress: 95.2,
    category: "market",
    priority: "high",
  },
  {
    id: 8,
    title: "Cost per Order",
    value: "₹68.45",
    change: "-5.2%",
    changeType: "decrease",
    icon: <TrendingDown className="w-6 h-6" />,
    color: "from-red-400 to-pink-500",
    bgColor:
      "from-red-50/80 to-pink-50/80 dark:from-red-950/20 dark:to-pink-950/20",
    trend: [72.1, 71.3, 70.8, 70.2, 69.5, 68.9, 68.5],
    period: "vs last month",
    target: "₹65.00",
    progress: 94.5,
    category: "financial",
    priority: "medium",
  },
];

const reportCategories = [
  {
    id: "financial",
    label: "Financial Reports",
    icon: DollarSign,
    color: "from-emerald-400 to-teal-500",
    reports: [
      {
        name: "Q4 Financial Summary",
        type: "PDF",
        size: "2.4 MB",
        date: "2024-01-15",
      },
      {
        name: "Revenue Analysis Report",
        type: "Excel",
        size: "1.8 MB",
        date: "2024-01-10",
      },
      {
        name: "Cost Structure Analysis",
        type: "PDF",
        size: "3.1 MB",
        date: "2024-01-08",
      },
    ],
  },
  {
    id: "operational",
    label: "Operational Reports",
    icon: Package,
    color: "from-blue-400 to-indigo-500",
    reports: [
      {
        name: "Production Efficiency Report",
        type: "PDF",
        size: "1.9 MB",
        date: "2024-01-14",
      },
      {
        name: "Delivery Performance Analysis",
        type: "Excel",
        size: "2.2 MB",
        date: "2024-01-12",
      },
      {
        name: "Inventory Management Report",
        type: "PDF",
        size: "2.7 MB",
        date: "2024-01-09",
      },
    ],
  },
  {
    id: "customer",
    label: "Customer Reports",
    icon: Users,
    color: "from-purple-400 to-pink-500",
    reports: [
      {
        name: "Customer Satisfaction Survey",
        type: "PDF",
        size: "1.5 MB",
        date: "2024-01-13",
      },
      {
        name: "Customer Behavior Analysis",
        type: "Excel",
        size: "2.8 MB",
        date: "2024-01-11",
      },
      {
        name: "Loyalty Program Report",
        type: "PDF",
        size: "1.2 MB",
        date: "2024-01-07",
      },
    ],
  },
  {
    id: "market",
    label: "Market Reports",
    icon: Target,
    color: "from-orange-400 to-red-500",
    reports: [
      {
        name: "Market Share Analysis",
        type: "PDF",
        size: "2.1 MB",
        date: "2024-01-12",
      },
      {
        name: "Competitive Analysis Report",
        type: "Excel",
        size: "3.3 MB",
        date: "2024-01-10",
      },
      {
        name: "Market Trends Report",
        type: "PDF",
        size: "1.7 MB",
        date: "2024-01-08",
      },
    ],
  },
];

const filterOptions = [
  {
    label: "Category",
    value: "category",
    icon: "📊",
    options: [
      "All Categories",
      "Financial",
      "Operational",
      "Customer",
      "Market",
      "HR",
    ],
  },
  {
    label: "Time Period",
    value: "period",
    icon: "📅",
    options: [
      "Last 7 Days",
      "Last 30 Days",
      "Last Quarter",
      "Last Year",
      "Custom Range",
    ],
  },
  {
    label: "Priority",
    value: "priority",
    icon: "🎯",
    options: ["All Priorities", "High", "Medium", "Low"],
  },
  {
    label: "Format",
    value: "format",
    icon: "📄",
    options: ["All Formats", "PDF", "Excel", "PowerPoint", "Word"],
  },
];

export default function ExecutiveReportsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [expandedKPI, setExpandedKPI] = useState<number | null>(null);

  const filteredKPIs = kpiData.filter((kpi) => {
    const matchesSearch =
      kpi.title.toLowerCase().includes(search.toLowerCase()) ||
      kpi.value.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || kpi.category === selectedCategory;
    const matchesPriority =
      selectedPriority === "all" || kpi.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 90)
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20";
    if (progress >= 75) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    if (progress >= 60)
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === "increase" ? (
      <TrendingUp className="w-4 h-4 text-emerald-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Stunning Glassy Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 border-b border-pink-200/50 dark:border-slate-700/50 px-8 py-6 flex items-center justify-between backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Executive Reports
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive analytics & performance insights
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl mx-8">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder="Search KPIs, reports, or metrics..."
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

        {/* Enhanced Filter Bar */}
        <div className="sticky top-[5.5rem] z-20 flex justify-center w-full px-6 py-4">
          <div className="flex gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl px-6 py-3 border border-pink-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            {filterOptions.map((filter) => (
              <DropdownMenu key={filter.value}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl px-4 py-2 text-sm transition-all duration-300 hover:bg-pink-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>{filter.label} Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {filter.options.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => {
                        switch (filter.value) {
                          case "category":
                            setSelectedCategory(
                              option === "All Categories"
                                ? "all"
                                : option.toLowerCase()
                            );
                            break;
                          case "period":
                            setSelectedPeriod(option);
                            break;
                          case "priority":
                            setSelectedPriority(
                              option === "All Priorities"
                                ? "all"
                                : option.toLowerCase()
                            );
                            break;
                          case "format":
                            setSelectedFormat(
                              option === "All Formats" ? "all" : option
                            );
                            break;
                        }
                      }}
                      className={
                        (filter.value === "category" &&
                          selectedCategory ===
                            (option === "All Categories"
                              ? "all"
                              : option.toLowerCase())) ||
                        (filter.value === "period" &&
                          selectedPeriod === option) ||
                        (filter.value === "priority" &&
                          selectedPriority ===
                            (option === "All Priorities"
                              ? "all"
                              : option.toLowerCase())) ||
                        (filter.value === "format" &&
                          selectedFormat ===
                            (option === "All Formats" ? "all" : option))
                          ? "bg-pink-100 dark:bg-slate-700"
                          : ""
                      }
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col gap-10">
          {/* Enhanced KPI Cards Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Key Performance Indicators
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredKPIs.map((kpi) => (
                <Card
                  key={kpi.id}
                  className={`relative overflow-hidden bg-gradient-to-br ${
                    kpi.bgColor
                  } border-pink-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
                    expandedKPI === kpi.id ? "ring-2 ring-pink-500" : ""
                  }`}
                  onClick={() =>
                    setExpandedKPI(expandedKPI === kpi.id ? null : kpi.id)
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        {kpi.icon}
                      </div>
                      <Badge
                        className={`text-xs ${getProgressColor(kpi.progress)}`}
                      >
                        {kpi.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                        {kpi.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                          {kpi.value}
                        </span>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(kpi.changeType)}
                          <span
                            className={`text-sm font-medium ${
                              kpi.changeType === "increase"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {kpi.change}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {kpi.period}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">
                          Progress
                        </span>
                        <span className="text-slate-800 dark:text-white font-medium">
                          {kpi.progress}% of target
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${kpi.color} transition-all duration-500`}
                          style={{ width: `${kpi.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Target: {kpi.target}
                      </p>
                    </div>

                    {/* Expanded Details */}
                    {expandedKPI === kpi.id && (
                      <div className="pt-4 border-t border-pink-200/50 dark:border-slate-700/50 space-y-3 animate-slide-in-up">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">
                            Category:
                          </span>
                          <Badge className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {kpi.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">
                            Priority:
                          </span>
                          <Badge
                            className={`text-xs ${
                              kpi.priority === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20"
                                : kpi.priority === "medium"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20"
                                : "bg-green-100 text-green-800 dark:bg-green-900/20"
                            }`}
                          >
                            {kpi.priority}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl"
                          >
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Categories */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Report Library
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-pink-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                            {category.label}
                          </CardTitle>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {category.reports.length} reports available
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.reports.map((report, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-white">
                                {report.name}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {report.type} • {report.size} • {report.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-pink-100 dark:hover:bg-slate-600 rounded-xl"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-pink-100 dark:hover:bg-slate-600 rounded-xl"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New Report
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
