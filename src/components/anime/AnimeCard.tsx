import React from 'react'
import { Link } from 'react-router-dom'

const AnimeCard: React.FC<{ anime: any }> = ({ anime }) => {
  return (
    <article>
      <h3>
        <Link to={`/anime/${anime.mal_id}`}>{anime.title}</Link>
      </h3>
      <p>{anime.synopsis}</p>
      <ul>
        {anime.genres.map((genre: any) => (
          <li key={genre.mal_id}><Link to={`/genres/${genre.mal_id}`}>{genre.name}</Link></li>
        ))}
      </ul>
    </article>
  )
}

export default AnimeCard
