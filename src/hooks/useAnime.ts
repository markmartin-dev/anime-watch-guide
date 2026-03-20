import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
    fetchAnimeList,
    fetchAnimeById,
    fetchAnimeEpisodes,
    fetchTopAnime,
    fetchSeasonAnime,
    fetchAnimePictures,
    fetchAnimeRecommendations,
    type FetchAnimeListParams,
    type FetchTopAnimeParams,
    type FetchSeasonAnimeBaseParams,
    type FetchSeasonAnimeParams,
    type FetchAnimeRecommendationsParams
} from '../services/animeService'
import type {
  AnimeEpisodesResponse,
  AnimeListResponse,
  AnimeRecommendationsResponse,
} from '../types/anime'

export const useAnimeList = (params: number | FetchAnimeListParams = 1) => {
  const normalized = typeof params === 'number' ? { page: params } : params
  const {
    page = 1,
    limit = 10,
    orderBy = 'popularity',
    q,
    sfw = false,
    type,
    status,
  } = normalized
  const statusKey = Array.isArray(status) ? status.join(',') : status ?? ''

  return useQuery<AnimeListResponse, Error>({
    queryKey: ['anime', page, limit, orderBy, q ?? '', sfw, type ?? '', statusKey],
    queryFn: () => fetchAnimeList({ page, limit, orderBy, q, sfw, type, status }),
    keepPreviousData: true,
  })
}

export const useTopAnime = (params: number| FetchTopAnimeParams = 1) => {
    const normalized = typeof params === 'number' ? { page: params } : params
    const { page = 1, type, sfw = true, limit = 10, filter } = normalized
    return useQuery({
        queryKey: ['topAnime', page, type, sfw, limit, filter],
        queryFn: () => fetchTopAnime({ page, type, sfw, limit, filter }),
        keepPreviousData: true,
    })  
}   

export const useSeasonAnime = (
  params: number | FetchSeasonAnimeParams = {},
) => {
  const normalized = typeof params === 'number' ? { page: params, mode: 'now' as const } : params
  const { mode, page, limit, sfw, continuing, unapproved, filter } = normalized

  return useQuery<AnimeListResponse, Error>({
    queryKey: [
      'seasonAnime',
      mode ?? 'all',
      'year' in normalized ? normalized.year : '',
      'season' in normalized ? normalized.season : '',
      page ?? '',
      limit ?? '',
      sfw ?? '',
      continuing ?? '',
      unapproved ?? '',
      filter ?? '',
    ],
    queryFn: () => fetchSeasonAnime(normalized),
    keepPreviousData: true,
  })
}

export const useSeason = (params: number | FetchSeasonAnimeBaseParams = 1) => {
  const normalized = typeof params === 'number' ? { page: params } : params
  return useSeasonAnime({ ...normalized, mode: 'now' })
}

export const useAnimeRecommendations = (
  params: number | FetchAnimeRecommendationsParams = 1,
) => {
  const normalized = typeof params === 'number' ? { page: params } : params
  const { page = 1 } = normalized

  return useQuery<AnimeRecommendationsResponse, Error>({
    queryKey: ['animeRecommendations', page],
    queryFn: () => fetchAnimeRecommendations({ page }),
    keepPreviousData: true,
  })
}

export const useAnimeById = (id?: string) => {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: () => fetchAnimeById(id || ''),
    enabled: Boolean(id),
  })
}

export const useAnimeEpisodes = (id?: string, page = 1) => {
  return useQuery({
    queryKey: ['anime', id, 'episodes', page],
    queryFn: () => fetchAnimeEpisodes(id || '', page),
    enabled: Boolean(id),
  })
}

export const useAnimeEpisodesInfinite = (id?: string) => {
  return useInfiniteQuery<AnimeEpisodesResponse, Error>({
    queryKey: ['anime', id, 'episodes', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchAnimeEpisodes(id || '', Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.pagination?.has_next_page) return undefined
      return allPages.length + 1
    },
    enabled: Boolean(id),
  })
}

export const useAnimePictures = (id?: string) => {
  return useQuery({
    queryKey: ['anime', id, 'pictures'],
    queryFn: () => fetchAnimePictures(id || ''),
    enabled: Boolean(id),
  })
}

export default {
  useAnimeList,
  useTopAnime,
  useSeasonAnime,
  useSeason,
  useAnimeRecommendations,
  useAnimeById,
  useAnimeEpisodes,
  useAnimeEpisodesInfinite,
  useAnimePictures,
}
