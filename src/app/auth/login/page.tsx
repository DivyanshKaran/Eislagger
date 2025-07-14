"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Chrome,
  ArrowLeft,
  Users,
  Factory,
  Store,
  ShoppingCart,
  X,
} from "lucide-react";

type UserRole = "executive" | "manufacturer" | "clerk" | "patron";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      setShowRoleModal(true); // Show role selection modal in dev mode
    }, 1500);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    // Simulate Google Sign-In process
    setTimeout(() => {
      setIsGoogleLoading(false);
      setShowRoleModal(true); // Show role selection modal in dev mode
    }, 2000);
  };

  const handleRoleSelect = (role: UserRole) => {
    // Redirect to appropriate dashboard
    window.location.href = `/${role}/dashboard`;
  };

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case "executive":
        return {
          icon: <Users className="w-8 h-8" />,
          title: "Executive Dashboard",
          description:
            "Oversee operations, allocate budgets, and monitor performance",
          color: "from-peach-light to-coral-light",
          gradient: "gradient-primary",
        };
      case "manufacturer":
        return {
          icon: <Factory className="w-8 h-8" />,
          title: "Manufacturer Dashboard",
          description:
            "Produce stock efficiently, manage deliveries, and track production",
          color: "from-coral-light to-orchid-light",
          gradient: "gradient-secondary",
        };
      case "clerk":
        return {
          icon: <Store className="w-8 h-8" />,
          title: "Store Clerk Dashboard",
          description:
            "Manage sales, track inventory, and provide customer service",
          color: "from-cream-light to-peach-light",
          gradient: "gradient-accent",
        };
      case "patron":
        return {
          icon: <ShoppingCart className="w-8 h-8" />,
          title: "Customer Dashboard",
          description:
            "Browse flavors, place orders, and discover ice cream experiences",
          color: "from-orchid-light to-highlight",
          gradient: "bg-gradient-to-br from-orchid-light to-highlight",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-peach-light to-coral-light rounded-full flex items-center justify-center shadow-soft">
            <span className="text-3xl">🍦</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-peach-light to-coral-light bg-clip-text text-transparent">
            EisLager Pro
          </h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-gradient">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In Button */}
            <Button
              variant="outline"
              className="w-full mb-4 hover:shadow-soft transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input-modern w-full focus:ring-2 focus:ring-peach-light/20"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input-modern w-full pr-10 focus:ring-2 focus:ring-peach-light/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full hover:shadow-glow transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/auth/register"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Don&apos;t have an account? Sign up
              </Link>
              <br />
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>&copy; 2024 EisLager Pro. All rights reserved.</p>
        </div>
      </div>

      {/* Development Mode Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gradient">
                    Select Your Role
                  </h2>
                  <p className="text-muted-foreground">
                    Development Mode - Choose your dashboard
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRoleModal(false)}
                  className="hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {(
                  ["executive", "manufacturer", "clerk", "patron"] as UserRole[]
                ).map((role) => {
                  const roleInfo = getRoleInfo(role);
                  return (
                    <Card
                      key={role}
                      className="cursor-pointer hover:shadow-glow transition-all duration-300 group border-2 border-transparent hover:border-peach-light/20"
                      onClick={() => handleRoleSelect(role)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 ${roleInfo.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft`}
                          >
                            {roleInfo.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {roleInfo.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {roleInfo.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  This role selection is only available in development mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
