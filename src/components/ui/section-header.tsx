import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function SectionHeader({
  className,
  title,
  description,
  actions,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <div className="text-h2 font-semibold text-text">{title}</div>
        {description ? (
          <div className="text-body text-text-muted">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
