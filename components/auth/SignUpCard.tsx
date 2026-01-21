"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function SignUpCard() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative hidden min-h-[520px] md:block">
          <Image src="/auth/signup-bg.svg" alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/75 to-cyan-700/80" />

          <Link
            href="/"
            className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 className="text-3xl font-semibold leading-snug">
              Discover the best <br />
              supplier in <br />
              Cambodia.
            </h2>
            <p className="mt-3 text-sm text-white/90">Becoming the best supplier with us now!</p>
          </div>
        </div>

        <div className="p-7 md:p-10">
          <div className="mb-6 flex md:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-zinc-500">Welcome to</p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                H-Market
              </span>
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
              Fill in your information to start journey with us
            </p>
          </div>

          <form className="mt-8 space-y-4">
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

            <InputRow
              type={showConfirmPw ? "text" : "password"}
              placeholder="Confirm Password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="text-zinc-400 transition hover:text-zinc-600"
                  aria-label="Toggle confirm password"
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition hover:opacity-95"
            >
              Sign up
            </motion.button>

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-500">Or connect with</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="flex justify-center gap-3">
              <SocialBtn label="Facebook" icon="f" />
              <SocialBtn label="Google" icon="G" />
            </div>

            <p className="pt-2 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/auth" className="font-semibold text-cyan-700 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
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

function SocialBtn({ label, icon }: { label: string; icon: string }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}
