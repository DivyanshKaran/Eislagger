"use client";

import { useState, useEffect } from "react";

import { useTheme } from "next-themes";

import { Sidebar } from "@/components/presentational/Sidebar";
import type { UserRole } from "@/types";

// Thin wrapper that wires theme + collapsed state into the presentational Sidebar

interface SidebarProps {
  role: UserRole;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function SidebarContainer({
  role,
  collapsed: controlledCollapsed,
  onCollapse,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isControlled = typeof controlledCollapsed === "boolean";
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCollapse = (collapsed: boolean) => {
    if (isControlled) {
      onCollapse?.(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
  };

  const handleThemeToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) {
    // Placeholder to avoid hydration mismatch
    return (
      <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <Sidebar
      role={role}
      collapsed={isCollapsed}
      onCollapse={handleCollapse}
      theme={theme as "light" | "dark"}
      onThemeToggle={handleThemeToggle}
    />
  );
}
