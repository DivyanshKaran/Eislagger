/**
 * Style Utilities
 * Utility functions for consistent styling and style consolidation
 */

import { cn } from "@/lib/utils";
import { gradients, componentStyles, roleThemes } from "@/styles/design-tokens";

// Common gradient patterns consolidation
export const getGradientClass = (type: keyof typeof gradients) => {
  return gradients[type];
};

// Role-specific gradient classes
export const getRoleGradient = (role: keyof typeof roleThemes) => {
  return roleThemes[role].background;
};

export const getRoleGradientDark = (role: keyof typeof roleThemes) => {
  return roleThemes[role].backgroundDark;
};

// Component style consolidation
export const getCardStyle = (
  variant: keyof typeof componentStyles.card = "base",
) => {
  return componentStyles.card[variant];
};

export const getButtonStyle = (
  variant: keyof typeof componentStyles.button = "primary",
) => {
  return componentStyles.button[variant];
};

export const getInputStyle = (
  variant: keyof typeof componentStyles.input = "base",
) => {
  return componentStyles.input[variant];
};

export const getAvatarStyle = (role?: keyof typeof roleThemes) => {
  if (role) {
    return componentStyles.avatar[role];
  }
  return componentStyles.avatar.base;
};

// Common class combinations
export const commonClasses = {
  // Layout
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 sm:py-16 lg:py-20",
  grid: "grid gap-6 sm:gap-8 lg:gap-12",

  // Cards
  cardBase:
    "rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50",
  cardElevated:
    "rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-xl",
  cardGlass:
    "rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50",

  // Buttons
  buttonPrimary:
    "bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
  buttonSecondary:
    "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
  buttonGhost:
    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",

  // Inputs
  inputBase:
    "rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/50",
  inputGlass:
    "rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500/50",

  // Avatars
  avatarBase:
    "rounded-full bg-gradient-to-br from-blue-500 to-sky-600 text-white",
  avatarExecutive:
    "rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  avatarManufacturer:
    "rounded-full bg-gradient-to-br from-blue-500 to-sky-600 text-white",
  avatarClerk:
    "rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white",
  avatarPatron:
    "rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white",

  // Text
  textGradient:
    "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
  textGradientPrimary:
    "bg-gradient-to-r from-blue-500 to-sky-600 bg-clip-text text-transparent",
  textGradientSecondary:
    "bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent",

  // Animations
  fadeIn: "animate-fade-in",
  slideInUp: "animate-slide-in-up",
  scaleIn: "animate-scale-in",
  float: "animate-float",

  // Transitions
  transitionAll: "transition-all duration-300",
  transitionColors: "transition-colors duration-200",
  transitionTransform: "transition-transform duration-300",

  // Shadows
  shadowSm: "shadow-sm",
  shadowMd: "shadow-md",
  shadowLg: "shadow-lg",
  shadowXl: "shadow-xl",
  shadow2xl: "shadow-2xl",

  // Spacing
  paddingSm: "p-4",
  paddingMd: "p-6",
  paddingLg: "p-8",
  paddingXl: "p-10",

  marginSm: "m-4",
  marginMd: "m-6",
  marginLg: "m-8",
  marginXl: "m-10",

  // Border radius
  roundedSm: "rounded-sm",
  roundedMd: "rounded-md",
  roundedLg: "rounded-lg",
  roundedXl: "rounded-xl",
  rounded2xl: "rounded-2xl",
  roundedFull: "rounded-full",
} as const;

// Style consolidation functions
export const consolidateGradients = (gradientType: string, role?: string) => {
  if (role && role in roleThemes) {
    return getRoleGradient(role as keyof typeof roleThemes);
  }
  return getGradientClass(gradientType as keyof typeof gradients);
};

export const consolidateCardStyles = (
  variant: string = "base",
  role?: string,
) => {
  if (role && role in roleThemes) {
    return getCardStyle(role as keyof typeof componentStyles.card);
  }
  return getCardStyle(variant as keyof typeof componentStyles.card);
};

export const consolidateButtonStyles = (
  variant: string = "primary",
  role?: string,
) => {
  if (role && role in roleThemes) {
    return getButtonStyle(role as keyof typeof componentStyles.button);
  }
  return getButtonStyle(variant as keyof typeof componentStyles.button);
};

export const consolidateAvatarStyles = (role?: string) => {
  if (role && role in roleThemes) {
    return getAvatarStyle(role as keyof typeof roleThemes);
  }
  return getAvatarStyle();
};

// Class combination utilities
export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
) => {
  return cn(...classes.filter(Boolean));
};

export const createResponsiveClasses = (
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
) => {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`,
  );
};

export const createStateClasses = (
  base: string,
  hover?: string,
  focus?: string,
  active?: string,
  disabled?: string,
) => {
  return cn(
    base,
    hover && `hover:${hover}`,
    focus && `focus:${focus}`,
    active && `active:${active}`,
    disabled && `disabled:${disabled}`,
  );
};

// Style validation and cleanup
export const validateClassName = (className: string): boolean => {
  // Basic validation for Tailwind classes
  const validPatterns = [
    /^[a-z-]+$/,
    /^[a-z-]+\[[^\]]+\]$/,
    /^[a-z-]+\[[^\]]+\]\/[0-9]+$/,
  ];

  return validPatterns.some((pattern) => pattern.test(className));
};

export const cleanupClasses = (classes: string): string => {
  return classes.split(" ").filter(Boolean).filter(validateClassName).join(" ");
};

// Style extraction utilities
export const extractCustomStyles = (className: string) => {
  const customStyles: string[] = [];
  const tailwindClasses: string[] = [];

  className.split(" ").forEach((cls) => {
    if (
      cls.startsWith("custom-") ||
      cls.includes("[") ||
      !validateClassName(cls)
    ) {
      customStyles.push(cls);
    } else {
      tailwindClasses.push(cls);
    }
  });

  return {
    custom: customStyles.join(" "),
    tailwind: tailwindClasses.join(" "),
  };
};

// Performance optimization utilities
export const memoizeStyles = (fn: Function) => {
  const cache = new Map();
  return (...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Style debugging utilities
export const debugStyles = (element: HTMLElement) => {
  const computedStyles = window.getComputedStyle(element);
  const relevantStyles = [
    "background",
    "background-color",
    "background-image",
    "border",
    "border-radius",
    "box-shadow",
    "color",
    "font-size",
    "font-weight",
    "padding",
    "margin",
    "width",
    "height",
    "display",
    "flex-direction",
    "justify-content",
    "align-items",
  ];

  return relevantStyles.reduce(
    (acc, style) => {
      acc[style] = computedStyles.getPropertyValue(style);
      return acc;
    },
    {} as Record<string, string>,
  );
};

// Export types
export type CommonClasses = typeof commonClasses;
export type StyleVariant = "default" | "sm" | "md" | "lg" | "xl";
export type StyleRole = keyof typeof roleThemes;
