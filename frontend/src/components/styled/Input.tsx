/**
 * Styled Input Component
 * Reusable input component with consistent styling and variants
 */

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 dark:border-gray-600 focus-visible:ring-blue-500/50",
        glass:
          "bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 focus-visible:ring-blue-500/50 shadow-lg",
        outline:
          "border-gray-300 dark:border-gray-600 bg-transparent focus-visible:ring-blue-500/50",
        ghost:
          "border-transparent bg-transparent focus-visible:ring-blue-500/50",
        executive:
          "border-indigo-300 dark:border-indigo-600 focus-visible:ring-indigo-500/50",
        manufacturer:
          "border-blue-300 dark:border-blue-600 focus-visible:ring-blue-500/50",
        clerk:
          "border-pink-300 dark:border-pink-600 focus-visible:ring-pink-500/50",
        patron:
          "border-purple-300 dark:border-purple-600 focus-visible:ring-purple-500/50",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-3 py-1 text-sm",
        lg: "h-11 px-4 py-3 text-base",
        xl: "h-12 px-4 py-3 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      error: {
        true: "border-red-500 focus-visible:ring-red-500/50",
        false: "",
      },
      success: {
        true: "border-green-500 focus-visible:ring-green-500/50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: true,
      error: false,
      success: false,
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      error,
      success,
      leftIcon,
      rightIcon,
      label,
      helperText,
      errorMessage,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || !!errorMessage;
    const hasSuccess = success && !hasError;

    return (
      <div className={cn("space-y-2", !fullWidth && "w-fit")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({
                variant,
                size,
                fullWidth,
                error: hasError,
                success: hasSuccess,
                className,
              }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(helperText || errorMessage) && (
          <p
            className={cn(
              "text-sm",
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400",
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
