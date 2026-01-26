export type PartnerOverview = {
  activity: { label: string; value: number }[];
  kpis: { label: string; value: number; delta: number }[];
  chart: { labels: string[]; orders: number[]; returns: number[] };
  topMerchants: { name: string; spend: string }[];
};

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getPartnerOverview(): Promise<PartnerOverview> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const res = await fetch("/api/partner/overview", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });

  const data = await parseJson<PartnerOverview>(res);
  if (!res.ok || !data) {
    throw new Error("Failed to load dashboard data");
  }
  return data;
}
