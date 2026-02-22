import React from 'react'
import { Link } from 'react-router-dom'
import { slugify } from '../../utils/slug'
import type { Anime } from '../../types/anime'
import AnimeImage from './AnimeImage'
import styles from './AnimeCard.module.css'

const AnimeCard: React.FC<{ anime: Anime }> = ({ anime }) => {
  const slug = slugify(anime.title)

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>
        <Link className={styles.titleLink} to={`/anime/${anime.mal_id}/${slug}`}>
          {anime.title}
        </Link>
      </h3>
      <AnimeImage
        images={anime.images}
        title={anime.title}
        loading="lazy"
        className={styles.image}
      />
      <p className={styles.synopsis}>{anime.synopsis || anime.background || 'No synopsis available.'}</p>

      <ul className={styles.metaList}>
        <li className={styles.metaItem}>Type: {anime.type}</li>
        <li className={styles.metaItem}>Episodes: {anime.episodes ?? 'N/A'}</li>
        <li className={styles.metaItem}>Status: {anime.status}</li>
      </ul>
      {anime.genres && anime.genres.length > 0 && (
      <ul className={styles.metaList}>
        {anime.genres?.map((genre) => (
          <li className={styles.genreItem} key={genre.mal_id}>
            <Link className={styles.genreLink} to={`/genres/${genre.mal_id}`}>
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
    </article>
  )
}

export default AnimeCard
