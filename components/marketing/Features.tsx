"use client";
import { FEATURES } from "@/constants/Marketing";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <h2 className="text-center text-2xl font-semibold text-zinc-900 md:text-3xl">
        Our Best Features
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ title, desc, Icon }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
            whileHover={{ y: -6 }}
            className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 p-3">
                <Icon className="h-6 w-6 text-cyan-600" />
              </div>

              <div>
                <div className="font-semibold text-zinc-900 group-hover:text-cyan-700">
                  {title}
                </div>
                <p className="mt-1 text-sm text-zinc-600">{desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
