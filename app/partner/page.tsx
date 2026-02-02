"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Boxes,
  ChevronDown,
  ClipboardList,
  LogOut,
  Package,
  PackageCheck,
  Search,
  Truck,
  Users,
} from "lucide-react";
import {
  getPartnerOverview,
  getPartnerProfile,
  getPartnerStore,
  type PartnerOverview,
} from "@/services/partner";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select } from "@/src/components/ui/select";
import { SectionHeader } from "@/src/components/ui/section-header";
import { StatCard, StatCardSkeleton } from "@/src/components/ui/stat-card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";

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
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const authKey = useSyncExternalStore(
    (listener) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    },
    () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("auth_user_id") || localStorage.getItem("auth_token");
    },
    () => null
  );
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["partner-overview", authKey],
    queryFn: getPartnerOverview,
    enabled: Boolean(authKey),
  });
  const isLoadingData = isLoading || isFetching;
  const overview = data ?? DEFAULT_OVERVIEW;
  const activity = overview.activity ?? DEFAULT_OVERVIEW.activity;
  const kpis = overview.kpis ?? DEFAULT_OVERVIEW.kpis;
  const chart = overview.chart ?? DEFAULT_OVERVIEW.chart;
  const topMerchants = overview.topMerchants ?? DEFAULT_OVERVIEW.topMerchants;

  const ordersPath = buildPath(chart.orders);
  const returnsPath = buildPath(chart.returns);

  const { data: profile } = useQuery({
    queryKey: ["partner-profile", authKey],
    queryFn: getPartnerProfile,
    enabled: Boolean(authKey),
  });

  const { data: store } = useQuery({
    queryKey: ["partner-store", authKey],
    queryFn: getPartnerStore,
    enabled: Boolean(authKey),
  });

  const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Partner";
  const rawStoreImage = (store?.bannerImage ?? "").trim();
  const storeImage =
    rawStoreImage && (rawStoreImage.startsWith("/") || /^https?:\/\//i.test(rawStoreImage))
      ? rawStoreImage
      : "/brand/storefront.svg";
  const storeName = store?.name || "Your Store";

  const onLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    queryClient.removeQueries({ queryKey: ["partner-overview"] });
    queryClient.removeQueries({ queryKey: ["partner-profile"] });
    queryClient.removeQueries({ queryKey: ["partner-store"] });
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_role_id");
    window.setTimeout(() => {
      router.push("/");
    }, 400);
  };

  return (
    <div className="relative p-6 space-y-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
      </div>

      {/* Top Header Section */}
      <SectionHeader
        title={`Welcome back, ${displayName}!`}
        description="Here's what's happening with your store today."
        className="border-none pb-0 mb-0"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="w-60 pl-10"
              />
            </div>

            {/* Notification Button */}
            <Button
              variant="ghost"
              size="md"
              className="relative p-2.5"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-surface" />
            </Button>

            {/* Store Switcher */}
            <Link
              href="/partner/profile#store"
              className="flex items-center gap-2 h-10 rounded-md border border-border bg-surface px-3 text-body font-medium text-text transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-surface-2">
                <Image src={storeImage} alt="Store" fill className="object-contain p-1" />
              </div>
              <span className="max-w-24 truncate">{storeName}</span>
              <ChevronDown className="h-4 w-4 text-text-muted" />
            </Link>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="md"
              onClick={onLogout}
              disabled={isLoggingOut}
              leftIcon={isLoggingOut ? undefined : <LogOut className="h-4 w-4" />}
              isLoading={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        }
      />

      {/* Order Activity Section */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-brand">Order activity</CardTitle>
              <CardDescription>Keep an eye on every stage of fulfillment.</CardDescription>
            </div>
            <Button variant="secondary" size="sm">
              View workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Responsive grid: 1 col mobile, 2 tablet, 5 desktop */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {isLoadingData
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <StatCardSkeleton key={`activity-skeleton-${idx}`} />
                ))
              : activity.length === 0
              ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={<Package className="h-6 w-6" />}
                    title="No activity yet"
                    description="Your order activity will appear here once you start receiving orders."
                  />
                </div>
              )
              : activity.map(({ label, value }) => {
                  const Icon = ACTIVITY_ICONS[label as keyof typeof ACTIVITY_ICONS];
                  return (
                    <StatCard
                      key={label}
                      icon={Icon ? <Icon className="h-5 w-5" /> : undefined}
                      value={value}
                      label={label}
                      iconVariant="brand"
                    />
                  );
                })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Chart & KPIs Section */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>Store statistic</CardTitle>
                <CardDescription>Orders and fulfillment trend over the last 10 days.</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {/* Legend */}
                <div className="flex items-center gap-4 text-caption text-text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Orders
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-danger" />
                    Returns
                  </span>
                </div>
                {/* Timeframe Dropdown */}
                <Select defaultValue="10d" className="w-36">
                  <option value="10d">Last 10 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart Area */}
            <div className="rounded-lg bg-surface-2 p-4">
              <div className="flex items-center justify-between text-caption text-text-muted">
                <span>{chart.labels[0]}</span>
                <span>{chart.labels[chart.labels.length - 1]}</span>
              </div>
              <div className="mt-4 h-48 w-full">
                {isLoadingData ? (
                  <Skeleton className="h-full w-full rounded-lg" />
                ) : chart.orders.length === 0 ? (
                  <EmptyState
                    title="No chart data"
                    description="Order trends will show up once there is activity."
                  />
                ) : (
                  <svg viewBox="0 0 460 140" className="h-full w-full">
                    <path d={ordersPath} fill="none" stroke="hsl(var(--success))" strokeWidth="3" />
                    <path d={returnsPath} fill="none" stroke="hsl(var(--danger))" strokeWidth="3" />
                  </svg>
                )}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {isLoadingData
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <StatCardSkeleton key={`kpi-skeleton-${idx}`} />
                  ))
                : kpis.length === 0
                ? (
                  <div className="col-span-full">
                    <EmptyState
                      title="No KPIs available"
                      description="KPI data will appear here once available."
                    />
                  </div>
                )
                : kpis.map((item) => (
                    <StatCard
                      key={item.label}
                      value={item.value}
                      label={item.label}
                      subtext={`${item.delta > 0 ? "+" : ""}${item.delta.toFixed(2)}% from last month`}
                      subtextVariant={item.delta < 0 ? "danger" : "success"}
                      className="text-left"
                    />
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  "Add new product",
                  "Create bulk import",
                  "Review pricing rules",
                  "Invite a merchant",
                ].map((item) => (
                  <Button
                    key={item}
                    variant="secondary"
                    size="md"
                    className="justify-start text-left hover:bg-brand/5 hover:text-brand"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Merchants */}
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle>Top merchants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoadingData
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={`merchant-skeleton-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3"
                      >
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))
                  : topMerchants.length === 0
                  ? (
                    <EmptyState
                      icon={<Users className="h-6 w-6" />}
                      title="No merchants yet"
                      description="Your top merchants will appear here."
                    />
                  )
                  : topMerchants.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-body"
                      >
                        <span className="font-medium text-text">{item.name}</span>
                        <span className="text-text-muted">{item.spend}</span>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
