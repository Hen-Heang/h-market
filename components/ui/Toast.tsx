"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

const STYLES: Record<ToastVariant, { wrap: string; icon: string }> = {
  success: {
    wrap: "border-emerald-200 bg-white text-emerald-700 shadow-emerald-500/10",
    icon: "text-emerald-600",
  },
  error: {
    wrap: "border-red-200 bg-white text-red-700 shadow-red-500/10",
    icon: "text-red-600",
  },
  info: {
    wrap: "border-slate-200 bg-white text-slate-700 shadow-slate-500/10",
    icon: "text-slate-600",
  },
};

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function Toast({
  open,
  message,
  variant = "info",
}: {
  open: boolean;
  message: string;
  variant?: ToastVariant;
}) {
  const Icon = ICONS[variant];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-lg ${STYLES[variant].wrap}`}
        >
          <Icon className={`h-4 w-4 ${STYLES[variant].icon}`} />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
