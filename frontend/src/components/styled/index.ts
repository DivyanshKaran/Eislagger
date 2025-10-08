/**
 * Styled Components Barrel Export
 * Centralized exports for all styled components
 */

export { Button, buttonVariants } from "./Button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
} from "./Card";
export { Input, inputVariants } from "./Input";
export { Avatar, AvatarImage, AvatarFallback, avatarVariants } from "./Avatar";
export { Badge, badgeVariants } from "./Badge";

// Re-export types
export type { ButtonProps } from "./Button";
export type { CardProps } from "./Card";
export type { InputProps } from "./Input";
export type { AvatarProps } from "./Avatar";
export type { BadgeProps } from "./Badge";
