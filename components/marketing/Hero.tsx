"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
          animate={
            reducedMotion
              ? undefined
              : { x: [0, 18, 0], y: [0, 12, 0], scale: [1, 1.04, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
        <motion.div
          className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl"
          animate={
            reducedMotion
              ? undefined
              : { x: [0, -14, 0], y: [0, -10, 0], scale: [1, 1.05, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Next-gen partner marketplace
          </div>

          <h1 className="font-display text-4xl leading-tight text-slate-900 md:text-6xl">
            Build a{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-orange-500 bg-clip-text text-transparent">
              Trusted
            </span>{" "}
            supply network in weeks, not quarters.
          </h1>

          <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
            H-Market connects partners with merchants -- unify{" "}
            <span className="font-semibold text-slate-900">onboarding</span>,{" "}
            <span className="font-semibold text-slate-900">ordering</span>, and{" "}
            <span className="font-semibold text-slate-900">insights</span> so teams move faster and
            sell smarter.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/auth/signup"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20"
            >
              Get Started
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#features"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300"
            >
              View Features
            </motion.a>
          </div>

          <div className="grid gap-3 pt-2 text-xs text-slate-500 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">2x faster</div>
              <div>partner onboarding</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Live</div>
              <div>inventory signals</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Unified</div>
              <div>orders + reporting</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="relative">
            <motion.div
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg shadow-emerald-500/10"
              animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                    Live Dashboard
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Partner Pulse
                  </div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  98% verified
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-emerald-50">
                  <Image
                    src="/marketing/hero.svg"
                    alt="H-Market hero"
                    fill
                    className="object-contain drop-shadow-sm"
                    priority
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Active partners", value: "1,240" },
                    { label: "Avg order time", value: "48 mins" },
                    { label: "New products", value: "320" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="text-xs text-slate-500">{item.label}</div>
                      <div className="text-base font-semibold text-slate-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-6 -bottom-6 hidden w-[220px] rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-lg shadow-orange-500/10 md:block"
              animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }
            >
              <div className="text-xs uppercase tracking-[0.3em] text-orange-600">
                Trending
              </div>
              <div className="mt-2 font-semibold text-slate-900">Ready-to-ship catalog</div>
              <div className="mt-1 text-xs text-slate-500">
                Curated categories with verified availability.
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
