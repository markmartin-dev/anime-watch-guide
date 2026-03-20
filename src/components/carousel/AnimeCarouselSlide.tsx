import React from 'react'
import { Link } from 'react-router-dom'
import AnimeImage from '../anime/AnimeImage'
import { slugify } from '../../utils/slug'
import styles from './AnimeCarouselSlide.module.css'

type AnimeCarouselSlideProps = {
  id: string
  title: string
  synopsis?: string | null
  images?: Parameters<typeof AnimeImage>[0]['images']
}

const AnimeCarouselSlide: React.FC<AnimeCarouselSlideProps> = ({ id, title, synopsis, images }) => {
  const slug = slugify(title)

  return (
    <Link to={`/anime/${id}/${slug}`} className={styles.linkOverlay} aria-label={`View details for ${title}`}>
      <article className={styles.card}>
        <AnimeImage
          images={images}
          title={title}
          loading="lazy"
          className={styles.image}
          preferredSize="large"
        />
        <div className={styles.overlay}></div>
        <div className={styles.textContent}>
          <p className={styles.eyebrow}>Priority transmission</p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.synopsis}>
            {synopsis ||
              'Open the guide to inspect canon episodes, filler routes, and the fastest watch order.'}
          </p>
          <span className={styles.cta}>Open guide</span>
        </div>
      </article>
    </Link>
  )
}

export default AnimeCarouselSlide
