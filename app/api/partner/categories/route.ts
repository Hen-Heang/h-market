import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Category = {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
};

type Pagination = {
  last: boolean;
  first: boolean;
  size: number;
  totalPages: number;
  currentPage: number;
  currentTotalElements: number;
  totalElements: number;
  empty: boolean;
};

type CategoryPageResponse = {
  categories: Category[];
  pagination: Pagination;
};

const MOCK_CATEGORIES: Category[] = [
  {
    id: 101,
    name: "Beverages",
    createdDate: "2025-11-02 09:15:12",
    updatedDate: "2026-01-12 16:40:22",
  },
  {
    id: 102,
    name: "Household Essentials",
    createdDate: "2025-11-08 10:02:41",
    updatedDate: "2026-01-18 11:28:11",
  },
  {
    id: 103,
    name: "Fresh Snacks",
    createdDate: "2025-12-01 08:22:09",
    updatedDate: "2026-01-22 14:02:55",
  },
  {
    id: 104,
    name: "Personal Care",
    createdDate: "2025-12-12 16:44:33",
    updatedDate: "2026-01-30 09:17:46",
  },
];

function resolveBaseUrl() {
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

function resolveCategoryPath() {
  return (
    process.env.API_PARTNER_CATEGORY_PATH ||
    process.env.NEXT_PUBLIC_API_PARTNER_CATEGORY_PATH ||
    "api/v1/partner/categories"
  );
}

function buildAuthHeader(raw: string | null) {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}

function getAuthHeader(req: Request) {
  const header = req.headers.get("authorization");
  if (header) return header;
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (!match) return "";
  return buildAuthHeader(decodeURIComponent(match[1]));
}

async function parseBody(req: Request) {
  try {
    return (await req.json()) as { categoryName?: string };
  } catch {
    return null;
  }
}

type ApiPayload =
  | CategoryPageResponse
  | Category
  | { data?: CategoryPageResponse | Category; message?: string; status?: { message?: string } }
  | null;

function normalizePayload(payload: ApiPayload) {
  if (!payload) return null;
  if ("data" in payload && payload.data) return payload.data;
  return payload;
}

function resolveErrorMessage(payload: ApiPayload, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const typed = payload as {
    message?: string;
    detail?: string;
    title?: string;
    status?: { message?: string };
  };
  return typed.message || typed.detail || typed.title || typed.status?.message || fallback;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeCategory(raw: unknown): Category | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;
  const id = toNumber(payload.id ?? payload.categoryId ?? payload.category_id, 0);
  const name = String(payload.name ?? payload.categoryName ?? payload.category_name ?? "").trim();
  const createdDate = String(payload.createdDate ?? payload.created_date ?? "").trim();
  const updatedDate = String(payload.updatedDate ?? payload.updated_date ?? "").trim();
  if (!id || !name) return null;
  return { id, name, createdDate, updatedDate };
}

function normalizePagination(raw: unknown): Pagination | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;
  return {
    last: Boolean(payload.last),
    first: Boolean(payload.first),
    size: toNumber(payload.size, 0),
    totalPages: toNumber(payload.totalPages ?? payload.total_pages, 0),
    currentPage: toNumber(payload.currentPage ?? payload.current_page, 0),
    currentTotalElements: toNumber(
      payload.currentTotalElements ?? payload.current_total_elements,
      0
    ),
    totalElements: toNumber(payload.totalElements ?? payload.total_elements, 0),
    empty: Boolean(payload.empty),
  };
}

function normalizePageResponse(raw: unknown): CategoryPageResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;
  const list = Array.isArray(payload.categories) ? payload.categories : [];
  const categories = list.map(normalizeCategory).filter((item): item is Category => Boolean(item));
  const pagination = normalizePagination(payload.pagination);
  if (!pagination) return null;
  return { categories, pagination };
}

