import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/layout/Header'
import AnimeImage from '../../components/anime/AnimeImage'
import { useAnimeById, useAnimeEpisodesInfinite, useAnimePictures } from '../../hooks/useAnime'
import { slugify } from '../../utils/slug'
import { formatAiredDate } from '../../utils/format'
import type { Anime, AnimeEpisode, AnimeImages } from '../../types/anime'
import styles from './AnimeDetail.module.css'

const getEpisodeNumbers = (episodes: AnimeEpisode[]): number[] =>
  Array.from(
    new Set(
      episodes
        .map((ep) => ep.mal_id)
        .filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0),
    ),
  ).sort((a, b) => a - b)

const formatEpisodeRanges = (numbers: number[]): string => {
  if (!numbers.length) return 'N/A'
  const ranges: string[] = []
  let start = numbers[0]
  let end = numbers[0]

  for (let i = 1; i < numbers.length; i += 1) {
    const current = numbers[i]
    if (current === end + 1) {
      end = current
      continue
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`)
    start = current
    end = current
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`)
  return ranges.join(', ')
}

const getEpisodeType = (episode: AnimeEpisode) => {
  if (episode.filler === true) return 'Filler'
  if (episode.recap === true) return 'Recap'
  return 'Canon'
}

const getEpisodeSummary = (episode: AnimeEpisode) => {
  if (episode.filler === true) {
    return 'Side-route material that can be skipped if you want the shortest canon path.'
  }
  if (episode.recap === true) {
    return 'A recap-focused episode that revisits earlier events before the next story beat.'
  }
  return 'Core story episode that pushes the main narrative forward.'
}

const AnimeDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id, slug } = useParams()
  const [showAllEpisodes, setShowAllEpisodes] = useState(false)
  const { data, isLoading, error } = useAnimeById(id)
  const {
    data: episodesPages,
    isLoading: isEpisodesLoading,
    error: episodesError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAnimeEpisodesInfinite(id)
  const anime = data?.data as Anime | undefined
  const episodes = (episodesPages?.pages ?? [])
    .flatMap((page) => (Array.isArray(page?.data) ? page.data : []))
    .filter((ep): ep is AnimeEpisode => Boolean(ep?.mal_id))
  const dedupedEpisodes = Array.from(new Map(episodes.map((ep) => [ep.mal_id, ep])).values())
  const fillerEpisodes = dedupedEpisodes.filter((ep) => ep.filler === true)
  const recapEpisodes = dedupedEpisodes.filter((ep) => ep.recap === true && ep.filler !== true)
  const canonEpisodes = dedupedEpisodes.filter((ep) => ep.filler !== true && ep.recap !== true)
  const canonRanges = formatEpisodeRanges(getEpisodeNumbers(canonEpisodes))
  const fillerRanges = formatEpisodeRanges(getEpisodeNumbers(fillerEpisodes))
  const recapRanges = formatEpisodeRanges(getEpisodeNumbers(recapEpisodes))
  const { data: animePics } = useAnimePictures(id)

  useEffect(() => {
    if (!anime || !id) return
    const canonicalSlug = slugify(anime.title)
    if (slug !== canonicalSlug) {
      navigate(`/anime/${id}/${canonicalSlug}`, { replace: true })
    }
  }, [anime, id, slug, navigate])

  useEffect(() => {
    if (anime?.type !== 'TV') return
    if (isEpisodesLoading || isFetchingNextPage || episodesError) return
    if (!hasNextPage) return
    fetchNextPage()
  }, [
    anime?.type,
    hasNextPage,
    isEpisodesLoading,
    isFetchingNextPage,
    episodesError,
    fetchNextPage,
  ])

  const galleryImages = useMemo<AnimeImages[]>(() => {
    const pictures = animePics?.data?.slice(0, 4) ?? []
    if (pictures.length) return pictures
    return anime?.images ? [anime.images] : []
  }, [anime?.images, animePics?.data])

  const visibleEpisodes = showAllEpisodes ? dedupedEpisodes : dedupedEpisodes.slice(0, 6)
  const airedLabel = anime?.aired?.string ?? (anime?.year ? String(anime.year) : 'N/A')
  const studioLabel = anime?.studios?.[0]?.name ?? 'Unknown'
  const genreLabel =
    anime?.genres?.slice(0, 3).map((genre) => genre.name).join(', ') || 'Watch guide'
  const heroTag = anime?.rating ?? anime?.type ?? 'TV'
  const detailRating = anime?.rating ?? 'N/A'
  const heroImageUrl =
    anime?.images?.webp?.large_image_url ??
    anime?.images?.jpg?.large_image_url ??
    anime?.images?.webp?.image_url ??
    anime?.images?.jpg?.image_url ??
    anime?.images?.webp?.small_image_url ??
    anime?.images?.jpg?.small_image_url

  if (isLoading) {
    return (
      <div className="page-shell">
        <Header />
        <main className="page-main">
          <section className="panel page-intro">
            <p className="eyebrow">Guide profile</p>
            <h1>Loading anime profile...</h1>
          </section>
        </main>
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="page-shell">
        <Header />
        <main className="page-main">
          <section className="panel page-intro">
            <p className="eyebrow">Guide profile</p>
            <h1>Error loading anime.</h1>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <Header />
      <main className={`page-main ${styles.page}`}>
        <section className={styles.hero}>
          <div
            className={styles.heroBackground}
            style={heroImageUrl ? { backgroundImage: `url(${heroImageUrl})` } : undefined}
            aria-hidden="true"
          ></div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.heroBadges}>
              <span className={styles.heroBadgePrimary}>Trending #1</span>
              <span className={styles.heroBadge}>{heroTag}</span>
            </div>
            <h1 className={styles.heroTitle}>{anime.title}</h1>
            <div className={styles.heroMeta}>
              <span>
                <span className="material-symbols-outlined">
                    star
                </span>
                {anime.score ?? 'N/A'} Rating</span>
              &middot; <span>{genreLabel}</span>
              &middot; <span>{anime.year ?? 'N/A'}</span>
              &middot; <span>{anime.duration ?? 'N/A'}</span>
            </div>
            <div className={styles.heroActions}>
              <a className="button" href="#episodes">
                <span className="material-symbols-outlined">play_arrow</span>
                Watch
              </a>
              <a className="button button--secondary" href="#breakdown">
                <span className="material-symbols-outlined">add</span>
                Episode Breakdown
              </a>
            </div>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <article className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <span className={styles.sectionAccent}></span>
                <h2 className={styles.sectionTitle}>Synopsis</h2>
              </div>
              <p className={styles.synopsisCopy}>
                {anime.synopsis || anime.background || 'No synopsis available.'}
              </p>
            </article>

            <article id="breakdown" className={styles.sectionCard}>
              <div className={styles.sectionTitleRow}>
                <span className={styles.sectionAccent}></span>
                <h2 className={styles.sectionTitle}>Episode Breakdown</h2>
              </div>

              <div className={styles.breakdownGrid}>
                <div className={`${styles.breakdownCard} ${styles.breakdownCardCanon}`}>
                  <span className={styles.breakdownLabel}>Canon</span>
                  <strong className={styles.breakdownValue}>{canonEpisodes.length}</strong>
                </div>
                <div className={`${styles.breakdownCard} ${styles.breakdownCardFiller}`}>
                  <span className={styles.breakdownLabel}>Filler</span>
                  <strong className={styles.breakdownValue}>{fillerEpisodes.length}</strong>
                </div>
                <div className={`${styles.breakdownCard} ${styles.breakdownCardRecap}`}>
                  <span className={styles.breakdownLabel}>Recap</span>
                  <strong className={styles.breakdownValue}>{recapEpisodes.length}</strong>
                </div>
              </div>

              <div className={styles.rangeStack}>
                <div className={styles.rangeItem}>
                  <span className={`${styles.rangeDot} ${styles.rangeDotCanon}`}></span>
                  <div>
                    <h3>Canon Episodes</h3>
                    <p>{canonRanges}</p>
                  </div>
                </div>
                <div className={styles.rangeItem}>
                  <span className={`${styles.rangeDot} ${styles.rangeDotFiller}`}></span>
                  <div>
                    <h3>Filler Episodes</h3>
                    <p>{fillerRanges}</p>
                  </div>
                </div>
                <div className={styles.rangeItem}>
                  <span className={`${styles.rangeDot} ${styles.rangeDotRecap}`}></span>
                  <div>
                    <h3>Recap Episodes</h3>
                    <p>{recapRanges}</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className={styles.sidebar}>
            <article className={styles.sideCard}>
              <div className={styles.sideHeader}>
                <span className="material-symbols-outlined">info</span>
                <h2 className={styles.sideTitle}>Details</h2>
              </div>
              <div className={styles.detailRows}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={`${styles.detailValue} ${styles.detailValueStatus}`}>
                    {anime.status ?? 'Unknown'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Aired</span>
                  <span className={styles.detailValue}>{airedLabel}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Studio</span>
                  <span className={styles.detailValue}>{studioLabel}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Rating</span>
                  <span className={styles.detailValue}>{detailRating}</span>
                </div>
              </div>
            </article>

            <article className={styles.sideCard}>
              <div className={styles.sideHeader}>
                <span className="material-symbols-outlined">photo_library</span>
                <h2 className={styles.sideTitle}>Gallery</h2>
              </div>
              <div className={styles.galleryGrid}>
                {galleryImages.slice(0, 4).map((imageSet: AnimeImages, index: number) => (
                  <div key={`${anime.mal_id}-gallery-${index}`} className={styles.galleryItem}>
                    <AnimeImage
                      images={imageSet}
                      title={`${anime.title} gallery ${index + 1}`}
                      loading="lazy"
                      className={styles.galleryImage}
                    />
                    {index === 3 && galleryImages.length > 4 ? (
                      <span className={styles.galleryMore}>+{galleryImages.length - 3} More</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.sideCard}>
              <h2 className={styles.sideTitle}>Tags</h2>
              <div className={styles.tagWrap}>
                {(anime.genres?.slice(0, 6) ?? []).map((genre) => (
                  <span key={genre.mal_id} className={styles.tag}>
                    {genre.name}
                  </span>
                ))}
              </div>
            </article>
          </aside>
        </section>

        <section id="episodes" className={styles.episodesSection}>
          <div className={styles.episodesHeader}>
            <div className={styles.sectionTitleRow}>
              <span className={styles.sectionAccent}></span>
              <h2 className={styles.sectionTitle}>Episodes</h2>
            </div>
            <span className={styles.episodesCount}>
              {dedupedEpisodes.length} Episodes available
            </span>
          </div>

          {isEpisodesLoading && <p className={styles.episodeState}>Loading episodes...</p>}
          {episodesError && (
            <p className={styles.episodeState}>
              Error loading episodes
              {episodesError instanceof Error ? `: ${episodesError.message}` : ''}
            </p>
          )}
          {!isEpisodesLoading && !episodesError && !dedupedEpisodes.length && (
            <p className={styles.episodeState}>No episodes found.</p>
          )}

          {!isEpisodesLoading && !episodesError && Boolean(dedupedEpisodes.length) && (
            <>
              <div className={styles.episodeList}>
                {visibleEpisodes.map((episode, index) => {
                  const episodeType = getEpisodeType(episode)
                  const imageSet = galleryImages[index % Math.max(galleryImages.length, 1)] ?? anime.images

                  return (
                    <article key={episode.mal_id} className={styles.episodeCard}>
                      <div className={styles.episodeThumbWrap}>
                        {imageSet ? (
                          <AnimeImage
                            images={imageSet}
                            title={`${anime.title} episode ${episode.mal_id}`}
                            loading="lazy"
                            className={styles.episodeThumb}
                          />
                        ) : null}
                        <span className={styles.episodeThumbMeta}>
                          {anime.duration ?? 'N/A'}
                        </span>
                      </div>

                      <div className={styles.episodeBody}>
                        <div className={styles.episodeTopRow}>
                          <h3 className={styles.episodeTitle}>
                            {episode.mal_id}. {episode.title ?? 'Untitled'}
                          </h3>
                          <span
                            className={
                              episodeType === 'Canon'
                                ? `${styles.episodeType} ${styles.episodeTypeCanon}`
                                : episodeType === 'Filler'
                                  ? `${styles.episodeType} ${styles.episodeTypeFiller}`
                                  : `${styles.episodeType} ${styles.episodeTypeRecap}`
                            }
                          >
                            {episodeType}
                          </span>
                        </div>
                        <p className={styles.episodeDescription}>{getEpisodeSummary(episode)}</p>
                        <span className={styles.episodeMeta}>
                          Aired {formatAiredDate(episode.aired)}
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>

              {dedupedEpisodes.length > 6 ? (
                <button
                  type="button"
                  className={styles.episodeToggle}
                  onClick={() => setShowAllEpisodes((current) => !current)}
                >
                  {showAllEpisodes
                    ? 'Show Fewer Episodes'
                    : `Show All ${dedupedEpisodes.length} Episodes`}
                </button>
              ) : null}

              {isFetchingNextPage && (
                <span className={styles.loadingChip}>Loading remaining pages...</span>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default AnimeDetail
