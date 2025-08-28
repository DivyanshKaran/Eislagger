"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Store,
  CreditCard,
  Package,
  MessageSquare,
  Mail,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    href: "/clerk/dashboard",
    icon: <Store className="w-5 h-5" />,
    label: "Dashboard",
  },
  {
    href: "/clerk/pos",
    icon: <CreditCard className="w-5 h-5" />,
    label: "POS",
  },
  {
    href: "/clerk/stock",
    icon: <Package className="w-5 h-5" />,
    label: "Stock",
  },
  {
    href: "/clerk/chat",
    icon: <MessageSquare className="w-5 h-5" />,
    label: "Chat",
  },
  { href: "/clerk/email", icon: <Mail className="w-5 h-5" />, label: "Email" },
  {
    href: "/clerk/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Analytics",
  },
];

export default function ClerkSidebar({
  collapsed: controlledCollapsed,
  onCollapse,
}: {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = typeof controlledCollapsed === "boolean";
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCollapse = () => {
    if (!isControlled) setInternalCollapsed(true);
    if (onCollapse) onCollapse(true);
  };
  const handleExpand = () => {
    if (!isControlled) setInternalCollapsed(false);
    if (onCollapse) onCollapse(false);
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    if (!mounted) return <div className="w-4 h-4" />;
    if (theme === "light") return <Sun className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-pink-50/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 border-r border-pink-200/60 dark:border-pink-800/40 shadow-xl backdrop-blur-xl flex flex-col transition-all duration-150 z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapsed: Show expand button at the top */}
      {isCollapsed && (
        <div className="flex items-center justify-center py-4 border-b border-pink-200/50 dark:border-pink-800/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExpand}
            className="hover:bg-pink-100 dark:hover:bg-pink-900/30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
      {/* Expanded: Header with collapse button */}
      {!isCollapsed && (
        <div className="p-6 border-b border-pink-200/50 dark:border-pink-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg animate-float">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-pink-900 dark:text-pink-100 text-lg">
                Store Clerk
              </h2>
              <p className="text-xs text-pink-700 dark:text-pink-300">
                Sales Hub
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapse}
            className="hover:bg-pink-100 dark:hover:bg-pink-900/30 ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      )}
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-pink-900 dark:text-pink-100 rounded-xl transition-all duration-150 font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                    : "hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-900 dark:hover:text-white"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="flex-1 flex flex-col" />
      <div className="border-t border-pink-200/50 dark:border-pink-800/40 px-2 py-2">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full h-10 mb-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-900 dark:text-pink-100 rounded-xl transition-all duration-150"
        >
          {getThemeIcon()}
        </Button>
        <Link href="/auth/login">
          <Button variant="destructive" className="w-full h-12 rounded-xl">
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </Link>
      </div>
    </aside>
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
    .animate-float { animation: float 3s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
}
