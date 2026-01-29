"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Store, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

type Role = "PARTNER" | "MERCHANT";

export default function RoleSelectCard() {
  const [role, setRole] = useState<Role>("MERCHANT");

  const roles = useMemo(
    () => [
      {
        key: "PARTNER" as const,
        title: "Partner",
        desc: "I’d like to supply products and grow my distribution network.",
        Icon: Users,
      },
      {
        key: "MERCHANT" as const,
        title: "Merchant",
        desc: "I’d like to find trusted partners and stock great products.",
        Icon: Store,
      },
    ],
    []
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-10"
    >
      <Link
        href="/auth/signup"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-700 transition hover:bg-cyan-600/15"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </Link>

      <div className="mt-3 text-center">
        <h1 className="text-2xl font-semibold text-cyan-700 md:text-3xl">
          Choose your role
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Select Partner or Merchant to continue.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl space-y-4">
        {roles.map(({ key, title, desc, Icon }) => {
          const active = role === key;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => setRole(key)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "relative flex w-full items-center gap-4 rounded-xl border p-5 text-left transition",
                active
                  ? "border-cyan-400 bg-cyan-50/60 ring-4 ring-cyan-200/40"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  active
                    ? "bg-linear-to-r from-cyan-600/15 to-blue-600/15 text-cyan-700"
                    : "bg-zinc-100 text-zinc-500",
                ].join(" ")}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-zinc-800">{title}</div>
                <div className="mt-1 text-sm text-zinc-500">{desc}</div>
              </div>

              {active && <CheckCircle2 className="h-6 w-6 text-cyan-600" />}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-xl"
        >
          <Link
            href={`/auth/signup?role=${role}`}
            className="block rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition hover:opacity-95"
          >
            Continue
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
