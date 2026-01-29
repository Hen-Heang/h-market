"use client";
import { FEATURES } from "@/constants/Marketing";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          Capabilities
        </div>
        <h2 className="font-display mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
          Built for the way{" "}
          <span className="font-semibold text-emerald-700">modern teams</span> actually buy.
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-700 md:text-base">
          One workspace for discovery, ordering, and post-order insight so your team never loses
          momentum.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ title, desc, Icon }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-linear-to-br from-white via-white to-emerald-50/70 p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400/40 via-emerald-400/70 to-cyan-400/40" />
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-3">
                <Icon className="h-6 w-6 text-emerald-700" />
              </div>


              <div>
                <div className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
                  {title}
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">{desc}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-600">
              <span>Real-time insights</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                Verified
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
