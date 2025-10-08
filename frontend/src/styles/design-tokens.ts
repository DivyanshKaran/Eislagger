/**
 * Design System Tokens
 * Centralized design tokens for consistent styling across the application
 */

// Color Palette
export const colors = {
  // Primary Colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Secondary Colors
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // Accent Colors
  accent: {
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
      950: "#500724",
    },
    purple: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764",
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    sky: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },
    indigo: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
      950: "#1e1b4b",
    },
  },

  // Status Colors
  status: {
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    info: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },
  },

  // Neutral Colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
} as const;

// Spacing Scale
export const spacing = {
  0: "0px",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    serif: ["Georgia", "serif"],
    mono: ["JetBrains Mono", "monospace"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
    "5xl": ["3rem", { lineHeight: "1" }], // 48px
    "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
    "7xl": ["4.5rem", { lineHeight: "1" }], // 72px
    "8xl": ["6rem", { lineHeight: "1" }], // 96px
    "9xl": ["8rem", { lineHeight: "1" }], // 128px
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// Border Radius
export const borderRadius = {
  none: "0px",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",
} as const;

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Animation Durations
export const durations = {
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1000: "1000ms",
} as const;

// Animation Easing
export const easing = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Role-specific Theme Colors
export const roleThemes = {
  executive: {
    primary: colors.accent.indigo,
    secondary: colors.accent.purple,
    background: "from-indigo-50 via-purple-50 to-blue-50",
    backgroundDark: "from-indigo-950/30 via-purple-950/30 to-blue-950/30",
  },
  manufacturer: {
    primary: colors.accent.blue,
    secondary: colors.accent.sky,
    background: "from-blue-50 via-sky-50 to-indigo-50",
    backgroundDark: "from-blue-950/30 via-sky-950/30 to-indigo-950/30",
  },
  clerk: {
    primary: colors.accent.pink,
    secondary: colors.accent.purple,
    background: "from-pink-50 via-purple-50 to-blue-50",
    backgroundDark: "from-pink-950/30 via-purple-950/30 to-blue-950/30",
  },
  patron: {
    primary: colors.accent.purple,
    secondary: colors.accent.pink,
    background: "from-purple-50 via-pink-50 to-blue-50",
    backgroundDark: "from-purple-950/30 via-pink-950/30 to-blue-950/30",
  },
} as const;

// Common Gradient Patterns
export const gradients = {
  primary: "bg-gradient-to-r from-blue-500 to-sky-600",
  secondary: "bg-gradient-to-r from-purple-500 to-pink-600",
  accent: "bg-gradient-to-r from-indigo-500 to-purple-600",
  success: "bg-gradient-to-r from-green-500 to-emerald-600",
  warning: "bg-gradient-to-r from-yellow-500 to-orange-600",
  error: "bg-gradient-to-r from-red-500 to-rose-600",
  info: "bg-gradient-to-r from-blue-500 to-cyan-600",

  // Background gradients
  background: {
    executive: "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50",
    manufacturer: "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50",
    clerk: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
    patron: "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50",
  },

  // Dark background gradients
  backgroundDark: {
    executive:
      "dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-blue-950/30",
    manufacturer:
      "dark:from-blue-950/30 dark:via-sky-950/30 dark:to-indigo-950/30",
    clerk: "dark:from-pink-950/30 dark:via-purple-950/30 dark:to-blue-950/30",
    patron: "dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30",
  },
} as const;

// Common Component Styles
export const componentStyles = {
  card: {
    base: "rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50",
    elevated:
      "rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-xl",
    glass:
      "rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50",
  },
  button: {
    primary:
      "bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white",
    secondary:
      "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
  },
  input: {
    base: "rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/50",
    glass:
      "rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500/50",
  },
  avatar: {
    base: "rounded-full bg-gradient-to-br from-blue-500 to-sky-600 text-white",
    executive:
      "rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
    manufacturer:
      "rounded-full bg-gradient-to-br from-blue-500 to-sky-600 text-white",
    clerk:
      "rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white",
    patron:
      "rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white",
  },
} as const;

// Animation Classes
export const animations = {
  fadeIn: "animate-fade-in",
  slideInUp: "animate-slide-in-up",
  slideInDown: "animate-slide-in-down",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  scaleIn: "animate-scale-in",
  float: "animate-float",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  ping: "animate-ping",
} as const;

// Transition Classes
export const transitions = {
  all: "transition-all duration-300",
  colors: "transition-colors duration-200",
  transform: "transition-transform duration-300",
  opacity: "transition-opacity duration-200",
  shadow: "transition-shadow duration-300",
} as const;

// Utility Functions
export const createGradient = (
  from: string,
  to: string,
  direction: "r" | "br" | "tr" | "bl" = "r",
) => {
  return `bg-gradient-to-${direction} from-${from} to-${to}`;
};

export const createShadow = (size: keyof typeof shadows) => {
  return `shadow-${size}`;
};

export const createSpacing = (size: keyof typeof spacing) => {
  return spacing[size];
};

export const createBorderRadius = (size: keyof typeof borderRadius) => {
  return `rounded-${size}`;
};

export const createTypography = (size: keyof typeof typography.fontSize) => {
  return `text-${size}`;
};

// Type exports
export type ColorScale = typeof colors;
export type SpacingScale = typeof spacing;
export type TypographyScale = typeof typography;
export type BorderRadiusScale = typeof borderRadius;
export type ShadowScale = typeof shadows;
export type ZIndexScale = typeof zIndex;
export type BreakpointScale = typeof breakpoints;
export type DurationScale = typeof durations;
export type EasingScale = typeof easing;
export type RoleTheme = typeof roleThemes;
export type GradientScale = typeof gradients;
export type ComponentStyle = typeof componentStyles;
export type AnimationScale = typeof animations;
export type TransitionScale = typeof transitions;
