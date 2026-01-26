"use client";

import { Bell, ChevronDown, ClipboardList, PackageCheck, Search, Truck, Users, Boxes } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPartnerOverview, type PartnerOverview } from "@/services/partner";
import { useRouter } from "next/navigation";

const DEFAULT_OVERVIEW: PartnerOverview = {
  activity: [
    { label: "New orders", value: 17 },
    { label: "Preparing", value: 5 },
    { label: "Dispatch", value: 10 },
    { label: "Confirming", value: 6 },
    { label: "Completed", value: 70 },
  ],
  kpis: [
    { label: "Total product import", value: 213, delta: 34.42 },
    { label: "Total orders", value: 54, delta: -14.12 },
    { label: "Products sold", value: 141, delta: 24.42 },
  ],
  chart: {
    labels: ["Apr 17", "Apr 18", "Apr 19", "Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26"],
    orders: [12, 18, 21, 30, 42, 38, 44, 52, 55, 68],
    returns: [34, 32, 31, 29, 26, 18, 22, 21, 19, 17],
  },
  topMerchants: [
    { name: "Angkor Mart", spend: "$12.4k" },
    { name: "Naga Supply", spend: "$9.7k" },
    { name: "Phnom Trade", spend: "$7.1k" },
  ],
};

const ACTIVITY_ICONS = {
  "New orders": ClipboardList,
  Preparing: PackageCheck,
  Dispatch: Truck,
  Confirming: Users,
  Completed: Boxes,
};

function buildPath(values: number[], height = 140, width = 460) {
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values
    .map((value, index) => {
      const x = Math.round(index * step);
      const y = Math.round(height - (value / max) * (height - 20) + 10);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}

export default function PartnerHomePage() {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["partner-overview"],
    queryFn: getPartnerOverview,
  });
  const overview = data ?? DEFAULT_OVERVIEW;
  const activity = overview.activity ?? DEFAULT_OVERVIEW.activity;
  const kpis = overview.kpis ?? DEFAULT_OVERVIEW.kpis;
  const chart = overview.chart ?? DEFAULT_OVERVIEW.chart;
  const topMerchants = overview.topMerchants ?? DEFAULT_OVERVIEW.topMerchants;

  const ordersPath = buildPath(chart.orders);
  const returnsPath = buildPath(chart.returns);
  const onLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_role_id");
    router.push("/");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back, Blurz
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search inventory..."
              className="w-56 rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-600 shadow-sm outline-none focus:border-emerald-400"
            />
          </div>
          <button
            type="button"
            className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:border-slate-300"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500" />
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
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-emerald-700">Order activity</h2>
            <p className="text-xs text-slate-500">
              Keep an eye on every stage of fulfillment.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
          >
            View workflow
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {activity.map(({ label, value }) => {
            const Icon = ACTIVITY_ICONS[label as keyof typeof ACTIVITY_ICONS];
            return (
              <div
                key={label}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  {Icon ? <Icon className="h-5 w-5" /> : null}
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Store statistic</h2>
              <p className="text-xs text-slate-500">
                Orders and fulfillment trend over the last 10 days.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Orders
              <span className="ml-3 h-2 w-2 rounded-full bg-rose-400" />
              Returns
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{chart.labels[0]}</span>
              <span>{chart.labels[chart.labels.length - 1]}</span>
            </div>
            <div className="mt-4 h-48 w-full">
              <svg viewBox="0 0 460 140" className="h-full w-full">
                <path d={ordersPath} fill="none" stroke="#10b981" strokeWidth="3" />
                <path d={returnsPath} fill="none" stroke="#fb7185" strokeWidth="3" />
              </svg>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {kpis.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white p-4"
              >
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="mt-2 text-xl font-semibold text-slate-900">
                  {item.value}
                </div>
                <div
                  className={[
                    "mt-1 text-xs font-semibold",
                    item.delta < 0 ? "text-rose-500" : "text-emerald-600",
                  ].join(" ")}
                >
                  {item.delta > 0 ? "+" : ""}
                  {item.delta.toFixed(2)}% from last month
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Quick actions</div>
            <div className="mt-4 grid gap-3">
              {[
                "Add new product",
                "Create bulk import",
                "Review pricing rules",
                "Invite a merchant",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Top merchants</div>
            <div className="mt-4 space-y-3">
              {topMerchants.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.spend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
