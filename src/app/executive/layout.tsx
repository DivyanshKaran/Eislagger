"use client";

import Sidebar from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 dark:from-pink-300/20 dark:to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 dark:from-blue-300/20 dark:to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-300/10 dark:to-teal-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative flex min-h-screen">
          <Sidebar role="executive" collapsible={true} />
          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
