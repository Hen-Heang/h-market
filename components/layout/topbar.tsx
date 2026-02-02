"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { getPartnerStore } from "@/services/partner";

/* ============================================
   TOPBAR PROPS
   ============================================ */

interface TopbarProps {
  sticky?: boolean;
  className?: string;
}

/* ============================================
   TOPBAR COMPONENT
   ============================================ */

export function Topbar({ sticky = true, className }: TopbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get auth key for queries
  const authKey = typeof window !== "undefined"
    ? localStorage.getItem("auth_user_id") || localStorage.getItem("auth_token")
    : null;

  // Fetch store data
  const { data: store } = useQuery({
    queryKey: ["partner-store", authKey],
    queryFn: getPartnerStore,
    enabled: Boolean(authKey),
  });

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
    <header
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-3",
        sticky && "sticky top-0 z-40",
        className
      )}
    >
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inventory, orders, merchants..."
          leftIcon={<Search className="h-4 w-4" />}
          className="rounded-lg"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="md"
          className="relative p-2.5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-success ring-2 ring-surface" />
        </Button>

        {/* Store Switcher */}
        <Link
          href="/partner/profile#store"
          className={cn(
            "flex items-center gap-2 h-10 rounded-lg border border-border bg-surface px-3",
            "text-body font-medium text-text",
            "transition-colors duration-200",
            "hover:bg-surface-2",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          )}
        >
          <div className="relative h-6 w-6 overflow-hidden rounded-md bg-surface-2">
            <Image src={storeImage} alt="Store" fill className="object-contain p-0.5" />
          </div>
          <span className="max-w-32 truncate hidden sm:inline">{storeName}</span>
          <ChevronDown className="h-4 w-4 text-text-muted" />
        </Link>

        {/* Logout */}
        <Button
          variant="outline"
          size="md"
          onClick={onLogout}
          disabled={isLoggingOut}
          isLoading={isLoggingOut}
          leftIcon={!isLoggingOut ? <LogOut className="h-4 w-4" /> : undefined}
        >
          <span className="hidden sm:inline">
            {isLoggingOut ? "Logging out..." : "Log out"}
          </span>
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
