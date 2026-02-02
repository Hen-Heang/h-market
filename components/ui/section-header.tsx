import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   SECTION HEADER COMPONENT
   ============================================ */

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          "pb-4 mb-4 border-b border-border",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-h2 font-semibold text-text">{title}</h2>
          {description && (
            <p className="text-body text-text-muted">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";
