/**
 * Styled Avatar Component
 * Reusable avatar component with consistent styling and variants
 */

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-blue-500 to-sky-600 text-white",
        executive: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
        manufacturer: "bg-gradient-to-br from-blue-500 to-sky-600 text-white",
        clerk: "bg-gradient-to-br from-pink-500 to-purple-600 text-white",
        patron: "bg-gradient-to-br from-purple-500 to-pink-600 text-white",
        gray: "bg-gray-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white",
      },
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
        "3xl": "h-24 w-24 text-3xl",
      },
      status: {
        online: "ring-2 ring-white ring-offset-2 ring-offset-green-500",
        offline: "ring-2 ring-white ring-offset-2 ring-offset-gray-400",
        busy: "ring-2 ring-white ring-offset-2 ring-offset-red-500",
        away: "ring-2 ring-white ring-offset-2 ring-offset-yellow-500",
        none: "",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 transition-transform duration-200",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "none",
      interactive: false,
    },
  },
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  asChild?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      variant,
      size,
      status,
      interactive,
      src,
      alt,
      fallback,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ variant, size, status, interactive, className }),
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-semibold">
            {fallback || "?"}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));

AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-semibold",
      className,
    )}
    {...props}
  />
));

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
