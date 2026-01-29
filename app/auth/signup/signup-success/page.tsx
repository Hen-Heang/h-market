"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-blue-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-4xl rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex h-44 w-64 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/70">
              <Check className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <h1 className="mt-8 text-3xl font-semibold text-cyan-700">
            Congratulations!
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            You have signed up successfully!
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition hover:opacity-95"
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
