import { useQuery } from '@tanstack/react-query'
import { fetchAnimeList, fetchAnimeById } from '../services/animeService'
import type { AnimeListResponse } from '../types/anime'

export const useAnimeList = (page = 1) => {
  return useQuery<AnimeListResponse, Error>(['anime', page], () => fetchAnimeList(page), {
    keepPreviousData: true,
  })
}

export const useAnimeById = (id?: string) => {
  return useQuery(['anime', id], () => fetchAnimeById(id || ''), { enabled: Boolean(id) })
}

export default { useAnimeList, useAnimeById }
