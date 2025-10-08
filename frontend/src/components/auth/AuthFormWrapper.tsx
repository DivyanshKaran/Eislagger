"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type AuthFormWrapperProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthFormWrapper({ title, subtitle, children, footer }: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-orange-400 to-pink-500 p-2">
              <Image src="/favicon.png" alt="logo" width={24} height={24} className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">EisLagger</span>
          </Link>
        </div>
        <div className="rounded-xl border border-orange-200/70 dark:border-orange-900/40 bg-white dark:bg-gray-900 shadow-sm">
          <div className="px-6 pt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
            )}
          </div>
          <div className="px-6 py-6">{children}</div>
        </div>
        {footer && <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">{footer}</div>}
      </div>
    </div>
  );
}


