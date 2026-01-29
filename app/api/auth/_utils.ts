import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

export function resolveAuthPath() {
  return process.env.API_AUTH_PATH || process.env.NEXT_PUBLIC_API_AUTH_PATH || "authorization";
}

export function buildAuthUrl(endpoint: string) {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) return "";
  const path = resolveAuthPath().replace(/^\/+|\/+$/g, "");
  const suffix = endpoint.replace(/^\/+/, "");
  return `${baseUrl}/${path}/${suffix}`;
}
