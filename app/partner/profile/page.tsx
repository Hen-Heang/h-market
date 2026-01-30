"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Pencil,
  Check,
  X,
  Phone,
  ShieldCheck,
  Star,
  Store,
  UserRound,
  Users,
  MapPinned,
  FileText,
  Eye,
  ListPlus,
  Tags,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";
import {
  createPartnerProfile,
  createPartnerStore,
  getPartnerProfile,
  getPartnerStore,
  updatePartnerProfile,
  updatePartnerStore,
} from "@/services/partner";
import type { PartnerProfilePayload } from "@/types/partner";
import type { PartnerStorePayload } from "@/types/store";

const CATEGORY_TAGS = ["Grocery", "Snacks", "Household", "Beauty", "Pharmacy", "Homeware"];
const HIGHLIGHTS = [
  { label: "Fulfillment score", value: "98.4%" },
  { label: "Average dispatch", value: "4.2 hrs" },
  { label: "Active merchants", value: "128" },
];

const EMPTY_PROFILE: PartnerProfilePayload = {
  firstName: "",
  lastName: "",
  gender: "",
  profileImage: "",
};

const EMPTY_STORE: PartnerStorePayload = {
  name: "",
  description: "",
  address: "",
  bannerImage: "",
  primaryPhone: "",
  additionalPhone: [""],
  isPublish: true,
};

