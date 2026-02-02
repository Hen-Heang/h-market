import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   AVATAR COMPONENT
   ============================================ */

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: keyof typeof sizes;
  status?: "online" | "offline" | "away" | "busy";
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, initials, size = "md", status, ...props }, ref) => {
    const statusColors = {
      online: "bg-success",
      offline: "bg-text-muted",
      away: "bg-warning",
      busy: "bg-danger",
    };

    return (
      <div ref={ref} className={cn("relative inline-block", className)} {...props}>
        <div
          className={cn(
            "flex items-center justify-center rounded-full overflow-hidden",
            "bg-brand/10 text-brand font-medium",
            sizes[size]
          )}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt || "Avatar"} className="h-full w-full object-cover" />
          ) : (
            <span>{initials || "?"}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-surface",
              statusColors[status],
              size === "xs" || size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
