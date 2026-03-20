import { apiGet } from '../api/client'
import type {
  AnimeListResponse,
  Anime,
  TopAnimeResponse,
  AnimeRecommendationsResponse,
  AnimeGenresResponse,
  AnimePicturesResponse,
} from '../types/anime'

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
    q?: string
    sfw?: boolean
    type?: string
    genres?: string
    start_date?: string
    end_date?: string
    min_score?: number
    max_score?: number
    status?: string
}

export type FetchTopAnimeParams = {
    page?: number
    type?: string
    sfw?: boolean
    limit?: number
    filter?: string
}

export type FetchAnimeRecommendationsParams = {
  page?: number
}

export type FetchAnimeGenresParams = {
  filter?: 'genres' | 'explicit_genres' | 'themes' | 'demographics'
}

export type SeasonName = 'winter' | 'spring' | 'summer' | 'fall'

export type FetchSeasonAnimeBaseParams = {
  page?: number
  limit?: number
  sfw?: boolean
  continuing?: boolean
  unapproved?: boolean
  filter?: string
}

export type FetchSeasonAnimeParams =
  | (FetchSeasonAnimeBaseParams & { mode?: undefined })
  | (FetchSeasonAnimeBaseParams & { mode: 'now' })
  | (FetchSeasonAnimeBaseParams & { mode: 'upcoming' })
  | (FetchSeasonAnimeBaseParams & {
      mode: 'season'
      year: number
      season: SeasonName
    })

export const fetchAnimeList = async (params: FetchAnimeListParams = {}): Promise<AnimeListResponse> => {
  const {
    page = 1,
    limit = 20,
    orderBy = 'title',
    q,
    sfw = true,
    type: rawType,
    genres,
    start_date,
    end_date,
    min_score,
    max_score,
    status
  } = params
  const type = normalizeAnimeType(rawType)

  return apiGet('/anime', {
    page,
    limit,
    order_by: orderBy,
    ...(q ? { q } : {}),
    sfw,
    ...(type ? { type } : {}),
    ...(genres ? { genres } : {}),
    ...(start_date ? { start_date } : {}),
    ...(end_date ? { end_date } : {}),
    ...(status ? { status } : {}),
    ...(min_score ? { min_score } : {}),
    ...(max_score ? { max_score } : {}),
  })
}

export const fetchAnimeById = async (id: string | number): Promise<{ data: Anime }> => {
  return apiGet(`/anime/${id}`)
}

export const fetchAnimeEpisodes = async (id: string | number, page = 1) => {
  return apiGet(`/anime/${id}/episodes`, { page })
}

export const fetchAnimePictures = async (id: string | number): Promise<AnimePicturesResponse> => {
  return apiGet(`/anime/${id}/pictures`)
}

export const fetchAnimeGenres = async (
  params: FetchAnimeGenresParams = {},
): Promise<AnimeGenresResponse> => {
  const { filter = 'genres' } = params
  return apiGet('/genres/anime', { filter })
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

export const fetchSeasonAnime = async (
  params: FetchSeasonAnimeParams = {},
): Promise<AnimeListResponse> => {
  if (!params.mode) {
    return apiGet('/seasons')
  }

  const {
    page = 1,
    limit = 20,
    sfw = true,
    continuing = true,
    unapproved = false,
    filter,
  } = params

  let path = '/seasons/now'
  if (params.mode === 'upcoming') {
    path = '/seasons/upcoming'
  } else if (params.mode === 'season') {
    path = `/seasons/${params.year}/${params.season}`
  }

  return apiGet(path, {
    page,
    limit,
    sfw,
    continuing,
    unapproved,
    ...(filter ? { filter } : {}),
  })
}

export const fetchSeasonNow = async (
  params: FetchSeasonAnimeBaseParams = {},
): Promise<AnimeListResponse> => fetchSeasonAnime({ ...params, mode: 'now' })

export const fetchAnimeRecommendations = async (
  params: FetchAnimeRecommendationsParams = {},
): Promise<AnimeRecommendationsResponse> => {
  const { page = 1 } = params
  return apiGet('/recommendations/anime', { page })
}

export default {
  fetchAnimeList,
  fetchAnimeById,
  fetchAnimeEpisodes,
  fetchAnimePictures,
  fetchAnimeGenres,
  fetchTopAnime,
  fetchSeasonAnime,
  fetchSeasonNow,
  fetchAnimeRecommendations,
}
