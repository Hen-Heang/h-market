"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Globe2,
  Home,
  LineChart,
  PlugZap,
  Store,
  Truck,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/partner", Icon: Home },
  { label: "Products", href: "/partner/products", Icon: Boxes },
  { label: "Category", href: "/partner/categories", Icon: ClipboardList },
  { label: "Orders", href: "/partner/orders", Icon: Truck },
  { label: "Report", href: "/partner/reports", Icon: BarChart3 },
  { label: "Order history", href: "/partner/order-history", Icon: LineChart },
  { label: "Profile", href: "/partner/profile", Icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          <Store className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">H Market</div>
          <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-700">
            Partner Ops
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
        <span className="inline-flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-emerald-700" />
          Store online
        </span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          Live
        </span>
      </div>

      <nav className="mt-8 space-y-2">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={label}
              href={href}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 space-y-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-600">Smart tip</div>
          <p className="mt-2 text-xs text-slate-600">
            Keep inventory synced to avoid rush backorders.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
          >
            View insights
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
            Integrations
            <PlugZap className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Sync catalogs and orders with your ERP to keep owners and partners aligned.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>Last sync</span>
            <span className="text-emerald-700">12 min ago</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
