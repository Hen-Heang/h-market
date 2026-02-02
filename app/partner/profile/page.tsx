"use client";

import {
  Check,
  Eye,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useSyncExternalStore, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Select } from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { SectionHeader } from "@/src/components/ui/section-header";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Dropzone, ImagePreviewCard } from "@/src/components/ui/dropzone";

import {
  createPartnerProfile,
  createPartnerStore,
  deletePartnerStore,
  getPartnerProfile,
  getPartnerStore,
  updatePartnerProfile,
  updatePartnerStore,
} from "@/services/partner";
import type { PartnerProfilePayload } from "@/types/partner";
import type { PartnerStorePayload } from "@/types/store";

const HIGHLIGHTS = [
  { label: "Fulfillment score", value: "98.4%" },
  { label: "Average dispatch", value: "4.2 hrs" },
  { label: "Active merchants", value: "128" },
];

const TEAM_MEMBERS = [
  { name: "Sophea R.", role: "Admin", status: "online" as const, initials: "SR" },
  { name: "Dara V.", role: "Operations", status: "offline" as const, initials: "DV" },
  { name: "Mina L.", role: "Support", status: "online" as const, initials: "ML" },
];

const VISIBILITY_ITEMS = [
  { label: "Boosted listing", detail: "Top 10 for snacks", status: "Active" },
  { label: "Merchants following", detail: "214 followers", status: "Healthy" },
  { label: "Response SLA", detail: "Under 15 minutes", status: "Excellent" },
];


