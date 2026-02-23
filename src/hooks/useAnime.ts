import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchAnimeList,
  fetchAnimeById,
  fetchAnimeEpisodes,
  fetchTopAnime,
  type FetchAnimeListParams,
  type FetchTopAnimeParams,
  fetchAnimePictures
} from '../services/animeService'
import type { AnimeListResponse } from '../types/anime'

export const useAnimeList = (params: number | FetchAnimeListParams = 1) => {
  const normalized = typeof params === 'number' ? { page: params } : params
  const {
    page = 1,
    limit = 10,
    orderBy = 'popularity',
    sfw = false,
    type,
  } = normalized

  return useQuery<AnimeListResponse, Error>({
    queryKey: ['anime', page, limit, orderBy, sfw, type ?? ''],
    queryFn: () => fetchAnimeList({ page, limit, orderBy, sfw, type }),
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

type AnimeEpisodesPage = {
  data?: Array<{
    mal_id: number
    episode_id?: number
    title?: string
    aired?: string
    filler?: boolean
    recap?: boolean
  }>
  pagination?: {
    current_page?: number
    has_next_page?: boolean
  }
}

export const useAnimeEpisodesInfinite = (id?: string) => {
  return useInfiniteQuery<AnimeEpisodesPage, Error>({
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

export default { useAnimeList, useAnimeById, useAnimeEpisodes, useAnimeEpisodesInfinite, useAnimePictures }