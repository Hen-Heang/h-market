"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/constants/Marketing";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/brand/logo.svg" alt="Logo" width={44} height={44} />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-800">H</div>
            <div className="text-sm font-semibold text-zinc-800">Market</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-600 transition hover:text-zinc-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/auth"
              className="rounded-full border px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Log In
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/auth/signup"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t bg-white/85 backdrop-blur md:hidden"
          >
            <div className="mx-auto max-w-6xl px-6 py-4">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/auth"
                  className="rounded-lg border px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
