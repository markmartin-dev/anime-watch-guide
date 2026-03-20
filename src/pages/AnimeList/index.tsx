import React from 'react'
import { useSearchParams } from 'react-router-dom'
import BrowseAnimeCard from '../../components/anime/BrowseAnimeCard'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import { useAnimeGenres, useAnimeList } from '../../hooks/useAnime'
import styles from './AnimeList.module.css'

const VALID_QUERY_STATUSES = new Set(['airing', 'complete', 'upcoming'])

const STATUS_LABELS: Record<string, string> = {
  airing: 'Currently Airing',
  complete: 'Finished Airing',
  upcoming: 'Upcoming',
}

const SEASON_FILTERS = [
  { label: 'Spring 2026', value: 'spring-2026', start: '2026-03-01', end: '2026-05-31' },
  { label: 'Winter 2026', value: 'winter-2026', start: '2026-01-01', end: '2026-02-28' },
]

const AnimeList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = Number(searchParams.get('page') || '1')
  const queryParam = searchParams.get('q')?.trim() ?? ''
  const statusParam = searchParams.get('status')?.trim().toLowerCase() ?? ''
  const normalizedStatus = VALID_QUERY_STATUSES.has(statusParam) ? statusParam : undefined
  const genreParam = searchParams.get('genre')?.trim() ?? ''
  const seasonParam = searchParams.get('season')?.trim() ?? ''
  const activeSeason = SEASON_FILTERS.find((season) => season.value === seasonParam)
  const minScoreParamRaw = searchParams.get('min_score')
  const minScoreParam = Number(minScoreParamRaw)
  const normalizedMinScore =
    minScoreParamRaw && Number.isFinite(minScoreParam) && minScoreParam >= 0 && minScoreParam <= 10
      ? minScoreParam
      : 0
  const { data: genresData, isLoading: isGenresLoading } = useAnimeGenres({ filter: 'genres' })
  const genreItems = [...(genresData?.data ?? [])].sort((a, b) => a.name.localeCompare(b.name))
  const activeGenre = genreItems.find((genre) => String(genre.mal_id) === genreParam)

  const { data, isLoading, error, isFetching } = useAnimeList({
    page: pageParam,
    limit: 8,
    orderBy: 'title',
    q: queryParam || undefined,
    sfw: true,
    type: 'tv',
    genres: activeGenre ? String(activeGenre.mal_id) : undefined,
    start_date: activeSeason?.start,
    end_date: activeSeason?.end,
    min_score: minScoreParamRaw ? normalizedMinScore : undefined,
    status: normalizedStatus,
  })
  const animeItems = data?.data ?? []
  const hasActiveFilters = Boolean(
    normalizedStatus || activeGenre || activeSeason || minScoreParamRaw,
  )

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key)
        return
      }
      nextParams.set(key, value)
    })
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const resetFilters = () => {
    const nextParams = new URLSearchParams()
    if (queryParam) {
      nextParams.set('q', queryParam)
    }
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const goToPage = (p: number) => {
    if (p <= 0) return
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(p))
    setSearchParams(nextParams)
  }

  const pagination = data?.pagination
  const activeStatusLabel = normalizedStatus ? STATUS_LABELS[normalizedStatus] : 'All Statuses'
  const totalResults = pagination?.items?.total ?? animeItems.length
  const sortLabel = 'Popularity'
  const sliderPercent = `${(normalizedMinScore / 10) * 100}%`

  return (
    <div className="page-shell">
      <Header />
      <main className="page-main">
        <div className={styles.page}>
          <aside className={styles.sidebar}>
            <section className={styles.filterSection}>
              <div className={styles.filterHeader}>
                <span className={styles.filterLabel}>Genre</span>
                {hasActiveFilters ? (
                  <button type="button" className={styles.resetButton} onClick={resetFilters}>
                    Reset Filters
                  </button>
                ) : null}
              </div>
              <div className={`${styles.filterList} ${styles.filterListScrollable}`}>
                {isGenresLoading ? (
                  <div className={styles.stateCard}>Loading genres...</div>
                ) : (
                  genreItems.map((genre) => (
                    <button
                      key={genre.mal_id}
                      type="button"
                      className={
                        activeGenre?.mal_id === genre.mal_id
                          ? `${styles.filterButton} ${styles.filterButtonActive}`
                          : styles.filterButton
                      }
                      onClick={() =>
                        updateFilters({
                          genre:
                            activeGenre?.mal_id === genre.mal_id
                              ? undefined
                              : String(genre.mal_id),
                        })
                      }
                    >
                      <span className="material-symbols-outlined">sell</span>
                      {genre.name}
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className={styles.filterSection}>
              <span className={styles.filterLabel}>Status</span>
              <div className={styles.filterList}>
                {[
                  { value: 'airing', label: 'Airing' },
                  { value: 'complete', label: 'Completed' },
                  { value: 'upcoming', label: 'Upcoming' },
                ].map((statusOption) => (
                  <button
                    key={statusOption.value}
                    type="button"
                    className={
                      normalizedStatus === statusOption.value
                        ? `${styles.statusButton} ${styles.statusButtonActive}`
                        : styles.statusButton
                    }
                    onClick={() =>
                      updateFilters({
                        status:
                          normalizedStatus === statusOption.value ? undefined : statusOption.value,
                      })
                    }
                  >
                    <span className={styles.statusIndicator}></span>
                    {statusOption.label}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <span className={styles.filterLabel}>Season</span>
              <div className={styles.filterList}>
                {SEASON_FILTERS.map((season) => (
                  <button
                    key={season.value}
                    type="button"
                    className={
                      activeSeason?.value === season.value
                        ? `${styles.seasonButton} ${styles.seasonButtonActive}`
                        : styles.seasonButton
                    }
                    onClick={() =>
                      updateFilters({
                        season: activeSeason?.value === season.value ? undefined : season.value,
                      })
                    }
                  >
                    <span>{season.label}</span>
                    <span></span>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.filterSection}>
              <span className={styles.filterLabel}>Min Rating</span>
              <div className={styles.ratingBlock}>
                <div className={styles.ratingHeader}>
                  <span>0.0</span>
                  <span className={styles.ratingActive}>
                    {minScoreParamRaw ? `${normalizedMinScore.toFixed(1)}+` : 'Any'}
                  </span>
                  <span>10.0</span>
                </div>
                <div className={styles.sliderTrack}>
                  <span className={styles.sliderFill} style={{ width: sliderPercent }}></span>
                  <span className={styles.sliderThumb} style={{ left: `calc(${sliderPercent} - 10px)` }}></span>
                </div>
                <input
                  className={styles.sliderInput}
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={normalizedMinScore}
                  onChange={(event) => updateFilters({ min_score: event.target.value })}
                  aria-label="Minimum rating"
                />
              </div>
            </section>
          </aside>

          <section className={styles.content}>
            <div className={styles.topbar}>
              <div>
                <p className="eyebrow">Browse</p>
                <div className={styles.titleRow}>
                  <h1 className={styles.title}>
                    {queryParam ? `Results for "${queryParam}"` : 'Browsing Anime'}
                  </h1>
                  <span className={styles.results}>({totalResults.toLocaleString()} results)</span>
                </div>
              </div>

              <div className={styles.sortControl}>
                <span>Sort by:</span>
                <span className={styles.sortValue}>{sortLabel}</span>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>

            {isLoading && <div className={styles.stateCard}>Loading catalog entries...</div>}
            {error && <div className={styles.stateCard}>Error loading anime.</div>}
            {!isLoading && !error && animeItems.length === 0 && (
              <div className={styles.stateCard}>
                No anime found for the current search and filter combination.
              </div>
            )}

            {!error && animeItems.length > 0 && (
              <section className={styles.grid}>
                {animeItems.map((anime, index) => (
                  <BrowseAnimeCard
                    key={`${anime.mal_id}-${index}`}
                    anime={anime}
                    isNew={pageParam === 1 && index === 0}
                  />
                ))}
              </section>
            )}

            {animeItems.length > 0 && (
              <div className={styles.paginationBar}>
                <button
                  className={styles.paginationButton}
                  onClick={() => goToPage(pageParam - 1)}
                  disabled={pageParam <= 1 || !pagination}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className={styles.paginationCurrent}>{pagination?.current_page ?? pageParam}</span>
                <button
                  className={styles.paginationButton}
                  onClick={() => goToPage((pagination?.current_page ?? pageParam) + 1)}
                  disabled={pagination ? !pagination.has_next_page : false}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <span className={styles.paginationGhost}>
                  {pagination?.last_visible_page
                    ? `${pagination.last_visible_page} pages`
                    : activeStatusLabel}
                </span>
                {isFetching && <span className="status-chip">Updating...</span>}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </main>
    </div>
  )
}

export default AnimeList
