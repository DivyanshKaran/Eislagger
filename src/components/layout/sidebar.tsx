"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
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
  Truck,
  Store,
  CreditCard,
  ShoppingCart,
  Search,
  ShoppingBag,
  Heart,
  Star,
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
}: {
  isCollapsed: boolean;
  pathname: string;
}) {
  const navigationItems = [
    {
      href: "/executive/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/executive/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
    },
    {
      href: "/executive/budget",
      icon: <DollarSign className="w-5 h-5" />,
      label: "Budget",
    },
    {
      href: "/executive/chat",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chat",
    },
    {
      href: "/executive/email",
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
    },
    {
      href: "/executive/map",
      icon: <MapPin className="w-5 h-5" />,
      label: "Map",
    },
    {
      href: "/reports",
      icon: <FileText className="w-5 h-5" />,
      label: "Reports",
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
    { href: "/help", icon: <HelpCircle className="w-5 h-5" />, label: "Help" },
    {
      href: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-eis-primary to-eis-secondary rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Executive</h2>
                <p className="text-xs text-muted-foreground">CEO Dashboard</p>
              </div>
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
                className={`w-full justify-start gap-3 h-10 text-foreground ${
                  isActive ? "shadow-soft" : "hover:bg-muted"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
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
}: {
  isCollapsed: boolean;
  pathname: string;
}) {
  const navigationItems = [
    {
      href: "/manufacturer/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/manufacturer/stock",
      icon: <Package className="w-5 h-5" />,
      label: "Stock",
    },
    {
      href: "/manufacturer/delivery",
      icon: <Truck className="w-5 h-5" />,
      label: "Delivery",
    },
    {
      href: "/manufacturer/chat",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chat",
    },
    {
      href: "/manufacturer/email",
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
    },
    {
      href: "/manufacturer/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
    },
    {
      href: "/reports",
      icon: <FileText className="w-5 h-5" />,
      label: "Reports",
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
    { href: "/help", icon: <HelpCircle className="w-5 h-5" />, label: "Help" },
    {
      href: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-eis-secondary to-eis-accent rounded-lg flex items-center justify-center">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Manufacturer</h2>
                <p className="text-xs text-muted-foreground">Production Hub</p>
              </div>
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
                className={`w-full justify-start gap-3 h-10 text-foreground ${
                  isActive ? "shadow-soft" : "hover:bg-muted"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
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
}: {
  isCollapsed: boolean;
  pathname: string;
}) {
  const navigationItems = [
    {
      href: "/clerk/dashboard",
      icon: <Home className="w-5 h-5" />,
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
    {
      href: "/clerk/email",
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
    },
    {
      href: "/clerk/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
    },
    {
      href: "/reports",
      icon: <FileText className="w-5 h-5" />,
      label: "Reports",
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
    { href: "/help", icon: <HelpCircle className="w-5 h-5" />, label: "Help" },
    {
      href: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-eis-accent to-eis-primary rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Store Clerk</h2>
                <p className="text-xs text-muted-foreground">Sales Hub</p>
              </div>
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
                className={`w-full justify-start gap-3 h-10 text-foreground ${
                  isActive ? "shadow-soft" : "hover:bg-muted"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
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
}: {
  isCollapsed: boolean;
  pathname: string;
}) {
  const navigationItems = [
    {
      href: "/patron/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/patron/browse",
      icon: <Search className="w-5 h-5" />,
      label: "Browse",
    },
    {
      href: "/patron/orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Orders",
    },
    {
      href: "/patron/favorites",
      icon: <Heart className="w-5 h-5" />,
      label: "Favorites",
    },
    {
      href: "/patron/reviews",
      icon: <Star className="w-5 h-5" />,
      label: "Reviews",
    },
    {
      href: "/patron/stores",
      icon: <MapPin className="w-5 h-5" />,
      label: "Stores",
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
    { href: "/help", icon: <HelpCircle className="w-5 h-5" />, label: "Help" },
    {
      href: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-eis-warm to-eis-cool rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Customer</h2>
                <p className="text-xs text-muted-foreground">Ice Cream Hub</p>
              </div>
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
                className={`w-full justify-start gap-3 h-10 text-foreground ${
                  isActive ? "shadow-soft" : "hover:bg-muted"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar({ role, collapsed, onCollapse }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = typeof collapsed === "boolean";
  const isCollapsed = isControlled ? collapsed : internalCollapsed;
  const setCollapsed = (val: boolean) => {
    if (onCollapse) onCollapse(val);
    if (!isControlled) setInternalCollapsed(val);
  };
  const pathname = usePathname();

  const renderRoleSidebar = () => {
    switch (role) {
      case "executive":
        return (
          <ExecutiveSidebar isCollapsed={isCollapsed} pathname={pathname} />
        );
      case "manufacturer":
        return (
          <ManufacturerSidebar isCollapsed={isCollapsed} pathname={pathname} />
        );
      case "clerk":
        return <ClerkSidebar isCollapsed={isCollapsed} pathname={pathname} />;
      case "patron":
        return <PatronSidebar isCollapsed={isCollapsed} pathname={pathname} />;
    }
  };

  return (
    <div
      className={`h-screen bg-card border-r border-border/50 transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with collapse button */}
        <div className="flex items-center justify-end p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!isCollapsed)}
            className="hover:bg-muted text-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Role-specific content */}
        {renderRoleSidebar()}

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <Link href="/auth/login">
            <Button
              variant="destructive"
              className={`w-full justify-start gap-3 h-10 hover:bg-destructive/80 text-white font-semibold ${
                isCollapsed ? "justify-center px-2" : ""
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