function buildPagination(
  pageNumber: number,
  pageSize: number,
  totalElements: number,
  currentCount: number
): Pagination {
  const totalPages = Math.max(1, Math.ceil(totalElements / Math.max(1, pageSize)));
  return {
    last: pageNumber >= totalPages,
    first: pageNumber <= 1,
    size: pageSize,
    totalPages,
    currentPage: pageNumber,
    currentTotalElements: currentCount,
    totalElements,
    empty: currentCount === 0,
  };
}

function getPaginationParams(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageNumber = Math.max(1, toNumber(searchParams.get("pageNumber"), 1));
  const pageSize = Math.max(1, toNumber(searchParams.get("pageSize"), 10));
  return { pageNumber, pageSize };
}

export async function GET(req: Request) {
  const { pageNumber, pageSize } = getPaginationParams(req);
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const slice = MOCK_CATEGORIES.slice(start, end);
    return NextResponse.json(
      {
        categories: slice,
        pagination: buildPagination(pageNumber, pageSize, MOCK_CATEGORIES.length, slice.length),
      },
      { headers: { "x-data-source": "mock" } }
    );
  }

  const auth = getAuthHeader(req);
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/${resolveCategoryPath()}?${params.toString()}`, {
      headers: auth ? { Authorization: auth } : undefined,
      cache: "no-store",
    });
  } catch {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const slice = MOCK_CATEGORIES.slice(start, end);
    return NextResponse.json(
      {
        categories: slice,
        pagination: buildPagination(pageNumber, pageSize, MOCK_CATEGORIES.length, slice.length),
      },
      { headers: { "x-data-source": "mock-fallback" } }
    );
  }

  const rawText = await res.text();
  const payload = (rawText ? JSON.parse(rawText) : null) as ApiPayload;
  if (!res.ok || !payload) {
    return NextResponse.json(
      {
        message: resolveErrorMessage(payload, "Failed to load categories"),
        backendStatus: res.status,
        backendBody: rawText || null,
      },
      { status: res.status || 500 }
    );
  }

  const normalized = normalizePayload(payload);
  const data = normalizePageResponse(normalized);
  if (!data) {
    return NextResponse.json(
      { message: "Invalid category payload", backendStatus: res.status, backendBody: rawText || null },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await parseBody(req);
  const { searchParams } = new URL(req.url);
  const categoryName = (body?.categoryName || searchParams.get("categoryName") || "").trim();

  if (!categoryName) {
    return NextResponse.json({ message: "Category name is required." }, { status: 400 });
  }

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    const now = new Date().toISOString();
    const mockCategory: Category = {
      id: MOCK_CATEGORIES.length + 100,
      name: categoryName,
      createdDate: now,
      updatedDate: now,
    };
    return NextResponse.json(mockCategory, { headers: { "x-data-source": "mock" } });
  }

  const auth = getAuthHeader(req);
  const url = new URL(`${baseUrl}/${resolveCategoryPath()}`);
  url.searchParams.set("categoryName", categoryName);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: "POST",
      headers: auth ? { Authorization: auth } : undefined,
    });
  } catch {
    const now = new Date().toISOString();
    const mockCategory: Category = {
      id: MOCK_CATEGORIES.length + 100,
      name: categoryName,
      createdDate: now,
      updatedDate: now,
    };
    return NextResponse.json(mockCategory, { headers: { "x-data-source": "mock-fallback" } });
  }

  const rawText = await res.text();
  const payload = (rawText ? JSON.parse(rawText) : null) as ApiPayload;
  if (!res.ok || !payload) {
    const message = resolveErrorMessage(payload, "Failed to create category");
    return NextResponse.json(
      { message, backendStatus: res.status, backendBody: rawText || null },
      { status: res.status || 500 }
    );
  }

  const normalized = normalizePayload(payload);
  const data = normalizeCategory(normalized);
  if (!data) {
    return NextResponse.json(
      { message: "Invalid category payload", backendStatus: res.status, backendBody: rawText || null },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
