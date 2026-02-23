const BASE = 'https://api.jikan.moe/v4'

type QueryValue = string | number | boolean | null | undefined

export async function apiGet(path: string, params?: Record<string, QueryValue>) {
  const url = new URL(`${BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      url.searchParams.set(k, String(v))
    })
  }

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export default { apiGet }
