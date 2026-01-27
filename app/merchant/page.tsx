"use client";

import Image from "next/image";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  ShoppingBag,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORY_ITEMS = [
  "Toys",
  "Beverage",
  "Glass",
  "Skin care",
  "Snacks",
  "Bedroom",
  "Kitchen",
  "Decoration",
];

const SHOP_CARDS = [
  { name: "Yimeng Ware", tags: "Wholesale, Household", rating: "4.8" },
  { name: "Cheott's", tags: "Grocery, Snacks", rating: "4.9" },
  { name: "John Ware", tags: "Kitchen, Home", rating: "4.6" },
  { name: "Bob Shop", tags: "Beverage, FMCG", rating: "4.7" },
  { name: "Naga Mart", tags: "Pharmacy, Health", rating: "4.5" },
  { name: "Angkor Foods", tags: "Snacks, Imports", rating: "4.8" },
];

export default function MerchantHomePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const onLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_role_id");
    window.setTimeout(() => {
      router.push("/");
    }, 400);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">H Market</div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Merchant
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search suppliers, products, categories"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:border-slate-300"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
                Shopping
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-100">
                  <Image src="/brand/logo.svg" alt="Avatar" fill className="object-contain p-2" />
                </div>
                Blurz Store
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
                    Logging out...
                  </span>
                ) : (
                  "Log out"
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <button type="button" className="font-semibold text-emerald-600">
              Home
            </button>
            <button type="button" className="hover:text-slate-900">
              Orders
            </button>
            <button type="button" className="hover:text-slate-900">
              Favorite
            </button>
            <button type="button" className="hover:text-slate-900">
              Report
            </button>
            <button type="button" className="hover:text-slate-900">
              History
            </button>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative grid gap-8 bg-[linear-gradient(120deg,_#0ea5a8_0%,_#0f766e_45%,_#0b3b3b_100%)] p-8 text-white md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                Featured suppliers
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                Find trusted distributors with verified inventory and fast fulfillment.
              </h1>
              <p className="mt-3 text-sm text-white/80">
                Connect with partners who deliver consistent quality across every category.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900"
                >
                  Browse suppliers
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white"
                >
                  Create sourcing list
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
                <div className="grid gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-2">
                      <Truck className="h-4 w-4" />
                    </div>
                    1,240 shipments delivered this month
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-2">
                      <Users className="h-4 w-4" />
                    </div>
                    830 verified partners available
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-2">
                      <Heart className="h-4 w-4" />
                    </div>
                    98% on-time order rating
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white md:inline-flex"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white md:inline-flex"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Find things you love
              </h2>
              <p className="text-xs text-slate-500">
                Support independent distributors across every category.
              </p>
            </div>
            <button type="button" className="text-xs font-semibold text-emerald-600">
              View all
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            {CATEGORY_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60"
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">New shops</h3>
              <button type="button" className="text-xs font-semibold text-emerald-600">
                View all
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                >
                  <div className="relative h-36 w-full bg-[linear-gradient(130deg,_#f8fafc_0%,_#e2e8f0_100%)]">
                    <div className="absolute bottom-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                      Featured
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-semibold text-slate-900">Yimeng Ware</div>
                    <div className="text-xs text-slate-500">Wholesale, FMCG</div>
                    <button
                      type="button"
                      className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition group-hover:border-emerald-200 group-hover:bg-emerald-50/60"
                    >
                      Visit store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Highest rated</h3>
              <button type="button" className="text-xs font-semibold text-emerald-600">
                View all
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {SHOP_CARDS.slice(0, 3).map((shop) => (
                <div
                  key={shop.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{shop.name}</div>
                    <div className="text-slate-500">{shop.tags}</div>
                  </div>
                  <div className="text-emerald-600">★ {shop.rating}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">All shops</h3>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
            >
              Sort by: Popular
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOP_CARDS.map((shop) => (
              <div
                key={shop.name}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
              >
                <div className="relative h-28 w-full bg-[linear-gradient(140deg,_#e2e8f0_0%,_#f8fafc_100%)]">
                  <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-xs text-slate-600">
                    ★ {shop.rating}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-900">{shop.name}</div>
                  <div className="text-xs text-slate-500">{shop.tags}</div>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
