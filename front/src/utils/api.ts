export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Generic helper to make API calls with the base URL and JSON parsing
 * @param path endpoint path (without leading slash)
 * @param options fetch options
 */
export async function fetchFromApi(path: string, options?: RequestInit) {
  const url = `${API_URL}/${path}`
  const response = await fetch(url, options)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  return await response.json()
}