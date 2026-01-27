"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const stagger = reducedMotion ? {} : { staggerChildren: 0.12, delayChildren: 0.05 };
  const fadeUp = reducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      };

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
        <motion.div
          className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-300/20 blur-[120px]"
          animate={reducedMotion ? undefined : { y: [0, 10, 0], scale: [1, 1.06, 1] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          variants={{ hidden: {}, show: { transition: stagger } }}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Merchant-first commerce network
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl leading-tight text-slate-900 md:text-6xl"
          >
            Launch a{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Merchant
            </span>{" "}
            experience that feels premium and is easy to run.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-sm leading-6 text-slate-600 md:text-base"
          >
            Separate, clear experiences for{" "}
            <span className="font-semibold text-slate-900">Merchants</span> and{" "}
            <span className="font-semibold text-slate-900">Partners</span> -- faster onboarding,
            cleaner ordering, and confidence in every decision.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <motion.a
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/auth/signup"
              className="rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25"
            >
              Start as Merchant
            </motion.a>
            <motion.a
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#features"
              className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:border-emerald-300"
            >
              Explore Partner View
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-3 pt-2 text-xs text-slate-500 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">4 min</div>
              <div>merchant setup</div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">99%</div>
              <div>partner verified</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">1 view</div>
              <div>orders + payouts</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: stagger } }}
          initial="hidden"
          animate="show"
        >
          <div className="relative">
            <motion.div
              variants={fadeUp}
              className="rounded-3xl border border-amber-100 bg-white p-5 shadow-lg shadow-amber-500/10"
              animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-amber-600">
                    Merchant Console
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Revenue & Orders
                  </div>
                </div>
                <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  +24% sell-through
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-amber-50">
                  <Image
                    src="/marketing/hero.svg"
                    alt="H-Market merchant view"
                    fill
                    className="object-contain drop-shadow-sm"
                    priority
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Today’s orders", value: "86" },
                    { label: "Payout due", value: "$18.4k" },
                    { label: "Top partner", value: "NorthBay Co." },
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
              variants={fadeUp}
              className="absolute -left-6 -bottom-6 hidden w-[220px] rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-600 shadow-lg shadow-emerald-500/10 md:block"
              animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }
            >
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-600">Partner View</div>
              <div className="mt-2 font-semibold text-slate-900">Verified supply badges</div>
              <div className="mt-1 text-xs text-slate-500">
                Separate partner tools and clean status signals.
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="absolute -right-6 top-6 hidden w-[210px] rounded-2xl border border-amber-100 bg-white p-4 text-sm text-slate-600 shadow-lg shadow-amber-500/10 md:block"
              animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 5.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }
            >
              <div className="text-xs uppercase tracking-[0.3em] text-amber-600">
                Merchant Only
              </div>
              <div className="mt-2 font-semibold text-slate-900">Single-tap reorder</div>
              <div className="mt-1 text-xs text-slate-500">
                Fast actions and priority support for merchants.
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
