import React from 'react'
import type { AnimeImages, AnimeImageVariant } from '../../types/anime'
import styles from './AnimeImage.module.css'

type PreferredSize = 'small' | 'large'

type AnimeImageProps = {
  images?: AnimeImages
  title: string
  loading?: 'eager' | 'lazy'
  sizes?: string
  className?: string
  preferredSize?: PreferredSize
}

const DEFAULT_RESPONSIVE_SIZES =
  '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1440px) 30vw, 300px'

const buildWidthSrcSet = (imageSet?: AnimeImageVariant): string | undefined => {
  if (!imageSet) return undefined

  const candidates: Array<{ url?: string; width: string }> = [
    { url: imageSet.small_image_url, width: '42w' },
    { url: imageSet.image_url, width: '225w' },
    { url: imageSet.large_image_url, width: '450w' },
  ]

  const seen = new Set<string>()
  const entries = candidates
    .filter((candidate) => candidate.url && !seen.has(candidate.url))
    .map((candidate) => {
      seen.add(candidate.url as string)
      return `${candidate.url} ${candidate.width}`
    })

  return entries.length ? entries.join(', ') : undefined
}

const getFallbackImage = (images?: AnimeImages): string | undefined =>
  images?.webp?.image_url ??
  images?.webp?.small_image_url ??
  images?.jpg?.image_url ??
  images?.jpg?.small_image_url

const getPreferredSizeImage = (
  imageSet: AnimeImageVariant | undefined,
  preferredSize: PreferredSize,
): string | undefined => {
  if (!imageSet) return undefined
  if (preferredSize === 'small') {
    return imageSet.small_image_url ?? imageSet.image_url
  }
  return imageSet.large_image_url ?? imageSet.image_url
}

const AnimeImage: React.FC<AnimeImageProps> = ({
  images,
  title,
  loading = 'lazy',
  sizes = DEFAULT_RESPONSIVE_SIZES,
  className,
  preferredSize,
}) => {
  const webpSrcSet = preferredSize
    ? getPreferredSizeImage(images?.webp, preferredSize)
    : buildWidthSrcSet(images?.webp)
  const jpgSrcSet = preferredSize
    ? getPreferredSizeImage(images?.jpg, preferredSize)
    : buildWidthSrcSet(images?.jpg)
  const imgSrcSet = webpSrcSet ?? jpgSrcSet
  const fallbackImage = preferredSize
    ? getPreferredSizeImage(images?.webp, preferredSize) ??
      getPreferredSizeImage(images?.jpg, preferredSize) ??
      getFallbackImage(images)
    : getFallbackImage(images)

  if (!fallbackImage) return null
  const imageClassName = className ? `${styles.image} ${className}` : styles.image

  return (
    <picture className={styles.picture}>
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      {jpgSrcSet && <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />}
      <img
        src={fallbackImage}
        srcSet={imgSrcSet}
        sizes={sizes}
        alt={`${title} poster`}
        loading={loading}
        className={imageClassName}
      />
    </picture>
  )
}

export default AnimeImage
