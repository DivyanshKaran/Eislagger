"use client";

import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KPIData } from "@/types";

interface SummaryStat extends Pick<KPIData, "change" | "changeType"> {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  status?: "on-track" | "ahead" | "behind" | "critical";
  target?: string;
  progress?: number;
}

interface SummaryStatsProps {
  stats: SummaryStat[];
  title?: string;
  className?: string;
}

export default function SummaryStats({
  stats,
  title = "Summary Statistics",
  className = "",
}: SummaryStatsProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "on-track":
        return <Target className="w-4 h-4 text-emerald-500" />;
      case "ahead":
        return <Award className="w-4 h-4 text-blue-500" />;
      case "behind":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "on-track":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "ahead":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "behind":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} border-pink-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
                {stat.status && (
                  <Badge className={`text-xs ${getStatusColor(stat.status)}`}>
                    {stat.status.replace("-", " ")}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.label}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-slate-800 dark:text-white">
                    {stat.value}
                  </span>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(stat.changeType)}
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === "increase"
                          ? "text-emerald-600"
                          : stat.changeType === "decrease"
                            ? "text-red-600"
                            : "text-slate-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar (if applicable) */}
              {stat.progress !== undefined && stat.target && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Progress
                    </span>
                    <span className="text-slate-800 dark:text-white font-medium">
                      {stat.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500 ease-out`}
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Target: {stat.target}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
