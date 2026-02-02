"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Home,
  LineChart,
  Store,
  Truck,
  User,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

/* ============================================
   NAVIGATION ITEMS
   ============================================ */

const NAV_ITEMS = [
  { label: "Home", href: "/partner", Icon: Home },
  { label: "Products", href: "/partner/products", Icon: Boxes },
  { label: "Category", href: "/partner/categories", Icon: ClipboardList },
  { label: "Orders", href: "/partner/orders", Icon: Truck },
  { label: "Report", href: "/partner/reports", Icon: BarChart3 },
  { label: "Order history", href: "/partner/order-history", Icon: LineChart },
  { label: "Profile", href: "/partner/profile", Icon: User },
];

/* ============================================
   SIDEBAR NAV ITEM
   ============================================ */

interface NavItemProps {
  label: string;
  href: string;
  Icon: React.ElementType;
  isActive: boolean;
}

function NavItem({ label, href, Icon, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 h-11",
        "text-body font-medium transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        isActive
          ? "bg-brand/10 text-brand"
          : "text-text-muted hover:bg-surface-2 hover:text-text"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
      )}
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          isActive ? "bg-brand/15 text-brand" : "bg-surface-2 text-text-muted group-hover:text-text"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

/* ============================================
   SIDEBAR COMPONENT
   ============================================ */

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen flex-col border-r border-border bg-surface">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-brand-foreground">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-body font-semibold text-text">H Market</h1>
          <p className="text-caption uppercase tracking-widest text-text-muted">Partner</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          // Check if active: exact match for home, startsWith for others
          const isActive = href === "/partner"
            ? pathname === href
            : pathname.startsWith(href);
          
          return (
            <NavItem
              key={label}
              label={label}
              href={href}
              Icon={Icon}
              isActive={isActive}
            />
          );
        })}
      </nav>

      {/* Smart Tip Card */}
      <div className="p-4">
        <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
          <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-brand">
            <Lightbulb className="h-4 w-4" />
            Smart tip
          </div>
          <p className="mt-2 text-caption text-text-muted">
            Keep inventory synced to avoid rush backorders.
          </p>
          <Button variant="primary" size="sm" className="mt-3 w-full">
            View insights
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
