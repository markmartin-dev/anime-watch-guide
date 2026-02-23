import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import AnimeImage from '../../components/anime/AnimeImage'
import { useAnimeById, useAnimeEpisodesInfinite, useAnimePictures } from '../../hooks/useAnime'
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

type Anime = {
  type?: string
  status?: string
  score?: number
  rank?: number
  popularity?: number
  year?: number
  episodes?: number
  title?: string
  synopsis?: string
  images?: Parameters<typeof AnimeImage>[0]['images']
  // Add any other properties you expect from the anime object
}

const AnimeDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id, slug } = useParams()
  const { data, isLoading, error } = useAnimeById(id)
  const {
    data: episodesPages,
    isLoading: isEpisodesLoading,
    error: episodesError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAnimeEpisodesInfinite(id)
  const anime: Anime | undefined = data?.data
  const episodes = (episodesPages?.pages ?? [])
    .flatMap((page) => (Array.isArray(page?.data) ? page.data : []))
    .filter((ep): ep is Episode => Boolean(ep?.mal_id))
  const dedupedEpisodes = Array.from(new Map(episodes.map((ep) => [ep.mal_id, ep])).values())
  const fillerEpisodes = dedupedEpisodes.filter((ep) => ep.filler === true)
  const recapEpisodes = dedupedEpisodes.filter((ep) => ep.recap === true && ep.filler !== true)
  const canonEpisodes = dedupedEpisodes.filter((ep) => ep.filler !== true && ep.recap !== true)
  const { data: animePics } = useAnimePictures(id)  
  console.log('Anime pictures data:', animePics)
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
        <ul className='anime__meta'>
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
        <div>
            <h2>Pictures</h2>
            {animePics?.data?.length ? (
              <div className="anime-pictures__grid">
                {animePics.data.map(
                  (pic, i: number) => (
                    <AnimeImage
                        key={i + 1}
                        images={pic}
                        title={`${anime?.title} Picture`}
                        loading="lazy"
                        className="anime-pictures__image"
                    />
                  )
                )}
              </div>
            ) : (
              <p>No pictures available.</p>
            )}
        </div>
        {anime?.type === 'TV' && 
        <div className="episodes-list__wrapper">            
            <h2>Episode List</h2>
            {isEpisodesLoading && <p>Loading episodes...</p>}
            {episodesError && (
              <p>
                Error loading episodes
                {episodesError instanceof Error ? `: ${episodesError.message}` : ''}
              </p>
            )}
            {!isEpisodesLoading && !episodesError && !dedupedEpisodes.length && (
              <p>No episodes found.</p>
            )}
            {!isEpisodesLoading && !episodesError && Boolean(dedupedEpisodes.length) && (
              <>
                <button
                  type="button"
                  className="episode-load-more__button"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? 'Loading more episodes...'
                    : hasNextPage
                    ? 'Load more episodes'
                    : 'No more episodes'}
                </button>
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
        </div>
        }
      </main>
    </div>
  )
}

export default AnimeDetail
