import React from "react";

import { RefreshCw } from "lucide-react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "md":
        return "h-6 w-6";
      case "lg":
        return "h-8 w-8";
      case "xl":
        return "h-12 w-12";
      default:
        return "h-6 w-6";
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      case "xl":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <RefreshCw className={`${getSizeClasses()} animate-spin text-blue-600`} />
      {text && (
        <span
          className={`${getTextSizeClasses()} text-gray-600 dark:text-gray-400`}
        >
          {text}
        </span>
      )}
    </div>
  );
}

export function LoadingCard({
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 ${className}`}
    >
      <LoadingSpinner size={size} text={text} />
    </div>
  );
}

export function LoadingGrid({
  count = 6,
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingSpinnerProps & { count?: number }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} size={size} text={text} />
      ))}
    </div>
  );
}
