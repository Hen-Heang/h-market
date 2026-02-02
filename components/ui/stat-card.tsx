import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   STAT CARD COMPONENT
   ============================================ */

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  value: string | number;
  label: string;
  subtext?: string;
  subtextVariant?: "default" | "success" | "danger";
  iconVariant?: "brand" | "success" | "warning" | "danger" | "neutral";
}

const iconVariants = {
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-surface-2 text-text-muted",
} as const;

const subtextVariants = {
  default: "text-text-muted",
  success: "text-success",
  danger: "text-danger",
} as const;

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      icon,
      value,
      label,
      subtext,
      subtextVariant = "default",
      iconVariant = "brand",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-lg border border-border p-4",
          "text-center",
          "transition-shadow duration-200 hover:shadow-md",
          className
        )}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              "mx-auto flex h-10 w-10 items-center justify-center rounded-full",
              iconVariants[iconVariant]
            )}
          >
            {icon}
          </div>
        )}
        <div className={cn("text-xl font-semibold text-text", icon && "mt-3")}>
          {value}
        </div>
        <div className="mt-1 text-caption text-text-muted">{label}</div>
        {subtext && (
          <div
            className={cn(
              "mt-1 text-caption font-medium",
              subtextVariants[subtextVariant]
            )}
          >
            {subtext}
          </div>
        )}
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

/* ============================================
   STAT CARD SKELETON
   ============================================ */

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg border border-border p-4",
        className
      )}
    >
      <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-surface-2" />
      <div className="mx-auto mt-3 h-6 w-12 animate-pulse rounded bg-surface-2" />
      <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded bg-surface-2" />
    </div>
  );
}
