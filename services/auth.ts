import type {
  BasicResult,
  GenerateCodePayload,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "@/types/auth";
import { getErrorMessage, parseJson } from "@/utils/http";

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<
    | { ok: true; token?: string; userId?: number; roleId?: number }
    | { ok: false; message?: string }
  >(res);

  if (!res.ok || !data || ("ok" in data && data.ok === false)) {
    throw new Error(getErrorMessage(data, "Login failed"));
  }

  return data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<{ ok: true; email: string } | { ok: false; message?: string }>(
    res
  );

  if (!res.ok || !data || ("ok" in data && data.ok === false)) {
    throw new Error(getErrorMessage(data, "Signup failed"));
  }

  return data;
}

export async function generateCode(payload: GenerateCodePayload): Promise<BasicResult> {
  const res = await fetch("/api/auth/generate-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<{ ok: true; message?: string; data?: unknown } | { ok: false; message?: string }>(
    res
  );

  if (!res.ok || !data || ("ok" in data && data.ok === false)) {
    throw new Error(getErrorMessage(data, "Failed to send code"));
  }

  return data;
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<BasicResult> {
  const res = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<{ ok: true; message?: string } | { ok: false; message?: string }>(res);

  if (!res.ok || !data || ("ok" in data && data.ok === false)) {
    throw new Error(getErrorMessage(data, "Verification failed"));
  }

  return data;
}

export async function resendVerification(payload: GenerateCodePayload): Promise<BasicResult> {
  const res = await fetch("/api/auth/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<{ ok: true; message?: string } | { ok: false; message?: string }>(res);

  if (!res.ok || !data || ("ok" in data && data.ok === false)) {
    throw new Error(getErrorMessage(data, "Resend failed"));
  }

  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<BasicResult> {
  const res = await fetch("/api/auth/reset-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<{ ok: true; message?: string } | { ok: false; message?: string }>(res);

  if (!res.ok || !data || ("ok" in data && data.ok === false)) {
    throw new Error(getErrorMessage(data, "Reset failed"));
  }

  return data;
}
