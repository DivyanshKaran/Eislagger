"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || "Sign in failed");
      return;
    }
    // Redirect based on role
    const role = res.user?.role?.toLowerCase();
    switch (role) {
      case "executive":
        router.push("/executive/dashboard");
        break;
      case "manufacturer":
        router.push("/manufacturer/dashboard");
        break;
      case "clerk":
        router.push("/clerk/dashboard");
        break;
      case "patron":
        router.push("/patron/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <AuthFormWrapper
      title="Welcome back"
      subtitle="Sign in to continue"
      footer={
        <span>
          Don t have an account? {""}
          <Link href="/auth/signup" className="text-orange-600 dark:text-orange-400 hover:underline">Create one</Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-900"
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}