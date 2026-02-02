import { NextResponse } from "next/server";
import type { PartnerProfile } from "@/types/partner";

export const runtime = "nodejs";

const MOCK_PROFILE: PartnerProfile = {
  firstName: "Sophea",
  lastName: "R.",
  gender: "female",
  profileImage: "/brand/logo.svg",
  createdDate: "2025-04-12 09:15:12",
  updatedDate: "2026-01-12 16:40:22",
};

function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

function resolveProfilePath() {
  return (
    process.env.API_PARTNER_PROFILE_PATH ||
    process.env.NEXT_PUBLIC_API_PARTNER_PROFILE_PATH ||
    "api/v1/partner/profiles"
  );
}

function buildAuthHeader(raw: string | null) {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}

function getAuthHeader(req: Request) {
  const header = req.headers.get("authorization");
  if (header) return header;
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (!match) return "";
  return buildAuthHeader(decodeURIComponent(match[1]));
}

async function parseBody(req: Request) {
  try {
    return (await req.json()) as Partial<PartnerProfile>;
  } catch {
    return null;
  }
}

type ApiPayload =
  | PartnerProfile
  | { data?: PartnerProfile; message?: string; status?: { message?: string } }
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
    return NextResponse.json(MOCK_PROFILE, { headers: { "x-data-source": "mock" } });
  }

  const auth = getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveProfilePath()}/`, {
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
        message: resolveErrorMessage(payload, "Failed to load partner profile"),
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
        ...MOCK_PROFILE,
        ...body,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const auth = getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveProfilePath()}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = (await res.json().catch(() => null)) as ApiPayload;
  if (!res.ok || !payload) {
    const message = resolveErrorMessage(payload, "Failed to create partner profile");
    return NextResponse.json({ message }, { status: res.status || 500 });
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
        ...MOCK_PROFILE,
        ...body,
        updatedDate: new Date().toISOString(),
      },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const auth = getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveProfilePath()}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = (await res.json().catch(() => null)) as ApiPayload;
  if (!res.ok || !payload) {
    const message = resolveErrorMessage(payload, "Failed to update partner profile");
    return NextResponse.json({ message }, { status: res.status || 500 });
  }

  const data = normalizePayload(payload);
  return NextResponse.json(data);
}
