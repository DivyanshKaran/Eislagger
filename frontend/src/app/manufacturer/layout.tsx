"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function ManufacturerLayout({
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/30 dark:via-sky-950/30 dark:to-indigo-950/30" data-route="manufacturer">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-sky-300/30 dark:from-blue-300/20 dark:to-sky-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-blue-300/30 dark:from-indigo-300/20 dark:to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-sky-300/20 to-indigo-300/20 dark:from-sky-300/10 dark:to-indigo-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="fixed left-0 top-0 h-full z-50">
          <Sidebar 
            role="manufacturer" 
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
