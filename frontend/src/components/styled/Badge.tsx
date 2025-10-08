/**
 * Styled Badge Component
 * Reusable badge component with consistent styling and variants
 */

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        secondary:
          "border-transparent bg-gray-500 text-white hover:bg-gray-600",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: "border-transparent bg-cyan-500 text-white hover:bg-cyan-600",
        outline:
          "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300",
        ghost:
          "border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        gradient:
          "border-transparent bg-gradient-to-r from-blue-500 to-sky-600 text-white",
        "gradient-secondary":
          "border-transparent bg-gradient-to-r from-purple-500 to-pink-600 text-white",
        "gradient-success":
          "border-transparent bg-gradient-to-r from-green-500 to-emerald-600 text-white",
        "gradient-warning":
          "border-transparent bg-gradient-to-r from-yellow-500 to-orange-600 text-white",
        "gradient-error":
          "border-transparent bg-gradient-to-r from-red-500 to-rose-600 text-white",
        "gradient-info":
          "border-transparent bg-gradient-to-r from-cyan-500 to-blue-600 text-white",
        executive:
          "border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
        manufacturer:
          "border-transparent bg-gradient-to-r from-blue-500 to-sky-600 text-white",
        clerk:
          "border-transparent bg-gradient-to-r from-pink-500 to-purple-600 text-white",
        patron:
          "border-transparent bg-gradient-to-r from-purple-500 to-pink-600 text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      fullWidth: {
        true: "w-full justify-center",
        false: "",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 transition-transform duration-200",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      interactive: false,
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      interactive,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, fullWidth, interactive, className }),
        )}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
