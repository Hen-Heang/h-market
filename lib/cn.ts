import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conditional classes and resolves Tailwind conflicts
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-brand", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
