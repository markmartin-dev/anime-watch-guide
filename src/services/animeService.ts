import { apiGet } from '../api/client'
import type { AnimeListResponse, Anime, TopAnimeResponse } from '../types/anime'

const VALID_ANIME_TYPES = new Set([
  'tv',
  'movie',
  'ova',
  'special',
  'ona',
  'music',
  'cm',
  'pv',
  'tv_special',
])

const normalizeAnimeType = (value?: string): string | undefined => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  return VALID_ANIME_TYPES.has(normalized) ? normalized : undefined
}

export type FetchAnimeListParams = {
    page?: number
    limit?: number
    orderBy?: string
    sfw?: boolean
    type?: string
    start_date?: string
    end_date?: string
    status?: string
}

export type FetchTopAnimeParams = {
    page?: number
    type?: string
    sfw?: boolean
    limit?: number
    filter?: string
}

export const fetchAnimeList = async (params: FetchAnimeListParams = {}): Promise<AnimeListResponse> => {
  const {
    page = 1,
    limit = 20,
    orderBy = 'title',
    sfw = true,
    type: rawType,
    start_date,
    end_date,
    status
  } = params
  const type = normalizeAnimeType(rawType)

  return apiGet('/anime', {
    page,
    limit,
    order_by: orderBy,
    sfw,
    ...(type ? { type } : {}),
    ...(start_date ? { start_date } : {}),
    ...(end_date ? { end_date } : {}),
    ...(status ? { status } : {}),
  })
}

export const fetchAnimeById = async (id: string | number): Promise<{ data: Anime }> => {
  return apiGet(`/anime/${id}`)
}

export const fetchAnimeEpisodes = async (id: string | number, page = 1) => {
  return apiGet(`/anime/${id}/episodes`, { page })
}

export const fetchAnimePictures = async (id: string | number) => {
  return apiGet(`/anime/${id}/pictures`)
}

export const fetchTopAnime = async (params: FetchTopAnimeParams = {}): Promise<TopAnimeResponse> => {
    const { page = 1, type: rawType, sfw = true, limit = 10, filter } = params
    const type = normalizeAnimeType(rawType)
    return apiGet('/top/anime', {
        page,
        ...(type ? { type } : {}),
        sfw,
        limit,
        ...(filter ? { filter } : {}),
    })
}

export default { fetchAnimeList, fetchAnimeById, fetchAnimeEpisodes, fetchAnimePictures, fetchTopAnime }
