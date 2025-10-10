"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSidebarConfig, SidebarConfig } from "@/utils/sidebarConfig";

export interface SidebarProps {
  role: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
}

export function Sidebar({
  role,
  collapsed = false,
  onCollapse,
  theme = "light",
  onThemeToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const config = getSidebarConfig(role);

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    Home: <Home className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    BarChart3: <BarChart3 className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    DollarSign: <DollarSign className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    MessageSquare: (
      <MessageSquare className={collapsed ? "w-6 h-6" : "w-5 h-5"} />
    ),
    Mail: <Mail className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    MapPin: <MapPin className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    FileText: <FileText className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Settings: <Settings className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    HelpCircle: <HelpCircle className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Bell: <Bell className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Factory: <Factory className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Package: <Package className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Store: <Store className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    CreditCard: <CreditCard className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Search: <Search className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    ShoppingBag: <ShoppingBag className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Heart: <Heart className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
    Star: <Star className={collapsed ? "w-6 h-6" : "w-5 h-5"} />,
  };

  const handleToggleCollapse = () => {
    onCollapse?.(!collapsed);
  };

  const getThemeIcon = () => {
    return theme === "light" ? (
      <Sun className="w-4 h-4" />
    ) : (
      <Moon className="w-4 h-4" />
    );
  };

  // Role-specific styling
  const getRoleStyling = () => {
    switch (role) {
      case "clerk":
        return {
          background: "bg-gradient-to-br from-pink-50/90 to-purple-50/90 dark:bg-gradient-to-br dark:from-slate-900 dark:to-gray-800",
          border: "border-pink-200/60 dark:border-slate-700/50",
          headerBorder: "border-pink-200/60 dark:border-slate-700/50",
          footerBorder: "border-pink-200/60 dark:border-slate-700/50",
          backdrop: "backdrop-blur-xl dark:backdrop-blur-sm",
          shadow: "shadow-xl dark:shadow-2xl"
        };
      case "executive":
        return {
          background: "bg-gradient-to-br from-purple-50/90 to-violet-50/90 dark:from-purple-900/20 dark:to-violet-900/20",
          border: "border-purple-200/60 dark:border-purple-800/40",
          headerBorder: "border-purple-200/60 dark:border-purple-800/40",
          footerBorder: "border-purple-200/60 dark:border-purple-800/40",
          backdrop: "backdrop-blur-xl",
          shadow: "shadow-xl"
        };
      case "manufacturer":
        return {
          background: "bg-gradient-to-br from-blue-50/90 to-sky-50/90 dark:from-blue-900/20 dark:to-sky-900/20",
          border: "border-blue-200/60 dark:border-blue-800/40",
          headerBorder: "border-blue-200/60 dark:border-blue-800/40",
          footerBorder: "border-blue-200/60 dark:border-blue-800/40",
          backdrop: "backdrop-blur-xl",
          shadow: "shadow-xl"
        };
      case "patron":
        return {
          background: "bg-gradient-to-br from-orange-50/90 to-pink-50/90 dark:from-orange-900/20 dark:to-pink-900/20",
          border: "border-orange-200/60 dark:border-orange-800/40",
          headerBorder: "border-orange-200/60 dark:border-orange-800/40",
          footerBorder: "border-orange-200/60 dark:border-orange-800/40",
          backdrop: "backdrop-blur-xl",
          shadow: "shadow-xl"
        };
      default:
        return {
          background: "bg-white dark:bg-gray-900",
          border: "border-gray-200 dark:border-gray-700",
          headerBorder: "border-gray-200 dark:border-gray-700",
          footerBorder: "border-gray-200 dark:border-gray-700",
          backdrop: "",
          shadow: ""
        };
    }
  };

  const roleStyling = getRoleStyling();

  return (
    <div
      className={`flex flex-col h-full ${roleStyling.background} ${roleStyling.backdrop} ${roleStyling.shadow} border-r ${roleStyling.border} transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${roleStyling.headerBorder} ${role === "clerk" ? "dark:bg-gradient-to-r dark:from-slate-800/50 dark:to-gray-800/50" : ""}`}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg ${
                  role === "clerk" ? "dark:shadow-pink-500/20" : ""
                }`}
              >
                <img 
                  src={`/icons/${role}-icon.svg`} 
                  alt={`${role} icon`}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h2 className={`font-bold text-lg text-gray-900 dark:text-gray-100 ${
                  role === "clerk" ? "dark:text-pink-100" : ""
                }`}>
                  EisLagger
                </h2>
                <p className={`text-xs text-gray-500 dark:text-gray-400 ${
                  role === "clerk" ? "dark:text-pink-300" : ""
                }`}>
                  {config.title}
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center mb-4">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-lg ${
                  role === "clerk" ? "dark:shadow-pink-500/20" : ""
                }`}
              >
                <img 
                  src={`/icons/${role}-icon.svg`} 
                  alt={`${role} icon`}
                  className="w-5 h-5"
                />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleCollapse}
            className={`h-8 w-8 ${
              role === "clerk" 
                ? "dark:hover:bg-pink-500/20 dark:text-pink-300" 
                : ""
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 p-4 space-y-2 ${role === "clerk" ? "dark:bg-gradient-to-b dark:from-slate-800/30 dark:to-transparent" : ""}`}>
        {config.navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  collapsed ? "px-2" : "px-3"
                } ${
                  isActive
                    ? role === "clerk" 
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 dark:shadow-lg dark:shadow-pink-500/20"
                      : role === "executive"
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    : role === "clerk"
                      ? "text-gray-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-500/10 dark:hover:text-pink-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                disabled={item.disabled}
              >
                <div className="flex items-center gap-3">
                  {iconMap[item.iconName]}
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t ${roleStyling.footerBorder} space-y-2 ${role === "clerk" ? "dark:bg-gradient-to-r dark:from-slate-800/50 dark:to-gray-800/50" : ""}`}>
        {onThemeToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className={`w-full h-10 ${
              role === "clerk" 
                ? "dark:hover:bg-pink-500/20 dark:text-pink-300" 
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {getThemeIcon()}
              {!collapsed && (
                <span className="font-medium">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              )}
            </div>
          </Button>
        )}

        <Button
          variant="ghost"
          className={`w-full h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
            role === "clerk" 
              ? "dark:text-red-400 dark:hover:bg-red-500/10" 
              : ""
          }`}
          onClick={async () => {
            await logout();
            router.push("/auth/login");
          }}
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </div>
        </Button>
      </div>
    </div>
  );
}