export default function PartnerProfilePage() {
  const queryClient = useQueryClient();
  const autoCreateProfileRef = useRef(false);
  const autoCreateStoreRef = useRef(false);
  const isMockMode = !process.env.NEXT_PUBLIC_API_BASE_URL;
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
    queryKey: ["partner-profile", authKey],
    queryFn: getPartnerProfile,
    enabled: Boolean(authKey),
  });
  const { data: storeData, isLoading: isStoreLoading, isFetching: isStoreFetching } = useQuery({
    queryKey: ["partner-store", authKey],
    queryFn: getPartnerStore,
    enabled: Boolean(authKey),
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
  const isProfileEditable = isEditingProfile || !hasProfile;
  const isStoreEditable = isEditingStore || !hasStore;

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
    bannerImage: storeData?.bannerImage ?? "/brand/storefront.svg",
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

  useEffect(() => {
    if (!isMockMode) return;
    if (!authKey || isLoadingProfile || profileMutation.isPending) return;
    if (hasProfile || autoCreateProfileRef.current) return;
    autoCreateProfileRef.current = true;
    profileMutation.mutate({
      firstName: "Partner",
      lastName: "User",
      gender: "other",
      profileImage: "",
    });
  }, [authKey, hasProfile, isLoadingProfile, profileMutation]);

  useEffect(() => {
    if (!isMockMode) return;
    if (!authKey || isLoadingStore || storeMutation.isPending) return;
    if (hasStore || autoCreateStoreRef.current) return;
    autoCreateStoreRef.current = true;
  }, [authKey, hasStore, isLoadingStore, storeMutation]);
  const storeDeleteMutation = useMutation({
    mutationFn: deletePartnerStore,
    onSuccess: () => {
      queryClient.setQueryData(["partner-store", authKey], null);
      setStoreForm(null);
      setIsEditingStore(false);
      toast.success("Store deleted.");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to delete store";
      setStoreError(message);
      toast.error(message);
    },
  });

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
    if (!isEditingProfile && hasProfile) {
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
    if (!isEditingStore && hasStore) {
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
    <div className="relative p-6 space-y-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <SectionHeader
        title="Profile & compliance"
        description="Keep your enterprise profile trusted, discoverable, and consistent."
        className="border-none pb-0 mb-0"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="md">
              Preview profile
            </Button>
            <Button variant="primary" size="md" onClick={onSubmit}>
              Save changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Card id="store" className="scroll-mt-24">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Partner info</CardTitle>
                  <CardDescription>Manage the personal details shown to merchants.</CardDescription>
                </div>
                <Badge variant={hasProfile ? "success" : "warning"}>
                  {hasProfile ? "Profile active" : "Profile pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {isLoadingProfile ? (
                  <>
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">First name</label>
                      <Input
                        value={profileValues.firstName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...(prev ?? profileValues),
                            firstName: e.target.value,
                          }))
                        }
                        disabled={!isProfileEditable}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Last name</label>
                      <Input
                        value={profileValues.lastName}
                        onChange={(e) =>
                          setForm((prev) => ({ ...(prev ?? profileValues), lastName: e.target.value }))
                        }
                        disabled={!isProfileEditable}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Gender</label>
                      <Select
                        value={profileValues.gender}
                        onChange={(e) =>
                          setForm((prev) => ({ ...(prev ?? profileValues), gender: e.target.value }))
                        }
                        disabled={!isProfileEditable}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Profile image URL</label>
                      <Input
                        type="url"
                        value={profileValues.profileImage ?? ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...(prev ?? profileValues),
                            profileImage: e.target.value,
                          }))
                        }
                        disabled={!isProfileEditable}
                      />
                      <p className="text-caption text-text-muted">
                        Enter a URL for your profile image.
                      </p>
                    </div>
                  </>
                )}
              </div>
              {error && (
                <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-caption text-danger">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              {isEditingProfile || !hasProfile ? (
                <>
                  {hasProfile && (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={onCancelProfile}
                      disabled={profileMutation.isPending}
                      leftIcon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onSubmit}
                    disabled={profileMutation.isPending || isLoadingProfile}
                    isLoading={profileMutation.isPending}
                    leftIcon={!profileMutation.isPending ? <Check className="h-4 w-4" /> : undefined}
                  >
                    {hasProfile ? "Save changes" : "Create profile"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onEditProfile}
                  disabled={isLoadingProfile}
                  leftIcon={<Pencil className="h-4 w-4" />}
                >
                  Edit profile
                </Button>
              )}
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Warehouse profile</CardTitle>
                  <CardDescription>Tell merchants how you store, ship, and support.</CardDescription>
                </div>
                <Badge variant={storeValues.isPublish ? "success" : "neutral"}>
                  <Eye className="mr-1 h-3 w-3" />
                  {storeValues.isPublish ? "Visible to merchants" : "Hidden"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {isLoadingStore ? (
                  <>
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-28 sm:col-span-2" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Store name</label>
                      <Input
                        value={storeValues.name}
                        onChange={(e) =>
                          setStoreForm((prev) => ({ ...(prev ?? storeValues), name: e.target.value }))
                        }
                        disabled={!isStoreEditable}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Address</label>
                      <Input
                        value={storeValues.address}
                        onChange={(e) =>
                          setStoreForm((prev) => ({ ...(prev ?? storeValues), address: e.target.value }))
                        }
                        disabled={!isStoreEditable}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-caption font-medium text-text">Short bio</label>
                      <Textarea
                        value={storeValues.description}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...(prev ?? storeValues),
                            description: e.target.value,
                          }))
                        }
                        disabled={!isStoreEditable}
                        rows={4}
                      />
                      <p className="text-caption text-text-muted">
                        Describe your warehouse and services to merchants.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Primary phone</label>
                      <Input
                        value={storeValues.primaryPhone}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...(prev ?? storeValues),
                            primaryPhone: e.target.value,
                          }))
                        }
                        disabled={!isStoreEditable}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Banner image URL</label>
                      <Input
                        type="url"
                        value={storeValues.bannerImage}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...(prev ?? storeValues),
                            bannerImage: e.target.value,
                          }))
                        }
                        disabled={!isStoreEditable}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-caption font-medium text-text mb-1.5 block">
                        Additional phone numbers
                      </label>
                      <div className="space-y-2">
                        {storeValues.additionalPhone.map((phone, idx) => (
                          <Input
                            key={`additional-phone-${idx}`}
                            value={phone}
                            onChange={(e) =>
                              setStoreForm((prev) => {
                                const base = prev ?? storeValues;
                                const next = [...base.additionalPhone];
                                next[idx] = e.target.value;
                                return { ...base, additionalPhone: next };
                              })
                            }
                            disabled={!isStoreEditable}
                          />
                        ))}
                        {isStoreEditable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setStoreForm((prev) => {
                                const base = prev ?? storeValues;
                                return { ...base, additionalPhone: [...base.additionalPhone, ""] };
                              })
                            }
                            leftIcon={<Plus className="h-3.5 w-3.5" />}
                          >
                            Add phone
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-caption font-medium text-text">Publish status</label>
                      <Select
                        value={storeValues.isPublish ? "published" : "hidden"}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...(prev ?? storeValues),
                            isPublish: e.target.value === "published",
                          }))
                        }
                        disabled={!isStoreEditable}
                      >
                        <option value="published">Published</option>
                        <option value="hidden">Hidden</option>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {storeError && (
                <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-caption text-danger">
                  {storeError}
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-between">
              <div>
                {hasStore && !isEditingStore && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setStoreError(null);
                      if (storeDeleteMutation.isPending) return;
                      if (window.confirm("Delete this store? This cannot be undone.")) {
                        storeDeleteMutation.mutate();
                      }
                    }}
                    disabled={storeDeleteMutation.isPending}
                    isLoading={storeDeleteMutation.isPending}
                    leftIcon={!storeDeleteMutation.isPending ? <Trash2 className="h-4 w-4" /> : undefined}
                  >
                    Delete store
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                {isEditingStore || !hasStore ? (
                  <>
                    {hasStore && (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={onCancelStore}
                        disabled={storeMutation.isPending || storeDeleteMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="md"
                      onClick={onSubmitStore}
                      disabled={storeMutation.isPending || storeDeleteMutation.isPending || isLoadingStore}
                      isLoading={storeMutation.isPending}
                    >
                      {hasStore ? "Save store" : "Create store"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onSubmitStore}
                    disabled={isLoadingStore || storeDeleteMutation.isPending}
                    leftIcon={<Pencil className="h-4 w-4" />}
                  >
                    Edit store
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand assets</CardTitle>
              <CardDescription>Logos and storefront imagery for a premium appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dropzone
                label="Drop cover image here or click to browse"
                hint="PNG or JPG up to 5MB. Recommended: 1200x400px."
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <ImagePreviewCard placeholder />
                <ImagePreviewCard placeholder />
                <ImagePreviewCard placeholder />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="secondary" size="sm">
                Manage assets
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Contact and compliance</CardTitle>
                  <CardDescription>Verified contact details help merchants trust you faster.</CardDescription>
                </div>
                <Badge variant="success">KYC complete</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-caption font-medium text-text">Primary email</label>
                  <Input type="email" defaultValue="hello@blurzsupply.co" />
                  <p className="text-caption text-text-muted">
                    This email will be visible to merchants.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-caption font-medium text-text">Phone number</label>
                  <Input type="tel" defaultValue="+855 98 555 231" />
                </div>
                <div className="space-y-2">
                  <label className="text-caption font-medium text-text">Tax ID</label>
                  <Input defaultValue="KH-00982131" />
                  <p className="text-caption text-text-muted">Required for invoicing.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-caption font-medium text-text">Business hours</label>
                  <Input defaultValue="Mon - Sat, 8:00 AM - 6:00 PM" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="primary" size="md">
                Update contact info
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Trust status</CardTitle>
              <CardDescription>Compliance and performance signals for merchants.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption uppercase tracking-wider text-brand font-semibold">Status</p>
                  <p className="mt-1 text-body font-semibold text-text">Active partner</p>
                </div>
                <Badge variant="success">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Protected
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {HIGHLIGHTS.map((item) => (
                  <div key={item.label} className="rounded-lg border border-border bg-surface px-3 py-2">
                    <p className="text-caption text-text-muted">{item.label}</p>
                    <p className="text-body font-semibold text-text">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storefront visibility</CardTitle>
              <CardDescription>Keep your profile trending in partner search.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {VISIBILITY_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <div>
                      <p className="text-body font-medium text-text">{item.label}</p>
                      <p className="text-caption text-text-muted">{item.detail}</p>
                    </div>
                    <Badge variant="success">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" size="sm">
                Boost listing
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team access</CardTitle>
              <CardDescription>Invite teammates and assign roles in one click.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-caption font-semibold text-text">
                        {member.initials}
                        <span
                          className={
                            member.status === "online"
                              ? "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface"
                              : "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-border ring-2 ring-surface"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-body font-medium text-text">{member.name}</p>
                        <p className="text-caption text-text-muted">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant={member.status === "online" ? "success" : "neutral"}>
                      {member.status === "online" ? "Online" : "Offline"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Invite teammate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
