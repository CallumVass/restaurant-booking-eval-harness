// pattern: Imperative Shell

import { getCsrfToken } from "../generated/booking-client";

let csrfToken: string | null = null;

export async function initCsrfToken() {
  if (csrfToken) return csrfToken;
  try {
    const response = await getCsrfToken();
    if (response.status === 200) {
      csrfToken = response.data.token;
    }
  } catch {
    // CSRF token fetch failed; mutations will still work in test env
  }
  return csrfToken;
}

export function getCsrfTokenValue() {
  return csrfToken;
}

export async function customFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (
    csrfToken &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(
      options.method?.toUpperCase() ?? "",
    )
  ) {
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const body = [204, 205, 304].includes(response.status)
    ? null
    : await response.text();

  return {
    data: body ? JSON.parse(body) : {},
    status: response.status,
    headers: response.headers,
  } as T;
}