export default function PartnerProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["partner-profile"],
    queryFn: getPartnerProfile,
  });
  const { data: storeData, isLoading: isStoreLoading, isFetching: isStoreFetching } = useQuery({
    queryKey: ["partner-store"],
    queryFn: getPartnerStore,
  });
  const [form, setForm] = useState<PartnerProfilePayload | null>(null);
  const [storeForm, setStoreForm] = useState<PartnerStorePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const isLoadingProfile = isLoading || isFetching;
  const isLoadingStore = isStoreLoading || isStoreFetching;
  const hasProfile = Boolean(data);
  const hasStore = Boolean(storeData);

  const profileValues: PartnerProfilePayload = form ?? {
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    gender: data?.gender ? data.gender.toLowerCase() : "",
    profileImage: data?.profileImage ?? "",
  };

  const storeValues: PartnerStorePayload = storeForm ?? {
    name: storeData?.name ?? "",
    description: storeData?.description ?? "",
    address: storeData?.address ?? "",
    bannerImage: storeData?.bannerImage ?? "",
    primaryPhone: storeData?.primaryPhone ?? "",
    additionalPhone: storeData?.additionalPhone?.length ? storeData.additionalPhone : [""],
    isPublish: storeData?.isPublish ?? true,
  };

  const profileMutation = useMutation({
    mutationFn: async (payload: PartnerProfilePayload) => {
      if (hasProfile) return updatePartnerProfile(payload);
      return createPartnerProfile(payload);
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["partner-profile"], next);
      setForm(null);
      setIsEditingProfile(false);
      toast.success(hasProfile ? "Profile updated." : "Profile created.");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      setError(message);
      toast.error(message);
    },
  });

  const storeMutation = useMutation({
    mutationFn: async (payload: PartnerStorePayload) => {
      if (hasStore) return updatePartnerStore(payload);
      return createPartnerStore(payload);
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["partner-store"], next);
      setStoreForm(null);
      setIsEditingStore(false);
      toast.success(hasStore ? "Store updated." : "Store created.");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to save store";
      setStoreError(message);
      toast.error(message);
    },
  });

  const displayName = hasProfile
    ? `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim()
    : "Partner profile";

  const onEditProfile = () => {
    setError(null);
    setIsEditingProfile(true);
    setForm(profileValues);
  };

  const onCancelProfile = () => {
    setError(null);
    setIsEditingProfile(false);
    setForm(null);
  };

  const onSubmit = () => {
    if (!isEditingProfile) {
      onEditProfile();
      return;
    }
    setError(null);
    const currentForm = form ?? profileValues;
    if (!currentForm.firstName.trim() || !currentForm.lastName.trim() || !currentForm.gender.trim()) {
      setError("First name, last name, and gender are required.");
      toast.info("Please complete required fields.");
      return;
    }
    profileMutation.mutate({
      firstName: currentForm.firstName.trim(),
      lastName: currentForm.lastName.trim(),
      gender: currentForm.gender.trim(),
      profileImage: currentForm.profileImage?.trim() ?? "",
    });
  };

  const onSubmitStore = () => {
    if (!isEditingStore) {
      setStoreError(null);
      setIsEditingStore(true);
      setStoreForm(storeValues);
      return;
    }
    setStoreError(null);
    const currentStore = storeForm ?? storeValues;
    if (!currentStore.name.trim() || !currentStore.description.trim() || !currentStore.address.trim()) {
      setStoreError("Store name, description, and address are required.");
      toast.info("Please complete store details.");
      return;
    }
    if (!currentStore.primaryPhone.trim()) {
      setStoreError("Primary phone is required.");
      toast.info("Please add a primary phone.");
      return;
    }
    if (!currentStore.bannerImage.trim()) {
      setStoreError("Banner image URL is required.");
      toast.info("Please add a banner image URL.");
      return;
    }

    storeMutation.mutate({
      name: currentStore.name.trim(),
      description: currentStore.description.trim(),
      address: currentStore.address.trim(),
      bannerImage: currentStore.bannerImage.trim(),
      primaryPhone: currentStore.primaryPhone.trim(),
      additionalPhone: currentStore.additionalPhone
        .map((phone) => phone.trim())
        .filter(Boolean),
      isPublish: currentStore.isPublish ?? true,
    });
  };

  const onCancelStore = () => {
    setStoreError(null);
    setIsEditingStore(false);
    setStoreForm(null);
  };

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute left-1/2 top-80 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-200/30 blur-[100px]" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Partner profile</h1>
          <p className="text-sm font-medium text-slate-600">
            Keep your storefront polished and trusted by merchants.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:border-slate-300"
          >
            Preview profile
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.16),_transparent_45%),_radial-gradient(circle_at_80%_10%,_rgba(56,189,248,0.16),_transparent_40%),_linear-gradient(120deg,_rgba(15,118,110,0.08),_rgba(255,255,255,0)_50%)]" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-sm">
              <Image src="/brand/logo.svg" alt="Partner logo" fill className="object-contain p-4" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {isLoadingProfile ? "Loading..." : displayName || "Partner profile"}
                </h2>
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
          <div id="store" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Partner info</h3>
                    <p className="text-xs text-slate-500">Manage the personal details shown to merchants.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  {hasProfile ? "Profile active" : "Profile pending"}
                </span>
                {isEditingProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={onCancelProfile}
                      disabled={profileMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={profileMutation.isPending || isLoadingProfile}
                      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {profileMutation.isPending ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onEditProfile}
                    disabled={isLoadingProfile}
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-emerald-600" />
                  First name
                </span>
                {isLoadingProfile ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="text"
                    value={profileValues.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...(prev ?? profileValues), firstName: e.target.value }))
                    }
                    disabled={!isEditingProfile}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-emerald-600" />
                  Last name
                </span>
                {isLoadingProfile ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="text"
                    value={profileValues.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...(prev ?? profileValues), lastName: e.target.value }))
                    }
                    disabled={!isEditingProfile}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Gender
                </span>
                {isLoadingProfile ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <select
                    value={profileValues.gender}
                    onChange={(e) =>
                      setForm((prev) => ({ ...(prev ?? profileValues), gender: e.target.value }))
                    }
                    disabled={!isEditingProfile}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-600" />
                  Profile image URL
                </span>
                {isLoadingProfile ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="url"
                    value={profileValues.profileImage ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...(prev ?? profileValues), profileImage: e.target.value }))
                    }
                    disabled={!isEditingProfile}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Warehouse profile</h3>
                    <p className="text-xs text-slate-500">
                      Tell merchants how you store, ship, and support.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  {storeValues.isPublish ? "Visible to merchants" : "Hidden"}
                </span>
                {isEditingStore ? (
                  <>
                    <button
                      type="button"
                      onClick={onCancelStore}
                      disabled={storeMutation.isPending}
                      className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onSubmitStore}
                      disabled={storeMutation.isPending || isLoadingStore}
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {storeMutation.isPending ? "Saving..." : "Save store"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onSubmitStore}
                    disabled={isLoadingStore}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit store
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Store className="h-4 w-4 text-emerald-600" />
                  Store name
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="text"
                    value={storeValues.name}
                    onChange={(e) =>
                      setStoreForm((prev) => ({ ...(prev ?? storeValues), name: e.target.value }))
                    }
                    disabled={!isEditingStore}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-emerald-600" />
                  Address
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="text"
                    value={storeValues.address}
                    onChange={(e) =>
                      setStoreForm((prev) => ({ ...(prev ?? storeValues), address: e.target.value }))
                    }
                    disabled={!isEditingStore}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600 sm:col-span-2">
                <span className="inline-flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Short bio
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-24 w-full rounded-2xl" />
                ) : (
                  <textarea
                    rows={4}
                    value={storeValues.description}
                    onChange={(e) =>
                      setStoreForm((prev) => ({ ...(prev ?? storeValues), description: e.target.value }))
                    }
                    disabled={!isEditingStore}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  Primary phone
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="text"
                    value={storeValues.primaryPhone}
                    onChange={(e) =>
                      setStoreForm((prev) => ({ ...(prev ?? storeValues), primaryPhone: e.target.value }))
                    }
                    disabled={!isEditingStore}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-600" />
                  Banner image URL
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <input
                    type="url"
                    value={storeValues.bannerImage}
                    onChange={(e) =>
                      setStoreForm((prev) => ({ ...(prev ?? storeValues), bannerImage: e.target.value }))
                    }
                    disabled={!isEditingStore}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  />
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600 sm:col-span-2">
                <span className="inline-flex items-center gap-2">
                  <ListPlus className="h-4 w-4 text-emerald-600" />
                  Additional phone numbers
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <div className="space-y-2">
                    {storeValues.additionalPhone.map((phone, idx) => (
                      <input
                        key={`additional-phone-${idx}`}
                        type="text"
                        value={phone}
                        onChange={(e) =>
                          setStoreForm((prev) => {
                            const base = prev ?? storeValues;
                            const next = [...base.additionalPhone];
                            next[idx] = e.target.value;
                            return { ...base, additionalPhone: next };
                          })
                        }
                        disabled={!isEditingStore}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setStoreForm((prev) => {
                          const base = prev ?? storeValues;
                          return { ...base, additionalPhone: [...base.additionalPhone, ""] };
                        })
                      }
                      disabled={!isEditingStore}
                      className="inline-flex items-center gap-2 rounded-full border border-dashed border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-600"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Add phone
                    </button>
                  </div>
                )}
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-600" />
                  Publish status
                </span>
                {isLoadingStore ? (
                  <Skeleton className="h-10 w-full rounded-2xl" />
                ) : (
                  <select
                    value={storeValues.isPublish ? "published" : "hidden"}
                    onChange={(e) =>
                      setStoreForm((prev) => ({
                        ...(prev ?? storeValues),
                        isPublish: e.target.value === "published",
                      }))
                    }
                    disabled={!isEditingStore}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400"
                  >
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                  </select>
                )}
              </label>
            </div>

            {storeError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {storeError}
              </div>
            )}

            <div className="mt-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Tags className="h-4 w-4 text-emerald-600" />
                Top categories
              </div>
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
                  className="inline-flex items-center gap-2 rounded-full border border-dashed border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-600"
                >
                  <Tags className="h-3.5 w-3.5" />
                  Add category
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
