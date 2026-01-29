"use client";

import Image from "next/image";
import { STEPS } from "@/constants/Marketing";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 pb-16 pt-6 md:pb-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-emerald-500/10">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-600">Workflow</div>
          <h2 className="font-display mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
            From signup to first order in a{" "}
            <span className="font-semibold text-emerald-700">single flow</span>.
          </h2>
          <p className="mt-3 text-sm font-medium text-slate-700 md:text-base">
            Clear steps, role-based access, and shared visibility keep every partner aligned.
          </p>

          <div className="mt-8 space-y-5">
            {STEPS.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{s.title}</div>
                  <p className="mt-1 text-sm font-medium text-slate-700">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-[260px] md:w-[360px]">
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-200/40 via-white to-orange-200/40 blur-2xl" />
          <Image src="/marketing/how.svg" alt="How it works" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
