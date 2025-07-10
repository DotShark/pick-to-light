/**
 * Generic helper to make API calls with the base URL and JSON parsing
 * @param path endpoint path (without leading slash)
 * @param options fetch options
 */
export async function fetchFromApi(path: string, options?: RequestInit) {
  if (!import.meta.env.VITE_API_URL) throw new Error('Missing env variable: VITE_API_URL')

  const url = `${import.meta.env.VITE_API_URL}/${path}`
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  return await response.json()
}