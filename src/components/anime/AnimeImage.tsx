import React from 'react'
import type { AnimeImages, AnimeImageVariant } from '../../types/anime'

type PreferredSize = 'small' | 'large'

type AnimeImageProps = {
  images?: AnimeImages
  title: string
  loading?: 'eager' | 'lazy'
  sizes?: string
  className?: string
  preferredSize?: PreferredSize
}

const buildDensitySrcSet = (imageSet?: AnimeImageVariant): string | undefined => {
  if (!imageSet) return undefined

  const candidates: Array<{ url?: string; density: string }> = [
    { url: imageSet.small_image_url, density: '1x' },
    { url: imageSet.image_url, density: '2x' },
    { url: imageSet.large_image_url, density: '3x' },
  ]

  const seen = new Set<string>()
  const entries = candidates
    .filter((candidate) => candidate.url && !seen.has(candidate.url))
    .map((candidate) => {
      seen.add(candidate.url as string)
      return `${candidate.url} ${candidate.density}`
    })

  return entries.length ? entries.join(', ') : undefined
}

const getFallbackImage = (images?: AnimeImages): string | undefined =>
  images?.jpg?.image_url ??
  images?.jpg?.small_image_url ??
  images?.webp?.image_url ??
  images?.webp?.small_image_url

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
  sizes,
  className,
  preferredSize,
}) => {
  const webpSrcSet = preferredSize
    ? getPreferredSizeImage(images?.webp, preferredSize)
    : buildDensitySrcSet(images?.webp)
  const jpgSrcSet = preferredSize
    ? getPreferredSizeImage(images?.jpg, preferredSize)
    : buildDensitySrcSet(images?.jpg)
  const fallbackImage = preferredSize
    ? getPreferredSizeImage(images?.jpg, preferredSize) ??
      getPreferredSizeImage(images?.webp, preferredSize) ??
      getFallbackImage(images)
    : getFallbackImage(images)

  if (!fallbackImage) return null

  return (
    <picture>
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      {jpgSrcSet && <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />}
      <img src={fallbackImage} alt={`${title} poster`} loading={loading} className={className} />
    </picture>
  )
}

export default AnimeImage
