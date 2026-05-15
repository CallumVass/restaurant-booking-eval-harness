// pattern: Imperative Shell
// Custom fetch mutator for Orval — adds CSRF token and credentials for cookie auth.

let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getCsrfTokenValue(): string | null {
  return csrfToken;
}

export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/api/csrf-token", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch CSRF token");
  const data: { token: string } = await res.json();
  csrfToken = data.token;
  return data.token;
}

export async function apiFetch<
  TResponse extends { data: unknown; status: number },
>(url: string, options: RequestInit): Promise<TResponse> {
  const headers = new Headers(options.headers);

  // Add CSRF token for state-changing requests
  if (
    csrfToken &&
    options.method &&
    !["GET", "HEAD"].includes(options.method.toUpperCase())
  ) {
    headers.set("X-XSRF-TOKEN", csrfToken);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const body = [204, 205, 304].includes(response.status)
    ? null
    : await response.text();
  const data: TResponse["data"] = body ? JSON.parse(body) : {};

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as unknown as TResponse;
}
