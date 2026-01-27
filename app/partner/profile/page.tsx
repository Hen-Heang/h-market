"use client";

import Image from "next/image";
import { BadgeCheck, Link as LinkIcon, MapPin, Pencil, ShieldCheck, Star } from "lucide-react";

const CATEGORY_TAGS = ["Grocery", "Snacks", "Household", "Beauty", "Pharmacy", "Homeware"];
const HIGHLIGHTS = [
  { label: "Fulfillment score", value: "98.4%" },
  { label: "Average dispatch", value: "4.2 hrs" },
  { label: "Active merchants", value: "128" },
];

export default function PartnerProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Partner profile</h1>
          <p className="text-sm text-slate-500">
            Keep your storefront polished and trusted by merchants.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm"
          >
            Preview profile
          </button>
          <button
            type="button"
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-500/30"
          >
            Save changes
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.16),_transparent_45%),_radial-gradient(circle_at_80%_10%,_rgba(56,189,248,0.16),_transparent_40%),_linear-gradient(120deg,_rgba(15,118,110,0.08),_rgba(255,255,255,0)_50%)]" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-sm">
              <Image src="/brand/logo.svg" alt="Partner logo" fill className="object-contain p-4" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold text-slate-900">Blurz Supply Co.</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  4.9 rating
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  SenSok, Phnom Penh
                </span>
                <span className="inline-flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5" />
                  blurzsupply.co
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                  Fast dispatch
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                  24/7 merchant chat
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                  Export ready
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                  Trust status
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900">Active partner</div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
                Protected
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Update cover assets
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Warehouse profile</h3>
                <p className="text-xs text-slate-500">
                  Tell merchants how you store, ship, and support.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                Visible to merchants
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                Store name
                <input
                  type="text"
                  defaultValue="Blurz Supply Co."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                Address
                <input
                  type="text"
                  defaultValue="SenSok, Street 93, Phnom Penh"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600 sm:col-span-2">
                Short bio
                <textarea
                  rows={4}
                  defaultValue="Specialized in premium grocery and household inventory with same-day dispatch."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-600">Top categories</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORY_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {tag}
                  </span>
                ))}
                <button
                  type="button"
                  className="rounded-full border border-dashed border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-600"
                >
                  + Add category
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Contact and compliance</h3>
                <p className="text-xs text-slate-500">
                  Verified contact details help merchants trust you faster.
                </p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                KYC complete
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                Primary email
                <input
                  type="email"
                  defaultValue="hello@blurzsupply.co"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                Phone number
                <input
                  type="tel"
                  defaultValue="+855 98 555 231"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                Tax ID
                <input
                  type="text"
                  defaultValue="KH-00982131"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                Business hours
                <input
                  type="text"
                  defaultValue="Mon - Sat, 8:00 AM - 6:00 PM"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Brand assets</h3>
            <p className="text-xs text-slate-500">
              Upload logos and storefront visuals for a premium look.
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4 text-center text-xs text-slate-500">
                Drop cover image here or <span className="font-semibold text-emerald-600">browse</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="h-20 rounded-2xl border border-slate-200 bg-[linear-gradient(120deg,_#f8fafc_0%,_#e2e8f0_100%)]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Team access</h3>
            <p className="text-xs text-slate-500">
              Invite teammates and assign roles in one click.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { name: "Sophea R.", role: "Admin", status: "Online" },
                { name: "Dara V.", role: "Ops", status: "Offline" },
                { name: "Mina L.", role: "Support", status: "Online" },
              ].map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{member.name}</div>
                    <div className="text-slate-500">{member.role}</div>
                  </div>
                  <span
                    className={[
                      "rounded-full px-2 py-1 text-[10px] font-semibold",
                      member.status === "Online"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600",
                    ].join(" ")}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
              <button
                type="button"
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700"
              >
                Invite teammate
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Storefront visibility</h3>
            <p className="text-xs text-slate-500">
              Keep your profile trending in partner search.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Boosted listing", detail: "Top 10 for snacks", status: "Active" },
                { label: "Merchants following", detail: "214 followers", status: "Healthy" },
                { label: "Response SLA", detail: "Under 15 minutes", status: "Excellent" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-slate-500">{item.detail}</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
