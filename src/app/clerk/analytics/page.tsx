"use client";
import { useState } from "react";
import SummaryCards from "@/components/analytics/SummaryCards";
import ChartsSection from "@/components/analytics/ChartsSection";
import ShopTable from "@/components/analytics/ShopTable";
import FactoryTable from "@/components/analytics/FactoryTable";
import FlavorTable from "@/components/analytics/FlavorTable";
import InsightsGenerator from "@/components/analytics/InsightsGenerator";
import TimeSelector from "@/components/analytics/TimeSelector";

export default function ClerkAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const summaryMetrics = [
    {
      title: "Total Revenue",
      value: "₹8,91,235",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 8v8m0 0c-1.5 0-2.5-1-2.5-2.5S10.5 11 12 11s2.5 1 2.5 2.5S13.5 16 12 16z"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      trend: "+12.3%",
      trendDirection: "up" as const,
      color: "from-emerald-400 to-teal-500",
      bgColor:
        "from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20",
    },
    {
      title: "Total Orders",
      value: "12,847",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
          <path
            d="M8 12l2 2 4-4"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      trend: "+8.7%",
      trendDirection: "up" as const,
      color: "from-blue-400 to-indigo-500",
      bgColor:
        "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
    },
    {
      title: "Top Shop",
      value: "EisLager Berlin",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 2l7 7-7 7-7-7 7-7z"
            stroke="#a21caf"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      trend: "₹2.1M",
      trendDirection: "neutral" as const,
      color: "from-purple-400 to-pink-500",
      bgColor:
        "from-purple-50/80 to-pink-50/80 dark:from-purple-950/20 dark:to-pink-950/20",
    },
    {
      title: "Top Flavor",
      value: "Mango Tango",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#f59e42" strokeWidth="2" />
          <path
            d="M12 8v4l3 3"
            stroke="#f59e42"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      trend: "3,421 sold",
      trendDirection: "up" as const,
      color: "from-orange-400 to-red-500",
      bgColor:
        "from-orange-50/80 to-red-50/80 dark:from-orange-950/20 dark:to-red-950/20",
    },
    {
      title: "Avg. Order Value",
      value: "₹72.30",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M12 8v8m0 0c-1.5 0-2.5-1-2.5-2.5S10.5 11 12 11s2.5 1 2.5 2.5S13.5 16 12 16z"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      trend: "+5.2%",
      trendDirection: "up" as const,
      color: "from-green-400 to-emerald-500",
      bgColor:
        "from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20",
    },
    {
      title: "Failed Deliveries",
      value: "19",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
          <path
            d="M12 8v4l3 3"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      trend: "-23.1%",
      trendDirection: "down" as const,
      color: "from-red-400 to-pink-500",
      bgColor:
        "from-red-50/80 to-pink-50/80 dark:from-red-950/20 dark:to-pink-950/20",
    },
  ];
  return (
    <>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
      <div className="min-h-screen min-w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 dark:from-pink-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-pink-200/30 dark:from-blue-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-300/10 dark:to-pink-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="relative flex flex-col h-screen z-10">
          <main className="flex-1 flex flex-col p-8 max-w-5xl mx-auto gap-12 overflow-y-auto scrollbar-none">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Store Analytics
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Visualize your store&apos;s performance and sales metrics in
                    real time.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TimeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            </div>
            {/* KPIs */}
            <SummaryCards metrics={summaryMetrics} />
            {/* Charts */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Analytics &amp; Insights
              </h2>
              <ChartsSection />
            </div>
            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ShopTable />
              <FactoryTable />
              <FlavorTable />
            </div>
            {/* AI Insights */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                AI-Powered Insights
              </h2>
              <InsightsGenerator />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
