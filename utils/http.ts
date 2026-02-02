export async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const obj = payload as {
      message?: string;
      detail?: string;
      title?: string;
      status?: { message?: string };
    };
    return obj.message || obj.detail || obj.title || obj.status?.message || fallback;
  }
  return fallback;
}
