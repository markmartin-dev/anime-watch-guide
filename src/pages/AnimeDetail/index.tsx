import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import AnimeImage from '../../components/anime/AnimeImage'
import { useAnimeById, useAnimeEpisodes } from '../../hooks/useAnime'
import { slugify } from '../../utils/slug'

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
        <p>{anime?.synopsis}</p>
        {anime?.type === 'TV' && 
        <>            
            <h2>Episodes</h2>
            <ul>
                {isEpisodesLoading && <li>Loading episodes...</li>}
                {episodesError && (
                  <li>
                    Error loading episodes
                    {episodesError instanceof Error ? `: ${episodesError.message}` : ''}
                  </li>
                )}
                {!isEpisodesLoading && !episodesError && !episodesData?.data?.length && (
                <li>No episodes found.</li>
                )}
                {episodesData?.data?.map((ep) => (
                    <li key={ep.mal_id}>
                        Episode {ep.episode_id}: {ep.title} ({ep.aired})
                        <span>{ep.filler === true ? ' (Filler Episode)' : ep.recap === true ? ' (Recap Episode)' : ' (Canon Episode)'}</span>
                    </li>
                ))}
            </ul>
        </>
        }
        <AnimeImage images={anime?.images} title={anime?.title ?? 'Anime'} loading="eager" preferredSize="large" />
      </main>
    </div>
  )
}

export default AnimeDetail
