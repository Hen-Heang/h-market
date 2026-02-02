import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   BADGE VARIANTS
   ============================================ */

const variants = {
  neutral: "bg-surface-2 text-text-muted border-border",
  success: "bg-success/10 text-success border-success/20",
  info: "bg-brand/10 text-brand border-brand/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
} as const;

/* ============================================
   BADGE COMPONENT
   ============================================ */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, variant = "neutral", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "px-2.5 py-0.5 rounded-full",
          "text-caption font-medium",
          "border",
          // Variant
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
