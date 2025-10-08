"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { LazyWrapper } from "@/components/loading/LazyWrapper";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";

// Lazy load components based on route
const LazyPageWrapper = lazy(() => import("./LazyPageWrapper"));

interface LazyRouteHandlerProps {
  route: string;
  children?: React.ReactNode;
}

export function LazyRouteHandler({ route, children }: LazyRouteHandlerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [route]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading page..." />
      </div>
    );
  }

  return (
    <LazyWrapper
      loadingType="skeleton-card"
      loadingText="Loading page content..."
      loadingSize="lg"
    >
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
        {children || <LazyPageWrapper page={route} />}
      </Suspense>
    </LazyWrapper>
  );
}

// Hook for route-based preloading
export function useRoutePreloader() {
  const [preloadedRoutes, setPreloadedRoutes] = useState<Set<string>>(
    new Set(),
  );

  const preloadRoute = React.useCallback(
    (route: string) => {
      if (preloadedRoutes.has(route)) return;

      // Preload the route component
      import("./LazyPageWrapper").then(() => {
        setPreloadedRoutes((prev) => new Set([...prev, route]));
      });
    },
    [preloadedRoutes],
  );

  const preloadMultipleRoutes = React.useCallback(
    (routes: string[]) => {
      routes.forEach((route) => preloadRoute(route));
    },
    [preloadRoute],
  );

  return { preloadRoute, preloadMultipleRoutes, preloadedRoutes };
}

// Component for preloading routes on hover
export function PreloadOnHover({
  route,
  children,
  className = "",
}: {
  route: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { preloadRoute } = useRoutePreloader();

  return (
    <div
      className={className}
      onMouseEnter={() => preloadRoute(route)}
      onFocus={() => preloadRoute(route)}
    >
      {children}
    </div>
  );
}
