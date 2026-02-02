import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface DropzoneProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  hint?: string;
}

export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, label, hint, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-2/40 px-6 py-8 text-center",
          className
        )}
        {...props}
      >
        <p className="text-body font-medium text-text">{label}</p>
        {hint ? <p className="text-caption text-text-muted">{hint}</p> : null}
      </div>
    );
  }
);
Dropzone.displayName = "Dropzone";

export interface ImagePreviewCardProps extends HTMLAttributes<HTMLDivElement> {
  placeholder?: boolean;
}

export const ImagePreviewCard = forwardRef<HTMLDivElement, ImagePreviewCardProps>(
  ({ className, placeholder = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface",
          placeholder && "bg-surface-2/60",
          className
        )}
        {...props}
      >
        {placeholder ? (
          <div className="flex h-full w-full items-center justify-center text-caption text-text-muted">
            Preview
          </div>
        ) : null}
      </div>
    );
  }
);
ImagePreviewCard.displayName = "ImagePreviewCard";