import { Bell, FileDown, Truck } from "lucide-react";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Contact", href: "#contact" },
];

export const FEATURES = [
  {
    title: "Track Orders",
    desc: "Track orders in real time so you always know what's happening.",
    Icon: Truck,
  },
  {
    title: "Export Reports",
    desc: "Export reports in one click for finance and analytics.",
    Icon: FileDown,
  },
  {
    title: "Product Alerts",
    desc: "Get notified when products are available or updated.",
    Icon: Bell,
  },
];

export const STEPS = [
  { title: "Create Account", desc: "Sign up in seconds and set up your profile." },
  { title: "Choose Role", desc: "Pick Partner or Merchant to get started." },
  { title: "Start Selling", desc: "Manage products, orders, and reporting in one place." },
];
