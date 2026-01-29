import { NextResponse } from "next/server";
import { buildAuthUrl, jsonError } from "../_utils";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !email.includes("@")) return jsonError("Please enter a valid email");
  if (!password) return jsonError("Missing password");

  const url = buildAuthUrl("login");
  if (!url) return jsonError("Missing API base URL", 500);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await res.json().catch(() => null)) as
    | {
        data?: { token?: string; userId?: number; roleId?: number };
        message?: string;
        status?: { message?: string };
      }
    | null;

  if (!res.ok) {
    const message = payload?.message || payload?.status?.message || "Login failed";
    return jsonError(message, res.status);
  }

  return NextResponse.json({
    ok: true,
    token: payload?.data?.token,
    userId: payload?.data?.userId,
    roleId: payload?.data?.roleId,
  });
}
