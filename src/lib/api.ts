/**
 * Typed HTTP client built on native `fetch`.
 *
 * - Base URL from `VITE_API_URL` (fallback empty string).
 * - Attaches `Authorization: Bearer <token>` when `auth.accessToken` is in localStorage.
 * - JSON in / JSON out; throws `ApiError` on non-2xx and network failures.
 * - On 401: clears stored token and dispatches a `auth:unauthorized` CustomEvent.
 */

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const TOKEN_KEY = "auth.accessToken";

function getBaseUrl(): string {
  const url = (import.meta as ImportMeta).env?.VITE_API_URL;
  return typeof url === "string" ? url : "";
}

function joinUrl(base: string, path: string): string {
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

function readToken(): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

function clearToken(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* noop */
  }
}

function dispatchUnauthorized(): void {
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
  } catch {
    /* noop */
  }
}

async function parseError(response: Response): Promise<{ message: string; data?: unknown }> {
  const contentType = response.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const data = await response.json();
      const message =
        (data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message
          : null) ||
        response.statusText ||
        `Request failed with status ${response.status}`;
      return { message, data };
    }
    const text = await response.text();
    return {
      message: text || response.statusText || `Request failed with status ${response.status}`,
      data: text,
    };
  } catch {
    return {
      message: response.statusText || `Request failed with status ${response.status}`,
    };
  }
}

async function parseSuccess<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  // Fall back: try text; if empty, return undefined.
  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const url = joinUrl(getBaseUrl(), path);

  const headers = new Headers(init?.headers);
  const token = readToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let finalBody: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (
      (typeof FormData !== "undefined" && body instanceof FormData) ||
      (typeof Blob !== "undefined" && body instanceof Blob) ||
      (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
      (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams)
    ) {
      finalBody = body as BodyInit;
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      finalBody = JSON.stringify(body);
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      method,
      headers,
      body: finalBody,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    throw new ApiError(message, 0);
  }

  if (response.status === 401) {
    clearToken();
    dispatchUnauthorized();
    const { message, data } = await parseError(response);
    throw new ApiError(message, 401, data);
  }

  if (!response.ok) {
    const { message, data } = await parseError(response);
    throw new ApiError(message, response.status, data);
  }

  return parseSuccess<T>(response);
}

export const api = {
  get: <T>(path: string, init?: RequestInit): Promise<T> =>
    request<T>("GET", path, undefined, init),
  post: <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> =>
    request<T>("POST", path, body, init),
  put: <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> =>
    request<T>("PUT", path, body, init),
  patch: <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> =>
    request<T>("PATCH", path, body, init),
  delete: <T>(path: string, init?: RequestInit): Promise<T> =>
    request<T>("DELETE", path, undefined, init),
};

/** Returns true when the app should route through the in-memory mock API. */
export function isMockMode(): boolean {
  return (import.meta as ImportMeta).env?.VITE_USE_MOCK_API === "true";
}
