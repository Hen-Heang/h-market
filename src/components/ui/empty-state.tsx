import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center",
          className
        )}
        {...props}
      >
        {icon ? (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-muted">
            {icon}
          </div>
        ) : null}
        <h3 className="text-body font-semibold text-text">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-sm text-caption text-text-muted">{description}</p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";