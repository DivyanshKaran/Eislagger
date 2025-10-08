"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const { register, isLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await register({ fullName, email, password });
    if (!res.success) setError(res.error || "Registration failed");
  };

  return (
    <AuthFormWrapper
      title="Create your account"
      subtitle="Join EisLagger in seconds"
      footer={
        <span>
          Already have an account? {""}
          <Link href="/auth/login" className="text-orange-600 dark:text-orange-400 hover:underline">Sign in</Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            required
            className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-900"
          />
        </div>
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
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}


