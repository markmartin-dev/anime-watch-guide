import React from 'react'
import { Link } from 'react-router-dom'
import AnimeImage from './AnimeImage'
import { slugify } from '../../utils/slug'
import type { Anime } from '../../types/anime'
import styles from './BrowseAnimeCard.module.css'

type BrowseAnimeCardProps = {
  anime: Anime
  isNew?: boolean
}

const getDisplayStatus = (status?: Anime['status']) => {
  const value = Array.isArray(status) ? status[0] : status
  if (!value) return 'Unknown'
  const normalized = value.trim().toLowerCase()
  if (normalized === 'airing' || normalized === 'currently airing') return 'Airing'
  if (normalized === 'complete' || normalized === 'finished airing') return 'Completed'
  if (normalized === 'upcoming') return 'Upcoming'
  return value
}

const getMetaValue = (anime: Anime) => {
  if (anime.episodes) return `Ep ${anime.episodes}`
  if (anime.duration) return anime.duration === 'Unknown' ? 'N/A' : anime.duration
  if (anime.year) return String(anime.year)
  return 'TV'
}

const BrowseAnimeCard: React.FC<BrowseAnimeCardProps> = ({ anime, isNew = false }) => {
  const href = `/anime/${anime.mal_id}/${slugify(anime.title)}`
  const genres =
    anime.genres?.slice(0, 3).map((genre) => genre.name).join(', ') || 'Curated anime guide'
  const status = getDisplayStatus(anime.status)

  return (
    <Link to={href} className={styles.card}>
      <div className={styles.media}>
        {isNew ? <span className={styles.newBadge}>New</span> : null}
        <AnimeImage images={anime.images} title={anime.title} loading="lazy" className={styles.image} />
        <div className={styles.mediaMeta}>
          <span className={styles.score}>
            <span className="material-symbols-outlined">star</span>
            {anime.score?.toFixed(2) ?? 'N/A'}
          </span>
          <span className={styles.type}>{anime.type ?? 'TV Series'}</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{anime.title}</h3>
        <p className={styles.genres}>{genres}</p>
        <div className={styles.footer}>
          <span className={styles.status}>
            <span
              className={
                status === 'Airing'
                  ? `${styles.statusDot} ${styles.statusDotAiring}`
                  : `${styles.statusDot} ${styles.statusDotMuted}`
              }
            ></span>
            {status}
          </span>
          <span className={styles.metaValue}>{getMetaValue(anime) ?? 'N/A'}</span>
        </div>
      </div>
    </Link>
  )
}

export default BrowseAnimeCard
