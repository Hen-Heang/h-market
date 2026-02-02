import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  neutral: "bg-surface-2 text-text border-border",
  success: "bg-success/15 text-success border-success/30",
  info: "bg-brand/15 text-brand border-brand/30",
  warning: "bg-warning/15 text-warning border-warning/30",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-caption font-medium",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";