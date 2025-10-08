import React from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={
        `animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-800/60 ${className}`
      }
      aria-hidden="true"
    />
  );
}

export default Skeleton;


