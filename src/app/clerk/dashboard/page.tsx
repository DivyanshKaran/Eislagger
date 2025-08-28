"use client";

import { ClerkKPICard } from "@/components/clerk/KPICard";
import {
  DollarSign,
  Store,
  Gauge,
  CheckCircle,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function ClerkDashboard() {
  // KPIs
  const kpis = [
    {
      title: "Sales Per Hour",
      value: "₹2,300",
      change: "+8%",
      changeType: "increase" as const,
      icon: <Gauge className="w-6 h-6" />,
      subtitle: "Today",
    },
    {
      title: "Avg. Transaction Value",
      value: "₹480",
      change: "+3%",
      changeType: "increase" as const,
      icon: <DollarSign className="w-6 h-6" />,
      subtitle: "ATV",
    },
    {
      title: "Items Per Transaction",
      value: "3.2",
      change: "+0.4",
      changeType: "increase" as const,
      icon: <Store className="w-6 h-6" />,
      subtitle: "IPT",
    },
    {
      title: "Conversion Rate",
      value: "41%",
      change: "+2%",
      changeType: "increase" as const,
      icon: <CheckCircle className="w-6 h-6" />,
      subtitle: "Customer Conversion",
    },
    {
      title: "Upsell Rate",
      value: "18%",
      change: "+1%",
      changeType: "increase" as const,
      icon: <Plus className="w-6 h-6" />,
      subtitle: "Add-on Sales",
    },
    {
      title: "Total Transactions",
      value: "57",
      change: "+5",
      changeType: "increase" as const,
      icon: <ShoppingCart className="w-6 h-6" />,
      subtitle: "Today",
    },
    {
      title: "Refund Rate",
      value: "1.2%",
      change: "-0.2%",
      changeType: "decrease" as const,
      icon: <X className="w-6 h-6" />,
      subtitle: "Today",
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      change: "+4%",
      changeType: "increase" as const,
      icon: <CheckCircle className="w-6 h-6" />,
      subtitle: "Surveyed",
    },
  ];

  // Weekly sales line chart
  const weeklySales = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 15000 },
    { day: "Wed", sales: 18000 },
    { day: "Thu", sales: 17000 },
    { day: "Fri", sales: 21000 },
    { day: "Sat", sales: 24000 },
    { day: "Sun", sales: 20000 },
  ];
  // Top flavor bar chart
  const topFlavors = [
    { name: "Choco Burst", sales: 32 },
    { name: "Mango Swirl", sales: 28 },
    { name: "Vanilla Dream", sales: 20 },
    { name: "Raspberry Delight", sales: 12 },
    { name: "Others", sales: 8 },
  ];
  // Today's sales trends (hourly)
  const todaysTrends = [
    { hour: "10 AM", sales: 1200 },
    { hour: "11 AM", sales: 1800 },
    { hour: "12 PM", sales: 2400 },
    { hour: "1 PM", sales: 2100 },
    { hour: "2 PM", sales: 1600 },
    { hour: "3 PM", sales: 1900 },
    { hour: "4 PM", sales: 2200 },
    { hour: "5 PM", sales: 2800 },
    { hour: "6 PM", sales: 3200 },
    { hour: "7 PM", sales: 2600 },
  ];
  // Daily sales for this month (for line chart)
  const dailySalesMonth = [
    { day: 1, sales: 12000 },
    { day: 2, sales: 15000 },
    { day: 3, sales: 18000 },
    { day: 4, sales: 17000 },
    { day: 5, sales: 21000 },
    { day: 6, sales: 24000 },
    { day: 7, sales: 20000 },
    { day: 8, sales: 22000 },
    { day: 9, sales: 19500 },
    { day: 10, sales: 25000 },
    { day: 11, sales: 23000 },
    { day: 12, sales: 21000 },
    { day: 13, sales: 26000 },
    { day: 14, sales: 27000 },
    { day: 15, sales: 22500 },
    { day: 16, sales: 24000 },
    { day: 17, sales: 25500 },
    { day: 18, sales: 26500 },
    { day: 19, sales: 27500 },
    { day: 20, sales: 28500 },
    { day: 21, sales: 29500 },
    { day: 22, sales: 30500 },
    { day: 23, sales: 31500 },
    { day: 24, sales: 32500 },
    { day: 25, sales: 33500 },
    { day: 26, sales: 34500 },
    { day: 27, sales: 35500 },
    { day: 28, sales: 36500 },
    { day: 29, sales: 37500 },
    { day: 30, sales: 38500 },
  ];
  // Weekly trends bar graph data
  const weeklyTrends = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 15000 },
    { day: "Wed", sales: 18000 },
    { day: "Thu", sales: 17000 },
    { day: "Fri", sales: 21000 },
    { day: "Sat", sales: 24000 },
    { day: "Sun", sales: 20000 },
  ];
  // Flavor sales heatmap data (flavors x days)
  const flavorNames = ["Choco", "Mango", "Vanilla", "Strawberry", "Hazelnut"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const flavorHeatmap = [
    [12, 15, 18, 17, 21, 24, 20], // Choco
    [9, 11, 14, 13, 16, 19, 15], // Mango
    [7, 8, 10, 9, 12, 13, 11], // Vanilla
    [5, 6, 8, 7, 9, 10, 8], // Strawberry
    [3, 4, 5, 4, 6, 7, 5], // Hazelnut
  ];
  return (
    <div className="flex flex-col gap-8">
      {/* KPIs Row */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-8 gap-6 gap-y-6 mb-4">
        {kpis.map((kpi, i) => (
          <ClerkKPICard key={i} {...kpi} />
        ))}
      </div>
      {/* Daily Sales This Month Line Chart (replaces Total Sales Today card) */}
      <div className="w-full max-w-7xl mx-auto mb-4">
        <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center animate-fade-in-scale">
          <h2 className="text-lg font-bold text-pink-900 dark:text-pink-100 mb-1">
            Daily Sales This Month
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={dailySalesMonth}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fill: "#ec4899", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a78bfa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fdf2f8",
                  borderRadius: 8,
                  border: "none",
                }}
                labelStyle={{ color: "#ec4899" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#ec4899"
                strokeWidth={3}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
        {/* Weekly Trends Bar Graph */}
        <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 flex flex-col gap-4 animate-fade-in-scale">
          <h2 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-2">
            Weekly Sales Trends
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={weeklyTrends}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fill: "#ec4899", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a78bfa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fdf2f8",
                  borderRadius: 8,
                  border: "none",
                }}
                labelStyle={{ color: "#ec4899" }}
              />
              <Bar
                dataKey="sales"
                fill="#ec4899"
                radius={[8, 8, 0, 0]}
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Flavor Sales Heatmap */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-100/80 to-pink-100/80 dark:from-blue-900/30 dark:to-pink-900/30 shadow-xl border border-blue-200/60 dark:border-blue-800/40 backdrop-blur-xl p-8 flex flex-col gap-6 animate-fade-in-scale">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            Flavor Sales Heatmap
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="text-left text-xs text-pink-700 dark:text-pink-200"></th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="text-xs text-pink-700 dark:text-pink-200 px-2 py-1"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flavorNames.map((flavor, i) => (
                  <tr key={flavor}>
                    <td className="text-sm font-semibold text-pink-900 dark:text-pink-100 pr-2">
                      {flavor}
                    </td>
                    {flavorHeatmap[i].map((val, j) => {
                      // Color intensity based on value
                      const intensity = Math.min(1, val / 25);
                      const bg = `rgba(236, 72, 153, ${0.2 + intensity * 0.7})`;
                      return (
                        <td
                          key={j}
                          className="rounded-lg w-8 h-8 text-center align-middle"
                          style={{ background: bg }}
                        >
                          <span className="text-xs font-bold text-pink-900 dark:text-pink-100">
                            {val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Top Flavor Horizontal Bar Chart */}
        <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 flex flex-col gap-4 animate-fade-in-scale">
          <h2 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-2">
            Top Performing Flavors
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topFlavors}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#ec4899", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#a78bfa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  background: "#fdf2f8",
                  borderRadius: 8,
                  border: "none",
                }}
                labelStyle={{ color: "#ec4899" }}
              />
              <Bar
                dataKey="sales"
                fill="#ec4899"
                radius={[8, 8, 8, 8]}
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top Flavors List */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-100/80 to-blue-100/80 dark:from-purple-900/30 dark:to-blue-900/30 shadow-xl border border-purple-200/60 dark:border-purple-800/40 backdrop-blur-xl p-8 flex flex-col gap-4 animate-fade-in-scale">
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
            Top Flavors List
          </h2>
          <ul className="space-y-3">
            {topFlavors.map((flavor, idx) => (
              <li key={flavor.name} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-pink-500">
                  #{idx + 1}
                </span>
                <span className="font-semibold text-pink-900 dark:text-pink-100 flex-1">
                  {flavor.name}
                </span>
                <span className="text-lg font-bold text-purple-700 dark:text-purple-200">
                  {flavor.sales} sales
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Flavor Leaderboard Card */}
        <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-blue-100/80 dark:from-pink-900/30 dark:to-blue-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl p-8 flex flex-col gap-6 animate-fade-in-scale col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-2">
            Flavor Leaderboard
          </h2>
          <ul className="space-y-4">
            {topFlavors.slice(0, 5).map((flavor, idx) => {
              const percent = Math.round(
                (flavor.sales / topFlavors[0].sales) * 100
              );
              const emojis = ["🍫", "🥭", "🌿", "🍓", "🍦"];
              return (
                <li key={flavor.name} className="flex items-center gap-4">
                  <span className="text-2xl">{emojis[idx] || "🍦"}</span>
                  <span className="font-semibold text-pink-900 dark:text-pink-100 flex-1">
                    {flavor.name}
                  </span>
                  <div className="flex-1 h-3 bg-pink-100 dark:bg-pink-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-200 ml-2">
                    {flavor.sales}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
