"use client";

import React from "react";

import Link from "next/link";

import {
  Users,
  Factory,
  Store,
  ShoppingCart,
  Bell,
  User,
  LogOut,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ROLE_META = {
  executive: {
    label: "Executive",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-eis-primary to-eis-secondary",
    bg: "bg-gradient-to-br from-eis-primary to-eis-secondary",
    initial: "E",
  },
  manufacturer: {
    label: "Manufacturer",
    icon: <Factory className="w-5 h-5" />,
    gradient: "from-eis-secondary to-eis-accent",
    bg: "bg-gradient-to-br from-eis-secondary to-eis-accent",
    initial: "M",
  },
  clerk: {
    label: "Clerk",
    icon: <Store className="w-5 h-5" />,
    gradient: "from-eis-accent to-eis-primary",
    bg: "bg-gradient-to-br from-eis-accent to-eis-primary",
    initial: "C",
  },
  patron: {
    label: "Patron",
    icon: <ShoppingCart className="w-5 h-5" />,
    gradient: "from-eis-accent to-eis-primary",
    bg: "bg-gradient-to-br from-eis-accent to-eis-primary",
    initial: "P",
  },
};

type Role = keyof typeof ROLE_META;

interface NavBarProps {
  role: Role;
  notificationCount?: number;
  userName?: string;
}

export function NavBar({
  role,
  notificationCount = 0,
  userName = "",
}: NavBarProps) {
  const meta = ROLE_META[role];

  return (
    <header className="sticky top-0 z-40 w-full bg-card/80 border-b border-border/50 backdrop-blur-md shadow-lg">
      <nav className="flex items-center justify-between h-16 px-6">
        {/* Left: Logo + Role */}
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">🍦</span>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-eis-primary to-eis-secondary select-none">
              EisLager Pro
            </span>
          </Link>
          <span
            className={`hidden sm:flex items-center gap-2 pl-4 border-l border-border/40 ml-4 min-w-0`}
          >
            <span
              className={`w-8 h-8 ${meta.bg} rounded-lg flex items-center justify-center text-white`}
            >
              {meta.icon}
            </span>
            <span className={`font-semibold text-foreground truncate`}>
              {meta.label}
            </span>
          </span>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="eis-dropdown min-w-[220px]"
            >
              <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted"
                aria-label="Profile"
              >
                <span
                  className={`w-9 h-9 ${meta.bg} rounded-full flex items-center justify-center text-white font-bold text-base`}
                >
                  {userName ? userName[0].toUpperCase() : meta.initial}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="eis-dropdown min-w-[180px]"
            >
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <div className="my-1 h-px bg-border/60" />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
