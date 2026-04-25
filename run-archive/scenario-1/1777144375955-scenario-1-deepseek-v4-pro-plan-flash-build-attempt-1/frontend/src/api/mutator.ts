export const customFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw { status: response.status, body: errorBody }
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return undefined as T
}
