import { NextResponse } from "next/server";
import { verifyHash, randomId } from "@/lib/auth/crypto";
import { findUserByEmail } from "@/lib/auth/store";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

function deriveUserId(raw: string) {
  return (
    raw
      .split("")
      .reduce((hash, ch) => (hash * 31 + ch.charCodeAt(0)) >>> 0, 7) % 100_000_000
  );
}

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

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    const user = await findUserByEmail(email);
    if (!user) return jsonError("Account not found", 404);
    if (!verifyHash(password, user.passwordSalt, user.passwordHash)) {
      return jsonError("Incorrect email or password", 401);
    }
    if (!user.emailVerifiedAt) {
      return jsonError("Please verify your email before signing in", 403);
    }

    const roleId = user.roleId ?? 1;
    const token = `mock-${randomId()}`;
    return NextResponse.json(
      { ok: true, token, userId: deriveUserId(user.id), roleId },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const formBody = new URLSearchParams({ email, password });
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
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
