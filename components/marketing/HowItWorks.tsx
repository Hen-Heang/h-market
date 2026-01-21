"use client";

import Image from "next/image";
import { STEPS } from "@/constants/Marketing";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-[260px] md:w-[360px]">
          <Image
            src="/marketing/how.svg"
            alt="How it works"
            fill
            className="object-contain"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
            How Does This Work?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 md:text-base">
            Simple onboarding, role-based access, and clean workflows.
          </p>

          <div className="mt-8 space-y-6">
            {STEPS.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex gap-4"
              >
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">{s.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
