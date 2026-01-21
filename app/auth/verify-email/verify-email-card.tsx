"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import OtpInput from "@/components/auth/OtpInput";

export default function VerifyEmailCard() {
  const email = useMemo(() => "you@example.com", []); // TODO: replace with your state/query
  const [otp, setOtp] = useState("");

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
          <span className="font-semibold text-cyan-700">{email}</span>
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
          onClick={() => {
            // TODO: call resend API
          }}
        >
          Resend email
        </button>
      </div>

      <div className="mt-8 flex justify-center">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md"
        >
          <Link
            href="/auth/signup/signup-success"
            aria-disabled={otp.length < 4}
            className={[
              "block rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition hover:opacity-95",
              otp.length < 4 ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
          >
            Verify
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
