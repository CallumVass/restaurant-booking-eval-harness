export const customFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return { data, status: response.status, headers: response.headers } as T
}
