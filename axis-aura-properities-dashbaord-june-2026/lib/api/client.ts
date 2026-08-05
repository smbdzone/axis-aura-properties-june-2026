const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * The session lives entirely in an httpOnly cookie set by the API, which is why
 * every request below sends `credentials: "include"`. Nothing auth-related is
 * kept in localStorage — a token there would be readable by any injected script.
 */

export function getApiBaseUrl() {
  return API_BASE;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** Pagination metadata returned by the API when a page is requested. */
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type Paginated<T> = { data: T[]; pagination: PaginationMeta };

function isPaginated<T>(value: unknown): value is Paginated<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data) &&
    "pagination" in value
  );
}

/**
 * Fetches a list endpoint that may return either a bare array (default) or a
 * `{ data, pagination }` envelope (when `?page`/`?limit` is sent). Callers that
 * only need the items get an array either way; pass a params object to page.
 */
export async function apiList<T>(
  path: string,
  params?: { page?: number; limit?: number },
): Promise<{ items: T[]; pagination: PaginationMeta | null }> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const url = query.toString() ? `${path}?${query}` : path;

  const result = await apiRequest<T[] | Paginated<T>>(url);
  if (isPaginated<T>(result)) {
    return { items: result.data, pagination: result.pagination };
  }
  return { items: Array.isArray(result) ? result : [], pagination: null };
}

export async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
