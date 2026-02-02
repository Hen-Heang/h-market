import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Upload, ImageIcon } from "lucide-react";

/* ============================================
   DROPZONE COMPONENT
   ============================================ */

export interface DropzoneProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  hint?: string;
  accept?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, label, hint, disabled, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2",
          "min-h-35 rounded-lg border-2 border-dashed border-border",
          "bg-surface-2/50 p-6 text-center",
          "transition-colors duration-200",
          "hover:border-brand/50 hover:bg-brand/5",
          "cursor-pointer",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
          {icon || <Upload className="h-5 w-5" />}
        </div>
        <div className="space-y-1">
          <p className="text-body font-medium text-text">
            {label || "Drop files here or click to browse"}
          </p>
          {hint && <p className="text-caption text-text-muted">{hint}</p>}
        </div>
      </div>
    );
  }
);
Dropzone.displayName = "Dropzone";

/* ============================================
   IMAGE PREVIEW CARD
   ============================================ */

export interface ImagePreviewCardProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  placeholder?: boolean;
}

export const ImagePreviewCard = forwardRef<HTMLDivElement, ImagePreviewCardProps>(
  ({ className, src, alt, placeholder, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-video overflow-hidden rounded-lg border border-border",
          "bg-surface-2",
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt || "Preview"} className="h-full w-full object-cover" />
        ) : placeholder ? (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-text-muted/40" />
          </div>
        ) : null}
      </div>
    );
  }
);
ImagePreviewCard.displayName = "ImagePreviewCard";
