import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PartnerOverview = {
  activity: { label: string; value: number }[];
  kpis: { label: string; value: number; delta: number }[];
  chart: { labels: string[]; orders: number[]; returns: number[] };
  topMerchants: { name: string; spend: string }[];
};

const MOCK_DATA: PartnerOverview = {
  activity: [
    { label: "New orders", value: 17 },
    { label: "Preparing", value: 5 },
    { label: "Dispatch", value: 10 },
    { label: "Confirming", value: 6 },
    { label: "Completed", value: 70 },
  ],
  kpis: [
    { label: "Total product import", value: 213, delta: 34.42 },
    { label: "Total orders", value: 54, delta: -14.12 },
    { label: "Products sold", value: 141, delta: 24.42 },
  ],
  chart: {
    labels: ["Apr 17", "Apr 18", "Apr 19", "Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26"],
    orders: [12, 18, 21, 30, 42, 38, 44, 52, 55, 68],
    returns: [34, 32, 31, 29, 26, 18, 22, 21, 19, 17],
  },
  topMerchants: [
    { name: "Angkor Mart", spend: "$12.4k" },
    { name: "Naga Supply", spend: "$9.7k" },
    { name: "Phnom Trade", spend: "$7.1k" },
  ],
};

function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

export async function GET(req: Request) {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(MOCK_DATA, { headers: { "x-data-source": "mock" } });
  }

  const auth = req.headers.get("authorization") ?? "";
  const res = await fetch(`${baseUrl}/partner/overview`, {
    headers: auth ? { Authorization: auth } : undefined,
    cache: "no-store",
  });

  const payload = (await res.json().catch(() => null)) as
    | PartnerOverview
    | { data?: PartnerOverview }
    | null;

  if (!res.ok || !payload) {
    return NextResponse.json(MOCK_DATA, {
      headers: {
        "x-data-source": "mock",
        "x-error": `partner-overview ${res.status || 500}`,
      },
    });
  }

  const data = "data" in payload && payload.data ? payload.data : payload;
  return NextResponse.json(data);
}
