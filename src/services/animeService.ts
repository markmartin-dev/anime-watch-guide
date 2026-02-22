import { apiGet } from '../api/client'
import type { AnimeListResponse, Anime } from '../types/anime'

export const fetchAnimeList = async (page = 1): Promise<AnimeListResponse> => {
  return apiGet('/anime', { page })
}

export const fetchAnimeById = async (id: string | number): Promise<{ data: Anime }> => {
  return apiGet(`/anime/${id}`)
}

export const fetchAnimeEpisodes = async (id: string | number, page = 1) => {
  return apiGet(`/anime/${id}/episodes`, { page })
}

export default { fetchAnimeList, fetchAnimeById, fetchAnimeEpisodes }
