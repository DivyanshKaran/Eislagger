import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Metric {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  color?: string;
  bgColor?: string;
}

export default function SummaryCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={metric.title}
          className={`rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 group ${
            metric.bgColor ? `bg-gradient-to-br ${metric.bgColor}` : ""
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-3">
            <div
              className={`p-3 rounded-xl shadow-lg ${
                metric.color
                  ? `bg-gradient-to-br ${metric.color}`
                  : "bg-gradient-to-br from-blue-500 to-purple-600"
              } text-white group-hover:scale-110 transition-transform duration-300`}
            >
              {metric.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">
                {metric.title}
              </CardTitle>
            </div>
            {metric.trend && (
              <Badge
                variant={
                  metric.trendDirection === "down" ? "destructive" : "success"
                }
                className={`ml-auto flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  metric.trendDirection === "down"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                }`}
              >
                {metric.trendDirection === "up" && (
                  <TrendingUp className="w-3 h-3" />
                )}
                {metric.trendDirection === "down" && (
                  <TrendingDown className="w-3 h-3" />
                )}
                {metric.trend}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
