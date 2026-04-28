// pattern: Imperative Shell

let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export async function customFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (csrfToken) {
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const body: T =
    response.status === 204 || response.status === 205
      ? (undefined as unknown as T)
      : ((await response.json()) as T);

  return {
    data: body,
    status: response.status,
    headers: response.headers,
  } as T;
}
