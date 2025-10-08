"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PatronLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20">
      <div className="relative flex min-h-screen">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-64 p-4 border-r border-orange-100/60 dark:border-orange-900/40">
          <div className="space-y-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-4 md:p-8">
          {/* Header bar */}
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <div className="hidden sm:flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          {/* Filters row */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-orange-100/60 dark:border-orange-900/40 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-36 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


