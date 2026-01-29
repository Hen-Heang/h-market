import { NextResponse } from "next/server";
import { buildAuthUrl, jsonError, resolveBaseUrl } from "../_utils";
import { hashWithSalt, newSalt, randomId } from "@/lib/auth/crypto";
import { findUserByEmail, upsertUser } from "@/lib/auth/store";

export const runtime = "nodejs";

type RegisterBody = {
  email?: string;
  password?: string;
  roleId?: number;
};

export async function POST(req: Request) {
  let body: RegisterBody;
  try {
    body = (await req.json()) as RegisterBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const roleId = body.roleId ?? 0;

  if (!email || !email.includes("@")) return jsonError("Please enter a valid email");
  if (!password) return jsonError("Missing password");
  if (![1, 2].includes(roleId)) return jsonError("Missing role");

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    const existing = await findUserByEmail(email);
    if (existing) return jsonError("Email already registered", 409);

    const passwordSalt = newSalt();
    const passwordHash = hashWithSalt(password, passwordSalt);
    const now = new Date().toISOString();

    await upsertUser({
      id: randomId(),
      email,
      passwordHash,
      passwordSalt,
      roleId,
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { ok: true, email },
      { status: 201, headers: { "x-data-source": "mock" } }
    );
  }

  const url = buildAuthUrl("register");
  if (!url) return jsonError("Missing API base URL", 500);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, roleId }),
  });

  const payload = (await res.json().catch(() => null)) as
    | { data?: { email?: string }; message?: string; status?: { message?: string } }
    | null;

  if (!res.ok) {
    const message =
      payload?.message || payload?.status?.message || "Registration failed";
    return jsonError(message, res.status);
  }

  return NextResponse.json({ ok: true, email: payload?.data?.email || email });
}
