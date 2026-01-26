type LoginPayload = {
  email: string;
  password: string;
};

type LoginResult = {
  token?: string;
  userId?: number;
  roleId?: number;
};

type RegisterPayload = {
  email: string;
  password: string;
  roleId: number;
};

type RegisterResult = {
  email: string;
};

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const obj = payload as { message?: string; status?: { message?: string } };
    return obj.message || obj.status?.message || fallback;
  }
  return fallback;
}

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
