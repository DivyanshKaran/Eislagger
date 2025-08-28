"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Chrome,
  Factory,
  ShoppingCart,
  Store,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type UserRole = "executive" | "manufacturer" | "clerk" | "patron";

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setShowRoleModal(true);
    }, 2000);
  };

  const handleRoleSelect = (role: UserRole) => {
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
          color: "from-blue-500 to-cyan-500",
          gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
        };
      case "manufacturer":
        return {
          icon: <Factory className="w-8 h-8" />,
          title: "Manufacturer Dashboard",
          description:
            "Produce stock efficiently, manage deliveries, and track production",
          color: "from-orange-500 to-red-500",
          gradient: "bg-gradient-to-br from-orange-500 to-red-500",
        };
      case "clerk":
        return {
          icon: <Store className="w-8 h-8" />,
          title: "Store Clerk Dashboard",
          description:
            "Manage sales, track inventory, and provide customer service",
          color: "from-yellow-500 to-orange-500",
          gradient: "bg-gradient-to-br from-yellow-500 to-orange-500",
        };
      case "patron":
        return {
          icon: <ShoppingCart className="w-8 h-8" />,
          title: "Customer Dashboard",
          description:
            "Browse flavors, place orders, and discover ice cream experiences",
          color: "from-blue-400 to-purple-500",
          gradient: "bg-gradient-to-br from-blue-400 to-purple-500",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🍦</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gradient">
            EisLager Pro
          </h1>
          <p className="text-muted-foreground">
            {authMode === "signin"
              ? "Welcome back to your dashboard"
              : "Join the ice cream revolution"}
          </p>
        </div>

        <Card className="shadow-xl border border-border/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gradient">
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {authMode === "signin"
                ? "Access your ice cream business dashboard"
                : "Start managing your ice cream empire today"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              variant="outline"
              className="w-full py-3 text-base font-medium hover:shadow-lg transition-all duration-300 border-2 border-border hover:border-primary bg-background"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
            >
              <Chrome className="w-5 h-5 mr-3" />
              {isGoogleLoading
                ? "Connecting..."
                : `Continue with Google ${
                    authMode === "signin" ? "Sign In" : "Sign Up"
                  }`}
            </Button>

            {/* Auth Mode Toggle */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {authMode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() =>
                    setAuthMode(authMode === "signin" ? "signup" : "signin")
                  }
                  className="ml-1 text-primary hover:underline font-medium transition-colors"
                >
                  {authMode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Your data is protected with enterprise-grade security
              </p>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border/50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gradient">
                    Select Your Role
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Development Mode - Choose your dashboard
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRoleModal(false)}
                  className="hover:bg-muted"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {(
                  ["executive", "manufacturer", "clerk", "patron"] as UserRole[]
                ).map((role) => {
                  const roleInfo = getRoleInfo(role);
                  return (
                    <Card
                      key={role}
                      className="cursor-pointer hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-primary/20 bg-card"
                      onClick={() => handleRoleSelect(role)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 ${roleInfo.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                          >
                            {roleInfo.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {roleInfo.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {roleInfo.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
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
