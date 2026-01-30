"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute left-1/2 top-96 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-200/30 blur-[110px]" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative w-full max-w-4xl rounded-3xl bg-white/90 p-10 text-center shadow-xl ring-1 ring-black/5 backdrop-blur"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-44 w-64 items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/70">
              <Check className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <h1 className="mt-8 text-3xl font-semibold text-emerald-700">
            Congratulations!
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            You have signed up successfully!
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95"
            >
              Go to Sign in
            </Link>
            <Link
              href="/"
              className="rounded-lg border px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Back to Home
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
