import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import AnimeImage from '../../components/anime/AnimeImage'
import { useAnimeById, useAnimeEpisodes } from '../../hooks/useAnime'
import { slugify } from '../../utils/slug'
import { formatAiredDate } from '../../utils/format'

type Episode = {
  mal_id: number
  episode_id?: number
  title?: string
  aired?: string
  filler?: boolean
  recap?: boolean
}

const AnimeDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id, slug } = useParams()
  const { data, isLoading, error } = useAnimeById(id)
  const {
    data: episodesData,
    isLoading: isEpisodesLoading,
    error: episodesError,
  } = useAnimeEpisodes(id)
  const anime = data?.data
  const episodes: Episode[] = Array.isArray(episodesData?.data) ? episodesData.data : []
  const fillerEpisodes = episodes.filter((ep) => ep.filler === true)
  const recapEpisodes = episodes.filter((ep) => ep.recap === true && ep.filler !== true)
  const canonEpisodes = episodes.filter((ep) => ep.filler !== true && ep.recap !== true)

  useEffect(() => {
    if (!anime || !id) return
    const canonicalSlug = slugify(anime.title)
    if (slug !== canonicalSlug) {
      navigate(`/anime/${id}/${canonicalSlug}`, { replace: true })
    }
  }, [anime, id, slug, navigate])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading anime</div>

  return (
    <div>
      <Header />
      <main>
        <h1>{anime?.title}</h1>
        <ul>
            <li>Type: {anime.type}</li>
            <li>Status: {anime.status}</li>
            <li>Score: {anime.score ?? 'N/A'}</li>
            <li>Rank: {anime.rank ?? 'N/A'}</li>
            <li>Popularity: {anime.popularity ?? 'N/A'}</li>
            <li>Year: {anime.year ?? 'N/A'}</li>
            <li>Episodes: {anime.episodes ?? 'N/A'}</li>
        </ul>
        <AnimeImage images={anime?.images} title={anime?.title ?? 'Anime'} loading="eager" preferredSize="large" />
        <h2>Synopsis</h2>
        <p>{anime?.synopsis}</p>
        {anime?.type === 'TV' && 
        <>            
            <h2>Episode List</h2>
            {isEpisodesLoading && <p>Loading episodes...</p>}
            {episodesError && (
              <p>
                Error loading episodes
                {episodesError instanceof Error ? `: ${episodesError.message}` : ''}
              </p>
            )}
            {!isEpisodesLoading && !episodesError && !episodes.length && (
              <p>No episodes found.</p>
            )}
            {!isEpisodesLoading && !episodesError && Boolean(episodes.length) && (
              <>
                <details open name="episode-list">
                  <summary>Canon Episodes ({canonEpisodes.length})</summary>
                  <ul>
                    {canonEpisodes.map((ep) => (
                      <li key={ep.mal_id}>
                        Episode {ep.mal_id ?? 'N/A'}: {ep.title ?? 'Untitled'} ({formatAiredDate(ep.aired)})
                      </li>
                    ))}
                  </ul>
                </details>

                <details name="episode-list">
                  <summary>Recap Episodes ({recapEpisodes.length})</summary>
                  <ul>
                    {recapEpisodes.map((ep) => (
                      <li key={ep.mal_id}>
                        Episode {ep.mal_id ?? 'N/A'}: {ep.title ?? 'Untitled'} ({formatAiredDate(ep.aired)})
                      </li>
                    ))}
                  </ul>
                </details>

                <details name="episode-list">
                  <summary>Filler Episodes ({fillerEpisodes.length})</summary>
                  <ul>
                    {fillerEpisodes.map((ep) => (
                      <li key={ep.mal_id}>
                        Episode {ep.mal_id ?? 'N/A'}: {ep.title ?? 'Untitled'} ({formatAiredDate(ep.aired)})
                      </li>
                    ))}
                  </ul>
                </details>
              </>
            )}
        </>
        }
      </main>
    </div>
  )
}

export default AnimeDetail
