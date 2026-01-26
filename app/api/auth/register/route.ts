import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RegisterBody = {
  email?: string;
  password?: string;
  roleId?: number;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

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
  if (!baseUrl) return jsonError("Missing API base URL", 500);

  const res = await fetch(`${baseUrl}/auth/register`, {
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
