"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-provider";
import { Bell, Store, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClerkNavbarProps {
  notificationCount?: number;
  userName?: string;
}

export function ClerkNavbar({
  notificationCount = 0,
  userName = "",
}: ClerkNavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-br from-pink-50/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 border-b border-pink-200/50 dark:border-pink-800/40 backdrop-blur-md shadow-lg">
      <nav className="flex items-center justify-between h-16 px-6">
        {/* Left: Logo + Role */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/clerk/dashboard"
            className="flex items-center gap-2 min-w-0"
          >
            <span className="text-2xl">🍦</span>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 select-none">
              EisLagger Clerk
            </span>
          </Link>
          <span className="hidden sm:flex items-center gap-2 pl-4 border-l border-pink-200/40 ml-4 min-w-0">
            <span className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
              <Store className="w-5 h-5" />
            </span>
            <span className="font-semibold text-pink-900 dark:text-pink-100 truncate">
              Clerk
            </span>
          </span>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-pink-100 dark:hover:bg-pink-900/30"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-pink-500" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-xs text-white animate-pulse">
                {notificationCount}
              </span>
            )}
          </Button>
          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-pink-100 dark:hover:bg-pink-900/30"
            aria-label="Profile"
          >
            <span className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base">
              {userName ? (
                userName[0].toUpperCase()
              ) : (
                <User className="w-5 h-5" />
              )}
            </span>
          </Button>
          {/* Sign Out */}
          <Link href="/auth/login">
            <Button variant="destructive" size="icon" className="ml-2">
              <LogOut className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
