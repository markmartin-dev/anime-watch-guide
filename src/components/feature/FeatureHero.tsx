import React from 'react'
import { Link } from 'react-router-dom'
import AnimeImage from '../anime/AnimeImage'
import type { AnimeImages } from '../../types/anime'
import styles from './FeatureHero.module.css'

type FeatureHeroProps = {
  badge: string
  title: string
  description: string
  image?: AnimeImages
  href: string
  primaryLabel?: string
  secondaryLabel?: string
}

const FeatureHero: React.FC<FeatureHeroProps> = ({
  badge,
  title,
  description,
  image,
  href,
  primaryLabel = 'Watch Now',
  secondaryLabel = 'Details',
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.media}>
        {image ? (
          <AnimeImage
            images={image}
            title={title}
            loading="eager"
            preferredSize="large"
            className={styles.image}
          />
        ) : null}
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <span className={styles.badge}>{badge}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.copy}>{description}</p>
          <div className={styles.actions}>
            <Link className="button" to={href}>
              <span className="material-symbols-outlined">play_arrow</span>
              {primaryLabel}
            </Link>
            <Link className="button button--secondary" to={href}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureHero
