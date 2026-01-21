"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginCard() {
  const [showPw, setShowPw] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative p-7 md:p-10">
          <Link
            href="/"
            className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-700 transition hover:bg-cyan-600/15"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="pt-10 text-center md:pt-6">
            <p className="text-xs text-zinc-500">Welcome back to</p>
            <h1 className="mt-1 text-xl font-semibold text-cyan-700 md:text-2xl">H-Market</h1>
            <p className="mt-1 text-xs text-zinc-500">Sign in to access your account</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <InputRow type="email" placeholder="Email" leftIcon={<Mail className="h-4 w-4" />} />

            <InputRow
              type={showPw ? "text" : "password"}
              placeholder="Password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-zinc-400 transition hover:text-zinc-600"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-cyan-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition hover:opacity-95"
            >
              Sign in
            </motion.button>

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-500">Or</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="space-y-3">
              <SocialWideBtn label="Connect with Google" icon="G" />
              <SocialWideBtn label="Connect with Facebook" icon="f" />
            </div>

            <p className="pt-2 text-center text-xs text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="font-semibold text-cyan-700 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden min-h-[520px] md:block">
          <Image src="/auth/login-bg.svg" alt="Login background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-700/80 to-cyan-800/80" />

          <div className="absolute bottom-12 left-10 right-10 text-white">
            <h2 className="text-3xl font-semibold leading-snug">
              Build stronger <br />
              partnerships <br />
              with H-Market
            </h2>
            <p className="mt-3 text-sm text-white/90">Connect partners and merchants in one place.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function InputRow({
  type,
  placeholder,
  leftIcon,
  rightIcon,
}: {
  type: string;
  placeholder: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-cyan-600">
        {leftIcon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-200 bg-white px-10 py-2.5 text-sm text-zinc-900 outline-none transition
                   focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/50
                   hover:border-zinc-300"
      />

      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
      )}
    </div>
  );
}

function SocialWideBtn({ label, icon }: { label: string; icon: string }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
        {icon}
      </span>
      {label}
    </motion.button>
  );
}
