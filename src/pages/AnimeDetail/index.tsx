import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import { useAnimeById } from '../../hooks/useAnime'

const AnimeDetail: React.FC = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useAnimeById(id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading anime</div>

  const anime = data?.data

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
