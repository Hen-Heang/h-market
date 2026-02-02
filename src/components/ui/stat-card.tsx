import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

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
          "bg-surface border border-border rounded-lg p-4",
          "transition-shadow duration-200 hover:shadow-md",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {icon ? (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                iconVariants[iconVariant]
              )}
            >
              {icon}
            </div>
          ) : null}
          <div className="flex-1">
            <div className="text-caption text-text-muted">{label}</div>
            <div className="text-h3 font-semibold text-text">{value}</div>
            {subtext ? (
              <div className={cn("text-caption font-medium", subtextVariants[subtextVariant])}>
                {subtext}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-surface border border-border rounded-lg p-4", className)}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-surface-2" />
        <div className="flex-1">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
          <div className="mt-2 h-5 w-20 animate-pulse rounded bg-surface-2" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}