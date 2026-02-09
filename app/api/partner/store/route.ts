import { NextResponse } from "next/server";
import type { PartnerStore } from "@/types/store";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const MOCK_STORE: PartnerStore = {
  id: 101,
  name: "Blurz Supply Co.",
  description: "Specialized in premium grocery and household inventory with same-day dispatch.",
  address: "SenSok, Street 93, Phnom Penh",
  bannerImage: "/brand/logo.svg",
  primaryPhone: "012345678",
  additionalPhone: [],
  isPublish: true,
  createdDate: "2025-04-12 09:15:12",
  updatedDate: "2026-01-12 16:40:22",
};

function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

function resolveStorePath() {
  return (
    process.env.API_PARTNER_STORE_PATH ||
    process.env.NEXT_PUBLIC_API_PARTNER_STORE_PATH ||
    "api/v1/partner/stores"
  );
}

function buildAuthHeader(raw: string | null) {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}

async function getAuthHeader(req: Request) {
  const header = req.headers.get("authorization");
  if (header) return buildAuthHeader(header);

  const cookieToken = (await cookies()).get("auth_token")?.value;
  if (cookieToken) return buildAuthHeader(cookieToken);

  const rawCookie = req.headers.get("cookie") || "";
  const match = rawCookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (!match) return "";
  return buildAuthHeader(decodeURIComponent(match[1]));
}

async function parseBody(req: Request) {
  try {
    return (await req.json()) as Partial<PartnerStore>;
  } catch {
    return null;
  }
}

type ApiPayload =
  | PartnerStore
  | { data?: PartnerStore; message?: string; status?: { message?: string } }
  | null;

function normalizePayload(payload: ApiPayload) {
  if (!payload) return null;
  if ("data" in payload && payload.data) return payload.data;
  return payload;
}

function resolveErrorMessage(payload: ApiPayload, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const typed = payload as {
    message?: string;
    detail?: string;
    title?: string;
    status?: { message?: string };
  };
  return typed.message || typed.detail || typed.title || typed.status?.message || fallback;
}

export async function GET(req: Request) {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(MOCK_STORE, { headers: { "x-data-source": "mock" } });
  }

  const auth = await getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveStorePath()}/user/`, {
    headers: auth ? { Authorization: auth } : undefined,
    cache: "no-store",
  });

  if (res.status === 404) {
    return NextResponse.json(null, { status: 200 });
  }

  const rawText = await res.text();
  const payload = (rawText ? JSON.parse(rawText) : null) as ApiPayload;
  if (!res.ok || !payload) {
    return NextResponse.json(
      {
        message: resolveErrorMessage(payload, "Failed to load store"),
        backendStatus: res.status,
        backendBody: rawText || null,
      },
      { status: res.status || 500 }
    );
  }

  const data = normalizePayload(payload);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await parseBody(req);
  if (!body) return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      {
        ...MOCK_STORE,
        ...body,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const auth = await getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveStorePath()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  const payload = (rawText ? JSON.parse(rawText) : null) as ApiPayload;
  if (!res.ok || !payload) {
    const message = resolveErrorMessage(payload, "Failed to create store");
    return NextResponse.json(
      { message, backendStatus: res.status, backendBody: rawText || null },
      { status: res.status || 500 }
    );
  }

  const data = normalizePayload(payload);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await parseBody(req);
  if (!body) return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      {
        ...MOCK_STORE,
        ...body,
        updatedDate: new Date().toISOString(),
      },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const auth = await getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveStorePath()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  const payload = (rawText ? JSON.parse(rawText) : null) as ApiPayload;
  if (!res.ok || !payload) {
    const message = resolveErrorMessage(payload, "Failed to update store");
    return NextResponse.json(
      { message, backendStatus: res.status, backendBody: rawText || null },
      { status: res.status || 500 }
    );
  }

  const data = normalizePayload(payload);
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ message: "Store deleted." }, { headers: { "x-data-source": "mock" } });
  }

  const auth = await getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveStorePath()}`, {
    method: "DELETE",
    headers: auth ? { Authorization: auth } : undefined,
  });

  const rawText = await res.text();
  const payload = (rawText ? JSON.parse(rawText) : null) as ApiPayload;
  if (!res.ok || !payload) {
    const message = resolveErrorMessage(payload, "Failed to delete store");
    return NextResponse.json(
      { message, backendStatus: res.status, backendBody: rawText || null },
      { status: res.status || 500 }
    );
  }

  return NextResponse.json(normalizePayload(payload));
}
