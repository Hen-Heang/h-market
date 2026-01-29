import { NextResponse } from "next/server";
import { buildAuthUrl, jsonError } from "../_utils";

export const runtime = "nodejs";

type ResendBody = {
  email?: string;
};

export async function POST(req: Request) {
  let body: ResendBody;
  try {
    body = (await req.json()) as ResendBody;
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
    | { message?: string; status?: { message?: string } }
    | null;

  if (!res.ok) {
    const message = payload?.message || payload?.status?.message || "Resend failed";
    return jsonError(message, res.status);
  }

  return NextResponse.json({ ok: true, message: payload?.message ?? "Code sent" });
}
