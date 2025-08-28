"use client";

import { useState } from "react";
import EnhancedKPICard, { GreenEnhancedKPICard } from "./EnhancedKPICard";

interface KPIData {
  id: number;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend: number[];
  period: string;
  target: string;
  progress: number;
  category: string;
  priority: "high" | "medium" | "low";
}

interface KPIGridProps {
  kpis: KPIData[];
  title?: string;
  showFilters?: boolean;
  onKPIClick?: (kpi: KPIData) => void;
  className?: string;
  CardComponent?: React.ComponentType<any>;
}

export default function KPIGrid({
  kpis,
  title = "Key Performance Indicators",
  showFilters = true,
  onKPIClick,
  className = "",
  CardComponent = EnhancedKPICard,
}: KPIGridProps) {
  const [expandedKPI, setExpandedKPI] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const filteredKPIs = kpis.filter((kpi) => {
    const matchesCategory =
      selectedCategory === "all" || kpi.category === selectedCategory;
    const matchesPriority =
      selectedPriority === "all" || kpi.priority === selectedPriority;
    return matchesCategory && matchesPriority;
  });

  const handleKPIClick = (kpi: KPIData) => {
    setExpandedKPI(expandedKPI === kpi.id ? null : kpi.id);
    onKPIClick?.(kpi);
  };

  const categories = Array.from(new Set(kpis.map((kpi) => kpi.category)));
  const priorities = ["high", "medium", "low"];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
        </div>
        {showFilters && (
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 text-sm bg-white/70 dark:bg-slate-800/70 border border-pink-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1 text-sm bg-white/70 dark:bg-slate-800/70 border border-pink-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
            >
              <option value="all">All Priorities</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredKPIs.map((kpi) => (
          <CardComponent
            key={kpi.id}
            {...kpi}
            expanded={expandedKPI === kpi.id}
            onClick={() => handleKPIClick(kpi)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredKPIs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            No KPIs Found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
}
