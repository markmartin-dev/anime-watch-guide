import { useQuery } from '@tanstack/react-query'
import { fetchAnimeList, fetchAnimeById } from '../services/animeService'
import type { AnimeListResponse } from '../types/anime'

export const useAnimeList = (page = 1) => {
  return useQuery<AnimeListResponse, Error>({
    queryKey: ['anime', page],
    queryFn: () => fetchAnimeList(page),
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

export default { useAnimeList, useAnimeById }
