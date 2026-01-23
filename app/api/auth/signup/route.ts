import { NextResponse } from "next/server";
import { findUserByEmail, upsertUser } from "@/lib/auth/store";
import { generateOtp, newSalt, randomId, hashWithSalt } from "@/lib/auth/crypto";

export const runtime = "nodejs";

type SignupBody = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: Request) {
  let body: SignupBody;
  try {
    body = (await req.json()) as SignupBody;
  } catch {
    return jsonError("Invalid JSON body");
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!email || !email.includes("@")) return jsonError("Please enter a valid email");
  if (password.length < 8) return jsonError("Password must be at least 8 characters");
  if (password !== confirmPassword) return jsonError("Passwords do not match");

  const existing = await findUserByEmail(email);
  if (existing) {
    if (existing.emailVerifiedAt) {
      return jsonError("Email already registered. Please sign in.", 409);
    }

    // Re-issue OTP for existing unverified user
    const otp = generateOtp(4);
    const otpSalt = newSalt();
    existing.verification = {
      otpSalt,
      otpHash: hashWithSalt(otp, otpSalt),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
    existing.updatedAt = new Date().toISOString();
    await upsertUser(existing);

    if (process.env.NODE_ENV !== "production") {
      console.log(`[dev] signup OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({ ok: true, email });
  }

  const passwordSalt = newSalt();
  const passwordHash = hashWithSalt(password, passwordSalt);
  const otp = generateOtp(4);
  const otpSalt = newSalt();

  const now = new Date().toISOString();

  await upsertUser({
    id: randomId(),
    email,
    passwordHash,
    passwordSalt,
    emailVerifiedAt: null,
    verification: {
      otpSalt,
      otpHash: hashWithSalt(otp, otpSalt),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
    createdAt: now,
    updatedAt: now,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] signup OTP for ${email}: ${otp}`);
  }

  return NextResponse.json({ ok: true, email });
}
