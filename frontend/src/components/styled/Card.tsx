/**
 * Styled Card Component
 * Reusable card component with consistent styling and variants
 */

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl border transition-all duration-300", {
  variants: {
    variant: {
      default:
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm",
      elevated:
        "bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-700/60 shadow-xl backdrop-blur-xl",
      glass:
        "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200/50 dark:border-slate-700/50 shadow-lg",
      outline: "bg-transparent border-gray-300 dark:border-gray-600",
      ghost: "bg-transparent border-transparent",
      executive:
        "bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200/60 dark:border-indigo-800/40 shadow-xl backdrop-blur-xl",
      manufacturer:
        "bg-gradient-to-br from-blue-50/80 to-sky-50/80 dark:from-blue-900/30 dark:to-sky-900/30 border-blue-200/60 dark:border-blue-800/40 shadow-xl backdrop-blur-xl",
      clerk:
        "bg-gradient-to-br from-pink-50/80 to-purple-50/80 dark:from-pink-900/30 dark:to-purple-900/30 border-pink-200/60 dark:border-pink-800/40 shadow-xl backdrop-blur-xl",
      patron:
        "bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200/60 dark:border-purple-800/40 shadow-xl backdrop-blur-xl",
    },
    size: {
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
      xl: "p-10",
    },
    hover: {
      true: "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      false: "",
    },
    interactive: {
      true: "hover:shadow-lg hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    hover: false,
    interactive: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, hover, interactive, className }),
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
