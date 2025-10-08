/**
 * Progress Utilities
 * Utility functions for progress bars and dynamic width/height calculations
 */

// Progress bar utilities
export const createProgressStyle = (progress: number, max: number = 100) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);
  return {
    width: `${percentage}%`,
  };
};

export const createHeightStyle = (value: number, maxValue: number) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  return {
    height: `${percentage}%`,
  };
};

// Background color utilities
export const createBackgroundStyle = (color: string) => {
  return {
    background: color,
  };
};

// Common progress bar configurations
export const progressConfigs = {
  // Color schemes
  colors: {
    primary: "bg-blue-500",
    secondary: "bg-purple-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-cyan-500",
  },

  // Sizes
  sizes: {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
    xl: "h-4",
  },

  // Animations
  animations: {
    smooth: "transition-all duration-1000 ease-in-out",
    fast: "transition-all duration-300 ease-in-out",
    slow: "transition-all duration-2000 ease-in-out",
  },
} as const;

// Create a complete progress bar configuration
export const createProgressBarConfig = (
  progress: number,
  max: number = 100,
  color: keyof typeof progressConfigs.colors = "primary",
  size: keyof typeof progressConfigs.sizes = "md",
  animation: keyof typeof progressConfigs.animations = "smooth",
) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  return {
    style: {
      width: `${percentage}%`,
    },
    className: `${progressConfigs.colors[color]} ${progressConfigs.sizes[size]} ${progressConfigs.animations[animation]}`,
    percentage,
  };
};

// Chart height utilities
export const createChartHeightConfig = (
  value: number,
  maxValue: number,
  minHeight: number = 0,
  maxHeight: number = 100,
) => {
  const percentage = Math.min(
    Math.max((value / maxValue) * 100, minHeight),
    maxHeight,
  );

  return {
    style: {
      height: `${percentage}%`,
    },
    percentage,
  };
};

// Background gradient utilities
export const createGradientBackground = (colors: string[]) => {
  const gradient = colors.join(", ");
  return {
    background: `linear-gradient(135deg, ${gradient})`,
  };
};

// Common gradient backgrounds
export const gradientBackgrounds = {
  primary: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  secondary: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  success: "linear-gradient(135deg, #10b981, #059669)",
  warning: "linear-gradient(135deg, #f59e0b, #d97706)",
  error: "linear-gradient(135deg, #ef4444, #dc2626)",
  info: "linear-gradient(135deg, #06b6d4, #0891b2)",
  executive: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  manufacturer: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  clerk: "linear-gradient(135deg, #ec4899, #8b5cf6)",
  patron: "linear-gradient(135deg, #8b5cf6, #ec4899)",
} as const;

// Create background style from gradient name
export const createGradientBackgroundStyle = (
  gradientName: keyof typeof gradientBackgrounds,
) => {
  return {
    background: gradientBackgrounds[gradientName],
  };
};

// Transform utilities
export const createTransformStyle = (transform: string) => {
  return {
    transform,
  };
};

// Common transforms
export const transforms = {
  scale: (factor: number) => `scale(${factor})`,
  rotate: (degrees: number) => `rotate(${degrees}deg)`,
  translate: (x: number, y: number) => `translate(${x}px, ${y}px)`,
  translateX: (x: number) => `translateX(${x}px)`,
  translateY: (y: number) => `translateY(${y}px)`,
  skew: (x: number, y: number) => `skew(${x}deg, ${y}deg)`,
  skewX: (x: number) => `skewX(${x}deg)`,
  skewY: (y: number) => `skewY(${y}deg)`,
} as const;

// Opacity utilities
export const createOpacityStyle = (opacity: number) => {
  return {
    opacity: Math.min(Math.max(opacity, 0), 1),
  };
};

// Combined style utilities
export const createCombinedStyle = (styles: Record<string, any>) => {
  return styles;
};

// Style validation
export const validateStyleValue = (
  value: any,
  type: "number" | "string" | "boolean",
) => {
  switch (type) {
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "string":
      return typeof value === "string";
    case "boolean":
      return typeof value === "boolean";
    default:
      return false;
  }
};

// Style interpolation
export const interpolateStyle = (
  startValue: number,
  endValue: number,
  progress: number,
  unit: string = "%",
) => {
  const value = startValue + (endValue - startValue) * progress;
  return `${value}${unit}`;
};

// Export types
export type ProgressColor = keyof typeof progressConfigs.colors;
export type ProgressSize = keyof typeof progressConfigs.sizes;
export type ProgressAnimation = keyof typeof progressConfigs.animations;
export type GradientBackground = keyof typeof gradientBackgrounds;
