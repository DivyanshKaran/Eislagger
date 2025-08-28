"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  BarChart3,
  DollarSign,
  MessageSquare,
  Mail,
  MapPin,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  Factory,
  Package,
  Store,
  CreditCard,
  Search,
  ShoppingBag,
  Heart,
  Star,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type UserRole = "executive" | "manufacturer" | "clerk" | "patron";

interface SidebarProps {
  role: UserRole;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

// Executive Sidebar Component
function ExecutiveSidebar({
  isCollapsed,
  pathname,
  onHeaderClick,
}: {
  isCollapsed: boolean;
  pathname: string;
  onHeaderClick: () => void;
}) {
  const navigationItems = [
    {
      href: "/executive/dashboard",
      icon: <Home className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Dashboard",
    },
    {
      href: "/executive/analytics",
      icon: <BarChart3 className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Analytics",
    },
    {
      href: "/executive/budget",
      icon: <DollarSign className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Budget",
    },
    {
      href: "/executive/chat",
      icon: (
        <MessageSquare className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
      ),
      label: "Chat",
    },
    {
      href: "/executive/email",
      icon: <Mail className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Email",
    },
    {
      href: "/executive/map",
      icon: <MapPin className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Map",
    },
    {
      href: "/executive/reports",
      icon: <FileText className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Reports",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-pink-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🍦</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white">
                  Executive
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  CEO Dashboard
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30 ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                    : "hover:bg-pink-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Manufacturer Sidebar Component
function ManufacturerSidebar({
  isCollapsed,
  pathname,
  onHeaderClick,
}: {
  isCollapsed: boolean;
  pathname: string;
  onHeaderClick: () => void;
}) {
  const navigationItems = [
    {
      href: "/manufacturer/dashboard",
      icon: <Home className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Dashboard",
    },
    {
      href: "/manufacturer/register-stock",
      icon: <Package className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Register Stock",
    },
    {
      href: "/manufacturer/inventory-stock",
      icon: (
        <ShoppingBag className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
      ),
      label: "Inventory Stock",
    },
    {
      href: "/manufacturer/analytics",
      icon: <BarChart3 className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Analytics",
    },
    {
      href: "/manufacturer/email",
      icon: <Mail className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Email",
    },
    {
      href: "/manufacturer/chat",
      icon: (
        <MessageSquare className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
      ),
      label: "Chat",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  Manufacturer
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Production Hub
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30 ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg"
                    : "hover:bg-blue-100 dark:hover:bg-blue-950/20 hover:text-gray-900 dark:hover:text-white"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Clerk Sidebar Component
function ClerkSidebar({
  isCollapsed,
  pathname,
  onHeaderClick,
}: {
  isCollapsed: boolean;
  pathname: string;
  onHeaderClick: () => void;
}) {
  const navigationItems = [
    {
      href: "/clerk/dashboard",
      icon: <Home className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Dashboard",
    },
    {
      href: "/clerk/pos",
      icon: <CreditCard className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "POS",
    },
    {
      href: "/clerk/stock",
      icon: <Package className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Stock",
    },
    {
      href: "/clerk/chat",
      icon: (
        <MessageSquare className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
      ),
      label: "Chat",
    },
    {
      href: "/clerk/email",
      icon: <Mail className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Email",
    },
    {
      href: "/clerk/analytics",
      icon: <BarChart3 className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Analytics",
    },
    {
      href: "/clerk/reports",
      icon: <FileText className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Reports",
    },
    {
      href: "/clerk/settings",
      icon: <Settings className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Settings",
    },
    {
      href: "/clerk/help",
      icon: <HelpCircle className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Help",
    },
    {
      href: "/clerk/notifications",
      icon: <Bell className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="border-b border-yellow-200/50 dark:border-amber-700/50 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={onHeaderClick}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-yellow-900 dark:text-yellow-100">
                  Store Clerk
                </h2>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Sales Hub
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30 ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-yellow-900 dark:text-yellow-100 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
                    : "hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-900 dark:hover:text-yellow-100"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// Patron Sidebar Component
function PatronSidebar({
  isCollapsed,
  pathname,
  onHeaderClick,
}: {
  isCollapsed: boolean;
  pathname: string;
  onHeaderClick: () => void;
}) {
  const navigationItems = [
    {
      href: "/patron/dashboard",
      icon: <Home className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Dashboard",
    },
    {
      href: "/patron/browse",
      icon: <Search className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Browse",
    },
    {
      href: "/patron/orders",
      icon: (
        <ShoppingBag className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
      ),
      label: "Orders",
    },
    {
      href: "/patron/favorites",
      icon: <Heart className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Favorites",
    },
    {
      href: "/patron/reviews",
      icon: <Star className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Reviews",
    },
    {
      href: "/patron/stores",
      icon: <MapPin className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Stores",
    },
    {
      href: "/patron/help",
      icon: <HelpCircle className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Help",
    },
    {
      href: "/patron/settings",
      icon: <Settings className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Settings",
    },
    {
      href: "/patron/notifications",
      icon: <Bell className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🍦</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white">
                  Customer
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ice Cream Hub
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30 ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={onHeaderClick}
                className="hover:bg-pink-100 dark:hover:bg-pink-900/30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-pink-600 text-white shadow-lg"
                    : "hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar({
  role,
  collapsed: controlledCollapsed,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = typeof controlledCollapsed === "boolean";
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handler to toggle collapse
  const handleHeaderClick = () => {
    if (!isControlled) setInternalCollapsed((prev) => !prev);
  };

  const renderRoleSidebar = () => {
    switch (role) {
      case "executive":
        return (
          <ExecutiveSidebar
            isCollapsed={isCollapsed}
            pathname={pathname}
            onHeaderClick={handleHeaderClick}
          />
        );
      case "manufacturer":
        return (
          <ManufacturerSidebar
            isCollapsed={isCollapsed}
            pathname={pathname}
            onHeaderClick={handleHeaderClick}
          />
        );
      case "clerk":
        return (
          <ClerkSidebar
            isCollapsed={isCollapsed}
            pathname={pathname}
            onHeaderClick={handleHeaderClick}
          />
        );
      case "patron":
        return (
          <PatronSidebar
            isCollapsed={isCollapsed}
            pathname={pathname}
            onHeaderClick={handleHeaderClick}
          />
        );
    }
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (!mounted) {
      // Return a placeholder during SSR to prevent hydration mismatch
      return <div className="w-4 h-4" />;
    }
    if (theme === "light") return <Sun className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    if (!mounted) {
      return "Theme";
    }
    return theme === "light" ? "Light" : "Dark";
  };

  return (
    <div
      className={`h-screen bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-pink-200/50 dark:border-slate-700/50 transition-all duration-150 flex-shrink-0 shadow-xl ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with collapse button */}
        {/* Removed collapsible back button */}
        {/* Role-specific content */}
        {renderRoleSidebar()}
        {/* Footer */}
        <div className="p-4 border-t border-pink-200/50 dark:border-slate-700/50 space-y-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`w-full justify-start gap-3 h-10 hover:bg-orange-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-150 ${
              isCollapsed ? "justify-center px-3" : ""
            }`}
          >
            {getThemeIcon()}
            {!isCollapsed && (
              <span className="font-medium">{getThemeLabel()}</span>
            )}
          </Button>

          {/* Sign Out */}
          <Link href="/auth/login">
            <Button
              variant="destructive"
              className={`w-full justify-start gap-3 h-10 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-300 ${
                isCollapsed ? "justify-center px-3" : ""
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
