"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "@/components/auth/OtpInput";
import Toast from "@/components/ui/Toast";
import { generateCode, resetPassword } from "@/services/auth";

type Step = "request" | "reset";

export default function ForgotPasswordCard() {
  const params = useSearchParams();
  const initialEmail = useMemo(() => (params.get("email") ?? "").trim(), [params]);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<Step>("request");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendCode = async () => {
    setError(null);
    setInfo(null);
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateCode({ email });
      setInfo(data?.message || "Verification code sent.");
      setStep("reset");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "request") {
      await sendCode();
      return;
    }
    setError(null);
    setInfo(null);
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (otp.length < 4) {
      setError("Please enter the 4-digit code.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, code: otp, newPassword });
      setToast({ message: "Password updated. Please sign in.", variant: "success" });
      window.setTimeout(() => router.push(`/auth/login?email=${encodeURIComponent(email)}`), 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <Toast open={Boolean(toast)} message={toast?.message ?? ""} variant={toast?.variant} />
      <div className="grid md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-140 overflow-hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_40%),linear-gradient(160deg,#f8fafc_0%,#ffffff_45%,#ecfeff_100%)]" />
          <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between p-10 text-slate-900">
            <div>
              <Link
                href="/auth/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="mt-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  Secure reset
                </div>
                <h2 className="mt-6 text-3xl font-semibold leading-snug">
                  Regain access to your workspace in minutes.
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  We send a one-time code to confirm ownership before updating your password.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <Mail className="h-4 w-4" />
                </div>
                Verify your email address
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                4-digit code expires quickly
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <KeyRound className="h-4 w-4" />
                </div>
                Create a new secure password
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-7 md:p-10">
          <div className="md:hidden">
            <Link
              href="/auth/login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition hover:bg-emerald-600/20"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          <div className="pt-8 text-center md:pt-2">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
              {step === "request" ? "Reset password" : "Verify & reset"}
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
              {step === "request" ? "Get a reset code" : "Set your new password"}
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              {step === "request"
                ? "Enter your email and we will send a verification code."
                : "Enter the code and choose a new password."}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={onReset}>
            <InputRow
              type="email"
              placeholder="Email"
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={setEmail}
              disabled={loading}
            />

            {step === "reset" && (
              <>
                <div className="mt-3 flex justify-center">
                  <OtpInput length={4} value={otp} onChange={setOtp} />
                </div>

                <InputRow
                  type={showNew ? "text" : "password"}
                  placeholder="New password"
                  leftIcon={<KeyRound className="h-4 w-4" />}
                  value={newPassword}
                  onChange={setNewPassword}
                  disabled={loading}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      disabled={loading}
                      className="text-slate-400 transition hover:text-slate-600"
                      aria-label="Toggle password"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <InputRow
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  leftIcon={<KeyRound className="h-4 w-4" />}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  disabled={loading}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      disabled={loading}
                      className="text-slate-400 transition hover:text-slate-600"
                      aria-label="Toggle password"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            {info && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                {info}
              </div>
            )}

            {step === "request" ? (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={sendCode}
                className="w-full rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95"
              >
                {loading ? "Sending code..." : "Send verification code"}
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95"
                >
                  {loading ? "Updating..." : "Reset password"}
                </motion.button>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={loading}
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    disabled={loading}
                    className="font-medium text-slate-600 hover:text-slate-800"
                  >
                    Change email
                  </button>
                </div>
              </>
            )}

            <p className="pt-2 text-center text-xs text-slate-500">
              Remembered your password?{" "}
              <Link href="/auth/login" className="font-semibold text-emerald-700 hover:underline">
                Back to sign in
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
