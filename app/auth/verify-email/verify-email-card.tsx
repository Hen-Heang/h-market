"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MailCheck } from "lucide-react";
import OtpInput from "@/components/auth/OtpInput";
import { useRouter, useSearchParams } from "next/navigation";
import { resendVerification, verifyEmail } from "@/services/auth";

export default function VerifyEmailCard() {
  const params = useSearchParams();
  const router = useRouter();
  const email = useMemo(() => (params.get("email") ?? "").trim(), [params]);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    setError(null);
    setInfo(null);
    if (!email) {
      setError("Missing email. Please go back to signup.");
      return;
    }
    if (otp.length < 4) return;

    setLoading(true);
    try {
      await verifyEmail({ email, code: otp });
      setInfo("Email verified. You can sign in now.");
      window.setTimeout(() => router.push(`/auth/login?email=${encodeURIComponent(email)}`), 700);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    if (!email) {
      setError("Missing email. Please go back to signup.");
      return;
    }

    setLoading(true);
    try {
      const data = await resendVerification({ email });
      setInfo(data?.message || "Verification code resent.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Resend failed";
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
      className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
    >
      <div className="grid md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-130 overflow-hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.2),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.22),transparent_40%),linear-gradient(160deg,#ffffff_0%,#f1f5f9_40%,#ecfeff_100%)]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl" />
            <div className="absolute right-10 top-24 h-32 w-32 rounded-full bg-teal-200/40 blur-2xl" />
          </div>
          <div className="relative flex h-full flex-col justify-between p-10 text-slate-900">
            <div>
              <Link
                href="/auth/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="mt-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  Security check
                </div>
                <h2 className="mt-6 text-3xl font-semibold leading-snug">
                  Secure your account with one-time verification.
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  We sent a 4-digit code to confirm this email belongs to you.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <MailCheck className="h-4 w-4" />
                </div>
                Email verification ensures only approved partners can access the workspace.
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
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Verify Email</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
              Enter the code we sent you
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              {email ? (
                <>
                  Sent to <span className="font-semibold text-emerald-700">{email}</span>
                </>
              ) : (
                "Missing email. Please return to signup."
              )}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <OtpInput length={4} value={otp} onChange={setOtp} />
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Didn&apos;t receive an email?{" "}
            <button
              type="button"
              className="font-semibold text-emerald-700 hover:underline"
              disabled={loading}
              onClick={onResend}
            >
              Resend code
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700">
              {error}
            </div>
          )}

          {info && (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-800">
              {info}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full max-w-md">
              <button
                type="button"
                onClick={onVerify}
                disabled={loading || otp.length < 4 || !email}
                className={[
                  "block w-full rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95",
                  loading || otp.length < 4 || !email ? "pointer-events-none opacity-60" : "",
                ].join(" ")}
              >
                {loading ? "Verifying..." : "Verify email"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
