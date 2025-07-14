"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sun, Moon, Bell, Settings, User } from "lucide-react";

type UserRole = "executive" | "manufacturer" | "clerk" | "patron";

interface AppShellProps {
  role: UserRole;
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarCollapse?: (collapsed: boolean) => void;
}

export default function AppShell({
  role,
  children,
  sidebarCollapsed,
  onSidebarCollapse,
}: AppShellProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check localStorage for theme
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          role={role}
          collapsed={sidebarCollapsed}
          onCollapse={onSidebarCollapse}
        />
      </div>

      {/* Main Content Area with spacing */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-card/80 border-b border-border/50 px-6 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍦</span>
              <span className="font-bold text-lg text-gradient">
                EisLager Pro
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              className="hover:bg-muted"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>
        {/* Main Content with padding */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
