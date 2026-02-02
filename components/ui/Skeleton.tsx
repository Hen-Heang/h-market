import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   SKELETON COMPONENT
   ============================================ */

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-surface-2",
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

/* ============================================
   SKELETON PRESETS
   ============================================ */

export function SkeletonText({ className, lines = 1 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-surface rounded-lg border border-border p-6", className)}>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-2 h-4 w-48" />
      <Skeleton className="mt-4 h-20 w-full" />
    </div>
  );
}

export default Skeleton;
