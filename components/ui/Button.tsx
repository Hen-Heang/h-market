import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   BUTTON VARIANTS & SIZES
   ============================================ */

const variants = {
  primary: [
    "bg-brand text-brand-foreground",
    "hover:bg-brand/90",
    "active:bg-brand/80",
  ].join(" "),
  secondary: [
    "bg-surface-2 text-text",
    "hover:bg-surface-2/80",
    "active:bg-surface-2/70",
  ].join(" "),
  outline: [
    "bg-transparent text-text border border-border",
    "hover:bg-surface-2",
    "active:bg-surface-2/80",
  ].join(" "),
  ghost: [
    "bg-transparent text-text",
    "hover:bg-surface-2",
    "active:bg-surface-2/80",
  ].join(" "),
  danger: [
    "bg-danger text-white",
    "hover:bg-danger/90",
    "active:bg-danger/80",
  ].join(" "),
} as const;

const sizes = {
  sm: "h-8 px-3 text-caption rounded-sm gap-1.5",
  md: "h-10 px-4 text-body rounded-md gap-2",
  lg: "h-12 px-6 text-body rounded-lg gap-2.5",
} as const;

/* ============================================
   BUTTON COMPONENT
   ============================================ */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium",
          "transition-colors duration-200",
          // Focus ring - accessible
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          // Variant & size
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
