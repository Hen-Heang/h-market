import { NextResponse } from "next/server";
import { buildAuthUrl, jsonError, resolveBaseUrl } from "../_utils";
import { verifyHash, randomId } from "@/lib/auth/crypto";
import { findUserByEmail } from "@/lib/auth/store";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

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

  const url = buildAuthUrl("login");
  if (!url) return jsonError("Missing API base URL", 500);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const headerAuth = res.headers.get("authorization") || res.headers.get("Authorization");

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

  type LoginPayload =
    | {
        data?: {
          token?: string;
          accessToken?: string;
          access_token?: string;
          jwt?: string;
          userId?: number;
          roleId?: number;
          user?: { id?: number; roleId?: number; role_id?: number };
        };
        message?: string;
        status?: { message?: string };
        token?: string;
        accessToken?: string;
        access_token?: string;
        jwt?: string;
        userId?: number;
        roleId?: number;
      }
    | null;

  const typedPayload = payload as LoginPayload;
  const data = typedPayload?.data ?? {};
  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    typedPayload?.token ||
    typedPayload?.accessToken ||
    typedPayload?.access_token ||
    typedPayload?.jwt ||
    (headerAuth && headerAuth.replace(/^Bearer\\s+/i, ""));
  const userId = data.userId || typedPayload?.userId || data.user?.id;
  const roleId =
    data.roleId || typedPayload?.roleId || data.user?.roleId || data.user?.role_id;

  return NextResponse.json({
    ok: true,
    token,
    userId,
    roleId,
  });
}
