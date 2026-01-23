import { NextResponse } from "next/server";
import { findUserByEmail, upsertUser } from "@/lib/auth/store";
import { generateOtp, hashWithSalt, newSalt } from "@/lib/auth/crypto";

export const runtime = "nodejs";

type ResendBody = {
  email?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: Request) {
  let body: ResendBody;
  try {
    body = (await req.json()) as ResendBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) return jsonError("Missing email");

  const user = await findUserByEmail(email);
  if (!user) return jsonError("Account not found", 404);
  if (user.emailVerifiedAt) return NextResponse.json({ ok: true });

  const otp = generateOtp(4);
  const otpSalt = newSalt();
  user.verification = {
    otpSalt,
    otpHash: hashWithSalt(otp, otpSalt),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
  user.updatedAt = new Date().toISOString();
  await upsertUser(user);

  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] resend OTP for ${email}: ${otp}`);
  }

  return NextResponse.json({ ok: true });
}
