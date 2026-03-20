import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
    fetchAnimeList,
    fetchAnimeById,
    fetchAnimeEpisodes,
    fetchAnimeGenres,
    fetchTopAnime,
    fetchSeasonAnime,
    fetchAnimePictures,
    fetchAnimeRecommendations,
    type FetchAnimeListParams,
    type FetchAnimeGenresParams,
    type FetchTopAnimeParams,
    type FetchSeasonAnimeBaseParams,
    type FetchSeasonAnimeParams,
    type FetchAnimeRecommendationsParams
} from '../services/animeService'
import type {
  AnimeEpisodesResponse,
  AnimeGenresResponse,
  AnimeListResponse,
  AnimePicturesResponse,
  AnimeRecommendationsResponse,
  TopAnimeResponse,
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
    genres,
    start_date,
    end_date,
    min_score,
    max_score,
    status,
  } = normalized
  const statusKey = Array.isArray(status) ? status.join(',') : status ?? ''

  return useQuery<AnimeListResponse, Error>({
    queryKey: [
      'anime',
      page,
      limit,
      orderBy,
      q ?? '',
      sfw,
      type ?? '',
      genres ?? '',
      start_date ?? '',
      end_date ?? '',
      min_score ?? '',
      max_score ?? '',
      statusKey,
    ],
    queryFn: () =>
      fetchAnimeList({
        page,
        limit,
        orderBy,
        q,
        sfw,
        type,
        genres,
        start_date,
        end_date,
        min_score,
        max_score,
        status,
      }),
    placeholderData: keepPreviousData,
  })
}

export const useTopAnime = (params: number| FetchTopAnimeParams = 1) => {
    const normalized = typeof params === 'number' ? { page: params } : params
    const { page = 1, type, sfw = true, limit = 10, filter } = normalized
    return useQuery<TopAnimeResponse, Error>({
        queryKey: ['topAnime', page, type, sfw, limit, filter],
        queryFn: () => fetchTopAnime({ page, type, sfw, limit, filter }),
        placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
  })
}

export const useAnimeById = (id?: string) => {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: () => fetchAnimeById(id || ''),
    enabled: Boolean(id),
  })
}

export const useAnimeGenres = (params: FetchAnimeGenresParams = {}) => {
  const { filter = 'genres' } = params
  return useQuery<AnimeGenresResponse, Error>({
    queryKey: ['animeGenres', filter],
    queryFn: () => fetchAnimeGenres({ filter }),
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
  return useQuery<AnimePicturesResponse, Error>({
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
  useAnimeGenres,
  useAnimeEpisodes,
  useAnimeEpisodesInfinite,
  useAnimePictures,
}
