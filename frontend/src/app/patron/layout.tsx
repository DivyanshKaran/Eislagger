"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function PatronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-900/20 dark:via-pink-900/20 dark:to-rose-900/20">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-pink-300/30 dark:from-orange-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-orange-300/30 dark:from-rose-300/20 dark:to-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 dark:from-pink-300/10 dark:to-rose-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative flex min-h-screen">
          <div className="fixed left-0 top-0 h-full z-50">
            <Sidebar
              role="patron"
              collapsed={collapsed}
              onCollapse={setCollapsed}
            />
          </div>
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              collapsed ? "ml-16" : "ml-64"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
