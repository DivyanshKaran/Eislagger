"use client";

import { ReactNode } from "react";

interface ClerkKPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  subtitle?: string;
}

export function ClerkKPICard({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  subtitle,
}: ClerkKPICardProps) {
  const changeColor =
    changeType === "increase"
      ? "text-pink-600"
      : changeType === "decrease"
      ? "text-red-500"
      : "text-slate-400";

  return (
    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 shadow-xl border border-pink-200/60 dark:border-pink-800/40 backdrop-blur-xl overflow-hidden group transition-transform hover:scale-[1.025] animate-fade-in-scale">
      {/* Animated Icon */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-pink-300/30 to-purple-300/40 dark:from-pink-700/20 dark:to-purple-700/30 rounded-full blur-2xl animate-float z-0" />
      <div className="relative z-10 flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-pink-700 dark:text-pink-300 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-pink-900 dark:text-pink-100">
          {value}
        </span>
        {change && (
          <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
        )}
      </div>
    </div>
  );
}

// Animations for glassy effect
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    @keyframes fade-in-scale {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-fade-in-scale { animation: fade-in-scale 0.5s ease-out forwards; }
  `;
  document.head.appendChild(style);
}
