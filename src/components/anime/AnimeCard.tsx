import React from 'react'
import { Link } from 'react-router-dom'
import { slugify } from '../../utils/slug'
import type { Anime } from '../../types/anime'
import AnimeImage from './AnimeImage'

const AnimeCard: React.FC<{ anime: Anime }> = ({ anime }) => {
  const slug = slugify(anime.title)

  return (
    <article>
      <AnimeImage images={anime.images} title={anime.title} loading="lazy" />
      <h3>
        <Link to={`/anime/${anime.mal_id}/${slug}`}>{anime.title}</Link>
      </h3>
      <p>{anime.synopsis}</p>
      <ul>
        {anime.genres?.map((genre) => (
          <li key={genre.mal_id}><Link to={`/genres/${genre.mal_id}`}>{genre.name}</Link></li>
        ))}
      </ul>
    </article>
  )
}

export default AnimeCard
