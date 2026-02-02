import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-md bg-surface-2", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export default Skeleton;