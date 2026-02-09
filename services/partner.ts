import { getErrorMessage, parseJson } from "@/utils/http";
import type { PartnerProfile, PartnerProfilePayload } from "@/types/partner";
import type { PartnerStore, PartnerStorePayload } from "@/types/store";
import type { Category, CategoryPageResponse } from "@/types/category";

export type PartnerOverview = {
  activity: { label: string; value: number }[];
  kpis: { label: string; value: number; delta: number }[];
  chart: { labels: string[]; orders: number[]; returns: number[] };
  topMerchants: { name: string; spend: string }[];
};

const API_BASE =
  (typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL) || "";

function buildUrl(backendPath: string, proxyPath: string) {
  if (API_BASE) {
    const base = API_BASE.replace(/\/+$/, "");
    const path = backendPath.replace(/^\/+/, "");
    return `${base}/${path}`;
  }
  return proxyPath;
}

const PROFILE_URL = buildUrl("api/v1/partner/profiles/", "/api/partner/profile");
const STORE_URL = buildUrl("api/v1/partner/stores", "/api/partner/store");
const STORE_USER_URL = buildUrl("api/v1/partner/stores/user/", "/api/partner/store");
const STORE_ENABLE_URL = buildUrl("api/v1/partner/stores/enable", "/api/partner/store/enable");
const STORE_DISABLE_URL = buildUrl("api/v1/partner/stores/disable", "/api/partner/store/disable");
const OVERVIEW_URL = buildUrl("api/v1/partner/overview", "/api/partner/overview");
const CATEGORY_URL = buildUrl("api/v1/partner/categories", "/api/partner/categories");

export async function getPartnerCategories(
  pageNumber = 1,
  pageSize = 8
): Promise<CategoryPageResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });

  const res = await fetch(`${CATEGORY_URL}?${params.toString()}`, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJson<CategoryPageResponse>(res);
  if (!res.ok || !data) {
    throw new Error(getErrorMessage(data, "Failed to load categories"));
  }
  return data;
}

export async function createPartnerCategory(categoryName: string): Promise<Category> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const url = `${CATEGORY_URL}?categoryName=${encodeURIComponent(categoryName)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ categoryName }),
  });

  const data = await parseJson<Category | { message?: string }>(res);
  if (!res.ok || !data || !isCategory(data)) {
    throw new Error(getErrorMessage(data, "Failed to create category"));
  }
  return data;
}

export async function getPartnerOverview(): Promise<PartnerOverview> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(OVERVIEW_URL, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseJson<PartnerOverview>(res);
  if (!res.ok || !data) {
    throw new Error("Failed to load dashboard data");
  }
  return data;
}

export async function getPartnerProfile(): Promise<PartnerProfile | null> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(PROFILE_URL, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    credentials: "include",
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

export async function createPartnerProfile(payload: PartnerProfilePayload): Promise<PartnerProfile> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(PROFILE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerProfile | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerProfile(data)) {
    throw new Error(getErrorMessage(data, "Failed to create profile"));
  }
  return data;
}

export async function updatePartnerProfile(payload: PartnerProfilePayload): Promise<PartnerProfile> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(PROFILE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerProfile | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerProfile(data)) {
    throw new Error(getErrorMessage(data, "Failed to update profile"));
  }
  return data;
}

export async function getPartnerStore(): Promise<PartnerStore | null> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(STORE_USER_URL, {
    headers: authHeader ? { Authorization: authHeader } : undefined,
    credentials: "include",
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
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(STORE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerStore | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerStore(data)) {
    throw new Error(getErrorMessage(data, "Failed to create store"));
  }
  return data;
}

export async function updatePartnerStore(payload: PartnerStorePayload): Promise<PartnerStore> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(STORE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseJson<PartnerStore | { message?: string }>(res);
  if (!res.ok || !data || !isPartnerStore(data)) {
    throw new Error(getErrorMessage(data, "Failed to update store"));
  }
  return data;
}

export async function deletePartnerStore(): Promise<{ message?: string }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(STORE_URL, {
    method: "DELETE",
    headers: authHeader ? { Authorization: authHeader } : undefined,
    credentials: "include",
  });

  const data = await parseJson<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, "Failed to delete store"));
  }
  return data ?? { message: "Deleted" };
}

export async function setPartnerStoreStatus(action: "enable" | "disable") {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const authHeader = buildAuthHeader(token);
  const res = await fetch(action === "enable" ? STORE_ENABLE_URL : STORE_DISABLE_URL, {
    method: "PUT",
    headers: authHeader ? { Authorization: authHeader } : undefined,
    credentials: "include",
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

function isCategory(payload: Category | { message?: string }): payload is Category {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "name" in payload &&
    "createdDate" in payload &&
    "updatedDate" in payload
  );
}
