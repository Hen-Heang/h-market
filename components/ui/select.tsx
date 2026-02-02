import { forwardRef, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   SELECT COMPONENT
   ============================================ */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      placeholder,
      options,
      leftIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-caption font-medium text-text"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              // Base styles
              "w-full h-10 px-3 pr-10 rounded-md",
              "bg-surface text-text text-body",
              "border border-border",
              // Appearance
              "appearance-none cursor-pointer",
              // Transitions
              "transition-colors duration-200",
              // Focus ring - accessible
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand",
              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2",
              // Error state
              error && "border-danger focus-visible:ring-danger/50 focus-visible:border-danger",
              // Icon padding
              leftIcon && "pl-10",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-caption text-danger">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="text-caption text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
