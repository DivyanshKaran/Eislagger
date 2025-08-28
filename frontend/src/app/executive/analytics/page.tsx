"use client";

import { useState } from "react";
import TimeSelector from "@/components/analytics/TimeSelector";
import SummaryCards from "@/components/analytics/SummaryCards";
import ChartsSection from "@/components/analytics/ChartsSection";
import ShopTable from "@/components/analytics/ShopTable";
import FactoryTable from "@/components/analytics/FactoryTable";
import FlavorTable from "@/components/analytics/FlavorTable";
import InsightsGenerator from "@/components/analytics/InsightsGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Search,
  User,
  TrendingUp,
  BarChart3,
  PieChart,
  MapPin,
  AlertTriangle,
  Filter,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

// --- Enhanced Mock Data ---
const summaryMetrics = [
  {
    title: "Total Revenue",
    value: "₹8,91,235",
    icon: <TrendingUp className="w-6 h-6" />,
    trend: "+12.3%",
    trendDirection: "up" as const,
    color: "from-emerald-400 to-teal-500",
    bgColor:
      "from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20",
  },
  {
    title: "Total Orders",
    value: "12,847",
    icon: <BarChart3 className="w-6 h-6" />,
    trend: "+8.7%",
    trendDirection: "up" as const,
    color: "from-blue-400 to-indigo-500",
    bgColor:
      "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
  },
  {
    title: "Top Shop",
    value: "EisLager Berlin",
    icon: <MapPin className="w-6 h-6" />,
    trend: "₹2.1M",
    trendDirection: "neutral" as const,
    color: "from-purple-400 to-pink-500",
    bgColor:
      "from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20",
  },
  {
    title: "Top Flavor",
    value: "Mango Tango",
    icon: <PieChart className="w-6 h-6" />,
    trend: "3,421 sold",
    trendDirection: "up" as const,
    color: "from-orange-400 to-red-500",
    bgColor:
      "from-orange-50/80 to-red-50/80 dark:from-orange-950/20 dark:to-red-950/20",
  },
  {
    title: "Avg. Order Value",
    value: "₹72.30",
    icon: <TrendingUp className="w-6 h-6" />,
    trend: "+5.2%",
    trendDirection: "up" as const,
    color: "from-green-400 to-emerald-500",
    bgColor:
      "from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20",
  },
  {
    title: "Failed Deliveries",
    value: "19",
    icon: <AlertTriangle className="w-6 h-6" />,
    trend: "-23.1%",
    trendDirection: "down" as const,
    color: "from-red-400 to-pink-500",
    bgColor:
      "from-red-50/80 to-pink-50/80 dark:from-red-950/20 dark:to-pink-950/20",
  },
];

const filterOptions = [
  {
    label: "Factory",
    value: "factory",
    icon: "🏭",
    options: [
      "All Factories",
      "Berlin Factory",
      "Mumbai Factory",
      "Pune Factory",
    ],
  },
  {
    label: "Shop",
    value: "shop",
    icon: "🏪",
    options: ["All Shops", "Berlin Central", "Pune HQ", "Mumbai Downtown"],
  },
  {
    label: "Flavor",
    value: "flavor",
    icon: "🍦",
    options: [
      "All Flavors",
      "Mango Tango",
      "Chocolate Dream",
      "Vanilla Bean",
      "Strawberry",
    ],
  },
  {
    label: "Region",
    value: "region",
    icon: "🌍",
    options: [
      "All Regions",
      "North America",
      "Europe",
      "Asia Pacific",
      "South America",
    ],
  },
  {
    label: "Archived",
    value: "archived",
    icon: "📦",
    options: ["Include", "Exclude"],
  },
];

export default function ExecutiveAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({
    factory: "All Factories",
    shop: "All Shops",
    flavor: "All Flavors",
    region: "All Regions",
    archived: "Exclude",
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [filterType]: value }));
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
                <span className="text-2xl">🍦</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real-time insights & performance metrics
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl mx-8">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder="Search analytics, shops, factories, flavors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 shadow-lg border-0 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 group-hover:shadow-xl"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TimeSelector value={timeRange} onChange={setTimeRange} />
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

        {/* Enhanced Floating Filter Bar with Dropdowns */}
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
                      onClick={() => handleFilterChange(filter.value, option)}
                      className={
                        selectedOptions[filter.value] === option
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

        {/* Main Content Area with Enhanced Spacing */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col gap-10">
          {/* Enhanced Metric Cards Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Key Performance Metrics
              </h2>
            </div>
            <SummaryCards metrics={summaryMetrics} />
          </div>

          {/* Enhanced Analytics Charts Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Analytics & Insights
              </h2>
            </div>
            <ChartsSection />
          </div>

          {/* Enhanced Tables and Insights */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Detailed Reports
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ShopTable />
              <FactoryTable />
              <FlavorTable />
            </div>
          </div>

          {/* Enhanced Insights Generator */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                AI-Powered Insights
              </h2>
            </div>
            <InsightsGenerator />
          </div>
        </div>
      </div>
    </>
  );
}
