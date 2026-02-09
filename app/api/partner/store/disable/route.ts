import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

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

export async function PUT(req: Request) {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { message: "Store is deactivated." },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const auth = await getAuthHeader(req);
  const res = await fetch(`${baseUrl}/${resolveStorePath()}/disable`, {
    method: "PUT",
    headers: auth ? { Authorization: auth } : undefined,
  });

  const payload = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok || !payload) {
    return NextResponse.json(
      { message: payload?.message || "Failed to disable store" },
      { status: res.status || 500 }
    );
  }

  return NextResponse.json(payload);
}
