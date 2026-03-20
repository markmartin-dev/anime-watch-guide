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
      <div className={styles.mediaFrame}>
        <div className={styles.signalRow}>
          <span className={styles.signalBadge}>{anime.type ?? 'TV'}</span>
          <span className={styles.scoreBadge}>{anime.score ? anime.score.toFixed(1) : 'N/A'}</span>
        </div>
        <AnimeImage
          images={anime.images}
          title={anime.title}
          loading="lazy"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Catalog entry</p>
        <h3 className={styles.title}>
          <Link className={styles.titleLink} to={`/anime/${anime.mal_id}/${slug}`}>
            {anime.title}
          </Link>
        </h3>
        <p className={styles.synopsis}>
          {anime.synopsis || anime.background || 'No synopsis available.'}
        </p>
      </div>

      <ul className={styles.metaList}>
        <li className={styles.metaItem}>Type: {anime.type}</li>
        <li className={styles.metaItem}>Episodes: {anime.episodes ?? 'N/A'}</li>
        <li className={styles.metaItem}>Status: {anime.status}</li>
      </ul>

      {anime.genres && anime.genres.length > 0 && (
        <ul className={styles.genreList}>
          {anime.genres.map((genre) => (
            <li className={styles.genreItem} key={genre.mal_id}>
              <span className={styles.genreLink}>{genre.name}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.footer}>
        <Link className={styles.detailLink} to={`/anime/${anime.mal_id}/${slug}`}>
          View anime
        </Link>
      </div>
    </article>
  )
}

export default AnimeCard
