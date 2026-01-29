import { NextResponse } from "next/server";
import { buildAuthUrl, jsonError } from "../_utils";

export const runtime = "nodejs";

type GenerateBody = {
  email?: string;
};

export async function POST(req: Request) {
  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) return jsonError("Missing email");

  const url = buildAuthUrl("generate");
  if (!url) return jsonError("Missing API base URL", 500);

  const res = await fetch(`${url}?${new URLSearchParams({ email }).toString()}`, {
    method: "POST",
  });

  const payload = (await res.json().catch(() => null)) as
    | { message?: string; status?: { message?: string }; data?: unknown }
    | null;

  if (!res.ok) {
    const message = payload?.message || payload?.status?.message || "Failed to send code";
    return jsonError(message, res.status);
  }

  return NextResponse.json({
    ok: true,
    message: payload?.message ?? "Code sent",
    data: payload?.data ?? null,
  });
}
