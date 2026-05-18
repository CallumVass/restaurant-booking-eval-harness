// pattern: Imperative Shell

let csrfToken: string | null = null;

type FetcherOptions<TBody> = RequestInit & {
  body?: TBody;
};

export function clearCsrfToken() {
  csrfToken = null;
}

export async function apiFetcher<TResponse, TBody = unknown>(
  url: string,
  options: FetcherOptions<TBody> = {},
): Promise<TResponse> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);

  if (isStateChanging(method)) {
    csrfToken ??= await fetchCsrfToken();
    headers.set("X-CSRF-TOKEN", csrfToken);
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
    body:
      options.body === undefined || typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body),
  });
  const text = [204, 205, 304].includes(response.status)
    ? ""
    : await response.text();
  const data = text ? JSON.parse(text) : undefined;

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as TResponse;
}

async function fetchCsrfToken() {
  const response = await fetch("/api/auth/csrf", { credentials: "include" });
  if (!response.ok) {
    throw new Error("Could not start a secure session.");
  }

  const data = (await response.json()) as { token: string };
  return data.token;
}

function isStateChanging(method: string) {
  return method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
}
