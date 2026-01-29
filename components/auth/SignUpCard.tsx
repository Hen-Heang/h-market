"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, CheckCircle2, Handshake, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { generateCode, register } from "@/services/auth";
import Toast from "@/components/ui/Toast";

export default function SignUpCard() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" } | null>(null);
  const redirectRef = useRef<number | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") ?? "").toUpperCase() === "PARTNER" ? "PARTNER" : "MERCHANT";
  const [role, setRole] = useState<"PARTNER" | "MERCHANT">(initialRole);
  const roleId = role === "PARTNER" ? 1 : 2;

  const signupMutation = useMutation({
    mutationFn: async () => register({ email, password, roleId }),
    onSuccess: async (data) => {
      const nextEmail = data.email;
      setToast({ message: "Account created. Verify your email.", variant: "success" });
      try {
        await generateCode({ email: nextEmail });
      } catch {
        // Ignore resend failures and allow manual resend on verify page.
      }
      redirectRef.current = window.setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(nextEmail)}`);
      }, 900);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    signupMutation.mutate();
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (redirectRef.current) window.clearTimeout(redirectRef.current);
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <Toast open={Boolean(toast)} message={toast?.message ?? ""} variant={toast?.variant} />
      <div className="grid md:grid-cols-[0.95fr_1.05fr]">
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
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Create Workspace</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
              Start selling and sourcing smarter
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Join a trusted network of partners and merchants.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Select role
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { key: "PARTNER" as const, label: "Partner", desc: "Sell and distribute products." },
                  { key: "MERCHANT" as const, label: "Merchant", desc: "Source trusted inventory." },
                ].map((option) => (
                  <label
                    key={option.key}
                    className={[
                      "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm transition",
                      role === option.key
                        ? "border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-100"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.key}
                      checked={role === option.key}
                      onChange={() => setRole(option.key)}
                      className="mt-1 h-4 w-4 text-emerald-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{option.label}</div>
                      <div className="text-xs text-slate-500">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <InputRow
              type="email"
              placeholder="Email"
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={setEmail}
              disabled={signupMutation.isPending}
            />

            <InputRow
              type={showPw ? "text" : "password"}
              placeholder="Password"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={setPassword}
              disabled={signupMutation.isPending}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  disabled={signupMutation.isPending}
                  className="text-slate-400 transition hover:text-slate-600"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={signupMutation.isPending}
              className="mt-2 w-full rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95"
            >
              {signupMutation.isPending ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                  Signing up...
                </span>
              ) : (
                "Create account"
              )}
            </motion.button>

            <div className="my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">Or connect with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex justify-center gap-3">
              <SocialBtn label="Google" icon="google" />
            </div>

            <p className="pt-2 text-center text-xs text-slate-500">
              Already have access?{" "}
              <Link href="/auth" className="font-semibold text-emerald-700 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden min-h-140 overflow-hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.2),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.22),transparent_40%),linear-gradient(160deg,#ffffff_0%,#f1f5f9_40%,#ecfeff_100%)]" />
          <div className="absolute inset-0 opacity-40">
            <Image src="/auth/signup-bg.svg" alt="Background" fill className="object-cover" priority />
          </div>

          <div className="relative flex h-full flex-col justify-between p-10 text-slate-900">
            <div>
              <Link
                href="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="mt-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  Ecommerce Network
                </div>
                <h2 className="mt-6 text-3xl font-semibold leading-snug">
                  Build reliable supply chains and unlock new revenue.
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  From onboarding to fulfillment, automate every step with shared visibility.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="text-base font-semibold">99.2%</div>
                  <div className="text-slate-500">on-time delivery</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="text-base font-semibold">14k</div>
                  <div className="text-slate-500">monthly orders</div>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <Handshake className="h-4 w-4" />
                  </div>
                  Verified partners and contracts
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  Smart ordering and pricing rules
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  Compliance checks built in
                </div>
              </div>
            </div>
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
        className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-900 outline-none transition
                   focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/60
                   hover:border-slate-300"
      />

      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
      )}
    </div>
  );
}

function SocialBtn({ label, icon }: { label: string; icon: "google" }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      aria-label={label}
    >
      <Image src={`/icons/${icon}.svg`} alt={label} width={16} height={16} />
    </motion.button>
  );
}
