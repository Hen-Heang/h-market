import { getErrorMessage, parseJson } from "@/utils/http";
import type { PartnerProfile, PartnerProfilePayload } from "@/types/partner";
import type { PartnerStore, PartnerStorePayload } from "@/types/store";

export type PartnerOverview = {
  activity: { label: string; value: number }[];
  kpis: { label: string; value: number; delta: number }[];
  chart: { labels: string[]; orders: number[]; returns: number[] };
  topMerchants: { name: string; spend: string }[];
};

export async function getPartnerOverview(): Promise<PartnerOverview> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/overview", {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    cache: "no-store",
  });

  const data = await parseJson<PartnerOverview>(res);
  if (!res.ok || !data) {
    throw new Error("Failed to load dashboard data");
  }
  return data;
}

export async function getPartnerProfile(): Promise<PartnerProfile | null> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/profile", {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const data = await parseJson<PartnerProfile | { message?: string }>(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, "Failed to load profile"));
  }
  if (!data || !isPartnerProfile(data)) return null;
  return data;
}

export async function createPartnerProfile(
  payload: PartnerProfilePayload
): Promise<PartnerProfile> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerProfile | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerProfile(data)) {
    throw new Error(getErrorMessage(data, "Failed to create profile"));
  }
  return data;
}

export async function updatePartnerProfile(
  payload: PartnerProfilePayload
): Promise<PartnerProfile> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerProfile | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerProfile(data)) {
    throw new Error(getErrorMessage(data, "Failed to update profile"));
  }
  return data;
}

export async function getPartnerStore(): Promise<PartnerStore | null> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/store", {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const data = await parseJson<PartnerStore | { message?: string }>(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, "Failed to load store"));
  }
  if (!data || !isPartnerStore(data)) return null;
  return data;
}

export async function createPartnerStore(payload: PartnerStorePayload): Promise<PartnerStore> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerStore | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerStore(data)) {
    throw new Error(getErrorMessage(data, "Failed to create store"));
  }
  return data;
}

export async function updatePartnerStore(payload: PartnerStorePayload): Promise<PartnerStore> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/store", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerStore | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerStore(data)) {
    throw new Error(getErrorMessage(data, "Failed to update store"));
  }
  return data;
}

export async function deletePartnerStore(): Promise<{ message?: string }> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch("/api/partner/store", {
    method: "DELETE",
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });

  const data = await parseJson<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, "Failed to delete store"));
  }
  return data ?? { message: "Deleted" };
}

export async function setPartnerStoreStatus(action: "enable" | "disable") {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(`/api/partner/store/${action}`, {
    method: "PUT",
    headers: authHeader ? { Authorization: authHeader } : undefined,
  });

  const data = await parseJson<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, "Failed to update store status"));
  }
  return data ?? { message: "Updated" };
}

function buildAuthHeader(token: string | null) {
  if (!token) return "";
  const trimmed = token.trim();
  if (!trimmed) return "";
  return /^bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}

function isPartnerProfile(payload: PartnerProfile | { message?: string }): payload is PartnerProfile {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "firstName" in payload &&
    "lastName" in payload &&
    "gender" in payload
  );
}

function isPartnerStore(payload: PartnerStore | { message?: string }): payload is PartnerStore {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "name" in payload &&
    "description" in payload &&
    "address" in payload
  );
}
