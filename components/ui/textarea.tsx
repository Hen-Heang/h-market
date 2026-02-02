import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, disabled, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-caption font-medium text-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            // Base styles
            "w-full min-h-[120px] px-3 py-2.5 rounded-md",
            "bg-surface text-text text-body",
            "border border-border",
            "placeholder:text-text-muted/60",
            // Transitions
            "transition-colors duration-200",
            // Focus ring - accessible
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand",
            // Disabled state
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2",
            // Error state
            error && "border-danger focus-visible:ring-danger/50 focus-visible:border-danger",
            // Resize
            "resize-y",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-caption text-danger">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-caption text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
