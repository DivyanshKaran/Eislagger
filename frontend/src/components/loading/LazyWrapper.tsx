"use client";

import React, { Suspense, ComponentType } from "react";

import { ErrorBoundary } from "@/components/error/ErrorBoundary";

import {
  LoadingSpinner,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
} from "./LoadingSpinner";

export interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingType?:
    | "spinner"
    | "skeleton-card"
    | "skeleton-table"
    | "skeleton-chart";
  loadingText?: string;
  loadingSize?: "sm" | "md" | "lg" | "xl";
}

export function LazyWrapper({
  children,
  fallback,
  errorFallback,
  loadingType = "spinner",
  loadingText,
  loadingSize = "md",
}: LazyWrapperProps) {
  const getLoadingFallback = () => {
    if (fallback) return fallback;

    switch (loadingType) {
      case "skeleton-card":
        return <SkeletonCard />;
      case "skeleton-table":
        return <SkeletonTable />;
      case "skeleton-chart":
        return <SkeletonChart />;
      default:
        return <LoadingSpinner size={loadingSize} text={loadingText} />;
    }
  };

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={getLoadingFallback()}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options?: Omit<LazyWrapperProps, "children">,
) {
  const LazyComponent = (props: P) => (
    <LazyWrapper {...options}>
      <Component {...props} />
    </LazyWrapper>
  );

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyComponent;
}

// Hook for lazy loading with intersection observer
export function useLazyLoad(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsIntersecting(true);
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return [ref, isIntersecting] as const;
}
