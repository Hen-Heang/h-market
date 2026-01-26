"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";

export default function LoginCard() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get("registered") === "1";

  const loginMutation = useMutation({
    mutationFn: async () => login({ email, password }),
    onSuccess: (data) => {
      if (data && "token" in data && data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      if (data && "userId" in data && data.userId) {
        localStorage.setItem("auth_user_id", String(data.userId));
      }
      if (data && "roleId" in data && data.roleId) {
        localStorage.setItem("auth_role_id", String(data.roleId));
      }

      const target =
        data && "roleId" in data && data.roleId === 2 ? "/merchant" : "/partner";
      router.push(target);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <div className="grid md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[560px] overflow-hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(16,185,129,0.18),_transparent_45%),_radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.18),_transparent_40%),_linear-gradient(160deg,_#ecfeff_0%,_#e0f2fe_45%,_#f8fafc_100%)]" />
          <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute inset-0 opacity-15">
            <Image src="/auth/login-bg.svg" alt="Login background" fill className="object-cover" priority />
          </div>

          <div className="relative flex h-full flex-col justify-between p-10 text-slate-900">
            <div>
              <Link
                href="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="mt-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  B2B Commerce Suite
                </div>
                <h2 className="mt-6 text-3xl font-semibold leading-snug">
                  Control purchasing, inventory, and partner access in one place.
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  Give teams a single source of truth for ordering, pricing, and fulfillment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="text-base font-semibold">48m</div>
                  <div className="text-slate-500">avg order time</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="text-base font-semibold">1.2k</div>
                  <div className="text-slate-500">active partners</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="text-base font-semibold">320</div>
                  <div className="text-slate-500">new SKUs</div>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <PackageSearch className="h-4 w-4" />
                  </div>
                  Live catalog + pricing updates
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <Truck className="h-4 w-4" />
                  </div>
                  Fulfillment visibility by partner
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  Verified supplier compliance
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-7 md:p-10">
          <div className="md:hidden">
            <Link
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition hover:bg-emerald-600/20"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          <div className="pt-8 text-center md:pt-2">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Access Portal</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
              Sign in to H Market
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Manage partners, orders, and product flows.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <InputRow
              type="email"
              placeholder="Email"
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={setEmail}
              disabled={loginMutation.isPending}
            />

            <InputRow
              type={showPw ? "text" : "password"}
              placeholder="Password"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={setPassword}
              disabled={loginMutation.isPending}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  disabled={loginMutation.isPending}
                  className="text-slate-400 transition hover:text-slate-600"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="font-medium text-emerald-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            {registered && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                Account created. Please sign in.
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </motion.button>

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">Or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-3">
              <SocialWideBtn label="Connect with Google" icon="google" />
            </div>

            <p className="pt-2 text-center text-xs text-slate-500">
              Need a new workspace?{" "}
              <Link href="/auth/signup" className="font-semibold text-emerald-700 hover:underline">
                Create an account
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
  value,
  onChange,
  disabled,
}: {
  type: string;
  placeholder: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-600">
        {leftIcon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-2.5 text-sm text-slate-900 outline-none transition
                   focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200/60
                   hover:border-slate-300"
      />

      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
      )}
    </div>
  );
}

function SocialWideBtn({ label, icon }: { label: string; icon: "google" }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
        <Image src="/icons/google.svg" alt="Google" width={16} height={16} />
      </span>
      {label}
    </motion.button>
  );
}
