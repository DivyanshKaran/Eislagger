"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20" data-route="clerk">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 dark:from-pink-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-pink-200/30 dark:from-blue-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-300/10 dark:to-pink-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="fixed left-0 top-0 h-full z-50">
          <Sidebar 
            role="clerk" 
            collapsed={collapsed} 
            onCollapse={setCollapsed} 
          />
        </div>
        <div
          className={`relative min-h-screen transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >
          <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
