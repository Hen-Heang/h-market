import { NextResponse } from "next/server";
import { buildAuthUrl, jsonError } from "../_utils";

export const runtime = "nodejs";

type ResetBody = {
  email?: string;
  code?: string;
  newPassword?: string;
};

export async function PUT(req: Request) {
  let body: ResetBody;
  try {
    body = (await req.json()) as ResetBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();
  const newPassword = body.newPassword ?? "";

  if (!email || !email.includes("@")) return jsonError("Missing email");
  if (!/^[0-9]{4}$/.test(code)) return jsonError("Invalid code");
  if (!newPassword) return jsonError("Missing new password");

  const url = buildAuthUrl("forget");
  if (!url) return jsonError("Missing API base URL", 500);

  const res = await fetch(
    `${url}?${new URLSearchParams({ email, otp: code, newPassword }).toString()}`,
    {
      method: "PUT",
    }
  );

  const payload = (await res.json().catch(() => null)) as
    | { message?: string; status?: { message?: string } }
    | null;

  if (!res.ok) {
    const message = payload?.message || payload?.status?.message || "Reset failed";
    return jsonError(message, res.status);
  }

  return NextResponse.json({ ok: true, message: payload?.message ?? "Password reset" });
}
