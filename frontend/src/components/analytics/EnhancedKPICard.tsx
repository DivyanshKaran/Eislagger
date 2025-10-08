"use client";

import { useState } from "react";

import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface KPICardProps {
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
  onClick?: () => void;
  expanded?: boolean;
}

export default function EnhancedKPICard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  bgColor,
  trend,
  period,
  target,
  progress,
  category,
  priority,
  onClick,
  expanded = false,
}: KPICardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${bgColor} border-pink-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
        isExpanded ? "ring-2 ring-pink-500" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
          <Badge className={`text-xs ${getProgressColor(progress)}`}>
            {progress}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              {value}
            </span>
            <div className="flex items-center gap-1">
              {getChangeIcon(changeType)}
              <span
                className={`text-sm font-medium ${
                  changeType === "increase"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{period}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-slate-800 dark:text-white font-medium">
              {progress}% of target
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Target: {target}
          </p>
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="flex justify-center">
          <div
            className={`w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-600 dark:text-slate-400" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-4 border-t border-pink-200/50 dark:border-slate-700/50 space-y-3 animate-slide-in-up">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                Category:
              </span>
              <Badge className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                {category}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                Priority:
              </span>
              <Badge
                className={`text-xs ${getPriorityColor(priority)} capitalize`}
              >
                {priority}
              </Badge>
            </div>

            {/* Trend Mini Chart */}
            <div className="space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                7-Day Trend
              </p>
              <div className="flex items-end justify-between h-12 gap-1">
                {trend.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-pink-400 to-purple-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl hover:bg-pink-100 dark:hover:bg-slate-700"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Green version for Clerk Dashboard
export function GreenEnhancedKPICard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  bgColor,
  trend,
  period,
  target,
  progress,
  category,
  priority,
  onClick,
  expanded = false,
}: KPICardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const getProgressColor = (progress: number) => {
    if (progress >= 90)
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20";
    if (progress >= 75) return "text-lime-600 bg-lime-100 dark:bg-lime-900/20";
    if (progress >= 60)
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === "increase" ? (
      <TrendingUp className="w-4 h-4 text-emerald-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-400";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${bgColor} border-emerald-200/50 dark:border-green-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
        isExpanded ? "ring-2 ring-emerald-500" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
          <Badge className={`text-xs ${getProgressColor(progress)}`}>
            {progress}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              {value}
            </span>
            <div className="flex items-center gap-1">
              {getChangeIcon(changeType)}
              <span
                className={`text-sm font-medium ${
                  changeType === "increase"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300">{period}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-700 dark:text-green-300">Progress</span>
            <span className="text-green-900 dark:text-green-100 font-medium">
              {progress}% of target
            </span>
          </div>
          <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300">
            Target: {target}
          </p>
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="flex justify-center">
          <div
            className={`w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-green-600 dark:text-green-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-4 border-t border-emerald-200/50 dark:border-green-700/50 space-y-3 animate-slide-in-up">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700 dark:text-green-300">
                Category:
              </span>
              <Badge className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 capitalize">
                {category}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700 dark:text-green-300">
                Priority:
              </span>
              <Badge
                className={`text-xs ${getPriorityColor(priority)} capitalize`}
              >
                {priority}
              </Badge>
            </div>

            {/* Trend Mini Chart */}
            <div className="space-y-2">
              <p className="text-xs text-green-700 dark:text-green-300">
                7-Day Trend
              </p>
              <div className="flex items-end justify-between h-12 gap-1">
                {trend.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-emerald-400 to-green-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl hover:bg-emerald-100 dark:hover:bg-green-900"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
