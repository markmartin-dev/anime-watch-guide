import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import { useAnimeById } from '../../hooks/useAnime'
import { slugify } from '../../utils/slug'

const AnimeDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id, slug } = useParams()
  const { data, isLoading, error } = useAnimeById(id)
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
        <p>{anime?.synopsis}</p>
      </main>
    </div>
  )
}

export default AnimeDetail
