/**
 * Animation Utilities
 * Utility functions for consistent animation delays and effects
 */

// Animation delay utilities
export const getAnimationDelay = (
  index: number,
  baseDelay: number = 0.1,
): string => {
  return `${baseDelay * index}s`;
};

export const getStaggeredDelay = (
  index: number,
  baseDelay: number = 0.1,
  offset: number = 0,
): string => {
  return `${offset + baseDelay * index}s`;
};

// Common animation delay classes
export const animationDelays = {
  "delay-0": "delay-0",
  "delay-75": "delay-75",
  "delay-100": "delay-100",
  "delay-150": "delay-150",
  "delay-200": "delay-200",
  "delay-300": "delay-300",
  "delay-500": "delay-500",
  "delay-700": "delay-700",
  "delay-1000": "delay-1000",
} as const;

// Generate animation delay class based on index
export const getDelayClass = (
  index: number,
  baseDelay: number = 100,
): string => {
  const delay = baseDelay * index;
  if (delay <= 75) return "delay-75";
  if (delay <= 100) return "delay-100";
  if (delay <= 150) return "delay-150";
  if (delay <= 200) return "delay-200";
  if (delay <= 300) return "delay-300";
  if (delay <= 500) return "delay-500";
  if (delay <= 700) return "delay-700";
  if (delay <= 1000) return "delay-1000";
  return "delay-1000";
};

// Animation sequence utilities
export const createAnimationSequence = (
  count: number,
  baseDelay: number = 0.1,
) => {
  return Array.from({ length: count }, (_, index) => ({
    index,
    delay: getAnimationDelay(index, baseDelay),
    delayClass: getDelayClass(index, baseDelay * 1000),
  }));
};

// Common animation patterns
export const animationPatterns = {
  fadeInUp: "animate-fade-in-up",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  scaleIn: "animate-scale-in",
  bounceIn: "animate-bounce-in",
  float: "animate-float",
  pulse: "animate-pulse",
  spin: "animate-spin",
} as const;

// Combine animation with delay
export const createAnimatedElement = (
  animation: keyof typeof animationPatterns,
  delay?: number,
) => {
  const baseClass = animationPatterns[animation];
  const delayClass = delay ? getDelayClass(delay) : "";
  return [baseClass, delayClass].filter(Boolean).join(" ");
};

// Staggered animation for lists
export const createStaggeredAnimation = (
  items: any[],
  animation: keyof typeof animationPatterns = "fadeInUp",
  baseDelay: number = 0.1,
) => {
  return items.map((_, index) => ({
    ...items[index],
    animationClass: createAnimatedElement(animation, index * baseDelay * 1000),
  }));
};

// Progress bar animation
export const createProgressAnimation = (
  progress: number,
  duration: number = 1000,
) => {
  return {
    width: `${progress}%`,
    transition: `width ${duration}ms ease-in-out`,
  };
};

// Height animation for charts
export const createHeightAnimation = (
  value: number,
  maxValue: number,
  duration: number = 1000,
) => {
  const height = (value / maxValue) * 100;
  return {
    height: `${height}%`,
    transition: `height ${duration}ms ease-in-out`,
  };
};

// Background color animation
export const createBackgroundAnimation = (
  color: string,
  duration: number = 300,
) => {
  return {
    background: color,
    transition: `background-color ${duration}ms ease-in-out`,
  };
};

// Transform animation
export const createTransformAnimation = (
  transform: string,
  duration: number = 300,
) => {
  return {
    transform,
    transition: `transform ${duration}ms ease-in-out`,
  };
};

// Opacity animation
export const createOpacityAnimation = (
  opacity: number,
  duration: number = 300,
) => {
  return {
    opacity,
    transition: `opacity ${duration}ms ease-in-out`,
  };
};

// Combined animation styles
export const createCombinedAnimation = (
  styles: Record<string, any>,
  duration: number = 300,
) => {
  return {
    ...styles,
    transition: `all ${duration}ms ease-in-out`,
  };
};

// Animation hooks for React
export const useAnimationDelay = (index: number, baseDelay: number = 0.1) => {
  return {
    style: { animationDelay: getAnimationDelay(index, baseDelay) },
    className: getDelayClass(index, baseDelay * 1000),
  };
};

export const useProgressAnimation = (
  progress: number,
  duration: number = 1000,
) => {
  return {
    style: createProgressAnimation(progress, duration),
  };
};

export const useHeightAnimation = (
  value: number,
  maxValue: number,
  duration: number = 1000,
) => {
  return {
    style: createHeightAnimation(value, maxValue, duration),
  };
};

// Export types
export type AnimationDelay = keyof typeof animationDelays;
export type AnimationPattern = keyof typeof animationPatterns;
