"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import OtpInput from "@/components/auth/OtpInput";
import { useRouter, useSearchParams } from "next/navigation";

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
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; message?: string }
        | null;

      if (!res.ok || !data || ("ok" in data && data.ok === false)) {
        setError((data && "message" in data && data.message) || "Verification failed");
        return;
      }

      router.push("/auth/signup/signup-success");
    } catch {
      setError("Network error. Please try again.");
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
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; message?: string }
        | null;
      if (!res.ok || !data || ("ok" in data && data.ok === false)) {
        setError((data && "message" in data && data.message) || "Resend failed");
        return;
      }
      setInfo("Verification code resent.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-10"
    >
      <Link
        href="/auth/choose-role"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-700 transition hover:bg-cyan-600/15"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="mt-6 text-center">
        <h1 className="text-2xl font-semibold text-cyan-700 md:text-3xl">
          Verify your email address
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Enter the verification code we just sent to{" "}
          <span className="font-semibold text-cyan-700">
            {email || "(missing email)"}
          </span>
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <OtpInput length={4} value={otp} onChange={setOtp} />
      </div>

      <div className="mt-6 text-center text-sm text-zinc-500">
        Didn&apos;t receive an email?{" "}
        <button
          type="button"
          className="font-semibold text-cyan-700 hover:underline"
          disabled={loading}
          onClick={onResend}
        >
          Resend email
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700">
          {error}
        </div>
      )}

      {info && (
        <div className="mt-6 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-center text-xs text-cyan-800">
          {info}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md"
        >
          <button
            type="button"
            onClick={onVerify}
            disabled={loading || otp.length < 4}
            className={[
              "block w-full rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition hover:opacity-95",
              loading || otp.length < 4 ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
