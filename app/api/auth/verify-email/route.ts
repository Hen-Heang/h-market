import { NextResponse } from "next/server";
import { findUserByEmail, upsertUser } from "@/lib/auth/store";
import { verifyHash } from "@/lib/auth/crypto";

export const runtime = "nodejs";

type VerifyBody = {
  email?: string;
  code?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: Request) {
  let body: VerifyBody;
  try {
    body = (await req.json()) as VerifyBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const code = (body.code ?? "").trim();

  if (!email || !email.includes("@")) return jsonError("Missing email");
  if (!/^[0-9]{4}$/.test(code)) return jsonError("Invalid code");

  const user = await findUserByEmail(email);
  if (!user) return jsonError("Account not found", 404);
  if (user.emailVerifiedAt) return NextResponse.json({ ok: true });

  if (!user.verification) return jsonError("No active verification code. Please resend.", 409);
  const expiresAt = new Date(user.verification.expiresAt).getTime();
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return jsonError("Code expired. Please resend.", 410);
  }

  const ok = verifyHash(code, user.verification.otpSalt, user.verification.otpHash);
  if (!ok) return jsonError("Incorrect code", 401);

  user.emailVerifiedAt = new Date().toISOString();
  delete user.verification;
  user.updatedAt = new Date().toISOString();
  await upsertUser(user);

  return NextResponse.json({ ok: true });
}
