"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
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
          className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
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

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <h1 className="text-3xl font-semibold leading-tight text-zinc-900 md:text-5xl">
            H-Market connects quality{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Products
            </span>{" "}
            with trusted{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Partners
            </span>
          </h1>

          <p className="max-w-xl text-sm leading-6 text-zinc-600 md:text-base">
            A platform that connects partners with merchants—helping everyone discover products,
            order faster, and grow together.
          </p>

          <div className="flex gap-3">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/auth/signup"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              Get Started
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#features"
              className="rounded-full border px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-white"
            >
              View Features
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <motion.div
            className="relative aspect-[16/10] w-full"
            animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
            }
          >
            <Image
              src="/marketing/hero.svg"
              alt="H-Market hero"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
